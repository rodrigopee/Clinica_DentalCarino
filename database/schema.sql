-- =====================================================================
-- SISTEMA DE GESTIÓN CLÍNICA ODONTOLÓGICA & RESERVAS EN LÍNEA
-- SCRIPT DDL: BASE DE DATOS MYSQL
-- =====================================================================

CREATE DATABASE IF NOT EXISTS clinica_odontologica_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE clinica_odontologica_db;

-- 1. TABLA DE ROLES
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'ADMIN, SUPERVISOR, CLIENTE',
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- 2. TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    password VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. TABLA DE PACIENTES
CREATE TABLE IF NOT EXISTS pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(180) NOT NULL,
    documento_identidad VARCHAR(30),
    telefono VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    fecha_nacimiento DATE,
    antecedentes_medicos TEXT,
    alergias TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABLA DE TRATAMIENTOS / SERVICIOS ODONTOLÓGICOS
CREATE TABLE IF NOT EXISTS tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL DEFAULT 45,
    precio_base DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 5. TABLA DE HORARIOS BLOQUEADOS (Gestionados por Asistente/Odontólogo)
CREATE TABLE IF NOT EXISTS horarios_bloqueados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    motivo VARCHAR(255) DEFAULT 'Bloqueado por administración',
    creado_por_id BIGINT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bloqueo_usuario FOREIGN KEY (creado_por_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. TABLA DE CITAS / RESERVACIONES
CREATE TABLE IF NOT EXISTS citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_reserva VARCHAR(20) NOT NULL UNIQUE,
    paciente_id BIGINT NOT NULL,
    tratamiento_id BIGINT NOT NULL,
    odontologo_id BIGINT,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    duracion_minutos INT NOT NULL DEFAULT 45,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, CONFIRMADA, ATENDIDA, CANCELADA',
    motivo_consulta TEXT,
    origen_reserva VARCHAR(30) DEFAULT 'WEB_MOVIL' COMMENT 'WEB_MOVIL, ASISTENTE, ODONTOLOGO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_citas_pacientes FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_citas_tratamientos FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_odontologos FOREIGN KEY (odontologo_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. TABLA DE SEGUIMIENTO CLÍNICO / HISTORIAL
CREATE TABLE IF NOT EXISTS seguimientos_clinicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cita_id BIGINT NOT NULL,
    paciente_id BIGINT NOT NULL,
    odontologo_id BIGINT NOT NULL,
    diagnostico TEXT NOT NULL,
    procedimiento_realizado TEXT NOT NULL,
    observaciones TEXT,
    receta_indicaciones TEXT,
    proxima_cita_sugerida DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seg_citas FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    CONSTRAINT fk_seg_pacientes FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_seg_odontologos FOREIGN KEY (odontologo_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. TABLA DE PAGOS E INGRESOS (Para KPIs mensuales)
CREATE TABLE IF NOT EXISTS pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cita_id BIGINT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL DEFAULT 'EFECTIVO' COMMENT 'EFECTIVO, TARJETA, TRANSFERENCIA, YAPE_PLIN',
    estado_pago VARCHAR(30) NOT NULL DEFAULT 'COMPLETADO' COMMENT 'PENDIENTE, COMPLETADO, ANULADO',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagos_citas FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. TABLA DE NOTIFICACIONES (Avisos en tiempo real para Doctor y Asistente con hora exacta de registro)
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    paciente_nombre VARCHAR(150) NOT NULL,
    paciente_dni VARCHAR(30),
    paciente_telefono VARCHAR(30) NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    hora_registro_str VARCHAR(20) NOT NULL,
    fecha_hora_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido_doctor BOOLEAN DEFAULT FALSE,
    leido_asistente BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- Índices de alto rendimiento para búsqueda de disponibilidad y reportes
CREATE INDEX idx_citas_fecha_hora ON citas(fecha_cita, hora_cita, estado);
CREATE INDEX idx_citas_paciente ON citas(paciente_id);
CREATE INDEX idx_bloqueo_fecha ON horarios_bloqueados(fecha);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago, estado_pago);
