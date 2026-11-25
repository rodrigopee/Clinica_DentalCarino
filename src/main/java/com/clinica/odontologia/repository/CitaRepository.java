package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.Cita;
import com.clinica.odontologia.entity.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByFechaCitaOrderByHoraCitaAsc(LocalDate fechaCita);

    List<Cita> findByFechaCitaAndEstadoNotOrderByHoraCitaAsc(LocalDate fechaCita, EstadoCita estadoExcluido);

    List<Cita> findByFechaCitaBetweenOrderByFechaCitaAscHoraCitaAsc(LocalDate fechaInicio, LocalDate fechaFin);

    List<Cita> findByPacienteIdOrderByFechaCitaDescHoraCitaDesc(Long pacienteId);

    Optional<Cita> findByCodigoReserva(String codigoReserva);

    long countByFechaCitaAndEstado(LocalDate fecha, EstadoCita estado);

    @Query("SELECT c FROM Cita c WHERE c.fechaCita = :fecha AND c.estado <> 'CANCELADA'")
    List<Cita> findCitasActivasEnFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT c FROM Cita c WHERE c.fechaCita BETWEEN :inicio AND :fin AND c.estado = 'ATENDIDA'")
    List<Cita> findCitasAtendidasEnRango(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}
