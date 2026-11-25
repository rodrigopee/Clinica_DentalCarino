package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.dto.BloqueoRequestDTO;
import com.clinica.odontologia.dto.HorarioSlotDTO;
import com.clinica.odontologia.entity.Cita;
import com.clinica.odontologia.entity.EstadoCita;
import com.clinica.odontologia.entity.HorarioBloqueado;
import com.clinica.odontologia.entity.Usuario;
import com.clinica.odontologia.repository.CitaRepository;
import com.clinica.odontologia.repository.HorarioBloqueadoRepository;
import com.clinica.odontologia.repository.UsuarioRepository;
import com.clinica.odontologia.service.DisponibilidadService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class DisponibilidadServiceImpl implements DisponibilidadService {

    private final CitaRepository citaRepository;
    private final HorarioBloqueadoRepository horarioBloqueadoRepository;
    private final UsuarioRepository usuarioRepository;

    private static final LocalTime HORA_INICIO_MANANA = LocalTime.of(9, 0);
    private static final LocalTime HORA_FIN_MANANA = LocalTime.of(13, 0);
    private static final LocalTime HORA_INICIO_TARDE = LocalTime.of(14, 0);
    private static final LocalTime HORA_FIN_TARDE = LocalTime.of(19, 0);
    private static final int INTERVALO_MINUTOS = 45;

    public DisponibilidadServiceImpl(CitaRepository citaRepository,
                                     HorarioBloqueadoRepository horarioBloqueadoRepository,
                                     UsuarioRepository usuarioRepository) {
        this.citaRepository = citaRepository;
        this.horarioBloqueadoRepository = horarioBloqueadoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HorarioSlotDTO> consultarHorariosPorFecha(LocalDate fecha) {
        List<Cita> citasDelDia = citaRepository.findByFechaCitaAndEstadoNotOrderByHoraCitaAsc(fecha, EstadoCita.CANCELADA);
        List<HorarioBloqueado> bloqueosDelDia = horarioBloqueadoRepository.findByFechaOrderByHoraInicioAsc(fecha);

        List<HorarioSlotDTO> slots = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

        // Turno Mañana (09:00 - 13:00)
        LocalTime actual = HORA_INICIO_MANANA;
        while (actual.isBefore(HORA_FIN_MANANA)) {
            slots.add(evaluarSlot(actual, fecha, citasDelDia, bloqueosDelDia, dtf));
            actual = actual.plusMinutes(INTERVALO_MINUTOS);
        }

        // Turno Tarde (14:00 - 19:00)
        actual = HORA_INICIO_TARDE;
        while (actual.isBefore(HORA_FIN_TARDE)) {
            slots.add(evaluarSlot(actual, fecha, citasDelDia, bloqueosDelDia, dtf));
            actual = actual.plusMinutes(INTERVALO_MINUTOS);
        }

        return slots;
    }

    private HorarioSlotDTO evaluarSlot(LocalTime slotHora,
                                       LocalDate fecha,
                                       List<Cita> citas,
                                       List<HorarioBloqueado> bloqueos,
                                       DateTimeFormatter dtf) {
        LocalTime slotFin = slotHora.plusMinutes(INTERVALO_MINUTOS);
        String formateada = slotHora.format(dtf);

        // Verificar si la fecha es en el pasado o hoy antes de la hora actual
        if (fecha.isBefore(LocalDate.now()) || (fecha.isEqual(LocalDate.now()) && slotHora.isBefore(LocalTime.now()))) {
            return new HorarioSlotDTO(slotHora, formateada, false, "OCUPADO", "Horario no disponible (Pasado)");
        }

        // 1. Verificar colisión con citas activas
        for (Cita c : citas) {
            LocalTime citaInicio = c.getHoraCita();
            LocalTime citaFin = citaInicio.plusMinutes(c.getDuracionMinutos() != null ? c.getDuracionMinutos() : 45);

            boolean haySolapamiento = (slotHora.isBefore(citaFin) && slotFin.isAfter(citaInicio));
            if (haySolapamiento) {
                return new HorarioSlotDTO(slotHora, formateada, false, "OCUPADO", "Reservado (" + c.getEstado() + ")");
            }
        }

        // 2. Verificar colisión con bloqueos administrativos (almuerzo, desinfección)
        for (HorarioBloqueado b : bloqueos) {
            boolean haySolapamiento = (slotHora.isBefore(b.getHoraFin()) && slotFin.isAfter(b.getHoraInicio()));
            if (haySolapamiento) {
                return new HorarioSlotDTO(slotHora, formateada, false, "OCUPADO", b.getMotivo());
            }
        }

        // Si está libre:
        return new HorarioSlotDTO(slotHora, formateada, true, "DISPONIBLE", "Disponible para reserva");
    }

    @Override
    public HorarioBloqueado bloquearHorario(BloqueoRequestDTO request, Long usuarioId) {
        Usuario usuario = null;
        if (usuarioId != null) {
            usuario = usuarioRepository.findById(usuarioId).orElse(null);
        }
        HorarioBloqueado bloqueo = new HorarioBloqueado(
                request.getFecha(),
                request.getHoraInicio(),
                request.getHoraFin(),
                request.getMotivo(),
                usuario
        );
        return horarioBloqueadoRepository.save(bloqueo);
    }

    @Override
    public void eliminarBloqueo(Long bloqueoId) {
        horarioBloqueadoRepository.deleteById(bloqueoId);
    }
}
