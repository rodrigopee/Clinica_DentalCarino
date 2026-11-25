/**
 * CARINO DENTAL STUDIO - PORTAL DEL PACIENTE
 * Lógica interactiva para los 2 módulos:
 * 1. Mi Tratamiento & Lo Que Te Harán (procedimientos futuros, próxima cita, mes, cuota y odontograma)
 * 2. Mi Perfil (datos personales, credenciales/contraseña e historial de citas)
 */

var currentPacienteEmail = null;
var currentDossier = null;
var selectedHoraPaciente = null;

// Conmutador global de módulos del paciente
window.switchModulePaciente = function(targetId) {
  var contents = document.querySelectorAll('.tab-paciente-content');
  for (var i = 0; i < contents.length; i++) {
    contents[i].classList.add('hidden');
  }

  var targetElem = document.getElementById(targetId);
  if (targetElem) {
    targetElem.classList.remove('hidden');
  }

  var navItems = document.querySelectorAll('.nav-item-paciente');
  for (var j = 0; j < navItems.length; j++) {
    var btn = navItems[j];
    if (btn.getAttribute('data-target') === targetId) {
      btn.classList.add('nav-item-active');
    } else {
      btn.classList.remove('nav-item-active');
    }
  }

  var headerTitulo = document.getElementById('headerTituloModulo');
  if (headerTitulo) {
    if (targetId === 'modulo-tratamiento') {
      headerTitulo.innerHTML = '<span>🦷</span> Módulo 1: Mi Tratamiento';
    } else if (targetId === 'modulo-controles') {
      headerTitulo.innerHTML = '<span>📋</span> Módulo 2: Seguimiento de Controles';
    } else if (targetId === 'modulo-perfil') {
      headerTitulo.innerHTML = '<span>👤</span> Módulo 3: Mi Perfil & Credenciales';
    }
  }

  // Cerrar drawer en pantallas pequeñas
  var sidebar = document.getElementById('sidebarPaciente');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  // 1. Obtener correo del paciente desde URL (?email=...) o localStorage
  var urlParams = new URLSearchParams(window.location.search);
  var emailParam = urlParams.get('email');

  if (emailParam) {
    currentPacienteEmail = emailParam.trim().toLowerCase();
  } else {
    var sesion = localStorage.getItem('sesion_paciente');
    if (sesion) {
      try {
        var obj = JSON.parse(sesion);
        if (obj && obj.email) currentPacienteEmail = obj.email.trim().toLowerCase();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Paciente por defecto si no se especificó: Paciente Demo 03 (Brackets)
  if (!currentPacienteEmail) {
    currentPacienteEmail = 'paciente05@clinica.example';
  }

  // 2. Control del Drawer Móvil
  var btnAbrirSidebar = document.getElementById('btnAbrirSidebarMobile');
  var btnCerrarSidebar = document.getElementById('btnCerrarSidebarMobile');
  var sidebar = document.getElementById('sidebarPaciente');

  if (btnAbrirSidebar && sidebar) {
    btnAbrirSidebar.addEventListener('click', function() {
      sidebar.classList.remove('-translate-x-full');
    });
  }
  if (btnCerrarSidebar && sidebar) {
    btnCerrarSidebar.addEventListener('click', function() {
      sidebar.classList.add('-translate-x-full');
    });
  }

  // 3. Control de Cerrar Sesión
  var btnsCerrar = [document.getElementById('btnCerrarSesionPaciente'), document.getElementById('btnCerrarSesionPerfil')];
  btnsCerrar.forEach(function(b) {
    if (b) {
      b.addEventListener('click', function() {
        localStorage.removeItem('sesion_paciente');
        window.location.href = 'index.html';
      });
    }
  });

  // 4. Cargar datos del paciente y renderizar
  await cargarDossierPaciente();

  // 5. Inicializar eventos de perfil y contraseña
  initPerfilEvents();

  // 6. Inicializar modal de agendar cita extra
  initModalCitaExtra();

  // 7. Inicializar notificaciones del paciente en la barra superior
  initNotificacionesPaciente();
  await reloadNotificacionesPaciente();
});

// Carga completa del dossier clínico
async function cargarDossierPaciente() {
  try {
    currentDossier = await ClinicaAPI.getDatosPaciente(currentPacienteEmail);
    if (!currentDossier) return;

    var pac = currentDossier.paciente;
    var trat = currentDossier.tratamiento;

    // A. Actualizar Sidebar
    var nombreSidebar = document.getElementById('pacienteNombreSidebar');
    var emailSidebar = document.getElementById('pacienteEmailSidebar');
    var avatarInitials = document.getElementById('pacienteAvatarInitials');
    var badgeTipo = document.getElementById('pacienteTipoBadge');
    var headerNombre = document.getElementById('headerPacienteNombre');

    if (nombreSidebar) nombreSidebar.textContent = pac.nombreCompleto;
    if (emailSidebar) emailSidebar.textContent = pac.email;
    if (headerNombre) headerNombre.textContent = pac.nombreCompleto;

    if (avatarInitials) {
      var partes = (pac.nombreCompleto || 'P').split(' ');
      var inits = partes[0].charAt(0).toUpperCase();
      if (partes.length > 1) inits += partes[1].charAt(0).toUpperCase();
      avatarInitials.textContent = inits;
    }

    if (badgeTipo) {
      badgeTipo.textContent = currentDossier.esCreadoPorDoctor ? "CONTROL MENSUAL" : "PACIENTE WEB";
    }

    // B. Módulo 1: Mi Tratamiento
    var tituloTrat = document.getElementById('tratamientoNombrePrincipal');
    var faseTrat = document.getElementById('tratamientoFasePrincipal');
    if (tituloTrat) tituloTrat.textContent = trat.nombre;
    if (faseTrat) faseTrat.textContent = trat.faseActual || trat.diagnostico;

    // Próxima Cita & Mes
    var proximaFechaGrande = document.getElementById('proximaCitaFechaGrande');
    var mesTexto = document.getElementById('mesTexto');
    var horaTexto = document.getElementById('horaTexto');
    var diaControlTexto = document.getElementById('diaControlFijoTexto');

    if (proximaFechaGrande) {
      proximaFechaGrande.textContent = formatearFechaLegible(trat.proximaCita);
    }
    if (mesTexto) mesTexto.textContent = trat.mesProximaCita || "Diciembre 2026";
    if (horaTexto) horaTexto.textContent = trat.horaProximaCita || "10:30 AM";
    if (diaControlTexto) {
      diaControlTexto.textContent = pac.diaControlMensual ? "Día " + pac.diaControlMensual + " de cada mes" : "Según agenda programada";
    }

    // Pago de ese Mes
    var cuotaMontoGrande = document.getElementById('cuotaMontoGrande');
    var mesCuotaTexto = document.getElementById('mesCuotaTexto');
    var badgeEstadoPago = document.getElementById('badgeEstadoPago');

    var monto = typeof trat.montoPagoMes === 'number' ? trat.montoPagoMes : parseFloat(trat.montoPagoMes || 120);

    if (cuotaMontoGrande) {
      cuotaMontoGrande.textContent = "S/ " + monto.toFixed(2);
    }
    if (mesCuotaTexto) {
      mesCuotaTexto.textContent = trat.mesProximaCita || pac.mesActual || "Mes Actual";
    }
    if (badgeEstadoPago) {
      if (trat.estadoPago === 'PAGADO') {
        badgeEstadoPago.className = "text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#0C6059] border border-emerald-500/40";
        badgeEstadoPago.textContent = "✓ PAGADO";
      } else {
        badgeEstadoPago.className = "text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#79450B] border border-amber-500/40";
        badgeEstadoPago.textContent = "⏳ PENDIENTE DE PAGO";
      }
    }

    // Recado del Doctor
    var recadoElem = document.getElementById('recadoDoctorTexto');
    if (recadoElem && trat.recadoDoctor) {
      recadoElem.textContent = trat.recadoDoctor;
    }

    // Odontograma Simplificado
    renderizarOdontogramaPaciente(trat.odontograma);

    // C. Módulo 2: Mi Perfil
    renderizarDatosPerfil(pac);
    renderizarHistorialCitas(currentDossier.historialCitas);

    // D. Historial de Controles Mensuales de Brackets y Asistencias
    renderizarTablaHistorialControlesPaciente(
      currentDossier.controlesMensuales,
      currentDossier.totalAsistidos,
      currentDossier.totalProgramados
    );

  } catch (err) {
    console.error("Error al cargar dossier del paciente:", err);
  }
}

// Renderizar tabla de historial de controles mensuales del paciente
function renderizarTablaHistorialControlesPaciente(controles, totalAsistidos, totalProgramados) {
  var tbody = document.getElementById('tablaHistorialControlesPacienteBody');
  var contAsist = document.getElementById('contadorAsistidosGrande');
  var contProg = document.getElementById('contadorProgramadosGrande');
  var pctAvance = document.getElementById('porcentajeAvanceGrande');
  var totInv = document.getElementById('totalInvertidoGrande');
  var sesTexto = document.getElementById('sesionesAsistidasTexto');

  var asistidos = (typeof totalAsistidos === 'number') ? totalAsistidos : 4;
  var total = (typeof totalProgramados === 'number' && totalProgramados > 0) ? totalProgramados : 6;
  var pendientes = Math.max(0, total - asistidos);
  var pct = Math.round((asistidos / total) * 100);

  if (contAsist) contAsist.textContent = asistidos + (asistidos === 1 ? " Asistencia" : " Asistencias");
  if (contProg) contProg.textContent = pendientes + (pendientes === 1 ? " Control" : " Controles");
  if (pctAvance) pctAvance.textContent = pct + "%";
  if (totInv) totInv.textContent = "S/ " + (asistidos * 120).toFixed(2);
  if (sesTexto) sesTexto.textContent = asistidos + " controles mensuales cumplidos";

  var contAsistMini = document.getElementById('contadorAsistidosMini');
  var contProgMini = document.getElementById('contadorProgramadosMini');
  var pctAvanceMini = document.getElementById('porcentajeAvanceMini');
  if (contAsistMini) contAsistMini.textContent = asistidos + (asistidos === 1 ? " Cita" : " Citas");
  if (contProgMini) contProgMini.textContent = pendientes + (pendientes === 1 ? " Cita" : " Citas");
  if (pctAvanceMini) pctAvanceMini.textContent = pct + "% de avance";

  if (!tbody) return;
  tbody.innerHTML = '';

  if (!controles || controles.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-neutral-600">No hay controles registrados.</td></tr>';
    return;
  }

  for (var i = 0; i < controles.length; i++) {
    var c = controles[i];
    var tr = document.createElement('tr');
    tr.className = "hover:bg-neutral-100/40 transition";

    var badgeEstado = (c.estadoControl === 'CONFIRMADO')
      ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#0C6059] border border-emerald-500/40">✓ ASISTIDO</span>'
      : '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#79450B] border border-amber-500/40">⏳ PROGRAMADO</span>';

    tr.innerHTML = 
      '<td class="py-2.5 px-3 text-center font-bold font-mono text-[#0C6059]">Control #' + (c.numeroControl || (i + 1)) + '</td>' +
      '<td class="py-2.5 px-3 font-semibold text-neutral-900">' + (c.mesControl || '-') + '</td>' +
      '<td class="py-2.5 px-3 text-neutral-700">' + formatearFechaLegible(c.fechaCita) + '</td>' +
      '<td class="py-2.5 px-3 text-neutral-700 max-w-xs truncate" title="' + (c.procedimiento || '') + '">' + (c.procedimiento || 'Control periódico de aparatología') + '</td>' +
      '<td class="py-2.5 px-3 font-bold text-neutral-900">S/ ' + parseFloat(c.montoPago || 120).toFixed(2) + '</td>' +
      '<td class="py-2.5 px-3 text-center">' + badgeEstado + '</td>';

    tbody.appendChild(tr);
  }
}

// GENERAR Y DESCARGAR PDF OFICIAL DEL HISTORIAL DEL PACIENTE
window.exportarHistorialPDFPaciente = function() {
  if (!currentDossier || !currentDossier.paciente) {
    alert("Cargando datos del paciente, intente en unos segundos...");
    return;
  }

  var pac = currentDossier.paciente;
  var trat = currentDossier.tratamiento;
  var controles = currentDossier.controlesMensuales || [];
  var asistidos = currentDossier.totalAsistidos || 4;
  var total = currentDossier.totalProgramados || 6;
  var hoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

  var rowsHtml = '';
  for (var i = 0; i < controles.length; i++) {
    var c = controles[i];
    var estadoTexto = (c.estadoControl === 'CONFIRMADO') ? '✓ ASISTIDO / CUMPLIDO' : '⏳ PROGRAMADO';
    var colorTexto = (c.estadoControl === 'CONFIRMADO') ? '#0E6A60' : '#79450B';

    rowsHtml += 
      '<tr>' +
        '<td style="text-align:center; font-weight:bold; padding:8px; border:1px solid #DDD;">#' + (c.numeroControl || (i + 1)) + '</td>' +
        '<td style="padding:8px; border:1px solid #DDD; font-weight:bold;">' + (c.mesControl || '-') + '</td>' +
        '<td style="padding:8px; border:1px solid #DDD;">' + formatearFechaLegible(c.fechaCita) + '</td>' +
        '<td style="padding:8px; border:1px solid #DDD;">' + (c.procedimiento || 'Control periódico y ajuste de arcos') + '</td>' +
        '<td style="text-align:right; font-weight:bold; padding:8px; border:1px solid #DDD;">S/ ' + parseFloat(c.montoPago || 120).toFixed(2) + '</td>' +
        '<td style="text-align:center; font-weight:bold; color:' + colorTexto + '; padding:8px; border:1px solid #DDD;">' + estadoTexto + '</td>' +
      '</tr>';
  }

  var printContent = '\
    <!DOCTYPE html>\
    <html>\
    <head>\
      <meta charset="utf-8">\
      <title>Historial de Controles - ' + pac.nombreCompleto + ' - Carino Dental Studio</title>\
      <style>\
        @page { size: A4 portrait; margin: 12mm 15mm; }\
        body { font-family: "Helvetica Neue", Arial, sans-serif; color: #262626; margin: 0; padding: 15px; font-size: 10.5pt; line-height: 1.4; }\
        .header { border-bottom: 2.5px solid #0C6059; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }\
        .logo-text { font-size: 20pt; font-weight: 900; letter-spacing: 1px; color: #171717; }\
        .logo-text span { color: #0C6059; }\
        .clinic-info { text-align: right; font-size: 8.5pt; color: #525252; }\
        .doc-title { text-align: center; margin: 15px 0 18px 0; font-size: 14pt; font-weight: bold; color: #171717; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E5E5E5; padding-bottom: 8px; }\
        .patient-box { background-color: #FAFAFA; border: 1.5px solid #E5E5E5; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9.5pt; }\
        .kpi-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; text-align: center; }\
        .kpi-card { background-color: #F4F4F4; border: 1px solid #E5E5E5; border-radius: 6px; padding: 8px; }\
        .kpi-card strong { display: block; font-size: 12pt; color: #171717; margin-top: 2px; }\
        .kpi-card span { font-size: 8pt; color: #595959; text-transform: uppercase; font-weight: bold; }\
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }\
        th { background-color: #171717; color: #FFFFFF; padding: 8px; text-align: left; border: 1px solid #111; font-weight: bold; font-size: 8.5pt; text-transform: uppercase; }\
        td { vertical-align: middle; }\
        .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid; }\
        .seal-box { border: 1.5px dashed #0C6059; padding: 10px 14px; border-radius: 6px; font-size: 8.5pt; color: #525252; max-width: 280px; }\
        .signature-line { text-align: center; width: 230px; border-top: 1.5px solid #333; padding-top: 6px; font-size: 8.5pt; color: #111; }\
        @media print {\
          body { padding: 0; }\
          button { display: none; }\
        }\
      </style>\
    </head>\
    <body>\
      <div class="header">\
        <div>\
          <div class="logo-text">CARINO <span>DENTAL</span> STUDIO</div>\
          <div style="font-size: 9pt; color: #595959; font-weight: bold; letter-spacing: 2px;">ODONTOLOGÍA INTEGRAL & ORTODONCIA DE ALTA GAMA</div>\
        </div>\
        <div class="clinic-info">\
          <strong>Sede Principal:</strong> Jr. Asamblea 245, Ayacucho<br>\
          <strong>Atención:</strong> +51 000 000 007 &bull; (066) 314-890<br>\
          <strong>RUC:</strong> 20608945231 &bull; <strong>Fecha:</strong> ' + hoy + '\
        </div>\
      </div>\
\
      <div class="doc-title">\
        CONSTANCIA OFICIAL DE ASISTENCIA Y CONTROLES DE ORTODONCIA\
      </div>\
\
      <div class="patient-box">\
        <div><strong>Paciente:</strong> ' + pac.nombreCompleto + '</div>\
        <div><strong>Documento (DNI):</strong> ' + pac.dni + '</div>\
        <div><strong>Tratamiento Activo:</strong> ' + trat.nombre + '</div>\
        <div><strong>Especialista Tratante:</strong> Dr. Kevin Jhon Lindo Alfaro (COP 34892)</div>\
        <div><strong>Día Fijo de Control:</strong> Día ' + (pac.diaControlMensual || 15) + ' de cada mes</div>\
        <div><strong>Estado del Plan:</strong> En Curso (Fase de Alineación y Cierre)</div>\
      </div>\
\
      <div class="kpi-box">\
        <div class="kpi-card">\
          <span>Controles Asistidos</span>\
          <strong style="color:#0E6A60;">' + asistidos + ' Sesiones</strong>\
        </div>\
        <div class="kpi-card">\
          <span>Próximos Controles</span>\
          <strong style="color:#79450B;">' + Math.max(0, total - asistidos) + ' Meses</strong>\
        </div>\
        <div class="kpi-card">\
          <span>Progreso Total</span>\
          <strong style="color:#35618A;">' + Math.round((asistidos / total) * 100) + '%</strong>\
        </div>\
        <div class="kpi-card">\
          <span>Total Abonado</span>\
          <strong style="color:#171717;">S/ ' + (asistidos * 120).toFixed(2) + '</strong>\
        </div>\
      </div>\
\
      <div style="font-size: 10pt; font-weight: bold; margin-bottom: 6px; color:#171717;">\
        DETALLE DE CONTROLES MENSUALES ASISTIDOS Y PROGRAMADOS:\
      </div>\
\
      <table>\
        <thead>\
          <tr>\
            <th style="width: 10%; text-align:center;">Control</th>\
            <th style="width: 18%;">Mes</th>\
            <th style="width: 18%;">Fecha</th>\
            <th style="width: 32%;">Procedimiento Realizado</th>\
            <th style="width: 10%; text-align:right;">Cuota</th>\
            <th style="width: 12%; text-align:center;">Estado</th>\
          </tr>\
        </thead>\
        <tbody>\
          ' + rowsHtml + '\
        </tbody>\
      </table>\
\
      <div class="signature-section">\
        <div class="seal-box">\
          <strong>Carino Dental Studio - Verificación Oficial</strong><br>\
          Constancia médica emitida para control y seguimiento de ortodoncia del paciente.\
        </div>\
        <div class="signature-line">\
          <strong>Dr. Kevin Jhon Lindo Alfaro</strong><br>\
          Cirujano Dentista - Especialista en Ortodoncia<br>\
          C.O.P. 34892 &bull; R.N.E. 12904\
        </div>\
      </div>\
    </body>\
    </html>\
  ';

  var printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(function() {
      printWindow.focus();
      printWindow.print();
    }, 400);
  } else {
    alert("Por favor permite las ventanas emergentes en tu navegador para generar e imprimir tu PDF.");
  }
};

// Renderizar el paso a paso clínico: "Lo Que Te Harán"
function renderizarProcedimientosFuturos(procedimientos) {
  var contenedor = document.getElementById('contenedorProcedimientosFuturos');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  if (!procedimientos || procedimientos.length === 0) {
    contenedor.innerHTML = '<p class="text-xs text-neutral-600 py-3 text-center">No hay procedimientos programados aún.</p>';
    return;
  }

  procedimientos.forEach(function(p, idx) {
    var pasoCard = document.createElement('div');
    pasoCard.className = "p-4 sm:p-5 rounded-xl bg-[#FFFFFF] border border-neutral-200 hover:border-[#0C6059]/40 transition space-y-3";

    var badgeColor = idx === 0 ? "bg-emerald-500/20 text-[#0C6059] border-emerald-500/40" : "bg-neutral-100 text-neutral-700 border-neutral-300";

    pasoCard.innerHTML = 
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-neutral-200/60">' +
        '<div class="flex items-center gap-2">' +
          '<span class="w-6 h-6 rounded-full bg-[#F4F9F8] border border-[#0C6059]/50 text-[#0C6059] font-bold text-xs flex items-center justify-center shrink-0">' +
            (idx + 1) +
          '</span>' +
          '<h4 class="text-sm sm:text-base font-bold text-neutral-900">' + p.titulo + '</h4>' +
        '</div>' +
        '<div class="flex items-center gap-2 text-[10px]">' +
          '<span class="px-2 py-0.5 rounded-full border ' + badgeColor + ' font-semibold">' + p.numeroSesion + '</span>' +
          '<span class="text-neutral-600">⏱️ ' + (p.tiempoEstimado || "30 min") + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">' +
        '<div class="md:col-span-1 bg-[#EDF6F4] p-3 rounded-lg border border-neutral-200/80">' +
          '<strong class="text-[#0C6059] block mb-1 flex items-center gap-1"><span>🔍</span> ¿Qué te harán?</strong>' +
          '<p class="text-neutral-700 leading-relaxed text-[11px]">' + p.queTeHaran + '</p>' +
        '</div>' +
        '<div class="md:col-span-1 bg-[#EDF6F4] p-3 rounded-lg border border-neutral-200/80">' +
          '<strong class="text-[#274E74] block mb-1 flex items-center gap-1"><span>🧠</span> ¿Qué sentirás?</strong>' +
          '<p class="text-neutral-700 leading-relaxed text-[11px]">' + (p.sensacionEsperada || "Molestia leve y pasajera.") + '</p>' +
        '</div>' +
        '<div class="md:col-span-1 bg-[#EDF6F4] p-3 rounded-lg border border-neutral-200/80">' +
          '<strong class="text-[#79450B] block mb-1 flex items-center gap-1"><span>⚠️</span> Cuidados a tener:</strong>' +
          '<p class="text-neutral-700 leading-relaxed text-[11px]">' + (p.cuidados || "Buena higiene y cepillado suave.") + '</p>' +
        '</div>' +
      '</div>';

    contenedor.appendChild(pasoCard);
  });
}

// Renderizar Odontograma con piezas interactivas
function renderizarOdontogramaPaciente(mapaOdontograma) {
  var sup = document.getElementById('odontogramaArcadaSuperior');
  var inf = document.getElementById('odontogramaArcadaInferior');
  if (!sup || !inf) return;

  sup.innerHTML = '';
  inf.innerHTML = '';

  var piezasSup = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  var piezasInf = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  var estadosPieza = {
    SANO: { nombre: 'Sano', estilo: 'bg-[#F4F9F8] border-[#0C6059]/30 text-[#0C6059] hover:bg-[#DCEFEA]' },
    BRACKETS: { nombre: 'Brackets', estilo: 'bg-[#F5F0FA] border-[#72578D]/60 text-[#5C4379] hover:bg-[#EDE4F7]' },
    CARIES: { nombre: 'Caries', estilo: 'bg-[#B33434]/10 border-red-500/60 text-[#9B2626] hover:bg-[#B33434]/20' },
    RESTAURADO: { nombre: 'Restaurado', estilo: 'bg-[#35618A]/10 border-[#35618A]/60 text-[#274E74] hover:bg-[#35618A]/20' },
    ENDODONCIA: { nombre: 'Endodoncia', estilo: 'bg-[#A56519]/10 border-[#A56519]/60 text-[#79450B] hover:bg-[#A56519]/20' },
    AUSENTE: { nombre: 'Ausente', estilo: 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100' }
  };

  function crearBotonDiente(numero) {
    var info = (mapaOdontograma && mapaOdontograma[numero]) ? mapaOdontograma[numero] : { estado: 'SANO', detalle: 'Pieza sana' };
    var estado = info.estado || 'SANO';
    var visual = Object.prototype.hasOwnProperty.call(estadosPieza, estado) ? estadosPieza[estado] : null;
    var nombreEstado = visual ? visual.nombre : estado;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-1.5 text-center transition hover:border-[#0E6A60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6059] ' + (visual ? visual.estilo : estadosPieza.SANO.estilo);
    btn.setAttribute('aria-label', 'Pieza ' + numero + ': ' + nombreEstado);

    var etiquetaNumero = document.createElement('span');
    etiquetaNumero.className = 'font-mono text-xs font-bold text-neutral-800';
    etiquetaNumero.textContent = numero;

    var diente = document.createElement('span');
    diente.className = 'odontogram-tooth';
    if (visual) diente.classList.add(estado.toLowerCase());
    diente.dataset.pieza = numero;
    diente.setAttribute('aria-hidden', 'true');

    var etiquetaEstado = document.createElement('span');
    etiquetaEstado.className = 'w-full break-words text-[10px] font-semibold leading-tight';
    etiquetaEstado.textContent = nombreEstado;
    btn.append(etiquetaNumero, diente, etiquetaEstado);

    btn.addEventListener('click', function() {
      var numElem = document.getElementById('detallePiezaNumero');
      var txtElem = document.getElementById('detallePiezaTexto');
      if (numElem) numElem.textContent = "Pieza " + numero + " (" + obtenerNombrePieza(numero) + "):";
      if (txtElem) txtElem.textContent = "[" + estado + "] " + (info.detalle || "En seguimiento clínico.");
    });

    return btn;
  }

  piezasSup.forEach(function(num) { sup.appendChild(crearBotonDiente(num)); });
  piezasInf.forEach(function(num) { inf.appendChild(crearBotonDiente(num)); });
}

function obtenerNombrePieza(num) {
  var ult = num % 10;
  var nombres = {
    1: "Incisivo Central",
    2: "Incisivo Lateral",
    3: "Canino",
    4: "Primer Premolar",
    5: "Segundo Premolar",
    6: "Primer Molar",
    7: "Segundo Molar",
    8: "Tercer Molar"
  };
  return nombres[ult] || "Pieza Dental";
}

// Renderizar Datos Personales en Módulo 2 (Mi Perfil)
function renderizarDatosPerfil(pac) {
  var inpNom = document.getElementById('perfilNombreInput');
  var inpDni = document.getElementById('perfilDniInput');
  var inpTel = document.getElementById('perfilTelefonoInput');
  var inpCor = document.getElementById('perfilCorreoInput');
  var inpPass = document.getElementById('perfilPasswordActual');

  if (inpNom) inpNom.value = pac.nombreCompleto || '';
  if (inpDni) inpDni.value = pac.dni || 'Sin registrar';
  if (inpTel) inpTel.value = pac.telefono || '';
  if (inpCor) inpCor.value = pac.email || '';
  if (inpPass) inpPass.value = pac.passwordVisible || 'carino2026';
}

// Renderizar Historial de Citas en Módulo 2
function renderizarHistorialCitas(citas) {
  var lista = document.getElementById('listaHistorialCitas');
  var badgeTotal = document.getElementById('totalCitasHistorialBadge');
  if (!lista) return;

  lista.innerHTML = '';
  if (!citas || citas.length === 0) {
    lista.innerHTML = '<p class="text-xs text-neutral-600 text-center py-4">No registras citas previas.</p>';
    if (badgeTotal) badgeTotal.textContent = "0 Citas";
    return;
  }

  if (badgeTotal) badgeTotal.textContent = citas.length + (citas.length === 1 ? " Cita" : " Citas");

  citas.forEach(function(c) {
    var item = document.createElement('div');
    item.className = "p-3 rounded-xl bg-[#FFFFFF] border border-neutral-200 space-y-1.5";

    var badgeColor = "bg-emerald-500/20 text-[#0C6059] border-emerald-500/30";
    if (c.estado === 'PENDIENTE') badgeColor = "bg-amber-500/20 text-[#79450B] border-amber-500/30";
    if (c.estado === 'CONFIRMADA') badgeColor = "bg-blue-500/20 text-[#274E74] border-blue-500/30";

    item.innerHTML = 
      '<div class="flex items-center justify-between">' +
        '<span class="text-xs font-bold text-neutral-900">' + (c.tratamientoNombre || "Control Odontológico") + '</span>' +
        '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ' + badgeColor + '">' + c.estado + '</span>' +
      '</div>' +
      '<div class="flex items-center justify-between text-[11px] text-neutral-600">' +
        '<span>📅 ' + formatearFechaLegible(c.fechaCita) + ' &bull; ' + (c.horaCita ? c.horaCita.substring(0, 5) : '10:00') + ' hrs</span>' +
        '<span class="text-[#0C6059]">' + (c.odontologoNombre || "Dr. Kevin Jhon Lindo Alfaro") + '</span>' +
      '</div>';

    lista.appendChild(item);
  });
}

// Eventos de Perfil y Contraseña
function initPerfilEvents() {
  var formDatos = document.getElementById('formPerfilDatos');
  if (formDatos) {
    formDatos.addEventListener('submit', function(e) {
      e.preventDefault();
      var nuevoTel = document.getElementById('perfilTelefonoInput').value.trim();
      var nuevoNom = document.getElementById('perfilNombreInput').value.trim();

      if (currentDossier && currentDossier.paciente) {
        currentDossier.paciente.telefono = nuevoTel;
        currentDossier.paciente.nombreCompleto = nuevoNom;
        localStorage.setItem('sesion_paciente', JSON.stringify(currentDossier.paciente));
        alert("¡Datos de contacto actualizados correctamente!");
      }
    });
  }

  // Ver / Ocultar Contraseña
  var btnToggle = document.getElementById('btnToggleVerPassword');
  var passInput = document.getElementById('perfilPasswordActual');
  if (btnToggle && passInput) {
    btnToggle.addEventListener('click', function() {
      if (passInput.type === 'password') {
        passInput.type = 'text';
      } else {
        passInput.type = 'password';
      }
    });
  }

  // Actualizar Contraseña
  var btnActualizar = document.getElementById('btnActualizarPassword');
  var nuevaPassInput = document.getElementById('perfilNuevaPasswordInput');
  if (btnActualizar && nuevaPassInput) {
    btnActualizar.addEventListener('click', function() {
      var nuevaClave = nuevaPassInput.value.trim();
      if (!nuevaClave || nuevaClave.length < 4) {
        alert("Por favor ingresa una contraseña de al menos 4 caracteres.");
        return;
      }

      if (passInput) passInput.value = nuevaClave;
      if (currentDossier && currentDossier.paciente) {
        currentDossier.paciente.passwordVisible = nuevaClave;
        localStorage.setItem('sesion_paciente', JSON.stringify(currentDossier.paciente));
      }

      // Si existe en clientesBrackets, actualizarlo también
      try {
        var brackets = DemoDatabase.getClientesBrackets();
        var cli = brackets.find(function(c) {
          return c.email && c.email.toLowerCase() === currentPacienteEmail.toLowerCase();
        });
        if (cli) {
          cli.passwordVisible = nuevaClave;
          DemoDatabase.saveClientesBrackets(brackets);
        }
      } catch (e) {
        console.error(e);
      }

      nuevaPassInput.value = '';
      alert("¡Contraseña actualizada con éxito! Úsala en tu próximo inicio de sesión.");
    });
  }
}

// Modal de Agendar Cita Extra
function initModalCitaExtra() {
  var btnAbrir = document.getElementById('btnAbrirModalAgendarPaciente');
  var modal = document.getElementById('modalCitaPaciente');
  var btnCerrar = document.getElementById('btnCerrarModalCitaPaciente');
  var form = document.getElementById('formCitaModalPaciente');
  var fechaInput = document.getElementById('modalFechaInputPaciente');
  var slotsContainer = document.getElementById('modalSlotsContainerPaciente');

  if (!modal) return;

  var hoy = new Date().toISOString().split('T')[0];
  if (fechaInput) {
    fechaInput.value = hoy;
    fechaInput.min = hoy;
    fechaInput.addEventListener('change', renderizarSlotsPaciente);
  }

  if (btnAbrir) {
    btnAbrir.addEventListener('click', function() {
      modal.classList.remove('hidden');
      renderizarSlotsPaciente();
    });
  }

  if (btnCerrar) {
    btnCerrar.addEventListener('click', function() {
      modal.classList.add('hidden');
    });
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.add('hidden');
  });

  async function renderizarSlotsPaciente() {
    if (!slotsContainer || !fechaInput) return;
    slotsContainer.innerHTML = '<p class="text-xs text-neutral-600 py-2 col-span-full text-center">Cargando turnos...</p>';
    selectedHoraPaciente = null;

    try {
      var slots = await ClinicaAPI.getDisponibilidad(fechaInput.value);
      slotsContainer.innerHTML = '';
      slots.forEach(function(slot) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = "slot-btn " + (slot.disponible ? "disponible" : "ocupado");
        btn.innerHTML = '<span class="slot-time">' + slot.horaFormateada + '</span>';

        if (slot.disponible) {
          btn.addEventListener('click', function() {
            var all = slotsContainer.querySelectorAll('.slot-btn.disponible');
            for (var k = 0; k < all.length; k++) all[k].classList.remove('selected');
            btn.classList.add('selected');
            selectedHoraPaciente = slot.hora;
          });
        } else {
          btn.disabled = true;
        }
        slotsContainer.appendChild(btn);
      });
    } catch (e) {
      slotsContainer.innerHTML = '<p class="text-xs text-[#9B2626] py-2 col-span-full text-center">Error al cargar turnos</p>';
    }
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!selectedHoraPaciente) {
        alert("Por favor selecciona un horario libre disponible.");
        return;
      }

      var motivo = document.getElementById('modalMotivoInputPaciente').value.trim();
      var pac = currentDossier ? currentDossier.paciente : {};

      try {
        var nueva = await ClinicaAPI.crearReserva({
          nombreCompleto: pac.nombreCompleto || "Paciente",
          documentoIdentidad: pac.dni || "DNI",
          telefono: pac.telefono || "999888777",
          email: pac.email || currentPacienteEmail,
          tratamientoId: 5, // Control y Ajuste
          fechaCita: fechaInput.value,
          horaCita: selectedHoraPaciente,
          motivoConsulta: motivo || "Consulta o ajuste extra de ortodoncia",
          origenReserva: 'PORTAL_PACIENTE'
        });

        alert("¡Cita reservada con éxito para el " + formatearFechaLegible(fechaInput.value) + " a las " + selectedHoraPaciente.substring(0, 5) + " hrs!");
        modal.classList.add('hidden');
        await cargarDossierPaciente();
      } catch (err) {
        alert("Error al reservar: " + err.message);
      }
    });
  }
}

function formatearFechaLegible(iso) {
  if (!iso) return '-';
  var p = iso.split('-');
  if (p.length !== 3) return iso;
  var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var mesIdx = parseInt(p[1], 10) - 1;
  return p[2] + " de " + (meses[mesIdx] || p[1]) + " " + p[0];
}

// =====================================================================
// 7. NOTIFICACIONES DEL PACIENTE (AVISOS DE TRATAMIENTO, PRÓXIMA CITA & RECADO)
// =====================================================================
function initNotificacionesPaciente() {
  var btnToggle = document.getElementById('btnNotificacionesPaciente');
  var dropdown = document.getElementById('dropdownNotificacionesPaciente');
  var btnLimpiar = document.getElementById('btnLimpiarNotifsPaciente');

  if (btnToggle && dropdown) {
    btnToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && e.target !== btnToggle && !btnToggle.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', async function() {
      await ClinicaAPI.marcarNotificacionesPacienteLeidas(currentPacienteEmail);
      await reloadNotificacionesPaciente();
    });
  }

  window.addEventListener('nueva-notificacion-paciente', function(e) {
    playGentleChimePaciente();
    reloadNotificacionesPaciente();
  });
}

async function reloadNotificacionesPaciente() {
  var lista = document.getElementById('listaNotifsPaciente');
  var badge = document.getElementById('pacienteNotifBadge');
  if (!lista) return;

  try {
    var notifs = await ClinicaAPI.getNotificacionesPaciente(currentPacienteEmail);
    var unread = 0;
    if (notifs) {
      for (var i = 0; i < notifs.length; i++) {
        if (!notifs[i].leido) unread++;
      }
    }

    if (badge) {
      if (unread > 0) {
        badge.textContent = unread;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (!notifs || notifs.length === 0) {
      lista.innerHTML = '<p class="text-xs text-neutral-600 py-4 text-center">No tienes avisos pendientes por el momento.</p>';
      return;
    }

    var html = '';
    for (var j = 0; j < notifs.length; j++) {
      var n = notifs[j];
      var isUnread = !n.leido;

      var borderClass = 'border-neutral-200';
      var bgClass = 'bg-neutral-50/70';
      if (n.tipo === 'CONTROL') {
        borderClass = 'border-[#0C6059]/40';
        bgClass = 'bg-[#F4F9F8]/60';
      } else if (n.tipo === 'RECADO') {
        borderClass = 'border-amber-500/30';
        bgClass = 'bg-[#A56519]/10';
      } else if (n.tipo === 'CONFIRMADO') {
        borderClass = 'border-emerald-500/30';
        bgClass = 'bg-[#0C6059]/10';
      }

      html += '\
        <div class="p-3 rounded-xl ' + bgClass + ' border ' + borderClass + ' space-y-1 transition">\
          <div class="flex items-center justify-between gap-2">\
            <span class="text-xs font-bold text-neutral-900 flex items-center gap-1.5">\
              ' + (isUnread ? '<span class="w-1.5 h-1.5 rounded-full bg-[#0C6059]"></span>' : '') + '\
              ' + n.titulo + '\
            </span>\
            <span class="text-[9px] text-neutral-600 font-mono px-1.5 py-0.2 rounded bg-neutral-50 border border-neutral-200 shrink-0">\
              ' + (n.horaRegistroStr || 'Aviso') + '\
            </span>\
          </div>\
          <p class="text-[11px] text-neutral-700 leading-relaxed">' + n.mensaje + '</p>\
        </div>\
      ';
    }

    lista.innerHTML = html;
  } catch (err) {
    console.error("Error al cargar notificaciones del paciente:", err);
  }
}

function playGentleChimePaciente() {
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    var ctx = new AudioContext();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Silencioso
  }
}
