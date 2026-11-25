package com.clinica.odontologia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SistemaClinicaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaClinicaApplication.class, args);
        System.out.println("=================================================================");
        System.out.println("   SISTEMA CLÍNICA ODONTOLÓGICA - BACKEND INICIADO CON ÉXITO     ");
        System.out.println("   Servidor: http://localhost:8080                               ");
        System.out.println("   Portal Paciente (Móvil): http://localhost:8080/index.html     ");
        System.out.println("   Portal Staff (Odontólogo / Asistente): http://localhost:8080/admin.html ");
        System.out.println("=================================================================");
    }
}
