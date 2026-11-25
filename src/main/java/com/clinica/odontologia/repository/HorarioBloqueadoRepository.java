package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.HorarioBloqueado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HorarioBloqueadoRepository extends JpaRepository<HorarioBloqueado, Long> {
    List<HorarioBloqueado> findByFechaOrderByHoraInicioAsc(LocalDate fecha);
}
