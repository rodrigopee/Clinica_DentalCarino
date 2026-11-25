package com.clinica.odontologia.config;

import com.clinica.odontologia.entity.*;
import com.clinica.odontologia.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final TratamientoRepository tratamientoRepository;
    private final PacienteRepository pacienteRepository;
    private final CitaRepository citaRepository;
    private final HorarioBloqueadoRepository horarioBloqueadoRepository;
    private final SeguimientoClinicoRepository seguimientoRepository;
    private final PagoRepository pagoRepository;

    public DataInitializer(RolRepository rolRepository,
                           UsuarioRepository usuarioRepository,
                           TratamientoRepository tratamientoRepository,
                           PacienteRepository pacienteRepository,
                           CitaRepository citaRepository,
                           HorarioBloqueadoRepository horarioBloqueadoRepository,
                           SeguimientoClinicoRepository seguimientoRepository,
                           PagoRepository pagoRepository) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.tratamientoRepository = tratamientoRepository;
        this.pacienteRepository = pacienteRepository;
        this.citaRepository = citaRepository;
        this.horarioBloqueadoRepository = horarioBloqueadoRepository;
        this.seguimientoRepository = seguimientoRepository;
        this.pagoRepository = pagoRepository;
    }

    @Override
    public void run(String... args) {
        if (rolRepository.count() > 0) {
            return; // Ya inicializado
        }

        System.out.println(">>> Inicializando datos iniciales de la Clínica Odontológica...");

        // 1. Roles
        Rol rolAdmin = rolRepository.save(new Rol("ADMIN", "Odontólogo Titular / Propietario"));
        Rol rolSupervisor = rolRepository.save(new Rol("SUPERVISOR", "Ayudante / Asistente Dental"));
        Rol rolCliente = rolRepository.save(new Rol("CLIENTE", "Paciente"));

        // 2. Usuarios del Staff
        Usuario odontologo = usuarioRepository.save(new Usuario(
                "Kevin Jhon", "Lindo Alfaro", "admin@datos.example", "+51 000 000 010", "demo-odontologo", rolAdmin
        ));
        Usuario asistente = usuarioRepository.save(new Usuario(
                "Sofía", "Ramírez", "asistente@datos.example", "+51 000 000 001", "demo-asistente", rolSupervisor
        ));

        // 3. Catálogo de Tratamientos
        Tratamiento t1 = tratamientoRepository.save(new Tratamiento("Evaluación y Diagnóstico Integral", "Revisión clínica exhaustiva y plan personalizado", 30, new BigDecimal("50.00")));
        Tratamiento t2 = tratamientoRepository.save(new Tratamiento("Profilaxis con Ultrasonido", "Eliminación de placa bacteriana, sarro y pulido dental", 45, new BigDecimal("120.00")));
        Tratamiento t3 = tratamientoRepository.save(new Tratamiento("Blanqueamiento Dental Láser Gold", "Tratamiento estético intensivo de alta gama", 60, new BigDecimal("380.00")));
        Tratamiento t4 = tratamientoRepository.save(new Tratamiento("Restauración Estética con Resina 3M", "Obturación estética directa de alta durabilidad", 45, new BigDecimal("150.00")));
        Tratamiento t5 = tratamientoRepository.save(new Tratamiento("Control y Ajuste de Ortodoncia", "Revisión y cambio de arcos dentales", 30, new BigDecimal("100.00")));
        Tratamiento t6 = tratamientoRepository.save(new Tratamiento("Endodoncia Mecanizada", "Tratamiento de conductos radiculares", 60, new BigDecimal("320.00")));

        // 4. Pacientes
        Paciente p1 = pacienteRepository.save(new Paciente("Paciente Demo 05", "00000005", "+51 000 000 007", "paciente10@clinica.example"));
        Paciente p2 = pacienteRepository.save(new Paciente("Paciente Demo 02", "00000003", "+51 000 000 006", "paciente04@clinica.example"));
        Paciente p3 = pacienteRepository.save(new Paciente("Paciente Demo 04", "00000007", "+51 000 000 004", "paciente09@clinica.example"));
        Paciente p4 = pacienteRepository.save(new Paciente("Paciente Demo 03", "00000004", "+51 000 000 003", "paciente06@clinica.example"));

        // 5. Citas (Hoy y Mañana para mostrar horarios ocupados sombreados de negro)
        LocalDate hoy = LocalDate.now();

        Cita c1 = new Cita();
        c1.setCodigoReserva("RES-202611-001");
        c1.setPaciente(p1);
        c1.setTratamiento(t2);
        c1.setOdontologo(odontologo);
        c1.setFechaCita(hoy);
        c1.setHoraCita(LocalTime.of(9, 45));
        c1.setDuracionMinutos(45);
        c1.setEstado(EstadoCita.ATENDIDA);
        c1.setMotivoConsulta("Profilaxis preventiva de rutina");
        citaRepository.save(c1);

        Cita c2 = new Cita();
        c2.setCodigoReserva("RES-202611-002");
        c2.setPaciente(p2);
        c2.setTratamiento(t4);
        c2.setOdontologo(odontologo);
        c2.setFechaCita(hoy);
        c2.setHoraCita(LocalTime.of(11, 15));
        c2.setDuracionMinutos(45);
        c2.setEstado(EstadoCita.CONFIRMADA);
        c2.setMotivoConsulta("Dolor leve en molar inferior al masticar");
        citaRepository.save(c2);

        Cita c3 = new Cita();
        c3.setCodigoReserva("RES-202611-003");
        c3.setPaciente(p3);
        c3.setTratamiento(t3);
        c3.setOdontologo(odontologo);
        c3.setFechaCita(hoy);
        c3.setHoraCita(LocalTime.of(15, 30));
        c3.setDuracionMinutos(60);
        c3.setEstado(EstadoCita.PENDIENTE);
        c3.setMotivoConsulta("Interés en blanqueamiento dental");
        citaRepository.save(c3);

        // 6. Bloqueo de Almuerzo / Desinfección de gabinete
        horarioBloqueadoRepository.save(new HorarioBloqueado(
                hoy, LocalTime.of(13, 0), LocalTime.of(14, 0),
                "Receso de almuerzo y esterilización instrumental", asistente
        ));

        // 7. Seguimiento Clínico de ejemplo
        SeguimientoClinico seg1 = new SeguimientoClinico();
        seg1.setCita(c1);
        seg1.setPaciente(p1);
        seg1.setOdontologo(odontologo);
        seg1.setDiagnostico("Gingivitis marginal leve en sector anteroinferior.");
        seg1.setProcedimientoRealizado("Profilaxis ultrasónica completa con scaler. Pulido y topicación con flúor al 5%.");
        seg1.setObservaciones("Paciente con excelente respuesta al tratamiento. Se sugiere control en 6 meses.");
        seg1.setRecetaIndicaciones("Enjuague con clorhexidina 0.12% por 7 días.");
        seg1.setProximaCitaSugerida(hoy.plusMonths(6));
        seg1.setFechaRegistro(LocalDateTime.now().minusHours(2));
        seguimientoRepository.save(seg1);

        // 8. Pagos para KPIs del Mes
        pagoRepository.save(new Pago(c1, new BigDecimal("120.00"), "YAPE_PLIN", "COMPLETADO"));
        pagoRepository.save(new Pago(c2, new BigDecimal("150.00"), "TARJETA", "COMPLETADO"));
        pagoRepository.save(new Pago(c3, new BigDecimal("380.00"), "TRANSFERENCIA", "PENDIENTE"));

        System.out.println(">>> Datos iniciales cargados correctamente en memoria.");
    }
}
