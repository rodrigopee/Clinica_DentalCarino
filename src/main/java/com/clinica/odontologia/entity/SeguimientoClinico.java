package com.clinica.odontologia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "seguimientos_clinicos")
public class SeguimientoClinico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cita_id", nullable = false)
    private Cita cita;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "odontologo_id", nullable = false)
    private Usuario odontologo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "procedimiento_realizado", nullable = false, columnDefinition = "TEXT")
    private String procedimientoRealizado;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "receta_indicaciones", columnDefinition = "TEXT")
    private String recetaIndicaciones;

    @Column(name = "proxima_cita_sugerida")
    private LocalDate proximaCitaSugerida;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    public SeguimientoClinico() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Usuario getOdontologo() {
        return odontologo;
    }

    public void setOdontologo(Usuario odontologo) {
        this.odontologo = odontologo;
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
