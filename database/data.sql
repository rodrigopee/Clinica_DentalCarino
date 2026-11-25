-- =====================================================================
-- SISTEMA DE GESTIÓN CLÍNICA ODONTOLÓGICA & RESERVAS EN LÍNEA
-- SCRIPT DML: DATOS SEMILLA DE PRUEBA REALISTAS
-- =====================================================================

USE clinica_odontologica_db;

-- 1. ROLES
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'ADMIN', 'Odontólogo Principal / Propietario de la clínica con acceso total'),
(2, 'SUPERVISOR', 'Ayudante / Asistente dental encargada de recepción, agenda y filtrado'),
(3, 'CLIENTE', 'Paciente que reserva desde el portal móvil o web')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. USUARIOS
INSERT INTO usuarios (id, nombre, apellido, email, telefono, password, rol_id, activo) VALUES
(1, 'Kevin Jhon', 'Lindo Alfaro', 'admin@datos.example', '+51 000 000 010', 'demo-sin-credencial', 1, TRUE),
(2, 'Sofía', 'Ramírez', 'asistente@datos.example', '+51 000 000 001', 'demo-sin-credencial', 2, TRUE),
(3, 'Paciente Demo 01', 'Mendoza', 'paciente14@clinica.example', '+51 000 000 011', 'demo-sin-credencial', 3, TRUE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. TRATAMIENTOS / SERVICIOS
INSERT INTO tratamientos (id, nombre, descripcion, duracion_minutos, precio_base, activo) VALUES
(1, 'Evaluación y Diagnóstico Integral', 'Revisión exhaustiva con cámara intraoral y plan de tratamiento personalizado', 30, 50.00, TRUE),
(2, 'Profilaxis y Limpieza con Ultrasonido', 'Eliminación de sarro supra y subgingival, pulido coronario y fluorización', 45, 120.00, TRUE),
(3, 'Blanqueamiento Dental Láser Gold', 'Sesión intensiva con activación láser de alta gama para aclarar hasta 5 tonos', 60, 380.00, TRUE),
(4, 'Restauración Estética con Resina 3M', 'Curación estética mimetizada con el color natural del esmalte dental', 45, 150.00, TRUE),
(5, 'Control y Ajuste de Ortodoncia', 'Revisión mensual, cambio de arcos y ligas elastoméricas', 30, 100.00, TRUE),
(6, 'Endodoncia Mecanizada Unirradicular', 'Tratamiento de conducto asistido por motor rotatorio de alta precisión', 60, 320.00, TRUE),
(7, 'Exodoncia Simple de Tercer Molar', 'Extracción quirúrgica atraumática con anestesia indolora', 45, 200.00, TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 4. PACIENTES FRECUENTES
INSERT INTO pacientes (id, nombre_completo, documento_identidad, telefono, email, fecha_nacimiento, antecedentes_medicos, alergias) VALUES
(1, 'Paciente Demo 05', '00000005', '+51 000 000 007', 'paciente10@clinica.example', '1990-01-01', 'Ejemplo clínico', 'Sin datos de alergias'),
(2, 'Paciente Demo 02', '00000003', '+51 000 000 006', 'paciente04@clinica.example', '1990-01-01', 'Ejemplo clínico', 'Sin datos de alergias'),
(3, 'Paciente Demo 04', '00000007', '+51 000 000 004', 'paciente09@clinica.example', '1990-01-01', 'Ejemplo clínico', 'Sin datos de alergias'),
(4, 'Paciente Demo 03', '00000004', '+51 000 000 003', 'paciente06@clinica.example', '1990-01-01', 'Ejemplo clínico', 'Sin datos de alergias'),
(5, 'Paciente Demo 06', '00000008', '+51 000 000 002', 'paciente16@clinica.example', '1990-01-01', 'Ejemplo clínico', 'Sin datos de alergias')
ON DUPLICATE KEY UPDATE nombre_completo=VALUES(nombre_completo);

-- 5. CITAS (Demostración de turnos ocupados hoy y en la semana para que se muestren sombreados/negros)
INSERT INTO citas (id, codigo_reserva, paciente_id, tratamiento_id, odontologo_id, fecha_cita, hora_cita, duracion_minutos, estado, motivo_consulta, origen_reserva) VALUES
(1, 'RES-00000001-01', 1, 2, 1, CURRENT_DATE(), '09:00:00', 45, 'ATENDIDA', 'Limpieza dental semestral preventiva', 'WEB_MOVIL'),
(2, 'RES-00000001-02', 2, 4, 1, CURRENT_DATE(), '11:00:00', 45, 'CONFIRMADA', 'Dolor leve en molar inferior derecho al masticar', 'WEB_MOVIL'),
(3, 'RES-00000001-03', 3, 3, 1, CURRENT_DATE(), '15:00:00', 60, 'PENDIENTE', 'Consulta para blanqueamiento antes de un evento', 'WEB_MOVIL'),
(4, 'RES-00000001-04', 4, 5, 1, CURRENT_DATE(), '17:00:00', 30, 'CONFIRMADA', 'Control mensual de brackets', 'ASISTENTE'),
(5, 'RES-00000002-01', 5, 1, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '10:00:00', 30, 'CONFIRMADA', 'Primera cita de evaluación general', 'WEB_MOVIL'),
(6, 'RES-00000002-02', 1, 3, 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '14:00:00', 60, 'PENDIENTE', 'Desea iniciar blanqueamiento dental', 'WEB_MOVIL')
ON DUPLICATE KEY UPDATE codigo_reserva=VALUES(codigo_reserva);

-- 6. HORARIOS BLOQUEADOS POR LA ASISTENTE / SUPERVISOR
INSERT INTO horarios_bloqueados (id, fecha, hora_inicio, hora_fin, motivo, creado_por_id) VALUES
(1, CURRENT_DATE(), '13:00:00', '14:00:00', 'Receso de almuerzo y desinfección de gabinete clínico', 2),
(2, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '13:00:00', '14:00:00', 'Receso de almuerzo y esterilización instrumental', 2)
ON DUPLICATE KEY UPDATE motivo=VALUES(motivo);

-- 7. SEGUIMIENTO CLÍNICO (Historial de pacientes para que el odontólogo evalúe)
INSERT INTO seguimientos_clinicos (id, cita_id, paciente_id, odontologo_id, diagnostico, procedimiento_realizado, observaciones, receta_indicaciones, proxima_cita_sugerida) VALUES
(1, 1, 1, 1, 
 'Gingivitis marginal inducida por placa en sector anteroinferior. Sin pérdida ósea detectable.', 
 'Profilaxis ultrasónica completa con scaler piezoeléctrico. Pulido con pasta diamantada fina y aplicación tópica de flúor barniz al 5%.', 
 'Paciente colaboradora, buena higiene en general salvo zona lingual inferior.', 
 'Enjuague bucal con Clorhexidina 0.12% cada 12 horas por 7 días. Cepillo interdental cónico.', 
 DATE_ADD(CURRENT_DATE(), INTERVAL 6 MONTH)),

(2, 2, 2, 1, 
 'Caries de esmalte y dentina en pieza 4.6 (Oclusal). Pulpitis reversible.', 
 'Eliminación de caries mediante fresa carbide, desinfección cavitaria con clorhexidina 2%, grabado ácido selectivo, adhesivo universal y reconstrucción con composite fluido + nanohíbrido Z350.', 
 'Oclusión ajustada y pulido de alto brillo.', 
 'Ibuprofeno 400mg cada 8 horas si presenta molestia leve al morder durante las primeras 24h.', 
 DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY))
ON DUPLICATE KEY UPDATE diagnostico=VALUES(diagnostico);

-- 8. PAGOS REGISTRADOS PARA KPIS FINANCIEROS DEL MES
INSERT INTO pagos (id, cita_id, monto, metodo_pago, estado_pago, fecha_pago) VALUES
(1, 1, 120.00, 'YAPE_PLIN', 'COMPLETADO', CURRENT_TIMESTAMP()),
(2, 2, 150.00, 'TARJETA', 'COMPLETADO', CURRENT_TIMESTAMP()),
(3, 3, 380.00, 'TRANSFERENCIA', 'PENDIENTE', CURRENT_TIMESTAMP()),
(4, 4, 100.00, 'EFECTIVO', 'COMPLETADO', CURRENT_TIMESTAMP())
ON DUPLICATE KEY UPDATE monto=VALUES(monto);
