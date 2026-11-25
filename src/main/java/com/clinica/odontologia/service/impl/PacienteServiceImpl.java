package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.entity.Paciente;
import com.clinica.odontologia.repository.PacienteRepository;
import com.clinica.odontologia.service.PacienteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteServiceImpl(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public Paciente buscarORegistrar(String nombreCompleto, String telefono, String email, String documento) {
        // 1. Intentar buscar por teléfono
        if (telefono != null && !telefono.trim().isEmpty()) {
            Optional<Paciente> existente = pacienteRepository.findByTelefono(telefono.trim());
            if (existente.isPresent()) {
                Paciente p = existente.get();
                // Actualizar datos si viene información nueva
                if (email != null && (p.getEmail() == null || p.getEmail().isEmpty())) p.setEmail(email.trim());
                if (documento != null && (p.getDocumentoIdentidad() == null || p.getDocumentoIdentidad().isEmpty())) p.setDocumentoIdentidad(documento.trim());
                return pacienteRepository.save(p);
            }
        }

        // 2. Si no existe, registrar nuevo paciente
        Paciente nuevo = new Paciente(
                nombreCompleto.trim(),
                documento != null ? documento.trim() : null,
                telefono != null ? telefono.trim() : "",
                email != null ? email.trim() : null
        );
        return pacienteRepository.save(nuevo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Paciente> obtenerTodos() {
        return pacienteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Paciente> obtenerPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public Paciente guardar(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }
}
