package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.dto.CitaResponseDTO;
import com.clinica.odontologia.dto.ReservaRequestDTO;
import com.clinica.odontologia.entity.*;
import com.clinica.odontologia.repository.*;
import com.clinica.odontologia.service.CitaService;
import com.clinica.odontologia.service.PacienteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepository;
    private final TratamientoRepository tratamientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HorarioBloqueadoRepository horarioBloqueadoRepository;
    private final PacienteService pacienteService;
    private final NotificacionRepository notificacionRepository;

    private static final SecureRandom RANDOM = new SecureRandom();

    public CitaServiceImpl(CitaRepository citaRepository,
                           TratamientoRepository tratamientoRepository,
                           UsuarioRepository usuarioRepository,
                           HorarioBloqueadoRepository horarioBloqueadoRepository,
                           PacienteService pacienteService,
                           NotificacionRepository notificacionRepository) {
        this.citaRepository = citaRepository;
        this.tratamientoRepository = tratamientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.horarioBloqueadoRepository = horarioBloqueadoRepository;
        this.pacienteService = pacienteService;
        this.notificacionRepository = notificacionRepository;
    }

    @Override
    public CitaResponseDTO crearReserva(ReservaRequestDTO request) {
        // 1. Validar tratamiento (si no se envía, usar el tratamiento 1 por defecto)
        Long tratamientoId = (request.getTratamientoId() != null) ? request.getTratamientoId() : 1L;
        Tratamiento tratamiento = tratamientoRepository.findById(tratamientoId)
                .orElseGet(() -> {
                    List<Tratamiento> todos = tratamientoRepository.findAll();
                    return !todos.isEmpty() ? todos.get(0) : new Tratamiento("Consulta General", "Evaluación clínica", 45, java.math.BigDecimal.valueOf(50.00));
                });

        // 2. Validar que el horario no esté ocupado ni en el pasado
        validarDisponibilidad(request.getFechaCita(), request.getHoraCita(), tratamiento.getDuracionMinutos());

        // 3. Obtener o crear paciente
        Paciente paciente = pacienteService.buscarORegistrar(
                request.getNombreCompleto(),
                request.getTelefono(),
                request.getEmail(),
                request.getDocumentoIdentidad()
        );

        // 4. Asignar odontólogo por defecto (ADMIN principal)
        List<Usuario> odontologos = usuarioRepository.findByRol_Nombre("ADMIN");
        Usuario odontologo = odontologos.isEmpty() ? null : odontologos.get(0);

        // 5. Generar código de reserva amigable
        String codigo = generarCodigoReserva(request.getFechaCita());

        // 6. Construir y guardar entidad Cita
        Cita cita = new Cita();
        cita.setCodigoReserva(codigo);
        cita.setPaciente(paciente);
        cita.setTratamiento(tratamiento);
        cita.setOdontologo(odontologo);
        cita.setFechaCita(request.getFechaCita());
        cita.setHoraCita(request.getHoraCita());
        cita.setDuracionMinutos(tratamiento.getDuracionMinutos());
        cita.setEstado(EstadoCita.PENDIENTE);
        cita.setMotivoConsulta(request.getMotivoConsulta() != null ? request.getMotivoConsulta() : tratamiento.getNombre());
        cita.setOrigenReserva(request.getOrigenReserva() != null ? request.getOrigenReserva() : "WEB_MOVIL");

        Cita guardada = citaRepository.save(cita);

        // 7. Notificación instantánea al Doctor y Asistente con la hora exacta en que registró el paciente
        String horaRegistroActual = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a"));
        String mensajeNotif = String.format("El paciente %s (DNI: %s, Tel: %s) registró una cita a las %s para la fecha %s a las %s.",
                paciente.getNombreCompleto(),
                paciente.getDocumentoIdentidad() != null ? paciente.getDocumentoIdentidad() : "No especificado",
                paciente.getTelefono(),
                horaRegistroActual,
                request.getFechaCita(),
                request.getHoraCita());

        Notificacion notificacion = new Notificacion(
                "¡Nueva Cita Registrada!",
                mensajeNotif,
                paciente.getNombreCompleto(),
                paciente.getDocumentoIdentidad(),
                paciente.getTelefono(),
                request.getFechaCita(),
                request.getHoraCita(),
                horaRegistroActual
        );
        notificacionRepository.save(notificacion);

        return CitaResponseDTO.fromEntity(guardada);
    }

    private void validarDisponibilidad(LocalDate fecha, LocalTime horaInicio, int duracionMinutos) {
        if (fecha.isBefore(LocalDate.now())) {
            throw new IllegalStateException("No es posible reservar en fechas pasadas.");
        }

        LocalTime horaFin = horaInicio.plusMinutes(duracionMinutos);

        // Validar contra otras citas activas
        List<Cita> citas = citaRepository.findByFechaCitaAndEstadoNotOrderByHoraCitaAsc(fecha, EstadoCita.CANCELADA);
        for (Cita c : citas) {
            LocalTime cInicio = c.getHoraCita();
            LocalTime cFin = cInicio.plusMinutes(c.getDuracionMinutos() != null ? c.getDuracionMinutos() : 45);
            if (horaInicio.isBefore(cFin) && horaFin.isAfter(cInicio)) {
                throw new IllegalStateException("El horario de " + horaInicio + " a " + horaFin + " ya se encuentra ocupado.");
            }
        }

        // Validar contra bloqueos de administración
        List<HorarioBloqueado> bloqueos = horarioBloqueadoRepository.findByFechaOrderByHoraInicioAsc(fecha);
        for (HorarioBloqueado b : bloqueos) {
            if (horaInicio.isBefore(b.getHoraFin()) && horaFin.isAfter(b.getHoraInicio())) {
                throw new IllegalStateException("El horario solicitado se encuentra bloqueado por la clínica: " + b.getMotivo());
            }
        }
    }

    private String generarCodigoReserva(LocalDate fecha) {
        String fechaStr = fecha.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + RANDOM.nextInt(9000);
        return "RES-" + fechaStr + "-" + rand;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaResponseDTO> obtenerCitasPorFecha(LocalDate fecha) {
        return citaRepository.findByFechaCitaOrderByHoraCitaAsc(fecha)
                .stream()
                .map(CitaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CitaResponseDTO> obtenerTodas() {
        return citaRepository.findAll()
                .stream()
                .map(CitaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CitaResponseDTO cambiarEstado(Long citaId, EstadoCita nuevoEstado) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada con ID: " + citaId));
        cita.setEstado(nuevoEstado);
        return CitaResponseDTO.fromEntity(citaRepository.save(cita));
    }

    @Override
    @Transactional(readOnly = true)
    public CitaResponseDTO obtenerPorCodigo(String codigoReserva) {
        Cita cita = citaRepository.findByCodigoReserva(codigoReserva)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró reserva con código: " + codigoReserva));
        return CitaResponseDTO.fromEntity(cita);
    }

    @Override
    @Transactional(readOnly = true)
    public CitaResponseDTO obtenerPorId(Long citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada con ID: " + citaId));
        return CitaResponseDTO.fromEntity(cita);
    }
}
