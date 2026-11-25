package com.clinica.odontologia.service;

import com.clinica.odontologia.entity.Paciente;
import java.util.List;
import java.util.Optional;

public interface PacienteService {
    Paciente buscarORegistrar(String nombreCompleto, String telefono, String email, String documento);
    List<Paciente> obtenerTodos();
    Optional<Paciente> obtenerPorId(Long id);
    Paciente guardar(Paciente paciente);
}
