package com.clinica.odontologia.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SeguimientoDTO {

    private Long id;
    private Long citaId;
    private Long pacienteId;
    private String pacienteNombre;
    private String odontologoNombre;
    private String diagnostico;
    private String procedimientoRealizado;
    private String observaciones;
    private String recetaIndicaciones;
    private LocalDate proximaCitaSugerida;
    private LocalDateTime fechaRegistro;

    public SeguimientoDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCitaId() {
        return citaId;
    }

    public void setCitaId(Long citaId) {
        this.citaId = citaId;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getPacienteNombre() {
        return pacienteNombre;
    }

    public void setPacienteNombre(String pacienteNombre) {
        this.pacienteNombre = pacienteNombre;
    }

    public String getOdontologoNombre() {
        return odontologoNombre;
    }

    public void setOdontologoNombre(String odontologoNombre) {
        this.odontologoNombre = odontologoNombre;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getProcedimientoRealizado() {
        return procedimientoRealizado;
    }

    public void setProcedimientoRealizado(String procedimientoRealizado) {
        this.procedimientoRealizado = procedimientoRealizado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getRecetaIndicaciones() {
        return recetaIndicaciones;
    }

    public void setRecetaIndicaciones(String recetaIndicaciones) {
        this.recetaIndicaciones = recetaIndicaciones;
    }

    public LocalDate getProximaCitaSugerida() {
        return proximaCitaSugerida;
    }

    public void setProximaCitaSugerida(LocalDate proximaCitaSugerida) {
        this.proximaCitaSugerida = proximaCitaSugerida;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
