package com.clinica.odontologia.service;

import com.clinica.odontologia.dto.BloqueoRequestDTO;
import com.clinica.odontologia.dto.HorarioSlotDTO;
import com.clinica.odontologia.entity.HorarioBloqueado;

import java.time.LocalDate;
import java.util.List;

public interface DisponibilidadService {

    /**
     * Retorna la lista de intervalos de atención para una fecha específica.
     * Los intervalos ya ocupados o bloqueados se retornan con disponible=false y estadoVisual="OCUPADO"
     * para que la interfaz los dibuje sombreados en negro.
     */
    List<HorarioSlotDTO> consultarHorariosPorFecha(LocalDate fecha);

    /**
     * Permite a la asistente (Rol Supervisor) o al Odontólogo bloquear un rango de horas.
     */
    HorarioBloqueado bloquearHorario(BloqueoRequestDTO request, Long usuarioId);

    /**
     * Desbloquea un horario previamente restringido.
     */
    void eliminarBloqueo(Long bloqueoId);
}
