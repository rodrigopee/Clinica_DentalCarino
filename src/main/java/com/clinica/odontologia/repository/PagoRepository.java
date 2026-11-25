package com.clinica.odontologia.repository;

import com.clinica.odontologia.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByFechaPagoBetweenOrderByFechaPagoDesc(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p WHERE p.fechaPago BETWEEN :inicio AND :fin AND p.estadoPago = 'COMPLETADO'")
    BigDecimal sumMontoCompletadoEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT p.cita.tratamiento.nombre, COUNT(p.id), SUM(p.monto) FROM Pago p " +
           "WHERE p.fechaPago BETWEEN :inicio AND :fin AND p.estadoPago = 'COMPLETADO' " +
           "GROUP BY p.cita.tratamiento.nombre ORDER BY SUM(p.monto) DESC")
    List<Object[]> findResumenTratamientosEnRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
