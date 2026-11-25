package com.clinica.odontologia.dto;

import com.clinica.odontologia.entity.Cita;
import com.clinica.odontologia.entity.EstadoCita;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class CitaResponseDTO {

    private Long id;
    private String codigoReserva;
    private Long pacienteId;
    private String pacienteNombre;
    private String pacienteTelefono;
    private String pacienteEmail;
    private String pacienteDocumento;
    private Long tratamientoId;
    private String tratamientoNombre;
    private BigDecimal precioTratamiento;
    private LocalDate fechaCita;
    private LocalTime horaCita;
    private Integer duracionMinutos;
    private EstadoCita estado;
    private String motivoConsulta;
    private String odontologoNombre;
    private String origenReserva;

    public CitaResponseDTO() {}

    public static CitaResponseDTO fromEntity(Cita cita) {
        CitaResponseDTO dto = new CitaResponseDTO();
        dto.setId(cita.getId());
        dto.setCodigoReserva(cita.getCodigoReserva());
        if (cita.getPaciente() != null) {
            dto.setPacienteId(cita.getPaciente().getId());
            dto.setPacienteNombre(cita.getPaciente().getNombreCompleto());
            dto.setPacienteTelefono(cita.getPaciente().getTelefono());
            dto.setPacienteEmail(cita.getPaciente().getEmail());
            dto.setPacienteDocumento(cita.getPaciente().getDocumentoIdentidad());
        }
        if (cita.getTratamiento() != null) {
            dto.setTratamientoId(cita.getTratamiento().getId());
            dto.setTratamientoNombre(cita.getTratamiento().getNombre());
            dto.setPrecioTratamiento(cita.getTratamiento().getPrecioBase());
        }
        dto.setFechaCita(cita.getFechaCita());
        dto.setHoraCita(cita.getHoraCita());
        dto.setDuracionMinutos(cita.getDuracionMinutos());
        dto.setEstado(cita.getEstado());
        dto.setMotivoConsulta(cita.getMotivoConsulta());
        dto.setOrigenReserva(cita.getOrigenReserva());
        if (cita.getOdontologo() != null) {
            dto.setOdontologoNombre("Dr. " + cita.getOdontologo().getNombreCompleto());
        } else {
            dto.setOdontologoNombre("Por asignar");
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoReserva() {
        return codigoReserva;
    }

    public void setCodigoReserva(String codigoReserva) {
        this.codigoReserva = codigoReserva;
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

    public String getPacienteTelefono() {
        return pacienteTelefono;
    }

    public void setPacienteTelefono(String pacienteTelefono) {
        this.pacienteTelefono = pacienteTelefono;
    }

    public String getPacienteEmail() {
        return pacienteEmail;
    }

    public void setPacienteEmail(String pacienteEmail) {
        this.pacienteEmail = pacienteEmail;
    }

    public String getPacienteDocumento() {
        return pacienteDocumento;
    }

    public void setPacienteDocumento(String pacienteDocumento) {
        this.pacienteDocumento = pacienteDocumento;
    }

    public Long getTratamientoId() {
        return tratamientoId;
    }

    public void setTratamientoId(Long tratamientoId) {
        this.tratamientoId = tratamientoId;
    }

    public String getTratamientoNombre() {
        return tratamientoNombre;
    }

    public void setTratamientoNombre(String tratamientoNombre) {
        this.tratamientoNombre = tratamientoNombre;
    }

    public BigDecimal getPrecioTratamiento() {
        return precioTratamiento;
    }

    public void setPrecioTratamiento(BigDecimal precioTratamiento) {
        this.precioTratamiento = precioTratamiento;
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

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getOdontologoNombre() {
        return odontologoNombre;
    }

    public void setOdontologoNombre(String odontologoNombre) {
        this.odontologoNombre = odontologoNombre;
    }

    public String getOrigenReserva() {
        return origenReserva;
    }

    public void setOrigenReserva(String origenReserva) {
        this.origenReserva = origenReserva;
    }
}
