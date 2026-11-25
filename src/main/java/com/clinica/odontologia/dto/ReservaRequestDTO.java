package com.clinica.odontologia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaRequestDTO {

    @NotBlank(message = "El nombre completo del paciente es obligatorio")
    private String nombreCompleto;

    @NotBlank(message = "El teléfono o WhatsApp de contacto es obligatorio")
    private String telefono;

    private String email;

    private String documentoIdentidad;

    private Long tratamientoId = 1L; // Por defecto Evaluación & Consulta Odontológica General

    @NotNull(message = "Debe indicar la fecha deseada")
    private LocalDate fechaCita;

    @NotNull(message = "Debe indicar la hora de la cita")
    private LocalTime horaCita;

    private String motivoConsulta;

    private String origenReserva = "WEB_MOVIL";

    public ReservaRequestDTO() {}

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public Long getTratamientoId() {
        return tratamientoId;
    }

    public void setTratamientoId(Long tratamientoId) {
        this.tratamientoId = tratamientoId;
    }

    public LocalDate getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(LocalDate fechaCita) {
        this.fechaCita = fechaCita;
    }

    public LocalTime getHoraCita() {
        return horaCita;
    }

    public void setHoraCita(LocalTime horaCita) {
        this.horaCita = horaCita;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getOrigenReserva() {
        return origenReserva;
    }

    public void setOrigenReserva(String origenReserva) {
        this.origenReserva = origenReserva;
    }
}
