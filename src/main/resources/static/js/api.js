/**
 * SISTEMA CLÍNICA ODONTOLÓGICA - CLIENTE DE API Y SERVICIO DE DATOS
 * Maneja llamadas REST al backend Spring Boot con soporte offline/demo interactivo.
 */

const API_BASE = '/api';

// Base de datos de respaldo interactiva (LocalStorage) para demostración inmediata
const DemoDatabase = {
  getTratamientos() {
    return [
      { id: 1, nombre: "Evaluación & Diagnóstico Integral", duracionMinutos: 30, precioBase: 50.00, descripcion: "Revisión exhaustiva con cámara intraoral y plan odontológico personalizado." },
      { id: 2, nombre: "Profilaxis Dental con Ultrasonido", duracionMinutos: 45, precioBase: 120.00, descripcion: "Eliminación profunda de sarro supra/subgingival, pulido y fluorización." },
      { id: 3, nombre: "Blanqueamiento Dental Láser Gold", duracionMinutos: 60, precioBase: 380.00, descripcion: "Tratamiento estético intensivo con gel de alta gama y activación LED." },
      { id: 4, nombre: "Restauración Estética con Resina 3M", duracionMinutos: 45, precioBase: 150.00, descripcion: "Obturación mimetizada al color natural del diente con acabado pulido." },
      { id: 5, nombre: "Control y Ajuste de Ortodoncia", duracionMinutos: 30, precioBase: 100.00, descripcion: "Ajuste de aparatología fija, cambio de arcos dentales y módulos elásticos." },
      { id: 6, nombre: "Endodoncia Mecanizada", duracionMinutos: 60, precioBase: 320.00, descripcion: "Biopulpectomía y conformación de conductos radiculares con motor rotatorio." }
    ];
  },

  getCitas() {
    let citas = localStorage.getItem('demo_citas');
    if (!citas) {
      const hoy = new Date().toISOString().split('T')[0];
      citas = [
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
          fechaCita: hoy,
          horaCita: "09:45:00",
          duracionMinutos: 45,
          estado: "ATENDIDA",
          motivoConsulta: "Limpieza anual preventiva",
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
          fechaCita: hoy,
          horaCita: "11:15:00",
          duracionMinutos: 45,
          estado: "CONFIRMADA",
          motivoConsulta: "Dolor leve al masticar alimentos fríos",
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
          fechaCita: hoy,
          horaCita: "15:30:00",
          duracionMinutos: 60,
          estado: "PENDIENTE",
          motivoConsulta: "Consulta para blanqueamiento dental antes de graduación",
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          origenReserva: "WEB_MOVIL"
        }
      ];
      localStorage.setItem('demo_citas', JSON.stringify(citas));
    } else {
      citas = JSON.parse(citas);
      const hoy = new Date().toISOString().split('T')[0];
      let updated = false;
      citas.forEach(c => {
        if (!c.fechaCita || c.fechaCita < hoy) {
          c.fechaCita = hoy;
          updated = true;
        }
      });
      if (updated) localStorage.setItem('demo_citas', JSON.stringify(citas));
    }
    return citas;
  },

  saveCitas(citas) {
    localStorage.setItem('demo_citas', JSON.stringify(citas));
  },

  getSeguimientos() {
    let seg = localStorage.getItem('demo_seguimientos');
    if (!seg) {
      seg = [
        {
          id: 1,
          citaId: 1,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 05",
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          diagnostico: "Gingivitis marginal inducida por placa en sector anteroinferior.",
          procedimientoRealizado: "Profilaxis ultrasónica completa con scaler piezoeléctrico. Pulido con pasta diamantada fina y topicación de flúor al 5%.",
          observaciones: "Paciente colaboradora, buena higiene. Encías con sangrado leve al sondaje superado tras tratamiento.",
          recadoIndicaciones: "Evitar alimentos con colorantes intensos durante 24 horas. Usar enjuague con Clorhexidina 0.12% cada 12 horas por 7 días. Cepillo interdental suave.",
          proximaCitaSugerida: "2026-12-18",
          mesProximaCita: "Diciembre 2026",
          montoPagoMes: 120.00,
          tratamiento: "Limpieza & Control Preventivo",
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 2,
          citaId: 4,
          pacienteId: 4,
          pacienteNombre: "Paciente Demo 03",
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          diagnostico: "Maloclusión Clase II División 1 en fase de alineación y nivelación.",
          procedimientoRealizado: "Cambio de arco superior a NiTi 0.016. Recambio de ligaduras elásticas en arcada superior e inferior. Ajuste de torque anterior.",
          observaciones: "Evolución favorable en sector anterosuperior. Excelente cooperación del paciente con los elásticos intermaxilares.",
          recadoIndicaciones: "Evitar morder alimentos duros directamente con los incisivos. Aplicar cera de ortodoncia en el tubo del molar 16 si presenta molestia. Próximo ajuste con arco de acero.",
          proximaCitaSugerida: "2026-12-15",
          mesProximaCita: "Diciembre 2026",
          montoPagoMes: 120.00,
          tratamiento: "Ortodoncia Metálica (Brackets)",
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 3,
          citaId: 2,
          pacienteId: 2,
          pacienteNombre: "Paciente Demo 02",
          odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
          diagnostico: "Caries oclusal profunda en pieza 36 sin compromiso pulpar.",
          procedimientoRealizado: "Apertura cavitaria conservadora, eliminación de tejido cariado, grabado ácido, adhesivo universal y restauración estética con resina nanohíbrida 3M Filtek.",
          observaciones: "Oclusión ajustada con papel articular 40 micras. Sin sintomatología residual.",
          recadoIndicaciones: "No masticar alimentos de consistencia dura durante las primeras 2 horas posteriores al tratamiento. Reportar si siente el punto de contacto alto.",
          proximaCitaSugerida: "2027-01-10",
          mesProximaCita: "Enero 2027",
          montoPagoMes: 150.00,
          tratamiento: "Restauración Estética con Resina",
          fechaRegistro: new Date().toISOString()
        }
      ];
      localStorage.setItem('demo_seguimientos', JSON.stringify(seg));
    } else {
      seg = JSON.parse(seg);
    }
    return seg;
  },

  saveSeguimientos(seg) {
    localStorage.setItem('demo_seguimientos', JSON.stringify(seg));
  },

  // CLIENTES CON CONTROL MENSUAL (BRACKETS / ORTODONCIA)
  getClientesBrackets() {
    let clients = localStorage.getItem('demo_clientes_brackets');
    if (!clients) {
      clients = [
        {
          id: 1,
          nombreCompleto: "Paciente Demo 03",
          dni: "00000004",
          telefono: "+51 000 000 003",
          email: "paciente05@clinica.example",
          passwordVisible: "demo-clave-1",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          diaControlMensual: 15,
          mesActual: "Noviembre 2026",
          cuotaMensual: 120.00,
          estadoPago: "PAGADO",
          fechaRegistro: "2026-08-15"
        },
        {
          id: 2,
          nombreCompleto: "Paciente Demo 06",
          dni: "00000008",
          telefono: "+51 000 000 002",
          email: "paciente17@clinica.example",
          passwordVisible: "demo-clave-3",
          tratamiento: "Ortodoncia Estética Zafiro",
          diaControlMensual: 22,
          mesActual: "Noviembre 2026",
          cuotaMensual: 160.00,
          estadoPago: "PENDIENTE",
          fechaRegistro: "2026-09-22"
        },
        {
          id: 3,
          nombreCompleto: "Paciente Demo 04",
          dni: "00000007",
          telefono: "+51 000 000 004",
          email: "paciente08@clinica.example",
          passwordVisible: "demo-clave-2",
          tratamiento: "Alineadores Invisibles",
          diaControlMensual: 5,
          mesActual: "Noviembre 2026",
          cuotaMensual: 250.00,
          estadoPago: "PAGADO",
          fechaRegistro: "2026-07-05"
        }
      ];
      localStorage.setItem('demo_clientes_brackets', JSON.stringify(clients));
    } else {
      clients = JSON.parse(clients);
    }
    return clients;
  },

  saveClientesBrackets(data) {
    localStorage.setItem('demo_clientes_brackets', JSON.stringify(data));
  },

  // CONTROLES MENSUALES DE BRACKETS Y SEGUIMIENTO EN LISTA
  getControlesMensuales() {
    var ctrls = localStorage.getItem('demo_controles_mensuales');
    if (!ctrls) {
      ctrls = [
        {
          id: 1,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 1,
          mesControl: "Agosto 2026",
          fechaCita: "2026-08-15",
          montoPago: 120.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Instalación de brackets metálicos superiores e inferiores con tubos de anclaje.",
          recado: "Usar cera de alivio en caso de roce. Dieta blanda los primeros 3 días.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 2,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 2,
          mesControl: "Septiembre 2026",
          fechaCita: "2026-09-15",
          montoPago: 120.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Cambio de ligaduras elásticas y ajuste de arco inicial NiTi .014.",
          recado: "Higiene correcta con cepillo interproximal en todas las zonas.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 3,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 3,
          mesControl: "Octubre 2026",
          fechaCita: "2026-10-15",
          montoPago: 120.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Ajuste de arcos NiTi .016 superior e inferior. Evaluación de rotaciones.",
          recado: "Mantener uso de pasta fluorada para proteger el esmalte dental.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 4,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 4,
          mesControl: "Noviembre 2026",
          fechaCita: "2026-11-15",
          montoPago: 120.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Alineación de sectores laterales y control de torque anterior.",
          recado: "Excelente avance. Evitar alimentos duros que puedan desprender brackets.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 5,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 5,
          mesControl: "Diciembre 2026",
          fechaCita: "2026-12-15",
          montoPago: 120.00,
          estadoPago: "PENDIENTE",
          estadoControl: "PENDIENTE",
          procedimiento: "Cambio de arco NiTi a Acero .018, reposición de bracket en pieza 2.1 y cadeneta.",
          recado: "Venir 10 minutos antes. Aplicar cera de alivio si nota roce previo.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 6,
          pacienteId: 1,
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          pacienteEmail: "paciente05@clinica.example",
          tratamiento: "Ortodoncia Metálica MBT (Brackets)",
          numeroControl: 6,
          mesControl: "Enero 2027",
          fechaCita: "2027-01-15",
          montoPago: 120.00,
          estadoPago: "PENDIENTE",
          estadoControl: "PENDIENTE",
          procedimiento: "Nivelación de curva de Spee y evaluación para elásticos intermaxilares.",
          recado: "Control de mordida y verificación de higiene.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 7,
          pacienteId: 2,
          pacienteNombre: "Paciente Demo 06",
          pacienteDni: "00000008",
          pacienteEmail: "paciente17@clinica.example",
          tratamiento: "Ortodoncia Estética Zafiro",
          numeroControl: 1,
          mesControl: "Septiembre 2026",
          fechaCita: "2026-09-22",
          montoPago: 160.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Cementación de brackets de zafiro en ambas arcadas.",
          recado: "Cuidado estricto para evitar manchas con café o salsas.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 8,
          pacienteId: 2,
          pacienteNombre: "Paciente Demo 06",
          pacienteDni: "00000008",
          pacienteEmail: "paciente17@clinica.example",
          tratamiento: "Ortodoncia Estética Zafiro",
          numeroControl: 2,
          mesControl: "Octubre 2026",
          fechaCita: "2026-10-22",
          montoPago: 160.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Recambio de módulos elastoméricos transparentes y arco estético.",
          recado: "Buena higiene dental observada.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 9,
          pacienteId: 2,
          pacienteNombre: "Paciente Demo 06",
          pacienteDni: "00000008",
          pacienteEmail: "paciente17@clinica.example",
          tratamiento: "Ortodoncia Estética Zafiro",
          numeroControl: 3,
          mesControl: "Noviembre 2026",
          fechaCita: "2026-11-22",
          montoPago: 160.00,
          estadoPago: "PENDIENTE",
          estadoControl: "PENDIENTE",
          procedimiento: "Ajuste mensual de arcos estéticos y control de mordida.",
          recado: "Asistir puntualmente a la cita.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 10,
          pacienteId: 3,
          pacienteNombre: "Paciente Demo 04",
          pacienteDni: "00000007",
          pacienteEmail: "paciente08@clinica.example",
          tratamiento: "Alineadores Invisibles",
          numeroControl: 1,
          mesControl: "Julio 2026",
          fechaCita: "2026-07-05",
          montoPago: 250.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Entrega y ajuste de juego de alineadores #1 a #4.",
          recado: "Usar mínimo 22 horas al día.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 11,
          pacienteId: 3,
          pacienteNombre: "Paciente Demo 04",
          pacienteDni: "00000007",
          pacienteEmail: "paciente08@clinica.example",
          tratamiento: "Alineadores Invisibles",
          numeroControl: 2,
          mesControl: "Agosto 2026",
          fechaCita: "2026-08-05",
          montoPago: 250.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Revisión de ataches y entrega de set de alineadores #5 a #8.",
          recado: "Correcto acoplamiento de alineadores.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 12,
          pacienteId: 3,
          pacienteNombre: "Paciente Demo 04",
          pacienteDni: "00000007",
          pacienteEmail: "paciente08@clinica.example",
          tratamiento: "Alineadores Invisibles",
          numeroControl: 3,
          mesControl: "Noviembre 2026",
          fechaCita: "2026-11-05",
          montoPago: 250.00,
          estadoPago: "PAGADO",
          estadoControl: "CONFIRMADO",
          procedimiento: "Control y cambio de placas alineadoras.",
          recado: "Continuar con el régimen de limpieza de placas.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        },
        {
          id: 13,
          pacienteId: 3,
          pacienteNombre: "Paciente Demo 04",
          pacienteDni: "00000007",
          pacienteEmail: "paciente08@clinica.example",
          tratamiento: "Alineadores Invisibles",
          numeroControl: 4,
          mesControl: "Diciembre 2026",
          fechaCita: "2026-12-05",
          montoPago: 250.00,
          estadoPago: "PENDIENTE",
          estadoControl: "PENDIENTE",
          procedimiento: "Escaneo intraoral de control de avance.",
          recado: "Traer el estuche de alineadores.",
          doctor: "Dr. Kevin Jhon Lindo Alfaro"
        }
      ];
      localStorage.setItem('demo_controles_mensuales', JSON.stringify(ctrls));
    } else {
      ctrls = JSON.parse(ctrls);
    }
    return ctrls;
  },

  saveControlesMensuales(data) {
    localStorage.setItem('demo_controles_mensuales', JSON.stringify(data));
  },

  // ODONTOGRAMA
  getOdontograma(pacienteId) {
    const key = 'demo_odontograma_' + (pacienteId || 'general');
    let od = localStorage.getItem(key);
    if (!od) {
      const inicial = {
        18: { estado: 'SANO', detalle: 'Tercer molar superior derecho erupcionado' },
        17: { estado: 'SANO', detalle: 'Sin lesión aparente' },
        16: { estado: 'CARIES', detalle: 'Caries oclusal con indicación de resina estética' },
        15: { estado: 'SANO', detalle: 'Sano' },
        14: { estado: 'SANO', detalle: 'Sano' },
        13: { estado: 'SANO', detalle: 'Canino en correcta guía canina' },
        12: { estado: 'SANO', detalle: 'Sano' },
        11: { estado: 'SANO', detalle: 'Incisivo central con ligera abrasión incisal' },
        21: { estado: 'SANO', detalle: 'Sano' },
        22: { estado: 'SANO', detalle: 'Sano' },
        23: { estado: 'SANO', detalle: 'Sano' },
        24: { estado: 'RESTAURADO', detalle: 'Obturación con resina compuesta clase II mesio-oclusal' },
        25: { estado: 'SANO', detalle: 'Sano' },
        26: { estado: 'SANO', detalle: 'Sano' },
        27: { estado: 'SANO', detalle: 'Sano' },
        28: { estado: 'AUSENTE', detalle: 'Pieza extraída previamente' },
        48: { estado: 'AUSENTE', detalle: 'Exodoncia quirúrgica de tercer molar inferior' },
        47: { estado: 'SANO', detalle: 'Sano' },
        46: { estado: 'SANO', detalle: 'Sano' },
        45: { estado: 'SANO', detalle: 'Sano' },
        44: { estado: 'SANO', detalle: 'Sano' },
        43: { estado: 'SANO', detalle: 'Sano' },
        42: { estado: 'SANO', detalle: 'Sano' },
        41: { estado: 'SANO', detalle: 'Sano' },
        31: { estado: 'SANO', detalle: 'Sano' },
        32: { estado: 'SANO', detalle: 'Sano' },
        33: { estado: 'SANO', detalle: 'Sano' },
        34: { estado: 'SANO', detalle: 'Sano' },
        35: { estado: 'SANO', detalle: 'Sano' },
        36: { estado: 'ENDODONCIA', detalle: 'Tratamiento de conducto con corona protésica definitiva' },
        37: { estado: 'SANO', detalle: 'Sano' },
        38: { estado: 'AUSENTE', detalle: 'Pieza no erupcionada / agenesia' }
      };
      localStorage.setItem(key, JSON.stringify(inicial));
      return inicial;
    }
    return JSON.parse(od);
  },

  saveOdontograma(pacienteId, data) {
    const key = 'demo_odontograma_' + (pacienteId || 'general');
    localStorage.setItem(key, JSON.stringify(data));
  },

  getNotificaciones() {
    let notifs = localStorage.getItem('demo_notificaciones');
    if (!notifs) {
      notifs = [
        {
          id: 1,
          titulo: "¡Nueva Cita Registrada!",
          mensaje: "Paciente Demo 05 (DNI: 00000005) agendó una cita.",
          pacienteNombre: "Paciente Demo 05",
          pacienteDni: "00000005",
          pacienteTelefono: "+51 000 000 007",
          fechaCita: new Date().toISOString().split('T')[0],
          horaCita: "09:45:00",
          horaRegistroStr: "09:12:30 AM",
          fechaHoraRegistro: new Date().toISOString(),
          leidoDoctor: false,
          leidoAsistente: false
        },
        {
          id: 2,
          titulo: "🔔 Paciente en Sala de Espera",
          mensaje: "Paciente Demo 03 se presentó para su control de brackets.",
          pacienteNombre: "Paciente Demo 03",
          pacienteDni: "00000004",
          horaRegistroStr: "10:30:15 AM",
          fechaHoraRegistro: new Date().toISOString(),
          leidoDoctor: false,
          leidoAsistente: false
        }
      ];
      localStorage.setItem('demo_notificaciones', JSON.stringify(notifs));
    } else {
      notifs = JSON.parse(notifs);
    }
    return notifs;
  },

  saveNotificaciones(notifs) {
    localStorage.setItem('demo_notificaciones', JSON.stringify(notifs));
  },

  // NOTIFICACIONES DIRIGIDAS AL PACIENTE (CONTROL, CUOTA, RECADOS & ESTADOS)
  getNotificacionesPaciente(emailOrDni) {
    let key = 'demo_notifs_paciente_' + (emailOrDni || 'default');
    let notifs = localStorage.getItem(key);
    if (!notifs) {
      notifs = [
        {
          id: 1,
          titulo: "🗓️ Próximo Control: Diciembre 2026",
          mensaje: "Tu cita de ajuste de brackets está programada para el 15/12/2026. Te esperamos puntualmente.",
          tipo: "CONTROL",
          horaRegistroStr: "Programada",
          leido: false
        },
        {
          id: 2,
          titulo: "💰 Cuota Programada: S/ 120.00",
          mensaje: "Cuota de ortodoncia correspondiente a Diciembre 2026 fijada en S/ 120.00.",
          tipo: "PAGO",
          horaRegistroStr: "Caja",
          leido: false
        },
        {
          id: 3,
          titulo: "📝 Recado del Dr. Kevin Jhon Lindo Alfaro",
          mensaje: "'Usar cera de alivio en molar 16 en caso de roce y continuar con el cepillado interdental diario.'",
          tipo: "RECADO",
          horaRegistroStr: "Indicación Activa",
          leido: false
        },
        {
          id: 4,
          titulo: "✓ Control de Noviembre Asistido",
          mensaje: "Se confirmó tu asistencia al control anterior. Tu tratamiento de ortodoncia se encuentra en 67% de avance.",
          tipo: "CONFIRMADO",
          horaRegistroStr: "Cumplido",
          leido: true
        }
      ];
      localStorage.setItem(key, JSON.stringify(notifs));
    } else {
      notifs = JSON.parse(notifs);
    }
    return notifs;
  },

  saveNotificacionesPaciente(emailOrDni, notifs) {
    let key = 'demo_notifs_paciente_' + (emailOrDni || 'default');
    localStorage.setItem(key, JSON.stringify(notifs));
  },

  // CHAT EN VIVO DE ATENCIÓN AL CLIENTE / DUDAS (BLANCO Y NEGRO)
  getChatMensajes() {
    let msgs = localStorage.getItem('demo_chat_mensajes');
    if (!msgs) {
      msgs = [
        {
          id: 1,
          clienteId: 'cliente_demo',
          clienteNombre: 'Paciente Demo 03',
          clienteTelefono: '+51 000 000 003',
          remitente: 'CLIENTE',
          remitenteNombre: 'Paciente Demo 03',
          texto: 'Buenas tardes doctor, ¿cuánto cuesta la cuota de control de brackets este mes?',
          fechaHora: '2026-11-18T10:15:00.000Z',
          horaStr: '10:15 AM',
          leidoPorAdmin: true,
          leidoPorCliente: true
        },
        {
          id: 2,
          clienteId: 'cliente_demo',
          clienteNombre: 'Paciente Demo 03',
          clienteTelefono: '+51 000 000 003',
          remitente: 'ADMIN',
          remitenteNombre: 'Dr. Kevin Jhon Lindo Alfaro',
          texto: 'Hola Paciente Demo 03, la cuota mensual de control es de S/ 120.00 e incluye cambio de ligaduras, activación de arco NiTi y limpieza de aparatología. Te esperamos en tu cita programada.',
          fechaHora: '2026-11-18T10:20:00.000Z',
          horaStr: '10:20 AM',
          leidoPorAdmin: true,
          leidoPorCliente: true
        }
      ];
      localStorage.setItem('demo_chat_mensajes', JSON.stringify(msgs));
    } else {
      msgs = JSON.parse(msgs);
    }
    return msgs;
  },

  saveChatMensajes(msgs) {
    localStorage.setItem('demo_chat_mensajes', JSON.stringify(msgs));
  }
};

const ClinicaAPI = {
  async getTratamientos() {
    try {
      const res = await fetch(`${API_BASE}/tratamientos`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Usar mock
    }
    return DemoDatabase.getTratamientos();
  },

  async getDisponibilidad(fecha) {
    try {
      const res = await fetch(`${API_BASE}/disponibilidad?fecha=${fecha}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Usar cálculo mock interactivo
    }

    // Horarios estándar: 09:00 a 18:30 (intervalos de 45 min)
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

    const citas = DemoDatabase.getCitas().filter(c => c.fechaCita === fecha && c.estado !== 'CANCELADA');

    return baseHoras.map(slot => {
      // Revisar si choca con cita activa
      const citaOcupada = citas.find(c => {
        const cHora = c.horaCita.substring(0, 5);
        const sHora = slot.hora.substring(0, 5);
        return cHora === sHora;
      });

      if (citaOcupada) {
        return {
          hora: slot.hora,
          horaFormateada: slot.horaFormateada,
          disponible: false,
          estadoVisual: "OCUPADO",
          motivoNoDisponible: `Reservado (${citaOcupada.estado})`
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
  },

  async crearReserva(data) {
    try {
      const res = await fetch(`${API_BASE}/citas/reservar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Error al procesar reserva');
    } catch (e) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
    }

    // Fallback Mock Local
    const citas = DemoDatabase.getCitas();
    const tratamientos = DemoDatabase.getTratamientos();
    const trat = tratamientos.find(t => t.id == data.tratamientoId) || tratamientos[0];

    const nuevaCita = {
      id: Date.now(),
      codigoReserva: "RES-" + data.fechaCita.replace(/-/g, '') + "-" + Math.floor(1000 + Math.random() * 9000),
      pacienteId: Date.now() + 1,
      pacienteNombre: data.nombreCompleto,
      pacienteTelefono: data.telefono,
      pacienteEmail: data.email || "",
      pacienteDocumento: data.documentoIdentidad || "DNI/Doc",
      tratamientoId: trat.id,
      tratamientoNombre: trat.nombre,
      precioTratamiento: trat.precioBase,
      fechaCita: data.fechaCita,
      horaCita: data.horaCita,
      duracionMinutos: trat.duracionMinutos,
      estado: "PENDIENTE",
      motivoConsulta: data.motivoConsulta || trat.nombre,
      odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
      origenReserva: data.origenReserva || "WEB_MOVIL"
    };

    citas.push(nuevaCita);
    DemoDatabase.saveCitas(citas);
    return nuevaCita;
  },

  async getCitas(fecha) {
    try {
      let url = `${API_BASE}/citas`;
      if (fecha) url += `?fecha=${fecha}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }
    const all = DemoDatabase.getCitas();
    if (fecha) {
      const match = all.filter(c => c.fechaCita === fecha);
      if (match.length > 0) return match;
    }
    return all;
  },

  async cambiarEstadoCita(citaId, nuevoEstado) {
    try {
      const res = await fetch(`${API_BASE}/citas/${citaId}/estado?estado=${nuevoEstado}`, {
        method: 'PATCH'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }

    const citas = DemoDatabase.getCitas();
    const index = citas.findIndex(c => c.id == citaId);
    if (index !== -1) {
      citas[index].estado = nuevoEstado;
      DemoDatabase.saveCitas(citas);
      return citas[index];
    }
    throw new Error("Cita no encontrada");
  },

  async getKpis(mes) {
    try {
      let url = `${API_BASE}/kpis/mensual`;
      if (mes) url += `?mes=${mes}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }

    const citas = DemoDatabase.getCitas();
    const atendidas = citas.filter(c => c.estado === 'ATENDIDA');
    const totalRecaudado = atendidas.reduce((acc, c) => acc + (c.precioTratamiento || 0), 3850.00);

    return {
      periodoMes: "Noviembre 2026",
      ingresoMesActual: totalRecaudado,
      ingresoMesAnterior: 3120.00,
      porcentajeCrecimiento: 23.4,
      ticketPromedioPorCita: Math.round(totalRecaudado / Math.max(atendidas.length + 15, 1)),
      totalCitasRegistradas: citas.length + 28,
      totalCitasAtendidas: atendidas.length + 22,
      totalCitasPendientes: citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length,
      totalCitasCanceladas: 2,
      tasaAsistenciaPorcentaje: 91.7,
      topTratamientos: [
        { tratamiento: "Blanqueamiento Dental Láser Gold", cantidad: 9, recaudado: 3420.00 },
        { tratamiento: "Profilaxis con Ultrasonido", cantidad: 16, recaudado: 1920.00 },
        { tratamiento: "Restauración Estética con Resina 3M", cantidad: 8, recaudado: 1200.00 },
        { tratamiento: "Control y Ajuste de Ortodoncia", cantidad: 11, recaudado: 1100.00 }
      ],
      ingresosPorMetodoPago: {
        "YAPE_PLIN": 2450.00,
        "TARJETA": 2890.00,
        "EFECTIVO": 1600.00,
        "TRANSFERENCIA": 700.00
      }
    };
  },

  async getSeguimientos(pacienteId) {
    try {
      let url = `${API_BASE}/seguimientos/recientes`;
      if (pacienteId) url = `${API_BASE}/seguimientos/paciente/${pacienteId}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }
    const all = DemoDatabase.getSeguimientos();
    if (pacienteId) return all.filter(s => s.pacienteId == pacienteId);
    return all;
  },

  async guardarSeguimiento(data) {
    try {
      const res = await fetch(`${API_BASE}/seguimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }

    const segs = DemoDatabase.getSeguimientos();
    const nuevo = {
      id: Date.now(),
      citaId: data.citaId,
      pacienteId: data.pacienteId || Date.now() + 2,
      pacienteNombre: data.pacienteNombre,
      odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
      diagnostico: data.diagnostico,
      procedimientoRealizado: data.procedimientoRealizado,
      observaciones: data.observaciones,
      recetaIndicaciones: data.recetaIndicaciones || data.recadoIndicaciones || "",
      recadoIndicaciones: data.recadoIndicaciones || data.recetaIndicaciones || "",
      proximaCitaSugerida: data.proximaCitaSugerida,
      mesProximaCita: data.mesProximaCita || "Próximo Mes",
      montoPagoMes: parseFloat(data.montoPagoMes || 0),
      tratamiento: data.tratamiento || "Tratamiento Integral",
      fechaRegistro: new Date().toISOString()
    };
    segs.unshift(nuevo);
    DemoDatabase.saveSeguimientos(segs);

    // Actualizar cita a ATENDIDA si existe citaId
    if (data.citaId) {
      await this.cambiarEstadoCita(data.citaId, 'ATENDIDA');
    }
    return nuevo;
  },

  // GESTIÓN DE CLIENTES DE CONTROL MENSUAL (BRACKETS / ORTODONCIA)
  async getClientesBrackets() {
    return DemoDatabase.getClientesBrackets();
  },

  // REGISTRO DE USUARIOS NUEVOS DESDE WEB
  getUsuarios() {
    var u = localStorage.getItem('demo_usuarios');
    if (!u) {
      var iniciales = [
        {
          id: 1,
          nombreCompleto: "Paciente Demo 03",
          dni: "00000004",
          telefono: "+51 000 000 003",
          email: "paciente05@clinica.example",
          password: "demo-clave-1",
          fechaRegistro: "2026-08-15"
        },
        {
          id: 2,
          nombreCompleto: "Paciente Demo 06",
          dni: "00000008",
          telefono: "+51 000 000 002",
          email: "paciente17@clinica.example",
          password: "demo-clave-3",
          fechaRegistro: "2026-09-22"
        },
        {
          id: 3,
          nombreCompleto: "Paciente Demo 04",
          dni: "00000007",
          telefono: "+51 000 000 004",
          email: "paciente08@clinica.example",
          password: "demo-clave-2",
          fechaRegistro: "2026-07-05"
        }
      ];
      localStorage.setItem('demo_usuarios', JSON.stringify(iniciales));
      return iniciales;
    }
    return JSON.parse(u);
  },

  saveUsuarios(data) {
    localStorage.setItem('demo_usuarios', JSON.stringify(data));
  },

  async registrarUsuario(data) {
    var usuarios = this.getUsuarios();
    var emailLower = (data.email || '').trim().toLowerCase();
    var existe = usuarios.find(function(u) { return (u.email || '').toLowerCase() === emailLower; });
    if (existe) {
      existe.nombreCompleto = data.nombreCompleto || existe.nombreCompleto;
      existe.telefono = data.telefono || existe.telefono;
      existe.dni = data.dni || existe.dni;
      if (data.password) existe.password = data.password;
      this.saveUsuarios(usuarios);
      localStorage.setItem('sesion_paciente', JSON.stringify(existe));
      return existe;
    }

    var nuevo = {
      id: Date.now(),
      nombreCompleto: data.nombreCompleto,
      dni: data.dni,
      telefono: data.telefono,
      email: data.email,
      password: data.password || 'carino2026',
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    usuarios.unshift(nuevo);
    this.saveUsuarios(usuarios);
    localStorage.setItem('sesion_paciente', JSON.stringify(nuevo));
    return nuevo;
  },

  // DOSSIER CLÍNICO INTEGRAL DEL PACIENTE (PARA EL PORTAL DE 2 MÓDULOS)
  async getDatosPaciente(emailOrDni) {
    var busqueda = (emailOrDni || '').trim().toLowerCase();
    var brackets = DemoDatabase.getClientesBrackets();
    var seguimientos = DemoDatabase.getSeguimientos();
    var citas = DemoDatabase.getCitas();
    var usuarios = this.getUsuarios();

    // 1. Buscar en Clientes creados por Doctor/Admin (Brackets / Control Mensual)
    var cliBracket = brackets.find(function(c) {
      return (c.email && c.email.toLowerCase() === busqueda) || (c.dni && c.dni === busqueda);
    });

    // 2. Si no viene búsqueda o no se encuentra, usar Paciente Demo 03 por defecto
    if (!cliBracket && (!busqueda || busqueda === 'paciente05@clinica.example')) {
      cliBracket = brackets[0];
    }

    if (cliBracket) {
      var seg = seguimientos.find(function(s) {
        return (s.pacienteNombre && s.pacienteNombre.toLowerCase().indexOf(cliBracket.nombreCompleto.toLowerCase().split(' ')[0]) !== -1);
      });

      var citasPaciente = citas.filter(function(c) {
        return (c.pacienteEmail && c.pacienteEmail.toLowerCase() === cliBracket.email.toLowerCase()) ||
               (c.pacienteDocumento && c.pacienteDocumento === cliBracket.dni) ||
               (c.pacienteNombre && c.pacienteNombre.toLowerCase().indexOf(cliBracket.nombreCompleto.toLowerCase().split(' ')[0]) !== -1);
      });

      var todosControles = DemoDatabase.getControlesMensuales();
      var controlesPaciente = todosControles.filter(function(ct) {
        return (ct.pacienteEmail && ct.pacienteEmail.toLowerCase() === cliBracket.email.toLowerCase()) ||
               (ct.pacienteDni && ct.pacienteDni === cliBracket.dni) ||
               (ct.pacienteNombre && ct.pacienteNombre.toLowerCase().indexOf(cliBracket.nombreCompleto.toLowerCase().split(' ')[0]) !== -1);
      });

      var asistenciasCumplidas = controlesPaciente.filter(function(ct) {
        return ct.estadoControl === 'CONFIRMADO';
      });

      return {
        esCreadoPorDoctor: true,
        totalAsistidos: asistenciasCumplidas.length,
        totalProgramados: controlesPaciente.length,
        controlesMensuales: controlesPaciente,
        paciente: {
          id: cliBracket.id,
          nombreCompleto: cliBracket.nombreCompleto,
          dni: cliBracket.dni || "00000004",
          telefono: cliBracket.telefono,
          email: cliBracket.email,
          passwordVisible: cliBracket.passwordVisible || "demo-clave-1",
          diaControlMensual: cliBracket.diaControlMensual || 15,
          mesActual: cliBracket.mesActual || "Noviembre 2026",
          cuotaMensual: cliBracket.cuotaMensual || 120.00,
          estadoPago: cliBracket.estadoPago || "PAGADO",
          fechaRegistro: cliBracket.fechaRegistro || "2026-08-15"
        },
        tratamiento: {
          nombre: cliBracket.tratamiento || "Ortodoncia Metálica MBT (Brackets)",
          tipo: "Ortodoncia Fija de Alta Gama",
          doctor: "Dr. Kevin Jhon Lindo Alfaro",
          especialidad: "Especialista en Ortodoncia & Estética Dental",
          faseActual: "Fase 2: Alineación, Nivelación & Cierre de Diastemas",
          diagnostico: (seg && seg.diagnostico) ? seg.diagnostico : "Maloclusión dental en fase de alineación activa con evolución favorable.",
          procedimientosRealizados: (seg && seg.procedimientoRealizado) ? seg.procedimientoRealizado : "Ajuste de aparatología fija, recambio de ligaduras y activación de arco NiTi.",
          
          // DETALLE CRONOLÓGICO: "LO QUE TE HARÁN" (PASO A PASO)
          procedimientosFuturos: [
            {
              numeroSesion: "Sesión Actual (Control Mensual)",
              titulo: "Cambio de Arco y Reposición de Bracket",
              queTeHaran: "El Dr. Kevin Jhon Lindo Alfaro retirará el arco flexible NiTi .016 para colocar un arco de acero .018 de mayor calibre. Se reposicionará el bracket de la pieza 2.1 y se instalará cadeneta elástica continua para cerrar el espacio entre los dientes.",
              sensacionEsperada: "Sentirás una ligera presión de tracción durante las primeras 36 a 48 horas. Es una señal completamente normal de que los dientes se están moviendo.",
              cuidados: "Aplicar cera de alivio en el extremo del arco si sientes roce. Evitar morder alimentos duros directamente con los dientes frontales (cortar en trozos pequeños).",
              tiempoEstimado: "35 a 45 minutos"
            },
            {
              numeroSesion: "Próxima Sesión Programada",
              titulo: "Nivelación de Curva de Spee & Torque Anterior",
              queTeHaran: "Evaluación del anclaje en molares posteriores, verificación del cierre de espacios e instalación de arcos rectangulares para controlar la inclinación radicular de las piezas anteriores.",
              sensacionEsperada: "Ajuste firme en molares. Molestia mínima fácilmente tolerable.",
              cuidados: "Mantener uso estricto del enjuague bucal y cepillado interproximal meticuloso.",
              tiempoEstimado: "30 minutos"
            },
            {
              numeroSesion: "Fase Final de Asentamiento",
              titulo: "Intercuspidación con Elásticos & Retiro de Aparatología",
              queTeHaran: "Asentamiento oclusal final mediante elásticos intermaxilares para engranar tu mordida con precisión milimétrica, seguido de pulido profiláctico del esmalte y entrega de retenedores estéticos transparentes.",
              sensacionEsperada: "Sensación de máxima comodidad y ligereza al liberar las piezas dentales.",
              cuidados: "Uso continuo del retenedor nocturno para fijar la sonrisa de por vida.",
              tiempoEstimado: "50 minutos"
            }
          ],

          proximaCita: (seg && seg.proximaCitaSugerida) ? seg.proximaCitaSugerida : "2026-12-15",
          mesProximaCita: (seg && seg.mesProximaCita) ? seg.mesProximaCita : "Diciembre 2026",
          horaProximaCita: "10:30 AM",
          montoPagoMes: (cliBracket.cuotaMensual || (seg && seg.montoPagoMes)) ? (cliBracket.cuotaMensual || seg.montoPagoMes) : 120.00,
          estadoPago: cliBracket.estadoPago || "PAGADO",
          recadoDoctor: (seg && seg.recadoIndicaciones) ? seg.recadoIndicaciones : "Recado del Dr. Kevin Jhon Lindo Alfaro: 'Tu avance es excelente. Continúa utilizando la cera de ortodoncia en el bracket lateral si notas roce. No mastiques alimentos excesivamente duros como turrones o hielo antes del ajuste.'",
          odontograma: DemoDatabase.getOdontograma(cliBracket.id)
        },
        historialCitas: citasPaciente.length > 0 ? citasPaciente : [
          {
            fechaCita: "2026-11-15",
            horaCita: "10:30:00",
            tratamientoNombre: "Control Mensual de Brackets Metálicos",
            odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
            estado: "ATENDIDA"
          },
          {
            fechaCita: "2026-10-15",
            horaCita: "11:00:00",
            tratamientoNombre: "Control Mensual & Colocación de Brackets Inferiores",
            odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
            estado: "ATENDIDA"
          },
          {
            fechaCita: "2026-12-15",
            horaCita: "10:30:00",
            tratamientoNombre: "Próximo Control: Cambio de Arco y Reposición",
            odontologoNombre: "Dr. Kevin Jhon Lindo Alfaro",
            estado: "CONFIRMADA"
          }
        ]
      };
    }

    // 3. Si es usuario auto-registrado que aún no tiene tratamiento creado por el doctor
    var usu = usuarios.find(function(u) {
      return (u.email && u.email.toLowerCase() === busqueda) || (u.dni && u.dni === busqueda);
    });

    var nombreUsuario = usu ? usu.nombreCompleto : (busqueda.split('@')[0] || "Paciente Registrado");
    var emailUsuario = usu ? usu.email : busqueda;
    var dniUsuario = usu ? (usu.dni || "") : "";
    var telUsuario = usu ? (usu.telefono || "") : "";
    var passUsuario = usu ? (usu.password || "carino2026") : "carino2026";

    var citasUsu = citas.filter(function(c) {
      return (c.pacienteEmail && c.pacienteEmail.toLowerCase() === emailUsuario.toLowerCase()) ||
             (dniUsuario && c.pacienteDocumento === dniUsuario);
    });

    return {
      esCreadoPorDoctor: false,
      paciente: {
        id: usu ? usu.id : Date.now(),
        nombreCompleto: nombreUsuario,
        dni: dniUsuario,
        telefono: telUsuario,
        email: emailUsuario,
        passwordVisible: passUsuario,
        diaControlMensual: null,
        mesActual: "Noviembre 2026",
        cuotaMensual: 0,
        estadoPago: "SIN_CUOTA",
        fechaRegistro: usu ? usu.fechaRegistro : new Date().toISOString().split('T')[0]
      },
      tratamiento: {
        nombre: "Evaluación Odontológica Inicial",
        tipo: "Consulta Diagnóstica",
        doctor: "Dr. Kevin Jhon Lindo Alfaro",
        especialidad: "Especialista en Ortodoncia & Estética Dental",
        faseActual: "Pendiente de Diagnóstico Presencial",
        diagnostico: "Tu ficha clínica y plan de tratamiento se activarán una vez que asistas a tu cita presencial con el Dr. Kevin Jhon Lindo Alfaro.",
        procedimientosRealizados: "Apertura de expediente y reserva de cita inicial.",
        procedimientosFuturos: [
          {
            numeroSesion: "Paso 1: Consulta Inicial",
            titulo: "Evaluación Clínica & Escaneo Diagnóstico",
            queTeHaran: "El doctor realizará una revisión completa de tus piezas dentales, encías y mordida con cámara intraoral y radiografía digital para diseñar tu plan de tratamiento personalizado.",
            sensacionEsperada: "Procedimiento 100% indoloro y cómodo.",
            cuidados: "Venir 5 minutos antes de la hora pactada.",
            tiempoEstimado: "30 minutos"
          }
        ],
        proximaCita: (citasUsu.length > 0) ? citasUsu[0].fechaCita : new Date().toISOString().split('T')[0],
        mesProximaCita: "Noviembre 2026",
        horaProximaCita: (citasUsu.length > 0) ? citasUsu[0].horaCita.substring(0, 5) : "09:00 AM",
        montoPagoMes: (citasUsu.length > 0) ? citasUsu[0].precioTratamiento : 50.00,
        estadoPago: "PENDIENTE",
        recadoDoctor: "Recado del Dr. Kevin Jhon Lindo Alfaro: '¡Bienvenido/a a Carino Dental Studio! Te esperamos en nuestro consultorio para tu evaluación integral y diseño de sonrisa personalizada.'",
        odontograma: DemoDatabase.getOdontograma('general')
      },
      historialCitas: citasUsu
    };
  },

  async crearClienteBrackets(data) {
    const clientes = DemoDatabase.getClientesBrackets();
    const nuevo = {
      id: Date.now(),
      nombreCompleto: data.nombreCompleto,
      dni: data.dni || "",
      telefono: data.telefono,
      email: data.email,
      passwordVisible: data.password || "carino2026",
      tratamiento: data.tratamiento || "Ortodoncia Metálica (Brackets)",
      diaControlMensual: parseInt(data.diaControlMensual || 15),
      mesActual: data.mesActual || "Noviembre 2026",
      cuotaMensual: parseFloat(data.cuotaMensual || 120.00),
      estadoPago: data.estadoPago || "PENDIENTE",
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    clientes.unshift(nuevo);
    DemoDatabase.saveClientesBrackets(clientes);
    return nuevo;
  },

  async cambiarEstadoPagoBrackets(id) {
    const clientes = DemoDatabase.getClientesBrackets();
    const cli = clientes.find(c => c.id == id);
    if (cli) {
      cli.estadoPago = (cli.estadoPago === 'PAGADO') ? 'PENDIENTE' : 'PAGADO';
      DemoDatabase.saveClientesBrackets(clientes);
      return cli;
    }
    throw new Error("Cliente no encontrado");
  },

  async actualizarClienteBrackets(id, data) {
    const clientes = DemoDatabase.getClientesBrackets();
    const idx = clientes.findIndex(c => c.id == id);
    if (idx !== -1) {
      if (data.nombreCompleto) clientes[idx].nombreCompleto = data.nombreCompleto.trim();
      if (data.dni !== undefined) clientes[idx].dni = data.dni.trim();
      if (data.telefono !== undefined) clientes[idx].telefono = data.telefono.trim();
      if (data.email) clientes[idx].email = data.email.trim().toLowerCase();
      if (data.passwordVisible || data.password) clientes[idx].passwordVisible = (data.passwordVisible || data.password).trim();
      if (data.tratamiento) clientes[idx].tratamiento = data.tratamiento.trim();
      if (data.diaControlMensual) clientes[idx].diaControlMensual = parseInt(data.diaControlMensual);
      if (data.mesActual) clientes[idx].mesActual = data.mesActual.trim();
      if (data.cuotaMensual !== undefined) clientes[idx].cuotaMensual = parseFloat(data.cuotaMensual);
      if (data.estadoPago) clientes[idx].estadoPago = data.estadoPago;

      DemoDatabase.saveClientesBrackets(clientes);
      return clientes[idx];
    }
    throw new Error("Paciente de brackets no encontrado");
  },

  // GESTIÓN DE CONTROLES MENSUALES Y SEGUIMIENTO EN LISTA
  async getControlesSeguimiento() {
    var raw = DemoDatabase.getControlesMensuales();
    return raw.map(function(c) {
      var mesVal = c.mesControl || c.mes || 'Noviembre 2026';
      var cuotaVal = c.montoPago !== undefined ? c.montoPago : (c.cuota !== undefined ? c.cuota : 120.00);
      var estVal = c.estadoControl || c.estado || 'PENDIENTE';
      c.mes = mesVal;
      c.mesControl = mesVal;
      c.cuota = cuotaVal;
      c.montoPago = cuotaVal;
      c.estado = estVal;
      c.estadoControl = estVal;
      return c;
    });
  },

  async marcarControlConfirmado(id) {
    var ctrls = DemoDatabase.getControlesMensuales();
    var item = ctrls.find(function(c) { return c.id == id; });
    if (item) {
      item.estadoControl = 'CONFIRMADO';
      item.estado = 'CONFIRMADO';
      item.estadoPago = 'PAGADO';
      item.fechaConfirmado = new Date().toISOString().split('T')[0];
      DemoDatabase.saveControlesMensuales(ctrls);

      // Sincronizar también con la cita y cliente si existe
      try {
        var brackets = DemoDatabase.getClientesBrackets();
        var bCli = brackets.find(function(b) { return b.nombreCompleto === item.pacienteNombre; });
        if (bCli) {
          bCli.estadoPago = 'PAGADO';
          DemoDatabase.saveClientesBrackets(brackets);
        }
      } catch (e) {
        console.error(e);
      }

      // Notificación inmediata
      await this.crearNotificacion({
        titulo: "¡Control Confirmado & Cumplido!",
        mensaje: "El paciente " + item.pacienteNombre + " asistió a su control del mes " + (item.mesControl || item.mes) + ". Cuota S/ " + parseFloat(item.montoPago || item.cuota).toFixed(2) + " confirmada.",
        pacienteNombre: item.pacienteNombre,
        pacienteDni: item.pacienteDni,
        fechaCita: item.fechaCita
      });

      return item;
    }
    throw new Error("Control no encontrado");
  },

  async crearControlMensual(data) {
    var ctrls = DemoDatabase.getControlesMensuales();
    var nuevo = {
      id: Date.now(),
      pacienteId: data.pacienteId || Date.now(),
      pacienteNombre: data.pacienteNombre,
      pacienteDni: data.pacienteDni || "00000004",
      pacienteEmail: data.pacienteEmail || "",
      tratamiento: data.tratamiento || "Ortodoncia Metálica (Brackets)",
      numeroControl: (ctrls.filter(function(c) { return c.pacienteNombre === data.pacienteNombre; }).length + 1),
      mesControl: data.mesControl || "Próximo Mes",
      fechaCita: data.fechaCita || new Date().toISOString().split('T')[0],
      montoPago: parseFloat(data.montoPago || 120.00),
      estadoPago: data.estadoPago || "PENDIENTE",
      estadoControl: data.estadoControl || "PENDIENTE",
      procedimiento: data.procedimiento || "Control periódico de aparatología.",
      recado: data.recado || "Mantener hábitos de higiene y cuidados.",
      doctor: "Dr. Kevin Jhon Lindo Alfaro"
    };
    ctrls.push(nuevo);
    DemoDatabase.saveControlesMensuales(ctrls);
    return nuevo;
  },

  // ODONTOGRAMA
  async getOdontograma(pacienteId) {
    return DemoDatabase.getOdontograma(pacienteId);
  },

  async guardarOdontograma(pacienteId, data) {
    DemoDatabase.saveOdontograma(pacienteId, data);
    return data;
  },

  // REPORTES: TOP CLIENTES FRECUENTES CON VISITAS (PARA GRÁFICO CIRCULAR)
  async getTopClientesFrecuentes() {
    return [
      {
        nombre: "Paciente Demo 05",
        visitas: 6,
        porcentaje: 38,
        color: "#0E6A60",
        colorHover: "#084D47",
        tratamiento: "Profilaxis, Control Preventivo & Resinas",
        totalPagado: 540.00,
        estado: "Cliente Más Frecuente (VIP)",
        badge: "🥇 1° Lugar en Frecuencia"
      },
      {
        nombre: "Paciente Demo 03",
        visitas: 4,
        porcentaje: 28,
        color: "#4779A9",
        colorHover: "#35618A",
        tratamiento: "Control Mensual de Brackets Metálicos",
        totalPagado: 480.00,
        estado: "Control Recurrente",
        badge: "🥈 2° Lugar en Frecuencia"
      },
      {
        nombre: "Paciente Demo 02",
        visitas: 3,
        porcentaje: 20,
        color: "#37856F",
        colorHover: "#256955",
        tratamiento: "Restauraciones Estéticas 3M",
        totalPagado: 450.00,
        estado: "Tratamiento Activo",
        badge: "🥉 3° Lugar en Frecuencia"
      },
      {
        nombre: "Paciente Demo 04 y otros",
        visitas: 2,
        porcentaje: 14,
        color: "#72578D",
        colorHover: "#5C4379",
        tratamiento: "Blanqueamiento Dental & Evaluaciones",
        totalPagado: 430.00,
        estado: "Pacientes Nuevos",
        badge: "4° Segmento"
      }
    ];
  },

  async getNotificaciones() {
    try {
      const res = await fetch(`${API_BASE}/notificaciones`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }
    return DemoDatabase.getNotificaciones();
  },

  async crearNotificacion(data) {
    try {
      const res = await fetch(`${API_BASE}/notificaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }

    const notifs = DemoDatabase.getNotificaciones();
    const nueva = {
      id: Date.now(),
      titulo: data.titulo || "¡Nueva Cita Registrada!",
      mensaje: data.mensaje || `El paciente ${data.pacienteNombre} agendó cita a las ${data.horaRegistroStr}.`,
      pacienteNombre: data.pacienteNombre,
      pacienteDni: data.pacienteDni || "-",
      pacienteTelefono: data.pacienteTelefono,
      fechaCita: data.fechaCita,
      horaCita: data.horaCita,
      horaRegistroStr: data.horaRegistroStr || new Date().toLocaleTimeString(),
      fechaHoraRegistro: new Date().toISOString(),
      leidoDoctor: false,
      leidoAsistente: false
    };
    notifs.unshift(nueva);
    DemoDatabase.saveNotificaciones(notifs);

    // Disparar evento en la ventana para actualización reactiva instantánea
    window.dispatchEvent(new CustomEvent('nueva-notificacion-cita', { detail: nueva }));
    return nueva;
  },

  async marcarNotificacionLeida(id, rol) {
    try {
      const res = await fetch(`${API_BASE}/notificaciones/${id}/marcar-leida?rol=${rol}`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch (e) {
      // Mock fallback
    }

    const notifs = DemoDatabase.getNotificaciones();
    const n = notifs.find(item => item.id == id);
    if (n) {
      if (rol === 'ODONTOLOGO') n.leidoDoctor = true;
      else n.leidoAsistente = true;
      DemoDatabase.saveNotificaciones(notifs);
    }
    return { ok: true };
  },

  // NOTIFICACIONES PARA EL PACIENTE
  async getNotificacionesPaciente(emailOrDni) {
    return DemoDatabase.getNotificacionesPaciente(emailOrDni);
  },

  async crearNotificacionPaciente(emailOrDni, data) {
    var notifs = DemoDatabase.getNotificacionesPaciente(emailOrDni);
    var nueva = {
      id: Date.now(),
      titulo: data.titulo || "Aviso Clínico",
      mensaje: data.mensaje || "",
      tipo: data.tipo || "GENERAL",
      horaRegistroStr: data.horaRegistroStr || new Date().toLocaleTimeString(),
      leido: false
    };
    notifs.unshift(nueva);
    DemoDatabase.saveNotificacionesPaciente(emailOrDni, notifs);
    window.dispatchEvent(new CustomEvent('nueva-notificacion-paciente', { detail: nueva }));
    return nueva;
  },

  async marcarNotificacionesPacienteLeidas(emailOrDni) {
    var notifs = DemoDatabase.getNotificacionesPaciente(emailOrDni);
    for (var i = 0; i < notifs.length; i++) {
      notifs[i].leido = true;
    }
    DemoDatabase.saveNotificacionesPaciente(emailOrDni, notifs);
    return { ok: true };
  },

  // COMUNICACIÓN & CHAT EN VIVO CON EL CLIENTE (BLANCO Y NEGRO)
  async getChatMensajes() {
    return DemoDatabase.getChatMensajes();
  },

  async enviarMensajeChat(data) {
    var msgs = DemoDatabase.getChatMensajes();
    var ahora = new Date();
    var horaStr = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    var nuevo = {
      id: Date.now(),
      clienteId: data.clienteId || 'cli_' + Math.floor(1000 + Math.random() * 9000),
      clienteNombre: data.clienteNombre || 'Visitante Web',
      clienteTelefono: data.clienteTelefono || '',
      remitente: data.remitente || 'CLIENTE',
      remitenteNombre: data.remitenteNombre || (data.remitente === 'ADMIN' ? 'Dr. Kevin Jhon Lindo Alfaro' : (data.clienteNombre || 'Cliente')),
      texto: data.texto,
      fechaHora: ahora.toISOString(),
      horaStr: horaStr,
      leidoPorAdmin: data.remitente === 'ADMIN',
      leidoPorCliente: data.remitente === 'CLIENTE'
    };

    msgs.push(nuevo);
    DemoDatabase.saveChatMensajes(msgs);

    // Si escribe el cliente, generar aviso al Administrador
    if (nuevo.remitente === 'CLIENTE') {
      await this.crearNotificacion({
        titulo: '💬 Consulta de ' + nuevo.clienteNombre,
        mensaje: '"' + nuevo.texto + '"' + (nuevo.clienteTelefono ? ' • Cel: ' + nuevo.clienteTelefono : ''),
        pacienteNombre: nuevo.clienteNombre,
        horaRegistroStr: horaStr
      });
    }

    // Disparar evento para actualización instantánea en vivo
    window.dispatchEvent(new CustomEvent('nuevo-mensaje-chat', { detail: nuevo }));
    return nuevo;
  }
};

window.ClinicaAPI = ClinicaAPI;
