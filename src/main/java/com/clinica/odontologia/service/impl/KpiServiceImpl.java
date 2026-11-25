package com.clinica.odontologia.service.impl;

import com.clinica.odontologia.dto.KpiReportDTO;
import com.clinica.odontologia.entity.Cita;
import com.clinica.odontologia.entity.EstadoCita;
import com.clinica.odontologia.entity.Pago;
import com.clinica.odontologia.repository.CitaRepository;
import com.clinica.odontologia.repository.PagoRepository;
import com.clinica.odontologia.service.KpiService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class KpiServiceImpl implements KpiService {

    private final PagoRepository pagoRepository;
    private final CitaRepository citaRepository;

    public KpiServiceImpl(PagoRepository pagoRepository, CitaRepository citaRepository) {
        this.pagoRepository = pagoRepository;
        this.citaRepository = citaRepository;
    }

    @Override
    public KpiReportDTO generarReporteMensual(YearMonth mes) {
        if (mes == null) mes = YearMonth.now();

        LocalDate inicioMes = mes.atDay(1);
        LocalDate finMes = mes.atEndOfMonth();
        LocalDateTime inicioDateTime = inicioMes.atStartOfDay();
        LocalDateTime finDateTime = finMes.atTime(23, 59, 59);

        YearMonth mesAnterior = mes.minusMonths(1);
        LocalDateTime inicioMesAnt = mesAnterior.atDay(1).atStartOfDay();
        LocalDateTime finMesAnt = mesAnterior.atEndOfMonth().atTime(23, 59, 59);

        // 1. Ingresos
        BigDecimal ingresoActual = pagoRepository.sumMontoCompletadoEnRango(inicioDateTime, finDateTime);
        if (ingresoActual == null) ingresoActual = BigDecimal.ZERO;

        BigDecimal ingresoAnterior = pagoRepository.sumMontoCompletadoEnRango(inicioMesAnt, finMesAnt);
        if (ingresoAnterior == null) ingresoAnterior = BigDecimal.ZERO;

        double crecimiento = 0.0;
        if (ingresoAnterior.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = ingresoActual.subtract(ingresoAnterior);
            crecimiento = diff.divide(ingresoAnterior, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        } else if (ingresoActual.compareTo(BigDecimal.ZERO) > 0) {
            crecimiento = 100.0;
        }

        // 2. Citas del mes
        List<Cita> citasDelMes = citaRepository.findByFechaCitaBetweenOrderByFechaCitaAscHoraCitaAsc(inicioMes, finMes);
        long totalRegistradas = citasDelMes.size();
        long totalAtendidas = citasDelMes.stream().filter(c -> c.getEstado() == EstadoCita.ATENDIDA).count();
        long totalPendientes = citasDelMes.stream().filter(c -> c.getEstado() == EstadoCita.PENDIENTE || c.getEstado() == EstadoCita.CONFIRMADA).count();
        long totalCanceladas = citasDelMes.stream().filter(c -> c.getEstado() == EstadoCita.CANCELADA).count();

        double tasaAsistencia = 0.0;
        long citasFinalizadas = totalAtendidas + totalCanceladas;
        if (citasFinalizadas > 0) {
            tasaAsistencia = ((double) totalAtendidas / citasFinalizadas) * 100.0;
        } else if (totalRegistradas > 0) {
            tasaAsistencia = 100.0;
        }

        BigDecimal ticketPromedio = BigDecimal.ZERO;
        if (totalAtendidas > 0) {
            ticketPromedio = ingresoActual.divide(BigDecimal.valueOf(totalAtendidas), 2, RoundingMode.HALF_UP);
        }

        // 3. Top tratamientos
        List<Object[]> rawTratamientos = pagoRepository.findResumenTratamientosEnRango(inicioDateTime, finDateTime);
        List<KpiReportDTO.TratamientoKpiDTO> topTratamientos = new ArrayList<>();
        for (Object[] row : rawTratamientos) {
            String nombre = (String) row[0];
            long cantidad = ((Number) row[1]).longValue();
            BigDecimal recaudado = (BigDecimal) row[2];
            topTratamientos.add(new KpiReportDTO.TratamientoKpiDTO(nombre, cantidad, recaudado));
        }

        // 4. Métodos de pago
        List<Pago> pagos = pagoRepository.findByFechaPagoBetweenOrderByFechaPagoDesc(inicioDateTime, finDateTime);
        Map<String, BigDecimal> desglosePagos = new HashMap<>();
        for (Pago p : pagos) {
            if ("COMPLETADO".equalsIgnoreCase(p.getEstadoPago())) {
                String metodo = p.getMetodoPago();
                desglosePagos.put(metodo, desglosePagos.getOrDefault(metodo, BigDecimal.ZERO).add(p.getMonto()));
            }
        }

        // Construir DTO
        KpiReportDTO dto = new KpiReportDTO();
        String nombreMes = mes.format(DateTimeFormatter.ofPattern("MMMM yyyy", new Locale("es", "ES")));
        dto.setPeriodoMes(Character.toUpperCase(nombreMes.charAt(0)) + nombreMes.substring(1));
        dto.setIngresoMesActual(ingresoActual);
        dto.setIngresoMesAnterior(ingresoAnterior);
        dto.setPorcentajeCrecimiento(Math.round(crecimiento * 10.0) / 10.0);
        dto.setTicketPromedioPorCita(ticketPromedio);
        dto.setTotalCitasRegistradas(totalRegistradas);
        dto.setTotalCitasAtendidas(totalAtendidas);
        dto.setTotalCitasPendientes(totalPendientes);
        dto.setTotalCitasCanceladas(totalCanceladas);
        dto.setTasaAsistenciaPorcentaje(Math.round(tasaAsistencia * 10.0) / 10.0);
        dto.setTopTratamientos(topTratamientos);
        dto.setIngresosPorMetodoPago(desglosePagos);

        return dto;
    }
}
