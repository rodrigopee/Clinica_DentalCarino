package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.dto.SeguimientoDTO;
import com.clinica.odontologia.entity.*;
import com.clinica.odontologia.repository.CitaRepository;
import com.clinica.odontologia.repository.PacienteRepository;
import com.clinica.odontologia.repository.SeguimientoClinicoRepository;
import com.clinica.odontologia.repository.UsuarioRepository;
import com.clinica.odontologia.service.SeguimientoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SeguimientoServiceImpl implements SeguimientoService {

    private final SeguimientoClinicoRepository seguimientoRepository;
    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public SeguimientoServiceImpl(SeguimientoClinicoRepository seguimientoRepository,
                                  CitaRepository citaRepository,
                                  PacienteRepository pacienteRepository,
                                  UsuarioRepository usuarioRepository) {
        this.seguimientoRepository = seguimientoRepository;
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public SeguimientoDTO registrarSeguimiento(SeguimientoDTO dto) {
        Cita cita = citaRepository.findById(dto.getCitaId())
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada con ID: " + dto.getCitaId()));

        Paciente paciente = cita.getPaciente();
        Usuario odontologo = cita.getOdontologo();
        if (odontologo == null) {
            List<Usuario> odontologos = usuarioRepository.findByRol_Nombre("ADMIN");
            odontologo = odontologos.isEmpty() ? null : odontologos.get(0);
        }

        SeguimientoClinico seg = new SeguimientoClinico();
        seg.setCita(cita);
        seg.setPaciente(paciente);
        seg.setOdontologo(odontologo);
        seg.setDiagnostico(dto.getDiagnostico());
        seg.setProcedimientoRealizado(dto.getProcedimientoRealizado());
        seg.setObservaciones(dto.getObservaciones());
        seg.setRecetaIndicaciones(dto.getRecetaIndicaciones());
        seg.setProximaCitaSugerida(dto.getProximaCitaSugerida());
        seg.setFechaRegistro(LocalDateTime.now());

        // Al registrar seguimiento, marcar cita como ATENDIDA
        cita.setEstado(EstadoCita.ATENDIDA);
        citaRepository.save(cita);

        SeguimientoClinico guardado = seguimientoRepository.save(seg);
        return mapearDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeguimientoDTO> obtenerHistorialPorPaciente(Long pacienteId) {
        return seguimientoRepository.findByPacienteIdOrderByFechaRegistroDesc(pacienteId)
                .stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeguimientoDTO> obtenerUltimosSeguimientos() {
        return seguimientoRepository.findTop15ByOrderByFechaRegistroDesc()
                .stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    private SeguimientoDTO mapearDTO(SeguimientoClinico s) {
        SeguimientoDTO dto = new SeguimientoDTO();
        dto.setId(s.getId());
        dto.setCitaId(s.getCita().getId());
        dto.setPacienteId(s.getPaciente().getId());
        dto.setPacienteNombre(s.getPaciente().getNombreCompleto());
        dto.setOdontologoNombre(s.getOdontologo() != null ? "Dr. " + s.getOdontologo().getNombreCompleto() : "Odontólogo");
        dto.setDiagnostico(s.getDiagnostico());
        dto.setProcedimientoRealizado(s.getProcedimientoRealizado());
        dto.setObservaciones(s.getObservaciones());
        dto.setRecetaIndicaciones(s.getRecetaIndicaciones());
        dto.setProximaCitaSugerida(s.getProximaCitaSugerida());
        dto.setFechaRegistro(s.getFechaRegistro());
        return dto;
    }
}
