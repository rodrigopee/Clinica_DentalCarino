package com.clinica.odontologia.controller;

import com.clinica.odontologia.dto.CitaResponseDTO;
import com.clinica.odontologia.dto.ReservaRequestDTO;
import com.clinica.odontologia.entity.EstadoCita;
import com.clinica.odontologia.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    /**
     * Endpoint para que el cliente reserve su cita desde el celular.
     */
    @PostMapping("/reservar")
    public ResponseEntity<?> reservarCita(@Valid @RequestBody ReservaRequestDTO request) {
        try {
            CitaResponseDTO response = citaService.crearReserva(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al procesar la reserva: " + e.getMessage()));
        }
    }

    /**
     * Listar citas con filtro opcional por fecha.
     */
    @GetMapping
    public ResponseEntity<List<CitaResponseDTO>> listarCitas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (fecha != null) {
            return ResponseEntity.ok(citaService.obtenerCitasPorFecha(fecha));
        }
        return ResponseEntity.ok(citaService.obtenerTodas());
    }

    /**
     * Obtener citas por fecha específica.
     */
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<CitaResponseDTO>> obtenerPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.obtenerCitasPorFecha(fecha));
    }

    /**
     * Obtener detalle de cita por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(citaService.obtenerPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Consultar cita por código de reserva amigable (ej. RES-00000001-4821).
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<?> obtenerPorCodigo(@PathVariable String codigo) {
        try {
            return ResponseEntity.ok(citaService.obtenerPorCodigo(codigo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cambiar el estado de la cita (CONFIRMADA, ATENDIDA, CANCELADA).
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoCita estado) {
        try {
            CitaResponseDTO actualizada = citaService.cambiarEstado(id, estado);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
