package com.clinica.odontologia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "paciente_nombre", nullable = false, length = 150)
    private String pacienteNombre;

    @Column(name = "paciente_dni", length = 30)
    private String pacienteDni;

    @Column(name = "paciente_telefono", nullable = false, length = 30)
    private String pacienteTelefono;

    @Column(name = "fecha_cita", nullable = false)
    private LocalDate fechaCita;

    @Column(name = "hora_cita", nullable = false)
    private LocalTime horaCita;

    @Column(name = "hora_registro_str", nullable = false, length = 20)
    private String horaRegistroStr; // ej. "13:25 hrs"

    @Column(name = "fecha_hora_registro", nullable = false, updatable = false)
    private LocalDateTime fechaHoraRegistro = LocalDateTime.now();

    @Column(name = "leido_doctor", nullable = false)
    private Boolean leidoDoctor = false;

    @Column(name = "leido_asistente", nullable = false)
    private Boolean leidoAsistente = false;

    public Notificacion() {}

    public Notificacion(String titulo, String mensaje, String pacienteNombre, String pacienteDni,
                        String pacienteTelefono, LocalDate fechaCita, LocalTime horaCita, String horaRegistroStr) {
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.pacienteNombre = pacienteNombre;
        this.pacienteDni = pacienteDni;
        this.pacienteTelefono = pacienteTelefono;
        this.fechaCita = fechaCita;
        this.horaCita = horaCita;
        this.horaRegistroStr = horaRegistroStr;
        this.fechaHoraRegistro = LocalDateTime.now();
        this.leidoDoctor = false;
        this.leidoAsistente = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getPacienteNombre() {
        return pacienteNombre;
    }

    public void setPacienteNombre(String pacienteNombre) {
        this.pacienteNombre = pacienteNombre;
    }

    public String getPacienteDni() {
        return pacienteDni;
    }

    public void setPacienteDni(String pacienteDni) {
        this.pacienteDni = pacienteDni;
    }

    public String getPacienteTelefono() {
        return pacienteTelefono;
    }

    public void setPacienteTelefono(String pacienteTelefono) {
        this.pacienteTelefono = pacienteTelefono;
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

    public String getHoraRegistroStr() {
        return horaRegistroStr;
    }

    public void setHoraRegistroStr(String horaRegistroStr) {
        this.horaRegistroStr = horaRegistroStr;
    }

    public LocalDateTime getFechaHoraRegistro() {
        return fechaHoraRegistro;
    }

    public void setFechaHoraRegistro(LocalDateTime fechaHoraRegistro) {
        this.fechaHoraRegistro = fechaHoraRegistro;
    }

    public Boolean getLeidoDoctor() {
        return leidoDoctor;
    }

    public void setLeidoDoctor(Boolean leidoDoctor) {
        this.leidoDoctor = leidoDoctor;
    }

    public Boolean getLeidoAsistente() {
        return leidoAsistente;
    }

    public void setLeidoAsistente(Boolean leidoAsistente) {
        this.leidoAsistente = leidoAsistente;
    }
}
