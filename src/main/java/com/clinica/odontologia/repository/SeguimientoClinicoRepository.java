package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.SeguimientoClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeguimientoClinicoRepository extends JpaRepository<SeguimientoClinico, Long> {
    List<SeguimientoClinico> findByPacienteIdOrderByFechaRegistroDesc(Long pacienteId);
    List<SeguimientoClinico> findTop15ByOrderByFechaRegistroDesc();
}
