package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByTelefono(String telefono);
    Optional<Paciente> findByDocumentoIdentidad(String documentoIdentidad);
    List<Paciente> findByNombreCompletoContainingIgnoreCase(String query);
}
