package com.clinica.odontologia.controller;

import com.clinica.odontologia.dto.BloqueoRequestDTO;
import com.clinica.odontologia.dto.HorarioSlotDTO;
import com.clinica.odontologia.entity.HorarioBloqueado;
import com.clinica.odontologia.service.DisponibilidadService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disponibilidad")
@CrossOrigin(origins = "*")
public class DisponibilidadController {

    private final DisponibilidadService disponibilidadService;

    public DisponibilidadController(DisponibilidadService disponibilidadService) {
        this.disponibilidadService = disponibilidadService;
    }

    /**
     * Consulta los intervalos de tiempo para una fecha.
     * Retorna slots libres (disponible=true) y slots ocupados (disponible=false, estadoVisual="OCUPADO").
     */
    @GetMapping
    public ResponseEntity<List<HorarioSlotDTO>> consultarDisponibilidad(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (fecha == null) {
            fecha = LocalDate.now();
        }
        return ResponseEntity.ok(disponibilidadService.consultarHorariosPorFecha(fecha));
    }

    /**
     * Permite a la ayudante o al odontólogo bloquear un rango horario.
     */
    @PostMapping("/bloquear")
    public ResponseEntity<?> bloquearHorario(@Valid @RequestBody BloqueoRequestDTO request) {
        try {
            HorarioBloqueado bloqueo = disponibilidadService.bloquearHorario(request, 1L);
            return ResponseEntity.status(HttpStatus.CREATED).body(bloqueo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Desbloquear un horario restringido.
     */
    @DeleteMapping("/bloquear/{id}")
    public ResponseEntity<?> eliminarBloqueo(@PathVariable Long id) {
        disponibilidadService.eliminarBloqueo(id);
        return ResponseEntity.ok(Map.of("mensaje", "Horario desbloqueado correctamente."));
    }
}
