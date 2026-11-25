/**
 * SERVIDOR DE DESARROLLO Y SIMULACIÓN REST PARA LA CLÍNICA ODONTOLÓGICA
 * Emula los endpoints de Spring Boot y sirve el frontend Luxury White & Gold.
 * Puerto por defecto: 8080 (igual que Spring Boot).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const STATIC_DIR = path.join(__dirname, 'src', 'main', 'resources', 'static');

// Base de datos en memoria para el servidor
let tratamientos = [
  { id: 1, nombre: "Evaluación & Diagnóstico Integral", duracionMinutos: 30, precioBase: 50.00, descripcion: "Revisión exhaustiva con cámara intraoral y plan odontológico personalizado.", activo: true },
  { id: 2, nombre: "Profilaxis Dental con Ultrasonido", duracionMinutos: 45, precioBase: 120.00, descripcion: "Eliminación profunda de sarro supra/subgingival, pulido y fluorización.", activo: true },
  { id: 3, nombre: "Blanqueamiento Dental Láser Gold", duracionMinutos: 60, precioBase: 380.00, descripcion: "Tratamiento estético intensivo con gel de alta gama y activación LED.", activo: true },
  { id: 4, nombre: "Restauración Estética con Resina 3M", duracionMinutos: 45, precioBase: 150.00, descripcion: "Obturación mimetizada al color natural del diente con acabado pulido.", activo: true },
  { id: 5, nombre: "Control y Ajuste de Ortodoncia", duracionMinutos: 30, precioBase: 100.00, descripcion: "Ajuste de aparatología fija, cambio de arcos dentales y módulos elásticos.", activo: true },
  { id: 6, nombre: "Endodoncia Mecanizada", duracionMinutos: 60, precioBase: 320.00, descripcion: "Biopulpectomía y conformación de conductos radiculares con motor rotatorio.", activo: true }
];

const hoyIso = new Date().toISOString().split('T')[0];

let citas = [
  {
    id: 1,
    codigoReserva: "RES-202611-001",
    pacienteId: 1,
    pacienteNombre: "Paciente Demo 05",
    pacienteTelefono: "+51 000 000 007",
    pacienteEmail: "paciente10@clinica.example",
    pacienteDocumento: "00000005",
    tratamientoId: 2,
    tratamientoNombre: "Profilaxis Dental con Ultrasonido",
    precioTratamiento: 120.00,
    fechaCita: hoyIso,
    horaCita: "09:45:00",
    duracionMinutos: 45,
    estado: "ATENDIDA",
    motivoConsulta: "Limpieza anual preventiva de rutina",
    odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
    origenReserva: "WEB_MOVIL"
  },
  {
    id: 2,
    codigoReserva: "RES-202611-002",
    pacienteId: 2,
    pacienteNombre: "Paciente Demo 02",
    pacienteTelefono: "+51 000 000 006",
    pacienteEmail: "paciente04@clinica.example",
    pacienteDocumento: "00000003",
    tratamientoId: 4,
    tratamientoNombre: "Restauración Estética con Resina 3M",
    precioTratamiento: 150.00,
    fechaCita: hoyIso,
    horaCita: "11:15:00",
    duracionMinutos: 45,
    estado: "CONFIRMADA",
    motivoConsulta: "Dolor leve al masticar alimentos fríos en molar derecho",
    odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
    origenReserva: "WEB_MOVIL"
  },
  {
    id: 3,
    codigoReserva: "RES-202611-003",
    pacienteId: 3,
    pacienteNombre: "Paciente Demo 04",
    pacienteTelefono: "+51 000 000 004",
    pacienteEmail: "paciente09@clinica.example",
    pacienteDocumento: "00000007",
    tratamientoId: 3,
    tratamientoNombre: "Blanqueamiento Dental Láser Gold",
    precioTratamiento: 380.00,
    fechaCita: hoyIso,
    horaCita: "15:30:00",
    duracionMinutos: 60,
    estado: "PENDIENTE",
    motivoConsulta: "Consulta para blanqueamiento dental de alta estética",
    odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
    origenReserva: "WEB_MOVIL"
  }
];

let seguimientos = [
  {
    id: 1,
    citaId: 1,
    pacienteId: 1,
    pacienteNombre: "Paciente Demo 05",
    odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
    diagnostico: "Gingivitis marginal inducida por placa en sector anteroinferior.",
    procedimientoRealizado: "Profilaxis ultrasónica completa con scaler piezoeléctrico. Pulido con pasta diamantada fina y topicación de flúor al 5%.",
    observaciones: "Paciente colaboradora, buena higiene. Encías con sangrado leve al sondaje resuelto tras limpieza.",
    recetaIndicaciones: "Enjuague bucal con Clorhexidina 0.12% cada 12 horas por 7 días. Cepillo interdental cónico.",
    proximaCitaSugerida: "2027-05-15",
    fechaRegistro: new Date().toISOString()
  }
];

let notificaciones = [
  {
    id: 1,
    titulo: "¡Nueva Cita Registrada!",
    mensaje: "Paciente Demo 05 (DNI: 00000005) agendó cita a las 09:12 AM.",
    pacienteNombre: "Paciente Demo 05",
    pacienteDni: "00000005",
    pacienteTelefono: "+51 000 000 007",
    fechaCita: hoyIso,
    horaCita: "09:45:00",
    horaRegistroStr: "09:12:30 AM",
    fechaHoraRegistro: new Date().toISOString(),
    leidoDoctor: false,
    leidoAsistente: false
  }
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Manejo de CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ===================================================================
  // ENDPOINTS REST (/api)
  // ===================================================================

  // 1. Catálogo de Tratamientos
  if (req.method === 'GET' && pathname === '/api/tratamientos') {
    sendJSON(res, tratamientos);
    return;
  }

  // 2. Disponibilidad de Horarios
  if (req.method === 'GET' && pathname === '/api/disponibilidad') {
    const fecha = parsedUrl.query.fecha || hoyIso;
    const baseHoras = [
      { hora: "09:00:00", horaFormateada: "09:00 AM" },
      { hora: "09:45:00", horaFormateada: "09:45 AM" },
      { hora: "10:30:00", horaFormateada: "10:30 AM" },
      { hora: "11:15:00", horaFormateada: "11:15 AM" },
      { hora: "12:00:00", horaFormateada: "12:00 PM" },
      { hora: "14:00:00", horaFormateada: "02:00 PM" },
      { hora: "14:45:00", horaFormateada: "02:45 PM" },
      { hora: "15:30:00", horaFormateada: "03:30 PM" },
      { hora: "16:15:00", horaFormateada: "04:15 PM" },
      { hora: "17:00:00", horaFormateada: "05:00 PM" },
      { hora: "17:45:00", horaFormateada: "05:45 PM" },
      { hora: "18:30:00", horaFormateada: "06:30 PM" }
    ];

    const citasDia = citas.filter(c => c.fechaCita === fecha && c.estado !== 'CANCELADA');

    const result = baseHoras.map(slot => {
      const encontrada = citasDia.find(c => c.horaCita.substring(0, 5) === slot.hora.substring(0, 5));
      if (encontrada) {
        return {
          hora: slot.hora,
          horaFormateada: slot.horaFormateada,
          disponible: false,
          estadoVisual: "OCUPADO",
          motivoNoDisponible: `Reservado (${encontrada.estado})`
        };
      }
      return {
        hora: slot.hora,
        horaFormateada: slot.horaFormateada,
        disponible: true,
        estadoVisual: "DISPONIBLE",
        motivoNoDisponible: "Disponible para reserva"
      };
    });

    sendJSON(res, result);
    return;
  }

  // 3. Reservar Cita (POST /api/citas/reservar)
  if (req.method === 'POST' && pathname === '/api/citas/reservar') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const trat = tratamientos.find(t => t.id == payload.tratamientoId) || tratamientos[0];

        // Validar choque de horario
        const yaExiste = citas.find(c => c.fechaCita === payload.fechaCita && c.horaCita.substring(0, 5) === payload.horaCita.substring(0, 5) && c.estado !== 'CANCELADA');
        if (yaExiste) {
          sendJSON(res, { error: "El horario seleccionado ya se encuentra ocupado." }, 400);
          return;
        }

        const ahora = new Date();
        const horaRegStr = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const nuevaCita = {
          id: Date.now(),
          codigoReserva: "RES-" + payload.fechaCita.replace(/-/g, '') + "-" + Math.floor(1000 + Math.random() * 9000),
          pacienteId: Date.now() + 1,
          pacienteNombre: payload.nombreCompleto,
          pacienteTelefono: payload.telefono,
          pacienteEmail: payload.email || "",
          pacienteDocumento: payload.documentoIdentidad || "DNI/Doc",
          tratamientoId: trat.id,
          tratamientoNombre: trat.nombre,
          precioTratamiento: trat.precioBase,
          fechaCita: payload.fechaCita,
          horaCita: payload.horaCita,
          duracionMinutos: trat.duracionMinutos,
          estado: "PENDIENTE",
          motivoConsulta: payload.motivoConsulta || trat.nombre,
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          origenReserva: payload.origenReserva || "WEB_CARIÑO",
          horaRegistro: horaRegStr
        };

        citas.push(nuevaCita);

        // Crear notificación automática para doctor y asistente con hora exacta
        const notif = {
          id: Date.now(),
          titulo: "¡Nueva Cita Registrada!",
          mensaje: `El paciente ${payload.nombreCompleto} (DNI: ${payload.documentoIdentidad || '-'}) agendó cita a las ${horaRegStr}.`,
          pacienteNombre: payload.nombreCompleto,
          pacienteDni: payload.documentoIdentidad || "-",
          pacienteTelefono: payload.telefono,
          fechaCita: payload.fechaCita,
          horaCita: payload.horaCita,
          horaRegistroStr: horaRegStr,
          fechaHoraRegistro: ahora.toISOString(),
          leidoDoctor: false,
          leidoAsistente: false
        };
        notificaciones.unshift(notif);

        sendJSON(res, nuevaCita, 201);
      } catch (err) {
        sendJSON(res, { error: err.message }, 400);
      }
    });
    return;
  }

  // 4. Listar Citas (GET /api/citas)
  if (req.method === 'GET' && pathname === '/api/citas') {
    const fecha = parsedUrl.query.fecha;
    if (fecha) {
      sendJSON(res, citas.filter(c => c.fechaCita === fecha));
    } else {
      sendJSON(res, citas);
    }
    return;
  }

  // 5. Cambiar Estado de Cita (PATCH /api/citas/:id/estado)
  if (req.method === 'PATCH' && pathname.startsWith('/api/citas/') && pathname.endsWith('/estado')) {
    const parts = pathname.split('/');
    const citaId = parts[3];
    const nuevoEstado = parsedUrl.query.estado;

    const c = citas.find(item => item.id == citaId);
    if (c) {
      c.estado = nuevoEstado;
      sendJSON(res, c);
    } else {
      sendJSON(res, { error: "Cita no encontrada" }, 404);
    }
    return;
  }

  // 6. KPIs Financieros (GET /api/kpis/mensual)
  if (req.method === 'GET' && pathname === '/api/kpis/mensual') {
    const atendidas = citas.filter(c => c.estado === 'ATENDIDA');
    const totalRecaudado = atendidas.reduce((acc, c) => acc + (c.precioTratamiento || 0), 4150.00);

    const kpi = {
      periodoMes: "Noviembre 2026",
      ingresoMesActual: totalRecaudado,
      ingresoMesAnterior: 3420.00,
      porcentajeCrecimiento: 21.3,
      ticketPromedioPorCita: Math.round(totalRecaudado / Math.max(atendidas.length + 18, 1)),
      totalCitasRegistradas: citas.length + 32,
      totalCitasAtendidas: atendidas.length + 24,
      totalCitasPendientes: citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length,
      totalCitasCanceladas: 2,
      tasaAsistenciaPorcentaje: 92.3,
      topTratamientos: [
        { tratamiento: "Blanqueamiento Dental Láser Gold", cantidad: 10, recaudado: 3800.00 },
        { tratamiento: "Profilaxis con Ultrasonido", cantidad: 18, recaudado: 2160.00 },
        { tratamiento: "Restauración Estética con Resina 3M", cantidad: 9, recaudado: 1350.00 },
        { tratamiento: "Control y Ajuste de Ortodoncia", cantidad: 12, recaudado: 1200.00 }
      ],
      ingresosPorMetodoPago: {
        "YAPE_PLIN": 2650.00,
        "TARJETA": 3100.00,
        "EFECTIVO": 1800.00,
        "TRANSFERENCIA": 900.00
      }
    };
    sendJSON(res, kpi);
    return;
  }

  // 7. Seguimiento Clínico (GET /api/seguimientos/recientes y POST /api/seguimientos)
  if (req.method === 'GET' && pathname === '/api/seguimientos/recientes') {
    sendJSON(res, seguimientos);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/seguimientos') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const nuevo = {
          id: Date.now(),
          citaId: payload.citaId,
          pacienteId: payload.pacienteId,
          pacienteNombre: payload.pacienteNombre,
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          diagnostico: payload.diagnostico,
          procedimientoRealizado: payload.procedimientoRealizado,
          observaciones: payload.observaciones,
          recetaIndicaciones: payload.recetaIndicaciones,
          proximaCitaSugerida: payload.proximaCitaSugerida,
          fechaRegistro: new Date().toISOString()
        };
        seguimientos.unshift(nuevo);

        // Marcar cita atendida
        const c = citas.find(item => item.id == payload.citaId);
        if (c) c.estado = 'ATENDIDA';

        sendJSON(res, nuevo, 201);
      } catch (err) {
        sendJSON(res, { error: err.message }, 400);
      }
    });
    return;
  }

  // 8. Notificaciones de Citas para Doctor y Asistente
  if (req.method === 'GET' && pathname === '/api/notificaciones') {
    sendJSON(res, notificaciones);
    return;
  }

  if (req.method === 'PATCH' && pathname.startsWith('/api/notificaciones/') && pathname.endsWith('/marcar-leida')) {
    const parts = pathname.split('/');
    const notifId = parts[3];
    const rol = parsedUrl.query.rol || 'ODONTOLOGO';
    const notif = notificaciones.find(n => n.id == notifId);
    if (notif) {
      if (rol === 'ODONTOLOGO') notif.leidoDoctor = true;
      else notif.leidoAsistente = true;
      sendJSON(res, { ok: true });
    } else {
      sendJSON(res, { error: "Notificación no encontrada" }, 404);
    }
    return;
  }

  // ===================================================================
  // ARCHIVOS ESTÁTICOS
  // ===================================================================
  let safePath = path.normalize(pathname);
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(STATIC_DIR, safePath);

  // Prevenir Directory Traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Recurso no encontrado: ' + pathname);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`===================================================================`);
  console.log(`   CLÍNICA ODONTOLÓGICA - SERVIDOR DE DESARROLLO ACTIVO            `);
  console.log(`   URL Principal: http://localhost:${PORT}                        `);
  console.log(`   Portal Paciente (Móvil): http://localhost:${PORT}/index.html    `);
  console.log(`   Portal Staff (Odontólogo/Asistente): http://localhost:${PORT}/admin.html`);
  console.log(`===================================================================`);
});
