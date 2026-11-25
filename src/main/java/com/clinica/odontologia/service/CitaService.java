package com.clinica.odontologia.service;

import com.clinica.odontologia.dto.CitaResponseDTO;
import com.clinica.odontologia.dto.ReservaRequestDTO;
import com.clinica.odontologia.entity.Cita;
import com.clinica.odontologia.entity.EstadoCita;

import java.time.LocalDate;
import java.util.List;

public interface CitaService {

    CitaResponseDTO crearReserva(ReservaRequestDTO request);

    List<CitaResponseDTO> obtenerCitasPorFecha(LocalDate fecha);

    List<CitaResponseDTO> obtenerTodas();

    CitaResponseDTO cambiarEstado(Long citaId, EstadoCita nuevoEstado);

    CitaResponseDTO obtenerPorCodigo(String codigoReserva);

    CitaResponseDTO obtenerPorId(Long citaId);
}
