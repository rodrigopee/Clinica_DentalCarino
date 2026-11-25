package com.clinica.odontologia.controller;

import com.clinica.odontologia.entity.Tratamiento;
import com.clinica.odontologia.service.TratamientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tratamientos")
@CrossOrigin(origins = "*")
public class TratamientoController {

    private final TratamientoService tratamientoService;

    public TratamientoController(TratamientoService tratamientoService) {
        this.tratamientoService = tratamientoService;
    }

    /**
     * Catálogo público de tratamientos dentales para la selección del cliente y clínica.
     */
    @GetMapping
    public ResponseEntity<List<Tratamiento>> listarTratamientos() {
        return ResponseEntity.ok(tratamientoService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tratamiento> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tratamientoService.obtenerPorId(id));
    }
}
