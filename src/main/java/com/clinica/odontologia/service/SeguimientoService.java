package com.clinica.odontologia.service;

import com.clinica.odontologia.dto.SeguimientoDTO;
import java.util.List;

public interface SeguimientoService {
    SeguimientoDTO registrarSeguimiento(SeguimientoDTO dto);
    List<SeguimientoDTO> obtenerHistorialPorPaciente(Long pacienteId);
    List<SeguimientoDTO> obtenerUltimosSeguimientos();
}
