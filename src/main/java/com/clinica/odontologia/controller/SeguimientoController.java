package com.clinica.odontologia.controller;

import com.clinica.odontologia.dto.SeguimientoDTO;
import com.clinica.odontologia.service.SeguimientoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(origins = "*")
public class SeguimientoController {

    private final SeguimientoService seguimientoService;

    public SeguimientoController(SeguimientoService seguimientoService) {
        this.seguimientoService = seguimientoService;
    }

    /**
     * Registrar seguimiento clínico, diagnóstico y receta del paciente.
     */
    @PostMapping
    public ResponseEntity<?> registrarSeguimiento(@RequestBody SeguimientoDTO dto) {
        try {
            SeguimientoDTO guardado = seguimientoService.registrarSeguimiento(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar seguimiento: " + e.getMessage()));
        }
    }

    /**
     * Obtener el historial clínico completo de un paciente por su ID.
     */
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<SeguimientoDTO>> obtenerPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(seguimientoService.obtenerHistorialPorPaciente(pacienteId));
    }

    /**
     * Obtener los seguimientos clínicos más recientes para el dashboard del odontólogo.
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<SeguimientoDTO>> obtenerRecientes() {
        return ResponseEntity.ok(seguimientoService.obtenerUltimosSeguimientos());
    }
}
