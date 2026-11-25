package com.clinica.odontologia.dto;

import java.time.LocalTime;

public class HorarioSlotDTO {

    private LocalTime hora;
    private String horaFormateada; // ej. "09:00 AM", "03:30 PM"
    private boolean disponible;
    private String estadoVisual;   // "DISPONIBLE" vs "OCUPADO" (Sombreado / Negro)
    private String motivoNoDisponible;

    public HorarioSlotDTO() {}

    public HorarioSlotDTO(LocalTime hora, String horaFormateada, boolean disponible, String estadoVisual, String motivoNoDisponible) {
        this.hora = hora;
        this.horaFormateada = horaFormateada;
        this.disponible = disponible;
        this.estadoVisual = estadoVisual;
        this.motivoNoDisponible = motivoNoDisponible;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getHoraFormateada() {
        return horaFormateada;
    }

    public void setHoraFormateada(String horaFormateada) {
        this.horaFormateada = horaFormateada;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public String getEstadoVisual() {
        return estadoVisual;
    }

    public void setEstadoVisual(String estadoVisual) {
        this.estadoVisual = estadoVisual;
    }

    public String getMotivoNoDisponible() {
        return motivoNoDisponible;
    }

    public void setMotivoNoDisponible(String motivoNoDisponible) {
        this.motivoNoDisponible = motivoNoDisponible;
    }
}
