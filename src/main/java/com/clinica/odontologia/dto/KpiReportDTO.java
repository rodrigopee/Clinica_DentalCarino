package com.clinica.odontologia.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class KpiReportDTO {

    private String periodoMes; // ej. "Noviembre 2026"
    private BigDecimal ingresoMesActual;
    private BigDecimal ingresoMesAnterior;
    private double porcentajeCrecimiento;
    private BigDecimal ticketPromedioPorCita;

    private long totalCitasRegistradas;
    private long totalCitasAtendidas;
    private long totalCitasPendientes;
    private long totalCitasCanceladas;
    private double tasaAsistenciaPorcentaje;

    private List<TratamientoKpiDTO> topTratamientos;
    private Map<String, BigDecimal> ingresosPorMetodoPago;

    public KpiReportDTO() {}

    public static class TratamientoKpiDTO {
        private String tratamiento;
        private long cantidad;
        private BigDecimal recaudado;

        public TratamientoKpiDTO(String tratamiento, long cantidad, BigDecimal recaudado) {
            this.tratamiento = tratamiento;
            this.cantidad = cantidad;
            this.recaudado = recaudado;
        }

        public String getTratamiento() {
            return tratamiento;
        }

        public void setTratamiento(String tratamiento) {
            this.tratamiento = tratamiento;
        }

        public long getCantidad() {
            return cantidad;
        }

        public void setCantidad(long cantidad) {
            this.cantidad = cantidad;
        }

        public BigDecimal getRecaudado() {
            return recaudado;
        }

        public void setRecaudado(BigDecimal recaudado) {
            this.recaudado = recaudado;
        }
    }

    public String getPeriodoMes() {
        return periodoMes;
    }

    public void setPeriodoMes(String periodoMes) {
        this.periodoMes = periodoMes;
    }

    public BigDecimal getIngresoMesActual() {
        return ingresoMesActual;
    }

    public void setIngresoMesActual(BigDecimal ingresoMesActual) {
        this.ingresoMesActual = ingresoMesActual;
    }

    public BigDecimal getIngresoMesAnterior() {
        return ingresoMesAnterior;
    }

    public void setIngresoMesAnterior(BigDecimal ingresoMesAnterior) {
        this.ingresoMesAnterior = ingresoMesAnterior;
    }

    public double getPorcentajeCrecimiento() {
        return porcentajeCrecimiento;
    }

    public void setPorcentajeCrecimiento(double porcentajeCrecimiento) {
        this.porcentajeCrecimiento = porcentajeCrecimiento;
    }

    public BigDecimal getTicketPromedioPorCita() {
        return ticketPromedioPorCita;
    }

    public void setTicketPromedioPorCita(BigDecimal ticketPromedioPorCita) {
        this.ticketPromedioPorCita = ticketPromedioPorCita;
    }

    public long getTotalCitasRegistradas() {
        return totalCitasRegistradas;
    }

    public void setTotalCitasRegistradas(long totalCitasRegistradas) {
        this.totalCitasRegistradas = totalCitasRegistradas;
    }

    public long getTotalCitasAtendidas() {
        return totalCitasAtendidas;
    }

    public void setTotalCitasAtendidas(long totalCitasAtendidas) {
        this.totalCitasAtendidas = totalCitasAtendidas;
    }

    public long getTotalCitasPendientes() {
        return totalCitasPendientes;
    }

    public void setTotalCitasPendientes(long totalCitasPendientes) {
        this.totalCitasPendientes = totalCitasPendientes;
    }

    public long getTotalCitasCanceladas() {
        return totalCitasCanceladas;
    }

    public void setTotalCitasCanceladas(long totalCitasCanceladas) {
        this.totalCitasCanceladas = totalCitasCanceladas;
    }

    public double getTasaAsistenciaPorcentaje() {
        return tasaAsistenciaPorcentaje;
    }

    public void setTasaAsistenciaPorcentaje(double tasaAsistenciaPorcentaje) {
        this.tasaAsistenciaPorcentaje = tasaAsistenciaPorcentaje;
    }

    public List<TratamientoKpiDTO> getTopTratamientos() {
        return topTratamientos;
    }

    public void setTopTratamientos(List<TratamientoKpiDTO> topTratamientos) {
        this.topTratamientos = topTratamientos;
    }

    public Map<String, BigDecimal> getIngresosPorMetodoPago() {
        return ingresosPorMetodoPago;
    }

    public void setIngresosPorMetodoPago(Map<String, BigDecimal> ingresosPorMetodoPago) {
        this.ingresosPorMetodoPago = ingresosPorMetodoPago;
    }
}
