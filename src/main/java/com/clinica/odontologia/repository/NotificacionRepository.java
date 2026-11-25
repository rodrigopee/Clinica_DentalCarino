package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findTop20ByOrderByFechaHoraRegistroDesc();
    long countByLeidoDoctorFalse();
    long countByLeidoAsistenteFalse();
}
