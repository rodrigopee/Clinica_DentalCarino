package com.clinica.odontologia.controller;

import com.clinica.odontologia.dto.KpiReportDTO;
import com.clinica.odontologia.service.KpiService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/kpis")
@CrossOrigin(origins = "*")
public class KpiController {

    private final KpiService kpiService;

    public KpiController(KpiService kpiService) {
        this.kpiService = kpiService;
    }

    /**
     * Reporte mensual de dinero recaudado, citas y KPIs para el odontólogo/administrador.
     * Ejemplo de query param: ?mes=2026-11
     */
    @GetMapping("/mensual")
    public ResponseEntity<KpiReportDTO> obtenerReporteMensual(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth mes) {
        if (mes == null) {
            mes = YearMonth.now();
        }
        return ResponseEntity.ok(kpiService.generarReporteMensual(mes));
    }
}
