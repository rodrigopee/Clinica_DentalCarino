package com.clinica.odontologia.controller;

import com.clinica.odontologia.entity.Notificacion;
import com.clinica.odontologia.repository.NotificacionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionRepository notificacionRepository;

    public NotificacionController(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    /**
     * Obtener las últimas notificaciones de citas registradas para el doctor y la asistente.
     */
    @GetMapping
    public ResponseEntity<List<Notificacion>> listarUltimas() {
        return ResponseEntity.ok(notificacionRepository.findTop20ByOrderByFechaHoraRegistroDesc());
    }

    /**
     * Conteo de notificaciones pendientes de lectura por rol.
     */
    @GetMapping("/conteo")
    public ResponseEntity<Map<String, Long>> conteoNoLeidas() {
        long noLeidasDoc = notificacionRepository.countByLeidoDoctorFalse();
        long noLeidasAsis = notificacionRepository.countByLeidoAsistenteFalse();
        return ResponseEntity.ok(Map.of(
                "doctorNoLeidas", noLeidasDoc,
                "asistenteNoLeidas", noLeidasAsis
        ));
    }

    /**
     * Marcar notificación como leída.
     */
    @PatchMapping("/{id}/marcar-leida")
    public ResponseEntity<?> marcarLeida(@PathVariable Long id, @RequestParam String rol) {
        return notificacionRepository.findById(id).map(notif -> {
            if ("ODONTOLOGO".equalsIgnoreCase(rol) || "DOCTOR".equalsIgnoreCase(rol)) {
                notif.setLeidoDoctor(true);
            } else {
                notif.setLeidoAsistente(true);
            }
            notificacionRepository.save(notif);
            return ResponseEntity.ok(Map.of("mensaje", "Notificación marcada como leída"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
