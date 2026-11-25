# 🦷 Sistema Web Integral para Clínica Odontológica

Código de demostración para desarrollo local. Los pacientes, contactos de prueba y credenciales de la demo son ficticios.

> **Solución integral desarrollada con arquitectura Java Spring Boot (Controller, Service, Repository, Entity, DTO) y Base de Datos MySQL.**  
> Diseñada para optimizar y automatizar la gestión médica y administrativa, eliminando la sobrecarga operativa del odontólogo.

---

## 💎 Características Principales y Diseño Visual

- **Paleta de Color de Lujo Sutil (Blanco & Oro Champán):** Estética sobria, moderna y refinada (`#FFFFFF`, `#FAFAF8`, `#C5A059`, `#A37E36`), sin saturar ni fatigar la vista.
- **Visualizador de Horarios en Tiempo Real:** 
  - Horarios disponibles resaltados en blanco y acento dorado interactivo.
  - **Horarios ocupados marcados en negro mate / sombreado (`#18181B`)**, deshabilitados y bloqueados automáticamente tal como solicitado.
- **Enfoque Mobile-First para el Paciente:** Interfaz ultra fluida para que los pacientes reserven directamente desde sus teléfonos celulares en segundos y generen su comprobante de atención digital con confirmación por WhatsApp.

---

## 👥 Roles del Sistema y Permisos

| Rol | Usuario Simulado | Permisos y Alcance |
| :--- | :--- | :--- |
| **1. Paciente / Cliente** | Acceso Libre (`index.html`) | • Registro móvil rápido (Nombre, teléfono, DNI, email)<br>• Consulta de disponibilidad horaria en vivo<br>• Reserva automática con código único (ej. `RES-00000001-4821`)<br>• Comprobante digital y contacto con la clínica |
| **2. Ayudante / Asistente (Supervisor)** | Sofía Ramírez (`admin.html`) | • Recepción de pacientes y gestión de la agenda diaria<br>• Confirmación, reprogramación o cancelación de citas<br>• Bloqueo manual de horarios (almuerzo, desinfección de gabinete, emergencias)<br>• Filtro previo para que el odontólogo reciba pacientes preparados |
| **3. Odontólogo / Administrador** | Dr. Kevin Jhon Lindo Alfaro (`admin.html`) | • Acceso total a los **4 Módulos Estratégicos** (descritos abajo)<br>• Liberación completa de tareas administrativas manuales |

---

## 🏛️ Los 4 Módulos del Odontólogo (Admin)

1. **Módulo 1: Ver Clientes que Reservan & Agenda Diaria**
   - Visualización de pacientes citados con filtros por fecha o listado general.
   - Detalle del motivo de consulta, historial de contacto y estado (`Pendiente`, `Confirmada`, `Atendida`, `Cancelada`).
   - Botón directo **"🩺 Evaluar"** para abrir la ficha clínica en un clic.

2. **Módulo 2: Seguimiento al Cliente (Historial Clínico)**
   - Ficha médica del paciente con registro de diagnósticos clínicos.
   - Procedimientos realizados (profilaxis, resinas, endodoncias, etc.).
   - Prescripción y recetas farmacológicas indicadas.
   - Programación de próxima cita o control recomendado.

3. **Módulo 3: KPIs & Finanzas del Mes (Reporte Ejecutivo)**
   - **Dinero Recaudado en el Mes Actual** y comparativa porcentual frente al mes anterior.
   - **Ticket Promedio** por paciente atendido.
   - Volumen de citas atendidas vs. canceladas y **Tasa de Asistencia (%)**.
   - Ranking de los tratamientos más solicitados y rentables.
   - Desglose de ingresos por método de cobro (*Yape/Plin, Tarjeta, Efectivo, Transferencia*).

4. **Módulo 4: Odontograma (Con Distintivo "Próximamente")**
   - Sección con distintivo de alta gama: **`PRÓXIMAMENTE • EN DESARROLLO ACTIVO`**.
   - Previsualización interactiva de la arcada dental anatómica de 32 piezas (Maxilar superior y mandibular inferior).
   - Simulación de estados dentales (Sano, Caries, Restaurado, En Tratamiento) lista para la fase 2.

---

## 📂 Arquitectura de Software (Java Spring Boot)

```
Sistema Clinica/
├── database/
│   ├── schema.sql                         # Script DDL de tablas MySQL, relaciones e índices
│   └── data.sql                           # Datos semilla iniciales (roles, tratamientos, citas de prueba)
├── src/main/java/com/clinica/odontologia/
│   ├── SistemaClinicaApplication.java     # Clase principal Spring Boot
│   ├── config/
│   │   ├── DataInitializer.java           # Precarga automática de datos de prueba en memoria
│   │   └── WebConfig.java                 # Configuración de CORS y recursos estáticos
│   ├── controller/
│   │   ├── CitaController.java            # Endpoints REST para reservas y citas
│   │   ├── DisponibilidadController.java  # Cálculo de horarios libres vs ocupados en negro
│   │   ├── KpiController.java             # Reportes de facturación y KPIs mensuales
│   │   ├── PacienteController.java        # Gestión de datos de pacientes
│   │   ├── SeguimientoController.java     # Historial clínico y notas médicas
│   │   └── TratamientoController.java     # Catálogo de servicios odontológicos
│   ├── dto/
│   │   ├── BloqueoRequestDTO.java
│   │   ├── CitaResponseDTO.java
│   │   ├── HorarioSlotDTO.java            # Contiene estadoVisual: "DISPONIBLE" vs "OCUPADO"
│   │   ├── KpiReportDTO.java              # Métricas financieras del mes
│   │   ├── ReservaRequestDTO.java
│   │   └── SeguimientoDTO.java
│   ├── entity/                            # Entidades JPA (Modelo relacional)
│   │   ├── Cita.java
│   │   ├── EstadoCita.java
│   │   ├── HorarioBloqueado.java
│   │   ├── Paciente.java
│   │   ├── Pago.java
│   │   ├── Rol.java
│   │   ├── SeguimientoClinico.java
│   │   ├── Tratamiento.java
│   │   └── Usuario.java
│   ├── repository/                        # Spring Data JPA Repositories
│   │   ├── CitaRepository.java
│   │   ├── HorarioBloqueadoRepository.java
│   │   ├── PacienteRepository.java
│   │   ├── PagoRepository.java
│   │   ├── RolRepository.java
│   │   ├── SeguimientoClinicoRepository.java
│   │   ├── TratamientoRepository.java
│   │   └── UsuarioRepository.java
│   └── service/                           # Lógica de Negocio
│       ├── CitaService.java / CitaServiceImpl.java
│       ├── DisponibilidadService.java / DisponibilidadServiceImpl.java
│       ├── KpiService.java / KpiServiceImpl.java
│       ├── PacienteService.java / PacienteServiceImpl.java
│       ├── SeguimientoService.java / SeguimientoServiceImpl.java
│       └── TratamientoService.java / TratamientoServiceImpl.java
├── src/main/resources/
│   ├── application.properties             # Configuración por defecto (H2 en memoria para pruebas instantáneas)
│   ├── application-mysql.properties       # Configuración para MySQL 8.0 en producción
│   └── static/                            # Frontend Web Responsive Luxury White & Gold
│       ├── index.html                     # Portal Paciente / Cliente (Mobile-First)
│       ├── admin.html                     # Portal Odontólogo (4 Módulos) & Ayudante
│       ├── css/styles.css                 # Sistema de diseño Blanco, Oro y Sombreado Ocupado
│       └── js/
│           ├── api.js                     # Cliente REST con fallback interactivo
│           ├── client.js                  # Lógica de reserva y horarios ocupados en negro
│           └── admin.js                   # Lógica de los 4 módulos y conmutador de roles
├── pom.xml                                # Dependencias Maven (Spring Boot 3, JPA, MySQL, Lombok)
└── server.js                              # Servidor local Node.js para visualización inmediata
```

---

## 🚀 Guía de Puesta en Marcha

### Opción A: Visualización y Prueba Inmediata (Sin requerir MySQL ni Maven previo)
Puedes abrir directamente en tu navegador:
1. **Portal Paciente:** `src/main/resources/static/index.html`
2. **Portal Staff Odontólogo:** `src/main/resources/static/admin.html`

O ejecutar el servidor de desarrollo incluido con Node.js:
```powershell
node server.js
```
Luego ingresa en tu navegador a:
- **Portal Paciente:** [http://localhost:8080/index.html](http://localhost:8080/index.html)
- **Portal Staff:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)

---

### Opción B: Ejecución con Java Spring Boot y Base de Datos MySQL

1. **Crear la Base de Datos en MySQL:**
   Abre MySQL Workbench o tu cliente MySQL y ejecuta:
   ```sql
   source database/schema.sql;
   -- Opcional, solo para una base de demostración vacía:
   -- source database/data.sql;
   ```
2. **Configurar las credenciales de MySQL en PowerShell.**
   Usa las variables siguientes en la sesión desde la que ejecutarás Maven.
   ```powershell
   $env:CLINICA_DB_USUARIO = "tu_usuario"
   $env:CLINICA_DB_PASSWORD = "tu_contraseña"
   ```
3. **Compilar y Ejecutar:**
   ```powershell
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   *Nota: Por defecto, si inicias sin perfil MySQL, el sistema arranca con base de datos H2 en memoria y precarga todos los datos semilla automáticamente.*
