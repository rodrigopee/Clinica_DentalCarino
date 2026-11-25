/**
 * SISTEMA CLÍNICA ODONTOLÓGICA - PORTAL DE GESTIÓN CLÍNICA (STAFF)
 * Carino Dental Studio - Arquitectura con Barra Izquierda & Dark Luxury
 * Soporta los 2 roles oficiales:
 * 1. Administrador (Dr. Kevin Jhon Lindo Alfaro - admin@clinica.example / demo-odontologo) -> 6 Módulos
 * 2. Ayudante (Sofía Ramírez - asistente@clinica.example / demo-asistente) -> 3 Módulos
 */

var currentRole = 'ODONTOLOGO'; // 'ODONTOLOGO' (Admin) o 'AYUDANTE'
var activeModule = 'modulo-citas';
var currentCitas = [];
var currentSeguimientos = [];
var currentControlesSeguimiento = [];
var filtroSeguimientoActual = 'TODOS';
var currentBrackets = [];
var currentOdontograma = {};
var selectedPiezaDental = 16;
var selectedPacienteOdonto = 1;

// =====================================================================
// NAVEGACIÓN GLOBAL DE MÓDULOS (DISPONIBLE DESDE ONCLICK Y EVENTOS)
// =====================================================================
function switchModule(targetId) {
  if (!targetId) return;
  activeModule = targetId;

  // Actualizar estilos activos de los botones de navegación en la barra lateral
  var navButtons = document.querySelectorAll('.nav-item');
  for (var i = 0; i < navButtons.length; i++) {
    var btn = navButtons[i];
    var t = btn.getAttribute('data-target');
    if (t === targetId) {
      btn.classList.add('nav-item-active');
      btn.classList.remove('text-neutral-600');
    } else {
      btn.classList.remove('nav-item-active');
      btn.classList.add('text-neutral-600');
    }
  }

  // Mostrar la sección correspondiente y ocultar las demás
  var sections = document.querySelectorAll('.tab-content');
  for (var j = 0; j < sections.length; j++) {
    var sec = sections[j];
    if (sec.id === targetId) {
      sec.classList.remove('hidden');
      sec.classList.add('animate-fade-in');
    } else {
      sec.classList.add('hidden');
      sec.classList.remove('animate-fade-in');
    }
  }

  // Actualizar el título y subtítulo en la barra superior
  var topbarTitle = document.getElementById('topbarModuleTitle');
  var topbarSub = document.getElementById('topbarModuleSubtitle');
  if (topbarTitle && topbarSub) {
    if (targetId === 'modulo-citas') {
      topbarTitle.innerHTML = '<span>📅</span> Módulo 1: Citas & Reservas de Pacientes';
      topbarSub.textContent = 'Gestión en tiempo real con 3 botones de estado: Pendiente, Confirmado y Atendido.';
    } else if (targetId === 'modulo-brackets') {
      topbarTitle.innerHTML = '<span>👥</span> Módulo 2: Clientes con Control Mensual (Brackets)';
      topbarSub.textContent = 'Creación de cuentas, contraseñas de acceso y control recurrente mes a mes.';
    } else if (targetId === 'modulo-seguimiento') {
      topbarTitle.innerHTML = '<span>📋</span> Módulo 3: Seguimiento Clínico';
      topbarSub.textContent = 'Próxima cita, qué mes le toca, cuota a pagar y recado médico de indicaciones.';
    } else if (targetId === 'modulo-odontograma') {
      topbarTitle.innerHTML = '<span>🦷</span> Módulo 4: Odontograma Completo (32 Piezas)';
      topbarSub.textContent = 'Mapeo anatómico y sincronización directa con la ficha de seguimiento.';
    } else if (targetId === 'modulo-reportes') {
      topbarTitle.innerHTML = '<span>📊</span> Módulo 5: Reportes, Pagos & Gráfico Circular';
      topbarSub.textContent = 'Métricas del mes y círculo indicando qué paciente acude con mayor frecuencia.';
    } else if (targetId === 'modulo-historial') {
      topbarTitle.innerHTML = '<span>📁</span> ' + (currentRole === 'ODONTOLOGO' ? 'Módulo 6' : 'Módulo 3') + ': Historial Clínico & Descargas';
      topbarSub.textContent = 'Historial completo de asistencias con descargas en PDF, Word (.doc) y Excel (.csv).';
    } else if (targetId === 'modulo-perfil') {
      topbarTitle.innerHTML = '<span>👤</span> ' + (currentRole === 'ODONTOLOGO' ? 'Módulo 7' : 'Módulo 4') + ': Mi Perfil & Credenciales';
      topbarSub.textContent = 'Información del profesional activo en el consultorio.';
    }
  }

  // Renderizar o actualizar datos específicos del módulo seleccionado
  if (targetId === 'modulo-citas') {
    renderCitasTable();
    actualizarMetricasCitas();
  } else if (targetId === 'modulo-brackets') {
    renderBracketsList();
  } else if (targetId === 'modulo-seguimiento') {
    reloadControlesSeguimiento();
    renderSeguimientosCards();
    actualizarSelectorPacientes();
  } else if (targetId === 'modulo-odontograma') {
    renderArcadasDentales();
    actualizarPanelDienteSeleccionado();
  } else if (targetId === 'modulo-historial') {
    reloadHistorialData();
  } else if (targetId === 'modulo-perfil') {
    renderPerfilData();
  }

  // En móvil o tablet, cerrar automáticamente la barra lateral al seleccionar un módulo
  var sidebar = document.getElementById('sidebarPortal');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
  }
}
window.switchModule = switchModule;

// =====================================================================
// INICIALIZACIÓN PRINCIPAL DEL DOM
// =====================================================================
document.addEventListener('DOMContentLoaded', async function() {
  detectRoleFromUrl();
  initSidebarNavigation();
  initRoleSwitcher();
  initCitasModule();
  initBracketsModule();
  initSeguimientoModule();
  initOdontogramaModule();
  initPerfilModule();
  initNotifications();
  initMobileDrawer();
  initAdminChatHub();
  
  // Carga inicial completa de datos
  await reloadAllData();
});

// =====================================================================
// 1. GESTIÓN Y DETECCIÓN DE ROLES (ADMIN VS AYUDANTE)
// =====================================================================
function detectRoleFromUrl() {
  var urlParams = new URLSearchParams(window.location.search);
  var roleParam = urlParams.get('role');
  if (roleParam && (roleParam === 'AYUDANTE' || roleParam === 'ODONTOLOGO')) {
    currentRole = roleParam;
  }
  applyRoleUI();
}

function initRoleSwitcher() {
  var btnSwitchAdmin = document.getElementById('btnSwitchAdmin');
  var btnSwitchAyudante = document.getElementById('btnSwitchAyudante');

  if (btnSwitchAdmin) {
    btnSwitchAdmin.addEventListener('click', function() {
      currentRole = 'ODONTOLOGO';
      applyRoleUI();
      showToast('Sesión cambiada a Administrador', 'Dr. Kevin Jhon Lindo Alfaro (admin@clinica.example)');
    });
  }

  if (btnSwitchAyudante) {
    btnSwitchAyudante.addEventListener('click', function() {
      currentRole = 'AYUDANTE';
      applyRoleUI();
      showToast('Sesión cambiada a Ayudante', 'Sofía Ramírez (asistente@clinica.example)');
    });
  }
}

function applyRoleUI() {
  var btnSwitchAdmin = document.getElementById('btnSwitchAdmin');
  var btnSwitchAyudante = document.getElementById('btnSwitchAyudante');
  var sidebarUserName = document.getElementById('sidebarUserName');
  var sidebarUserEmail = document.getElementById('sidebarUserEmail');
  var sidebarRolePill = document.getElementById('sidebarRolePill');
  var sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
  var roleModuleCountBadge = document.getElementById('roleModuleCountBadge');
  var credentialsNote = document.getElementById('credentialsNote');

  // Módulos condicionales de la barra izquierda
  var navItemBrackets = document.getElementById('navItemBrackets');
  var navItemOdontograma = document.getElementById('navItemOdontograma');
  var navItemReportes = document.getElementById('navItemReportes');
  var navItemHistorial = document.getElementById('navItemHistorial');
  var sidebarNavHistorialText = document.getElementById('sidebarNavHistorialText');
  var sidebarNavPerfilText = document.getElementById('sidebarNavPerfilText');

  // Módulo 1 banner ayudante
  var bannerAyudanteCitas = document.getElementById('bannerAyudanteCitas');

  // Módulo 3 seguimiento (modo solo lectura vs editable)
  var bannerModoSeguimiento = document.getElementById('bannerModoSeguimiento');
  var tituloModoSeguimiento = document.getElementById('tituloModoSeguimiento');
  var descModoSeguimiento = document.getElementById('descModoSeguimiento');
  var badgeEstadoPermisoSeguimiento = document.getElementById('badgeEstadoPermisoSeguimiento');
  var badgeSeguimientoMode = document.getElementById('badgeSeguimientoMode');
  var panelFormSeguimientoAdmin = document.getElementById('panelFormSeguimientoAdmin');

  if (currentRole === 'ODONTOLOGO') {
    // 1. PERFIL ADMINISTRADOR (7 MÓDULOS)
    if (btnSwitchAdmin) {
      btnSwitchAdmin.className = "py-1.5 px-2 text-[11px] font-bold rounded-lg bg-[#0C6059] text-white shadow-sm flex items-center justify-center gap-1 transition";
    }
    if (btnSwitchAyudante) {
      btnSwitchAyudante.className = "py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 shadow-sm flex items-center justify-center gap-1 transition";
    }

    if (sidebarUserName) sidebarUserName.textContent = "Dr. Kevin Jhon Lindo Alfaro";
    if (sidebarUserEmail) sidebarUserEmail.textContent = "admin@clinica.example";
    if (sidebarRolePill) {
      sidebarRolePill.textContent = "ADMIN";
      sidebarRolePill.className = "text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0C6059]/20 text-[#0C6059] border border-[#0C6059]/40 shrink-0";
    }
    if (sidebarUserAvatar) {
      sidebarUserAvatar.textContent = "GM";
      sidebarUserAvatar.className = "w-10 h-10 rounded-full bg-gradient-to-tr from-[#0C6059] to-[#0E6A60] text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0";
    }
    if (roleModuleCountBadge) roleModuleCountBadge.textContent = "7 Módulos";
    if (credentialsNote) credentialsNote.textContent = "Admin: admin@clinica.example / demo-odontologo";

    // Mostrar todos los módulos para el Administrador
    if (navItemBrackets) navItemBrackets.classList.remove('hidden');
    if (navItemOdontograma) navItemOdontograma.classList.remove('hidden');
    if (navItemReportes) navItemReportes.classList.remove('hidden');
    if (navItemHistorial) navItemHistorial.classList.remove('hidden');
    if (sidebarNavHistorialText) sidebarNavHistorialText.textContent = "6. Historial Clínico";
    if (sidebarNavPerfilText) sidebarNavPerfilText.textContent = "7. Mi Perfil";

    if (bannerAyudanteCitas) bannerAyudanteCitas.classList.add('hidden');

    // Seguimiento editable
    if (badgeSeguimientoMode) {
      badgeSeguimientoMode.textContent = "Lista";
      badgeSeguimientoMode.className = "text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-[#274E74] font-semibold border border-blue-500/20";
    }
    if (tituloModoSeguimiento) tituloModoSeguimiento.textContent = "Módulo 3: Seguimiento Clínico de Pacientes";
    if (descModoSeguimiento) descModoSeguimiento.textContent = "Control de pacientes en tratamiento, fecha y mes de próxima cita, cobro mensual y recado médico de indicaciones.";
    if (badgeEstadoPermisoSeguimiento) {
      badgeEstadoPermisoSeguimiento.textContent = "Modo Odontólogo (Control Total)";
      badgeEstadoPermisoSeguimiento.className = "text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-[#0C6059] border border-emerald-500/20 shrink-0";
    }
    if (panelFormSeguimientoAdmin) panelFormSeguimientoAdmin.classList.remove('hidden');

  } else {
    // 2. PERFIL AYUDANTE (4 MÓDULOS)
    if (btnSwitchAyudante) {
      btnSwitchAyudante.className = "py-1.5 px-2 text-[11px] font-bold rounded-lg bg-[#35618A] text-white shadow-sm flex items-center justify-center gap-1 transition";
    }
    if (btnSwitchAdmin) {
      btnSwitchAdmin.className = "py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 shadow-sm flex items-center justify-center gap-1 transition";
    }

    if (sidebarUserName) sidebarUserName.textContent = "Sofía Ramírez";
    if (sidebarUserEmail) sidebarUserEmail.textContent = "asistente@clinica.example";
    if (sidebarRolePill) {
      sidebarRolePill.textContent = "AYUDANTE";
      sidebarRolePill.className = "text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#274E74] border border-blue-500/40 shrink-0";
    }
    if (sidebarUserAvatar) {
      sidebarUserAvatar.textContent = "SR";
      sidebarUserAvatar.className = "w-10 h-10 rounded-full bg-gradient-to-tr from-[#BBDDD6] to-[#EAF5F2] text-neutral-900 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0";
    }
    if (roleModuleCountBadge) roleModuleCountBadge.textContent = "4 Módulos";
    if (credentialsNote) credentialsNote.textContent = "Ayudante: asistente@clinica.example / demo-asistente";

    // Ocultar módulos 2, 4 y 5 para la ayudante; mostrar Citas (1), Seguimiento (2), Historial (3) y Mi Perfil (4)
    if (navItemBrackets) navItemBrackets.classList.add('hidden');
    if (navItemOdontograma) navItemOdontograma.classList.add('hidden');
    if (navItemReportes) navItemReportes.classList.add('hidden');
    if (navItemHistorial) navItemHistorial.classList.remove('hidden');
    if (sidebarNavHistorialText) sidebarNavHistorialText.textContent = "3. Historial Clínico";
    if (sidebarNavPerfilText) sidebarNavPerfilText.textContent = "4. Mi Perfil";

    if (bannerAyudanteCitas) bannerAyudanteCitas.classList.remove('hidden');

    // Seguimiento solo lectura pero con confirmación asistencial
    if (badgeSeguimientoMode) {
      badgeSeguimientoMode.textContent = "Lista";
      badgeSeguimientoMode.className = "text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-[#79450B] font-bold border border-amber-500/30";
    }
    if (tituloModoSeguimiento) tituloModoSeguimiento.textContent = "Módulo 2 (Ayudante): Seguimiento Clínico & Asistencia";
    if (descModoSeguimiento) descModoSeguimiento.textContent = "Supervisión de próximas citas, pagos del mes y marcado directo de asistencia para controles cumplidos.";
    if (badgeEstadoPermisoSeguimiento) {
      badgeEstadoPermisoSeguimiento.textContent = "Modo Ayudante (Visualización & Confirmación)";
      badgeEstadoPermisoSeguimiento.className = "text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-[#79450B] border border-amber-500/30 shrink-0";
    }
    if (panelFormSeguimientoAdmin) panelFormSeguimientoAdmin.classList.add('hidden');

    // Si estaba en un módulo no autorizado, redirigir a citas
    if (activeModule === 'modulo-brackets' || activeModule === 'modulo-odontograma' || activeModule === 'modulo-reportes') {
      switchModule('modulo-citas');
    }
  }

  // Refrescar vistas
  renderCitasTable();
  renderPerfilData();
  renderSeguimientosCards();
}

// =====================================================================
// 2. NAVEGACIÓN DE MÓDULOS EN LA BARRA LATERAL IZQUIERDA
// =====================================================================
function initSidebarNavigation() {
  var navButtons = document.querySelectorAll('.nav-item');
  for (var i = 0; i < navButtons.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function(e) {
        var target = btn.getAttribute('data-target');
        if (target) {
          switchModule(target);
        }
      });
    })(navButtons[i]);
  }
}

// =====================================================================
// 3. MÓDULO 1: CITAS & RESERVAS (CON LOS 3 BOTONES DE ESTADO)
// =====================================================================
function initCitasModule() {
  var filterDateInput = document.getElementById('filterDateInput');
  var btnFiltroHoy = document.getElementById('btnFiltroHoy');
  var btnFiltroTodas = document.getElementById('btnFiltroTodas');
  var inputBuscar = document.getElementById('inputBuscarPaciente');
  var btnSimular = document.getElementById('btnSimularNuevaCita');

  var hoyStr = new Date().toISOString().split('T')[0];
  if (filterDateInput) {
    filterDateInput.value = hoyStr;
    filterDateInput.addEventListener('change', async function() {
      await reloadCitasData(filterDateInput.value);
    });
  }

  if (btnFiltroHoy && filterDateInput) {
    btnFiltroHoy.addEventListener('click', async function() {
      filterDateInput.value = hoyStr;
      await reloadCitasData(hoyStr);
    });
  }

  if (btnFiltroTodas && filterDateInput) {
    btnFiltroTodas.addEventListener('click', async function() {
      filterDateInput.value = '';
      await reloadCitasData(null);
    });
  }

  if (inputBuscar) {
    inputBuscar.addEventListener('input', function() {
      renderCitasTable();
    });
  }

  if (btnSimular) {
    btnSimular.addEventListener('click', async function() {
      await simularNuevaCitaWeb();
    });
  }
}

async function reloadCitasData(fecha) {
  try {
    currentCitas = await ClinicaAPI.getCitas(fecha);
  } catch (e) {
    currentCitas = [];
  }
  // Si no se encontraron con el filtro de fecha, obtener todas para no dejar la tabla vacía
  if (!currentCitas || currentCitas.length === 0) {
    try {
      currentCitas = await ClinicaAPI.getCitas(null);
    } catch (err) {
      currentCitas = [];
    }
  }
  renderCitasTable();
  actualizarMetricasCitas();
}

function renderCitasTable() {
  var tbody = document.getElementById('tablaCitasBody');
  if (!tbody) return;

  var inputBuscar = document.getElementById('inputBuscarPaciente');
  var query = (inputBuscar && inputBuscar.value) ? inputBuscar.value.toLowerCase().trim() : '';

  var filtered = currentCitas || [];
  if (query) {
    filtered = filtered.filter(function(c) {
      var nom = (c.pacienteNombre || '').toLowerCase();
      var dni = (c.pacienteDocumento || '').toLowerCase();
      var cel = (c.pacienteTelefono || '').toLowerCase();
      return nom.indexOf(query) !== -1 || dni.indexOf(query) !== -1 || cel.indexOf(query) !== -1;
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '\
      <tr>\
        <td colspan="5" class="py-12 text-center text-neutral-600 text-xs">\
          <span class="text-3xl block mb-2">🔍</span>\
          No se encontraron citas registradas con este filtro.\
        </td>\
      </tr>\
    ';
    return;
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var cita = filtered[i];
    var estado = cita.estado || 'PENDIENTE';
    
    var isPendiente = (estado === 'PENDIENTE');
    var isConfirmada = (estado === 'CONFIRMADA');
    var isAtendida = (estado === 'ATENDIDA');

    var btnPendienteClass = isPendiente
      ? "bg-amber-500/30 text-[#79450B] border-amber-500 ring-1 ring-[#A56519] shadow-xs"
      : "bg-neutral-50 text-neutral-600 border-neutral-300 hover:text-[#79450B] hover:border-amber-500/50";

    var btnConfirmadaClass = isConfirmada
      ? "bg-blue-500/30 text-[#274E74] border-blue-500 ring-1 ring-[#35618A] shadow-xs"
      : "bg-neutral-50 text-neutral-600 border-neutral-300 hover:text-[#274E74] hover:border-blue-500/50";

    var btnAtendidaClass = isAtendida
      ? "bg-emerald-500/30 text-[#0C6059] border-emerald-500 ring-1 ring-[#0C6059] shadow-xs"
      : "bg-neutral-50 text-neutral-600 border-neutral-300 hover:text-[#0C6059] hover:border-emerald-500/50";

    var inicial = (cita.pacienteNombre || 'P').charAt(0);
    var horaStr = cita.horaCita ? cita.horaCita.substring(0, 5) : '09:00';
    var fechaStr = cita.fechaCita || 'Hoy';

    html += '\
      <tr class="hover:bg-neutral-50/40 transition">\
        <td class="py-3 px-4">\
          <div class="flex items-center gap-2.5">\
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center justify-center text-xs font-bold text-[#0C6059]">\
              ' + inicial + '\
            </div>\
            <div>\
              <span class="font-bold text-neutral-900 block">' + (cita.pacienteNombre || 'Paciente') + '</span>\
              <span class="text-[10px] text-neutral-600">DNI: ' + (cita.pacienteDocumento || 'No reg.') + ' • ' + (cita.pacienteTelefono || '') + '</span>\
            </div>\
          </div>\
        </td>\
\
        <td class="py-3 px-4">\
          <span class="font-medium text-neutral-700 block">' + (cita.tratamientoNombre || 'Consulta General') + '</span>\
          <span class="text-[10px] text-neutral-600 italic block line-clamp-1">"' + (cita.motivoConsulta || 'Evaluación') + '"</span>\
        </td>\
\
        <td class="py-3 px-4 whitespace-nowrap">\
          <span class="text-[#0C6059] font-mono font-bold block">' + horaStr + '</span>\
          <span class="text-[10px] text-neutral-600 block">' + fechaStr + '</span>\
        </td>\
\
        <td class="py-3 px-4 text-center">\
          <div class="inline-flex items-center gap-1.5 p-1 rounded-xl bg-neutral-50/60 border border-neutral-200">\
            <button type="button" onclick="cambiarEstadoCitaDirecto(' + cita.id + ', \'PENDIENTE\')"\
                    class="btn-status-badge ' + btnPendienteClass + '" title="Marcar como Pendiente">\
              ⏳ Pendiente\
            </button>\
            <button type="button" onclick="cambiarEstadoCitaDirecto(' + cita.id + ', \'CONFIRMADA\')"\
                    class="btn-status-badge ' + btnConfirmadaClass + '" title="Marcar como Confirmado">\
              ✓ Confirmado\
            </button>\
            <button type="button" onclick="cambiarEstadoCitaDirecto(' + cita.id + ', \'ATENDIDA\')"\
                    class="btn-status-badge ' + btnAtendidaClass + '" title="Marcar como Atendido">\
              ★ Atendido\
            </button>\
          </div>\
        </td>\
\
        <td class="py-3 px-4 text-right whitespace-nowrap">\
          <div class="inline-flex items-center gap-2">\
            ' + (currentRole === 'AYUDANTE' ? '\
              <button type="button" onclick="avisarAlDoctor(\'' + (cita.pacienteNombre || 'Paciente').replace(/'/g, "\\'") + '\')"\
                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 text-[#79450B] border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1">\
                <span>🔔</span> Avisar al Doctor\
              </button>\
            ' : '\
              <button type="button" onclick="abrirModalEvaluar(' + cita.id + ')"\
                      class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-300 hover:border-[#0C6059] hover:text-[#0C6059] transition">\
                🩺 Evaluar\
              </button>\
            ') + '\
          </div>\
        </td>\
      </tr>\
    ';
  }

  tbody.innerHTML = html;
}

function actualizarMetricasCitas() {
  var totalEl = document.getElementById('statTotalCitas');
  var pendEl = document.getElementById('statPendientes');
  var confEl = document.getElementById('statConfirmadas');
  var atenEl = document.getElementById('statAtendidas');
  var sidebarCount = document.getElementById('sidebarCitasCount');

  var citas = currentCitas || [];
  var pendientes = citas.filter(function(c) { return c.estado === 'PENDIENTE'; }).length;
  var confirmadas = citas.filter(function(c) { return c.estado === 'CONFIRMADA'; }).length;
  var atendidas = citas.filter(function(c) { return c.estado === 'ATENDIDA'; }).length;

  if (totalEl) totalEl.textContent = citas.length;
  if (pendEl) pendEl.textContent = pendientes;
  if (confEl) confEl.textContent = confirmadas;
  if (atenEl) atenEl.textContent = atendidas;
  if (sidebarCount) sidebarCount.textContent = citas.length;
}

window.cambiarEstadoCitaDirecto = async function(citaId, nuevoEstado) {
  try {
    await ClinicaAPI.cambiarEstadoCita(citaId, nuevoEstado);
    var c = currentCitas.find(function(item) { return item.id == citaId; });
    if (c) c.estado = nuevoEstado;
    renderCitasTable();
    actualizarMetricasCitas();
    showToast('Estado actualizado: ' + nuevoEstado, 'Cita #' + citaId + ' ahora marcada como ' + nuevoEstado);
  } catch (e) {
    alert("Error al actualizar estado: " + e.message);
  }
};

window.avisarAlDoctor = function(pacienteNombre) {
  playGentleChime();
  showToast('¡Aviso Enviado al Doctor!', 'Dr. Kevin Jhon Lindo Alfaro ha sido notificado sobre la llegada de ' + pacienteNombre + ' a sala.');
  ClinicaAPI.crearNotificacion({
    titulo: '🔔 Paciente en Espera en Sala',
    mensaje: 'Sofía Ramírez avisa: El paciente ' + pacienteNombre + ' ya se encuentra en recepción listo para ser atendido.',
    pacienteNombre: pacienteNombre,
    horaRegistroStr: new Date().toLocaleTimeString()
  });
};

window.abrirModalEvaluar = function(citaId) {
  var c = currentCitas.find(function(item) { return item.id == citaId; });
  if (!c) return;
  var modal = document.getElementById('modalEvaluarCita');
  if (!modal) return;

  var sub = document.getElementById('evalModalPacienteSub');
  var trat = document.getElementById('evalTratamientoNombre');
  var mot = document.getElementById('evalMotivo');
  var tel = document.getElementById('evalTelefono');

  if (sub) sub.textContent = c.pacienteNombre + ' (DNI: ' + (c.pacienteDocumento || '-') + ')';
  if (trat) trat.textContent = c.tratamientoNombre;
  if (mot) mot.textContent = c.motivoConsulta || 'Evaluación rutinaria';
  if (tel) tel.textContent = c.pacienteTelefono;

  // Botones dentro del modal
  var btnAt = document.getElementById('btnEvalMarcarAtendido');
  var btnConf = document.getElementById('btnEvalMarcarConfirmado');
  var btnSeg = document.getElementById('btnEvalIrSeguimiento');

  if (btnAt) {
    btnAt.onclick = function() {
      cambiarEstadoCitaDirecto(citaId, 'ATENDIDA');
      modal.classList.add('hidden');
    };
  }
  if (btnConf) {
    btnConf.onclick = function() {
      cambiarEstadoCitaDirecto(citaId, 'CONFIRMADA');
      modal.classList.add('hidden');
    };
  }
  if (btnSeg) {
    btnSeg.onclick = function() {
      modal.classList.add('hidden');
      switchModule('modulo-seguimiento');
      var selectPac = document.getElementById('segPacienteSelect');
      if (selectPac) selectPac.value = c.pacienteNombre;
      var tratInput = document.getElementById('segTratamientoInput');
      if (tratInput) tratInput.value = c.tratamientoNombre;
    };
  }

  modal.classList.remove('hidden');
};

var btnCerrarEval = document.getElementById('btnCerrarEvalModal');
if (btnCerrarEval) {
  btnCerrarEval.addEventListener('click', function() {
    var modal = document.getElementById('modalEvaluarCita');
    if (modal) modal.classList.add('hidden');
  });
}

// =====================================================================
// 4. MÓDULO 2: CLIENTES CON CONTROL MENSUAL / BRACKETS (SOLO ADMIN)
// =====================================================================
function initBracketsModule() {
  var form = document.getElementById('formCrearClienteBrackets');
  var btnGenPass = document.getElementById('btnGenPass');
  var passInput = document.getElementById('brackPassword');

  if (btnGenPass && passInput) {
    btnGenPass.addEventListener('click', function() {
      var randomNum = Math.floor(1000 + Math.random() * 9000);
      passInput.value = 'brackets' + randomNum;
    });
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var nombre = document.getElementById('brackNombre').value.trim();
      var dni = document.getElementById('brackDni').value.trim();
      var telefono = document.getElementById('brackTelefono').value.trim();
      var email = document.getElementById('brackEmail').value.trim();
      var password = document.getElementById('brackPassword').value.trim();
      var tipo = document.getElementById('brackTipo').value;
      var diaControl = document.getElementById('brackDiaControl').value;
      var cuota = document.getElementById('brackCuota').value;

      try {
        await ClinicaAPI.crearClienteBrackets({
          nombreCompleto: nombre,
          dni: dni,
          telefono: telefono,
          email: email,
          password: password,
          tratamiento: tipo,
          diaControlMensual: diaControl,
          cuotaMensual: cuota,
          mesActual: "Noviembre 2026",
          estadoPago: "PENDIENTE"
        });

        form.reset();
        if (passInput) passInput.value = "brackets2026";
        await reloadBracketsData();
        showToast('¡Cuenta Creada Exitosamente!', 'El paciente ' + nombre + ' ya puede iniciar sesión con ' + email);
      } catch (err) {
        alert("Error al registrar cliente: " + err.message);
      }
    });
  }

  // Modales y edición de paciente
  var btnCerrar = document.getElementById('btnCerrarModalEditarBrack');
  var btnCancelar = document.getElementById('btnCancelarEditarBrack');
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalEditarClienteBrackets);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalEditarClienteBrackets);

  var formEditar = document.getElementById('formEditarClienteBrackets');
  if (formEditar) {
    formEditar.addEventListener('submit', async function(e) {
      e.preventDefault();
      var id = document.getElementById('editBrackId').value;
      var nombre = document.getElementById('editBrackNombre').value.trim();
      var dni = document.getElementById('editBrackDni').value.trim();
      var telefono = document.getElementById('editBrackTelefono').value.trim();
      var email = document.getElementById('editBrackEmail').value.trim();
      var password = document.getElementById('editBrackPassword').value.trim();
      var tratamiento = document.getElementById('editBrackTratamiento').value.trim();
      var diaControl = document.getElementById('editBrackDiaControl').value;
      var cuota = document.getElementById('editBrackCuota').value;
      var estadoPago = document.getElementById('editBrackEstadoPago').value;

      try {
        await ClinicaAPI.actualizarClienteBrackets(id, {
          nombreCompleto: nombre,
          dni: dni,
          telefono: telefono,
          email: email,
          passwordVisible: password,
          tratamiento: tratamiento,
          diaControlMensual: diaControl,
          cuotaMensual: cuota,
          estadoPago: estadoPago
        });

        cerrarModalEditarClienteBrackets();
        await reloadBracketsData();
        showToast('¡Datos de Paciente Modificados!', 'Se actualizaron las credenciales y datos de ' + nombre);
      } catch (err) {
        alert("Error al actualizar paciente: " + err.message);
      }
    });
  }
}

window.abrirModalEditarClienteBrackets = function(id) {
  var cli = (currentBrackets || []).find(function(c) { return c.id == id; });
  if (!cli) return;

  var modal = document.getElementById('modalEditarClienteBrackets');
  if (!modal) return;

  document.getElementById('editBrackId').value = cli.id;
  document.getElementById('editBrackNombre').value = cli.nombreCompleto || '';
  document.getElementById('editBrackDni').value = cli.dni || '';
  document.getElementById('editBrackTelefono').value = cli.telefono || '';
  document.getElementById('editBrackEmail').value = cli.email || '';
  document.getElementById('editBrackPassword').value = cli.passwordVisible || 'brackets2026';
  document.getElementById('editBrackTratamiento').value = cli.tratamiento || 'Ortodoncia Metálica (Brackets)';
  document.getElementById('editBrackDiaControl').value = cli.diaControlMensual || 15;
  document.getElementById('editBrackCuota').value = cli.cuotaMensual || 120;
  document.getElementById('editBrackEstadoPago').value = cli.estadoPago || 'PENDIENTE';

  modal.classList.remove('hidden');
};

window.cerrarModalEditarClienteBrackets = function() {
  var modal = document.getElementById('modalEditarClienteBrackets');
  if (modal) modal.classList.add('hidden');
};

async function reloadBracketsData() {
  try {
    currentBrackets = await ClinicaAPI.getClientesBrackets();
  } catch (e) {
    currentBrackets = [];
  }
  renderBracketsList();
  actualizarSelectorPacientes();
}

function renderBracketsList() {
  var container = document.getElementById('listaClientesBrackets');
  var badge = document.getElementById('totalPacientesBracketsBadge');
  if (badge) badge.textContent = (currentBrackets ? currentBrackets.length : 0) + ' Pacientes Registrados';
  if (!container) return;

  if (!currentBrackets || currentBrackets.length === 0) {
    container.innerHTML = '<p class="text-xs text-neutral-600 py-6 text-center">No hay pacientes de control mensual registrados aún.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < currentBrackets.length; i++) {
    var c = currentBrackets[i];
    var isPagado = (c.estadoPago === 'PAGADO');
    html += '\
      <div class="p-4 rounded-xl bg-neutral-50/90 border border-neutral-200 hover:border-[#0C6059]/40 transition space-y-2.5">\
        <div class="flex items-start justify-between gap-3">\
          <div>\
            <div class="flex items-center gap-2">\
              <span class="text-sm font-bold text-neutral-900">' + c.nombreCompleto + '</span>\
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#0C6059] border border-emerald-500/20">Control Mensual</span>\
            </div>\
            <p class="text-[11px] text-[#0C6059] font-semibold mt-0.5">' + c.tratamiento + '</p>\
          </div>\
          <div class="flex items-center gap-1.5 shrink-0">\
            <button type="button" onclick="abrirModalEditarClienteBrackets(' + c.id + ')"\
                    class="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-neutral-300 bg-neutral-100 hover:bg-neutral-100 text-neutral-700 transition flex items-center gap-1 shadow-xs" title="Modificar credenciales o datos">\
              ✏️ Editar Datos\
            </button>\
            <button type="button" onclick="togglePagoBrackets(' + c.id + ')"\
                    class="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ' + (isPagado ? 'bg-emerald-500/20 text-[#0C6059] border-emerald-500/40' : 'bg-amber-500/20 text-[#79450B] border-amber-500/40') + '">\
              ' + (isPagado ? '✓ CUOTA PAGADA' : '⏳ PAGO PENDIENTE') + '\
            </button>\
          </div>\
        </div>\
\
        <!-- Credenciales de acceso creadas para que el paciente entre -->\
        <div class="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">\
          <div>\
            <span class="text-neutral-600 block text-[9px] uppercase font-bold">Correo de Acceso (Usuario):</span>\
            <span class="text-neutral-700 font-mono font-medium">' + c.email + '</span>\
          </div>\
          <div>\
            <span class="text-neutral-600 block text-[9px] uppercase font-bold">Contraseña Creada:</span>\
            <span class="text-[#0C6059] font-mono font-bold">' + (c.passwordVisible || '••••••••') + '</span>\
          </div>\
        </div>\
\
        <div class="flex items-center justify-between text-[11px] text-neutral-600 pt-1 border-t border-neutral-200">\
          <span>📅 Día de control: <strong>Día ' + c.diaControlMensual + ' de cada mes</strong></span>\
          <span>Cuota mensual: <strong class="text-neutral-900">S/ ' + parseFloat(c.cuotaMensual || 120).toFixed(2) + '</strong></span>\
        </div>\
      </div>\
    ';
  }

  container.innerHTML = html;
}

window.togglePagoBrackets = async function(id) {
  try {
    await ClinicaAPI.cambiarEstadoPagoBrackets(id);
    await reloadBracketsData();
    showToast('Estado de Cuota Actualizado', 'El pago mensual del paciente ha sido actualizado.');
  } catch (e) {
    alert(e.message);
  }
};

// =====================================================================
// 5. MÓDULO 3: SEGUIMIENTO CLÍNICO (LISTA DE CONTROLES, MES & CUOTA)
// =====================================================================
function initSeguimientoModule() {
  var form = document.getElementById('formNuevoSeguimiento');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var pacienteNombre = document.getElementById('segPacienteSelect').value;
      var tratamiento = document.getElementById('segTratamientoInput').value;
      var diagnostico = document.getElementById('segDiagnostico').value;
      var procedimiento = document.getElementById('segProcedimiento').value;
      var fechaProxima = document.getElementById('segFechaProxima').value;
      var mesProxima = document.getElementById('segMesProxima').value;
      var montoPago = document.getElementById('segMontoPago').value;
      var recado = document.getElementById('segRecado').value;

      try {
        await ClinicaAPI.guardarSeguimiento({
          pacienteNombre: pacienteNombre,
          tratamiento: tratamiento,
          diagnostico: diagnostico,
          procedimientoRealizado: procedimiento,
          proximaCitaSugerida: fechaProxima,
          mesProximaCita: mesProxima,
          montoPagoMes: montoPago,
          recadoIndicaciones: recado
        });

        // Registrar también en la lista de controles mensuales de seguimiento
        await ClinicaAPI.crearControlMensual({
          pacienteNombre: pacienteNombre,
          pacienteDni: "00000006",
          tratamiento: tratamiento,
          mes: mesProxima,
          fechaCita: fechaProxima,
          cuota: montoPago,
          recado: recado,
          procedimiento: procedimiento,
          estado: "PENDIENTE"
        });

        form.reset();
        await reloadSeguimientosData();
        await reloadControlesSeguimiento();
        await reloadHistorialData();
        showToast('Ficha de Seguimiento Guardada', 'Se registró el control para ' + mesProxima + ' y el recado para el paciente.');
      } catch (err) {
        alert("Error al guardar seguimiento: " + err.message);
      }
    });
  }
}

async function reloadSeguimientosData() {
  try {
    currentSeguimientos = await ClinicaAPI.getSeguimientos();
  } catch (e) {
    currentSeguimientos = [];
  }
  renderSeguimientosCards();
}

async function reloadControlesSeguimiento() {
  try {
    currentControlesSeguimiento = await ClinicaAPI.getControlesSeguimiento();
  } catch (e) {
    currentControlesSeguimiento = [];
  }
  renderControlesSeguimientoTable();
}

function renderControlesSeguimientoTable() {
  var tbody = document.getElementById('tablaControlesSeguimientoBody');
  var badgeTotal = document.getElementById('totalControlesBadge');
  if (!tbody) return;

  var lista = currentControlesSeguimiento || [];
  var searchInput = document.getElementById('inputBuscarControlSeg');
  var busqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Filtrado por estado
  var filtrados = lista.filter(function(item) {
    var est = item.estadoControl || item.estado || 'PENDIENTE';
    if (filtroSeguimientoActual === 'PENDIENTES') return est === 'PENDIENTE';
    if (filtroSeguimientoActual === 'CONFIRMADOS') return est === 'CONFIRMADO';
    return true;
  });

  // Filtrado por buscador
  if (busqueda) {
    filtrados = filtrados.filter(function(item) {
      var n = (item.pacienteNombre || '').toLowerCase();
      var d = (item.pacienteDni || '').toLowerCase();
      var m = (item.mesControl || item.mes || '').toLowerCase();
      var t = (item.tratamiento || '').toLowerCase();
      return n.indexOf(busqueda) !== -1 || d.indexOf(busqueda) !== -1 || m.indexOf(busqueda) !== -1 || t.indexOf(busqueda) !== -1;
    });
  }

  if (badgeTotal) {
    badgeTotal.textContent = filtrados.length + ' Controles';
  }

  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-xs text-neutral-600">No se encontraron controles con los filtros seleccionados.</td></tr>';
    return;
  }

  var html = '';
  for (var i = 0; i < filtrados.length; i++) {
    var c = filtrados[i];
    var mesTexto = c.mesControl || c.mes || 'Noviembre 2026';
    var cuotaNum = parseFloat(c.montoPago !== undefined ? c.montoPago : (c.cuota !== undefined ? c.cuota : 120.00));
    var isConfirmado = (c.estadoControl === 'CONFIRMADO' || c.estado === 'CONFIRMADO');

    var badgeEstado = isConfirmado
      ? '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-[#0C6059] border border-emerald-500/30">✓ CUMPLIDO</span>'
      : '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-[#79450B] border border-amber-500/30">⏳ PENDIENTE</span>';

    var btnAccion = isConfirmado
      ? '<span class="text-[11px] text-[#0C6059] font-bold flex items-center justify-center gap-1 py-1">✓ Confirmado</span>'
      : '<button type="button" onclick="marcarControlConfirmadoBtn(' + c.id + ')" class="btn-gold py-1.5 px-3 rounded-lg text-[11px] font-bold shadow-sm hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1 mx-auto cursor-pointer" title="Confirmar asistencia y pago">' +
        '✓ Marcar Confirmado' +
        '</button>';

    html += '\
      <tr class="hover:bg-neutral-100/40 transition">\
        <td class="py-3 px-4 font-medium text-neutral-900">\
          <div class="flex items-center gap-2">\
            <div class="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-xs text-[#0C6059] border border-neutral-300 shrink-0">\
              ' + (c.pacienteNombre ? c.pacienteNombre.substring(0, 1) : 'P') + '\
            </div>\
            <div>\
              <span class="block font-bold text-neutral-900 text-xs">' + (c.pacienteNombre || 'Paciente') + '</span>\
              <span class="block text-[10px] text-neutral-600">DNI: ' + (c.pacienteDni || '-') + '</span>\
            </div>\
          </div>\
        </td>\
        <td class="py-3 px-3 text-xs text-neutral-700 font-medium">' + (c.tratamiento || 'Ortodoncia Metálica') + '</td>\
        <td class="py-3 px-3 whitespace-nowrap">\
          <span class="px-2.5 py-1 rounded-lg bg-[#0C6059]/15 text-[#0C6059] font-bold text-xs border border-[#0C6059]/30 flex items-center gap-1 w-fit">\
            🗓️ ' + mesTexto + '\
          </span>\
        </td>\
        <td class="py-3 px-3 text-xs text-neutral-700 font-mono whitespace-nowrap">' + (c.fechaCita || '-') + '</td>\
        <td class="py-3 px-3 whitespace-nowrap">\
          <span class="text-xs font-extrabold text-[#0C6059] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">S/ ' + cuotaNum.toFixed(2) + '</span>\
        </td>\
        <td class="py-3 px-3 max-w-xs">\
          <div class="text-[11px] text-[#79450B] italic truncate" title="' + (c.recado || 'Sin recado específico') + '">\
            💬 ' + (c.recado || 'Asistir puntual con higiene bucal previa.') + '\
          </div>\
        </td>\
        <td class="py-3 px-3 text-center whitespace-nowrap">\
          ' + badgeEstado + '\
        </td>\
        <td class="py-3 px-4 text-center whitespace-nowrap">\
          ' + btnAccion + '\
        </td>\
      </tr>\
    ';
  }

  tbody.innerHTML = html;
}

window.filtrarControlesSeguimiento = function(filtro) {
  filtroSeguimientoActual = filtro;
  var bTodos = document.getElementById('btnFiltroCtrlTodos');
  var bPend = document.getElementById('btnFiltroCtrlPend');
  var bConf = document.getElementById('btnFiltroCtrlConf');

  if (bTodos) bTodos.className = (filtro === 'TODOS') ? 'px-2.5 py-1 rounded-lg font-bold bg-[#0C6059] text-white transition' : 'px-2.5 py-1 rounded-lg font-medium text-neutral-600 hover:text-neutral-900 transition';
  if (bPend) bPend.className = (filtro === 'PENDIENTES') ? 'px-2.5 py-1 rounded-lg font-bold bg-[#0C6059] text-white transition' : 'px-2.5 py-1 rounded-lg font-medium text-neutral-600 hover:text-neutral-900 transition';
  if (bConf) bConf.className = (filtro === 'CONFIRMADOS') ? 'px-2.5 py-1 rounded-lg font-bold bg-[#0C6059] text-white transition' : 'px-2.5 py-1 rounded-lg font-medium text-neutral-600 hover:text-neutral-900 transition';

  renderControlesSeguimientoTable();
};

window.buscarEnListaControles = function() {
  renderControlesSeguimientoTable();
};

window.marcarControlConfirmadoBtn = async function(id) {
  try {
    var c = await ClinicaAPI.marcarControlConfirmado(id);
    if (typeof playGentleChime === 'function') playGentleChime();
    var mesNombre = c.mesControl || c.mes || 'este mes';
    var monto = parseFloat(c.montoPago !== undefined ? c.montoPago : (c.cuota || 120)).toFixed(2);
    showToast('¡Control Confirmado!', 'Control de ' + (c.pacienteNombre || 'paciente') + ' para ' + mesNombre + ' (S/ ' + monto + ') marcado como cumplido y asistido.');
    await reloadControlesSeguimiento();
    if (typeof reloadHistorialData === 'function') await reloadHistorialData();
  } catch (err) {
    alert("Error al confirmar control: " + err.message);
  }
};

function renderSeguimientosCards() {
  var container = document.getElementById('listaSeguimientosCards');
  var badge = document.getElementById('totalFichasBadge');
  if (badge) badge.textContent = (currentSeguimientos ? currentSeguimientos.length : 0) + ' Fichas Registradas';
  if (!container) return;

  if (!currentSeguimientos || currentSeguimientos.length === 0) {
    container.innerHTML = '<p class="text-xs text-neutral-600 py-6 text-center col-span-2">No hay fichas de seguimiento registradas aún.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < currentSeguimientos.length; i++) {
    var s = currentSeguimientos[i];
    var nombreSegEscaped = (s.pacienteNombre || 'Paciente').replace(/'/g, "\\'");
    html += '\
      <div class="dark-panel p-5 rounded-2xl border border-neutral-200 hover:border-[#0C6059]/40 transition space-y-3.5">\
        <div class="flex items-start justify-between pb-2 border-b border-neutral-200">\
          <div>\
            <span class="text-sm font-bold text-neutral-900 block">' + s.pacienteNombre + '</span>\
            <span class="text-xs text-[#0C6059] font-semibold">' + (s.tratamiento || 'Tratamiento Dental') + '</span>\
          </div>\
          <span class="text-[10px] text-neutral-600">Atendido por: ' + (s.odontologoNombre || 'Dr. Morales') + '</span>\
        </div>\
\
        <div class="space-y-1 text-xs">\
          <p class="text-neutral-700"><strong class="text-neutral-600">Diagnóstico:</strong> ' + (s.diagnostico || 'Evaluación integral') + '</p>\
          <p class="text-neutral-700"><strong class="text-neutral-600">Procedimiento realizado:</strong> ' + (s.procedimientoRealizado || 'Ajuste clínico') + '</p>\
        </div>\
\
        <!-- LOS 3 ELEMENTOS CLAVE SOLICITADOS: PRÓXIMA CITA + QUÉ MES + PAGO DE ESE MES -->\
        <div class="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">\
          <div>\
            <span class="text-[10px] text-neutral-600 block font-semibold">📅 Próxima Cita & Mes:</span>\
            <span class="text-neutral-900 font-bold">' + (s.proximaCitaSugerida || '18/12/2026') + '</span>\
            <span class="block text-[11px] text-[#0C6059] font-semibold">Mes: ' + (s.mesProximaCita || 'Diciembre 2026') + '</span>\
          </div>\
\
          <div>\
            <span class="text-[10px] text-neutral-600 block font-semibold">💰 Pago de ese Mes:</span>\
            <span class="text-[#0C6059] font-extrabold text-sm">S/ ' + parseFloat(s.montoPagoMes || 120).toFixed(2) + '</span>\
            <span class="block text-[10px] text-neutral-600">Cuota programada</span>\
          </div>\
        </div>\
\
        <!-- RECADO MÉDICO DE INDICACIONES PARA EL PACIENTE -->\
        <div class="p-3 rounded-xl bg-[#A56519]/10 border border-amber-500/30 text-xs space-y-1">\
          <div class="flex items-center gap-1.5 text-[#79450B] font-bold text-[11px]">\
            <span>📝</span> Recado del Doctor para el Paciente:\
          </div>\
          <p class="text-[#79450B] italic text-[11px]">\
            "' + (s.recadoIndicaciones || s.recetaIndicaciones || 'Seguir las pautas de higiene y reportar cualquier eventualidad.') + '"\
          </p>\
        </div>\
\
        ' + (currentRole === 'ODONTOLOGO' ? '\
          <div class="pt-1 flex justify-end">\
            <button type="button" onclick="irAOdontogramaDePaciente(\'' + nombreSegEscaped + '\')"\
                    class="text-[11px] font-bold text-[#0C6059] hover:underline flex items-center gap-1">\
              <span>🦷</span> Ver en Odontograma →\
            </button>\
          </div>\
        ' : '') + '\
      </div>\
    ';
  }

  container.innerHTML = html;
}

function actualizarSelectorPacientes() {
  var select = document.getElementById('segPacienteSelect');
  if (!select) return;

  var pacientesNombres = [];
  if (currentCitas) {
    for (var i = 0; i < currentCitas.length; i++) {
      var nom = currentCitas[i].pacienteNombre;
      if (nom && pacientesNombres.indexOf(nom) === -1) {
        pacientesNombres.push(nom);
      }
    }
  }
  if (currentBrackets) {
    for (var j = 0; j < currentBrackets.length; j++) {
      var nomB = currentBrackets[j].nombreCompleto;
      if (nomB && pacientesNombres.indexOf(nomB) === -1) {
        pacientesNombres.push(nomB);
      }
    }
  }

  if (pacientesNombres.length === 0) {
    select.innerHTML = '<option value="Paciente Demo 05">Paciente Demo 05</option>';
    return;
  }

  var options = '';
  for (var k = 0; k < pacientesNombres.length; k++) {
    options += '<option value="' + pacientesNombres[k] + '">' + pacientesNombres[k] + '</option>';
  }
  select.innerHTML = options;
}

// =====================================================================
// 5.1 MÓDULO 6 (ADMIN) / MÓDULO 3 (AYUDANTE): HISTORIAL CLÍNICO & EXPORTACIÓN
// DESCARGAS OFICIALES EN PDF, WORD (.DOC) Y EXCEL (.CSV)
// =====================================================================
async function reloadHistorialData() {
  try {
    currentControlesSeguimiento = await ClinicaAPI.getControlesSeguimiento();
  } catch (e) {
    currentControlesSeguimiento = [];
  }
  renderHistorialClinicoTable();
}

function renderHistorialClinicoTable() {
  var tbody = document.getElementById('tablaHistorialClinicoBody');
  var kpiAsist = document.getElementById('kpiHistorialAsistidas');
  var kpiProg = document.getElementById('kpiHistorialProgramadas');
  var kpiRec = document.getElementById('kpiHistorialRecaudado');
  var kpiTasa = document.getElementById('kpiHistorialTasa');

  var lista = currentControlesSeguimiento || [];
  var total = lista.length;
  var asistidas = 0;
  var recaudado = 0;

  for (var i = 0; i < total; i++) {
    if (lista[i].estado === 'CONFIRMADO') {
      asistidas++;
      recaudado += parseFloat(lista[i].cuota || 0);
    }
  }

  var tasa = total > 0 ? Math.round((asistidas / total) * 100) : 0;

  if (kpiAsist) kpiAsist.textContent = asistidas + ' Citas';
  if (kpiProg) kpiProg.textContent = (total - asistidas) + ' Citas';
  if (kpiRec) kpiRec.textContent = 'S/ ' + recaudado.toFixed(2);
  if (kpiTasa) kpiTasa.textContent = tasa + '%';

  if (!tbody) return;

  var searchInp = document.getElementById('inputBuscarHistorial');
  var busqueda = searchInp ? searchInp.value.toLowerCase().trim() : '';
  var selectTrat = document.getElementById('selectFiltroTratamientoHistorial');
  var tratFiltro = selectTrat ? selectTrat.value : 'TODOS';

  var filtrados = lista.filter(function(item) {
    if (tratFiltro !== 'TODOS') {
      if ((item.tratamiento || '').indexOf(tratFiltro) === -1) return false;
    }
    if (busqueda) {
      var n = (item.pacienteNombre || '').toLowerCase();
      var d = (item.pacienteDni || '').toLowerCase();
      var m = (item.mes || '').toLowerCase();
      var p = (item.procedimiento || '').toLowerCase();
      if (n.indexOf(busqueda) === -1 && d.indexOf(busqueda) === -1 && m.indexOf(busqueda) === -1 && p.indexOf(busqueda) === -1) {
        return false;
      }
    }
    return true;
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-xs text-neutral-600">No se encontraron registros en el historial con los criterios seleccionados.</td></tr>';
    return;
  }

  var html = '';
  for (var j = 0; j < filtrados.length; j++) {
    var c = filtrados[j];
    var isConf = (c.estado === 'CONFIRMADO');
    var badge = isConf
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-[#0C6059] border border-emerald-500/30">✓ Cumplido</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-[#79450B] border border-amber-500/30">⏳ Programado</span>';

    html += '\
      <tr class="hover:bg-neutral-100/40 transition">\
        <td class="py-3 px-4 font-medium text-neutral-900">\
          <span class="block font-bold text-xs">' + (c.pacienteNombre || '-') + '</span>\
          <span class="block text-[10px] text-neutral-600">DNI: ' + (c.pacienteDni || '-') + '</span>\
        </td>\
        <td class="py-3 px-3 text-xs text-neutral-700">' + (c.tratamiento || '-') + '</td>\
        <td class="py-3 px-3 text-center">\
          <span class="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-mono border border-neutral-300">\
            Control #' + (c.numeroControl || (j + 1)) + '\
          </span>\
        </td>\
        <td class="py-3 px-3 text-xs">\
          <span class="text-neutral-900 font-semibold block">' + (c.mes || '-') + '</span>\
          <span class="text-[10px] text-neutral-600">' + (c.fechaCita || '-') + '</span>\
        </td>\
        <td class="py-3 px-3 text-xs font-bold text-[#0C6059] whitespace-nowrap">S/ ' + parseFloat(c.cuota || 0).toFixed(2) + '</td>\
        <td class="py-3 px-3 text-xs text-neutral-700 max-w-xs truncate" title="' + (c.procedimiento || '-') + '">\
          ' + (c.procedimiento || '-') + '\
        </td>\
        <td class="py-3 px-3 text-center whitespace-nowrap">' + badge + '</td>\
        <td class="py-3 px-3 text-xs text-[#0C6059] font-medium">' + (c.odontologoNombre || 'Dr. Kevin Jhon Lindo Alfaro') + '</td>\
      </tr>\
    ';
  }

  tbody.innerHTML = html;
}

window.filtrarTablaHistorial = function() {
  renderHistorialClinicoTable();
};

// EXPORTACIÓN 1: PDF FORMAL CON MEMBRETE DE CARINO DENTAL STUDIO
window.exportarHistorialPDF = function() {
  var data = currentControlesSeguimiento || [];
  var total = data.length;
  var asistidas = 0;
  var recaudado = 0;
  for (var i = 0; i < total; i++) {
    if (data[i].estado === 'CONFIRMADO') {
      asistidas++;
      recaudado += parseFloat(data[i].cuota || 0);
    }
  }

  var filasHtml = '';
  for (var j = 0; j < data.length; j++) {
    var c = data[j];
    var isConf = (c.estado === 'CONFIRMADO');
    filasHtml += '<tr>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5; font-weight: bold;">' + (c.pacienteNombre || '-') + '<br><span style="font-size: 10px; color: #595959; font-weight: normal;">DNI: ' + (c.pacienteDni || '-') + '</span></td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5;">' + (c.tratamiento || '-') + '</td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5; text-align: center;">Control #' + (c.numeroControl || (j + 1)) + '</td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5;">' + (c.mes || '-') + '<br><span style="font-size: 10px; color: #595959;">' + (c.fechaCita || '-') + '</span></td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5; font-weight: bold; color: #0C6059;">S/ ' + parseFloat(c.cuota || 0).toFixed(2) + '</td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5; font-size: 11px;">' + (c.procedimiento || '-') + '</td>' +
      '<td style="padding: 8px 10px; border-bottom: 1px solid #E5E5E5; text-align: center;">' +
        (isConf ? '<span style="background: #dcfce7; color: #0C6059; font-weight: bold; padding: 3px 8px; border-radius: 9999px; font-size: 10px;">✓ ASISTIÓ / CUMPLIDO</span>'
                : '<span style="background: #fef3c7; color: #79450B; font-weight: bold; padding: 3px 8px; border-radius: 9999px; font-size: 10px;">⏳ PROGRAMADO</span>') +
      '</td>' +
    '</tr>';
  }

  var printWin = window.open('', '_blank', 'width=950,height=800');
  if (!printWin) {
    alert('Permite las ventanas emergentes en tu navegador para generar el reporte en PDF.');
    return;
  }

  printWin.document.write('<!DOCTYPE html><html><head><title>Historial Clínico - Carino Dental Studio</title>' +
    '<style>' +
    'body { font-family: "Segoe UI", Arial, sans-serif; color: #262626; margin: 0; padding: 30px; }' +
    '.header { border-bottom: 2px solid #0C6059; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }' +
    '.logo-title { font-size: 20px; font-weight: 800; color: #171717; letter-spacing: 1px; }' +
    '.logo-gold { color: #0C6059; }' +
    '.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }' +
    '.kpi-card { background: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 8px; padding: 10px; text-align: center; }' +
    '.kpi-val { font-size: 16px; font-weight: bold; color: #171717; margin-top: 4px; }' +
    'table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }' +
    'th { background: #171717; color: #ffffff; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }' +
    '.footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #595959; }' +
    '.seal { text-align: center; border-top: 1px solid #171717; width: 220px; padding-top: 6px; }' +
    '@media print { @page { margin: 15mm; } }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<div>' +
        '<div class="logo-title">CARINO <span class="logo-gold">DENTAL</span> STUDIO</div>' +
        '<div style="font-size: 12px; color: #595959; margin-top: 2px;">Clínica Odontológica Especializada • RUC: 20608945123</div>' +
        '<div style="font-size: 11px; color: #595959;">Jr. Bellido 245, Huamanga, Ayacucho • Central: +51 000 000 005</div>' +
      '</div>' +
      '<div style="text-align: right; font-size: 12px;">' +
        '<div style="font-weight: bold; color: #0C6059; text-transform: uppercase;">Informe Oficial de Controles</div>' +
        '<div>Fecha Emisión: ' + new Date().toLocaleDateString('es-PE') + '</div>' +
        '<div>Emitido por: ' + (currentRole === 'ODONTOLOGO' ? 'Dr. Kevin Jhon Lindo Alfaro' : 'Sofía Ramírez') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="kpi-grid">' +
      '<div class="kpi-card"><div style="font-size: 10px; color: #595959; text-transform: uppercase;">Total Asistencias</div><div class="kpi-val" style="color: #0C6059;">' + asistidas + ' Controles</div></div>' +
      '<div class="kpi-card"><div style="font-size: 10px; color: #595959; text-transform: uppercase;">Programadas</div><div class="kpi-val" style="color: #79450B;">' + (total - asistidas) + ' Controles</div></div>' +
      '<div class="kpi-card"><div style="font-size: 10px; color: #595959; text-transform: uppercase;">Recaudado Cuotas</div><div class="kpi-val">S/ ' + recaudado.toFixed(2) + '</div></div>' +
      '<div class="kpi-card"><div style="font-size: 10px; color: #595959; text-transform: uppercase;">Tasa Cumplimiento</div><div class="kpi-val" style="color: #35618A;">' + tasa + '%</div></div>' +
    '</div>' +
    '<table>' +
      '<thead><tr>' +
        '<th>Paciente / DNI</th><th>Tratamiento</th><th style="text-align:center;">Control</th><th>Mes & Fecha</th><th>Pago</th><th>Procedimiento</th><th style="text-align:center;">Estado</th>' +
      '</tr></thead>' +
      '<tbody>' + filasHtml + '</tbody>' +
    '</table>' +
    '<div class="footer">' +
      '<div>Documento clínico oficial respaldado por Carino Dental Studio. Registro auditable.</div>' +
      '<div class="seal">' +
        '<strong>Dr. Kevin Jhon Lindo Alfaro</strong><br>Cirujano Odontólogo - COP 34892 - RNE 12904<br>Director Clínico General' +
      '</div>' +
    '</div>' +
    '</body></html>');

  printWin.document.close();
  setTimeout(function() {
    printWin.focus();
    printWin.print();
  }, 400);
};

// EXPORTACIÓN 2: WORD (.DOC)
window.exportarHistorialWord = function() {
  var data = currentControlesSeguimiento || [];
  var total = data.length;
  var asistidas = 0;
  var recaudado = 0;
  for (var i = 0; i < total; i++) {
    if (data[i].estado === 'CONFIRMADO') {
      asistidas++;
      recaudado += parseFloat(data[i].cuota || 0);
    }
  }

  var filasHtml = '';
  for (var j = 0; j < data.length; j++) {
    var c = data[j];
    var isConf = (c.estado === 'CONFIRMADO');
    filasHtml += '<tr>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc; font-weight: bold;">' + (c.pacienteNombre || '-') + ' (DNI: ' + (c.pacienteDni || '-') + ')</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc;">' + (c.tratamiento || '-') + '</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc; text-align: center;">Control #' + (c.numeroControl || (j + 1)) + '</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc;">' + (c.mes || '-') + ' (' + (c.fechaCita || '-') + ')</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc; font-weight: bold;">S/ ' + parseFloat(c.cuota || 0).toFixed(2) + '</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc;">' + (c.procedimiento || '-') + '</td>' +
      '<td style="padding: 6px 8px; border: 1px solid #cccccc; text-align: center; font-weight: bold; color: ' + (isConf ? '#0C6059' : '#79450B') + ';">' + (isConf ? 'CUMPLIDO' : 'PENDIENTE') + '</td>' +
    '</tr>';
  }

  var content = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8"><title>Historial Clinico Carino Dental Studio</title>' +
    '<style>' +
    'body { font-family: Arial, sans-serif; font-size: 11pt; color: #333333; margin: 20pt; }' +
    'h1 { color: #171717; font-size: 18pt; margin-bottom: 2pt; }' +
    'h2 { color: #0C6059; font-size: 13pt; margin-top: 0; }' +
    'table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-top: 15pt; }' +
    'th { background-color: #171717; color: #ffffff; padding: 8px; border: 1px solid #171717; font-size: 10pt; text-align: left; }' +
    '</style></head><body>' +
    '<h1>CARINO DENTAL STUDIO</h1>' +
    '<h2>INFORME OFICIAL DE HISTORIAL CLÍNICO Y CONTROLES MENSUALES</h2>' +
    '<p><strong>Fecha de Generación:</strong> ' + new Date().toLocaleDateString('es-PE') + ' | <strong>Director Clínico:</strong> Dr. Kevin Jhon Lindo Alfaro (COP 34892 - RNE 12904)</p>' +
    '<p><strong>Resumen General:</strong> ' + asistidas + ' Asistencias Cumplidas de ' + total + ' Controles (' + (total > 0 ? Math.round((asistidas / total) * 100) : 0) + '% de cumplimiento). Total Recaudado: S/ ' + recaudado.toFixed(2) + '</p>' +
    '<table>' +
      '<thead><tr>' +
        '<th>Paciente</th><th>Tratamiento</th><th>Control</th><th>Mes / Fecha</th><th>Cuota</th><th>Procedimiento</th><th>Estado</th>' +
      '</tr></thead>' +
      '<tbody>' + filasHtml + '</tbody>' +
    '</table>' +
    '<br><br><p style="text-align: right;">___________________________________<br><strong>Dr. Kevin Jhon Lindo Alfaro</strong><br>Director Clínico - Carino Dental Studio</p>' +
    '</body></html>';

  var blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Historial_Clinico_Carino_Dental.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Archivo Word Generado', 'Se descargó "Historial_Clinico_Carino_Dental.doc" correctamente.');
};

// EXPORTACIÓN 3: EXCEL (.CSV CON BOM UTF-8)
window.exportarHistorialExcel = function() {
  var data = currentControlesSeguimiento || [];
  var csvRows = [
    ['ID', 'PACIENTE', 'DNI', 'TRATAMIENTO', 'NUMERO_CONTROL', 'MES', 'FECHA_CITA', 'CUOTA_SOLES', 'PROCEDIMIENTO', 'ESTADO_CONTROL', 'ATENDIDO_POR']
  ];

  for (var i = 0; i < data.length; i++) {
    var c = data[i];
    csvRows.push([
      c.id || (i + 1),
      '"' + (c.pacienteNombre || '').replace(/"/g, '""') + '"',
      '"' + (c.pacienteDni || '').replace(/"/g, '""') + '"',
      '"' + (c.tratamiento || '').replace(/"/g, '""') + '"',
      c.numeroControl || (i + 1),
      '"' + (c.mes || '').replace(/"/g, '""') + '"',
      '"' + (c.fechaCita || '').replace(/"/g, '""') + '"',
      parseFloat(c.cuota || 0).toFixed(2),
      '"' + (c.procedimiento || '').replace(/"/g, '""') + '"',
      '"' + (c.estado || 'PENDIENTE') + '"',
      '"' + (c.odontologoNombre || 'Dr. Kevin Jhon Lindo Alfaro').replace(/"/g, '""') + '"'
    ]);
  }

  var csvContent = '\uFEFF' + csvRows.map(function(row) { return row.join(';'); }).join('\r\n');
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Historial_Controles_Carino_Dental.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Archivo Excel Generado', 'Se descargó "Historial_Controles_Carino_Dental.csv" correctamente.');
};

window.irAOdontogramaDePaciente = function(pacienteNombre) {
  switchModule('modulo-odontograma');
  showToast('Odontograma Sincronizado', 'Visualizando ficha odontológica de ' + pacienteNombre);
};

// =====================================================================
// 6. MÓDULO 4: ODONTOGRAMA COMPLETO (32 PIEZAS DENTALES)
// =====================================================================
function initOdontogramaModule() {
  var selectPac = document.getElementById('selectOdontoPaciente');
  if (selectPac) {
    selectPac.addEventListener('change', async function(e) {
      selectedPacienteOdonto = e.target.value;
      await reloadOdontogramaData();
    });
  }

  var btnSync = document.getElementById('btnSincronizarSeguimiento');
  if (btnSync) {
    btnSync.addEventListener('click', async function() {
      var tooth = currentOdontograma[selectedPiezaDental] || { estado: 'SANO', detalle: 'Revisión normal' };
      var pacName = selectPac ? selectPac.options[selectPac.selectedIndex].text : "Paciente Seleccionado";
      
      try {
        await ClinicaAPI.guardarSeguimiento({
          pacienteNombre: pacName,
          tratamiento: "Hallazgo en Odontograma",
          diagnostico: 'Pieza ' + selectedPiezaDental + ': Estado ' + tooth.estado + '.',
          procedimientoRealizado: 'Evaluación detallada en odontograma: ' + (tooth.detalle || 'Revisión'),
          proximaCitaSugerida: "2026-12-18",
          mesProximaCita: "Diciembre 2026",
          montoPagoMes: 120.00,
          recadoIndicaciones: 'Cuidado específico en pieza ' + selectedPiezaDental + ' (' + tooth.estado + '). Evitar masticar alimentos de consistencia dura sobre esta pieza.'
        });
        await reloadSeguimientosData();
        showToast('Odontograma Sincronizado', 'La pieza ' + selectedPiezaDental + ' fue vinculada exitosamente con el Módulo de Seguimiento.');
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // Botones de cambio de estado de la pieza seleccionada
  var btnsCambio = document.querySelectorAll('.btn-diente-cambio');
  for (var i = 0; i < btnsCambio.length; i++) {
    (function(btn) {
      btn.addEventListener('click', async function() {
        var nuevoEstado = btn.getAttribute('data-estado');
        if (!currentOdontograma[selectedPiezaDental]) {
          currentOdontograma[selectedPiezaDental] = { estado: nuevoEstado, detalle: 'Actualizado' };
        } else {
          currentOdontograma[selectedPiezaDental].estado = nuevoEstado;
        }
        await ClinicaAPI.guardarOdontograma(selectedPacienteOdonto, currentOdontograma);
        renderArcadasDentales();
        actualizarPanelDienteSeleccionado();
        showToast('Pieza Dental Actualizada', 'Pieza ' + selectedPiezaDental + ' marcada como ' + nuevoEstado);
      });
    })(btnsCambio[i]);
  }
}

async function reloadOdontogramaData() {
  try {
    currentOdontograma = await ClinicaAPI.getOdontograma(selectedPacienteOdonto);
  } catch (e) {
    currentOdontograma = {};
  }
  renderArcadasDentales();
  actualizarPanelDienteSeleccionado();
}

function renderArcadasDentales() {
  var superior = document.getElementById('gridArcadaSuperior');
  var inferior = document.getElementById('gridArcadaInferior');

  var piezasSup = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  var piezasInf = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  if (superior) {
    var supHtml = '';
    for (var i = 0; i < piezasSup.length; i++) {
      supHtml += renderToothButtonHtml(piezasSup[i]);
    }
    superior.innerHTML = supHtml;
  }
  if (inferior) {
    var infHtml = '';
    for (var j = 0; j < piezasInf.length; j++) {
      infHtml += renderToothButtonHtml(piezasInf[j]);
    }
    inferior.innerHTML = infHtml;
  }
}

function renderToothButtonHtml(num) {
  var data = currentOdontograma[num] || { estado: 'SANO' };
  var est = (data.estado || 'SANO').toLowerCase();
  var isSelected = (selectedPiezaDental === num);

  return '\
    <button type="button" onclick="seleccionarPiezaDental(' + num + ')"\
            class="tooth-card ' + est + ' ' + (isSelected ? 'ring-2 ring-[#0E6A60] scale-105 shadow-lg' : '') + '"\
            title="Pieza ' + num + ': ' + data.estado + '">\
      <span class="text-[11px] font-mono font-bold text-neutral-700">' + num + '</span>\
      <span class="odontogram-tooth ' + est + '" data-pieza="' + num + '" aria-hidden="true"></span>\
      <span class="text-[8px] font-bold uppercase truncate max-w-[46px] odontogram-status">' + est + '</span>\
    </button>\
  ';
}

window.seleccionarPiezaDental = function(num) {
  selectedPiezaDental = num;
  renderArcadasDentales();
  actualizarPanelDienteSeleccionado();
};

function actualizarPanelDienteSeleccionado() {
  var badge = document.getElementById('badgeDienteNum');
  var txt = document.getElementById('txtDienteSeleccionado');
  var desc = document.getElementById('txtDienteEstadoDesc');
  var tooth = currentOdontograma[selectedPiezaDental] || { estado: 'SANO', detalle: 'Sin afección diagnosticada.' };

  if (badge) badge.textContent = selectedPiezaDental;
  if (txt) txt.textContent = selectedPiezaDental + ' (' + getNombreAnatomicoDiente(selectedPiezaDental) + ')';
  if (desc) {
    desc.textContent = 'Estado: ' + tooth.estado + ' • ' + (tooth.detalle || 'Sano');
    if (tooth.estado === 'CARIES') {
      desc.className = "text-[11px] text-[#9B2626] font-bold";
    } else if (tooth.estado === 'SANO') {
      desc.className = "text-[11px] text-[#0C6059] font-semibold";
    } else {
      desc.className = "text-[11px] text-[#0C6059] font-semibold";
    }
  }
}

function getNombreAnatomicoDiente(num) {
  var nombres = {
    18: "Tercer Molar Sup. Der.", 17: "Segundo Molar Sup. Der.", 16: "Primer Molar Sup. Der.",
    15: "Segundo Premolar Sup. Der.", 14: "Primer Premolar Sup. Der.", 13: "Canino Sup. Der.",
    12: "Incisivo Lateral Sup. Der.", 11: "Incisivo Central Sup. Der.",
    21: "Incisivo Central Sup. Izq.", 22: "Incisivo Lateral Sup. Izq.", 23: "Canino Sup. Izq.",
    24: "Primer Premolar Sup. Izq.", 25: "Segundo Premolar Sup. Izq.", 26: "Primer Molar Sup. Izq.",
    27: "Segundo Molar Sup. Izq.", 28: "Tercer Molar Sup. Izq.",
    48: "Tercer Molar Inf. Der.", 47: "Segundo Molar Inf. Der.", 46: "Primer Molar Inf. Der.",
    45: "Segundo Premolar Inf. Der.", 44: "Primer Premolar Inf. Der.", 43: "Canino Inf. Der.",
    42: "Incisivo Lateral Inf. Der.", 41: "Incisivo Central Inf. Der.",
    31: "Incisivo Central Inf. Izq.", 32: "Incisivo Lateral Inf. Izq.", 33: "Canino Inf. Izq.",
    34: "Primer Premolar Inf. Izq.", 35: "Segundo Premolar Inf. Izq.", 36: "Primer Molar Inf. Izq.",
    37: "Segundo Molar Inf. Izq.", 38: "Tercer Molar Inf. Izq."
  };
  return nombres[num] || "Pieza Dental";
}

// =====================================================================
// 7. MÓDULO 6: MI PERFIL (ADMIN: DR. MORALES | AYUDANTE: SOFÍA)
// =====================================================================
function initPerfilModule() {
  var form = document.getElementById('formMiPerfil');
  var btnPass = document.getElementById('btnTogglePerfilPass');
  var passInput = document.getElementById('perfilPasswordInput');

  if (btnPass && passInput) {
    btnPass.addEventListener('click', function() {
      passInput.type = (passInput.type === 'password') ? 'text' : 'password';
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('Perfil Actualizado con Éxito', 'Los cambios en tu cuenta institucional han sido guardados.');
    });
  }
}

function renderPerfilData() {
  var avatarBox = document.getElementById('perfilAvatarBox');
  var nombreH = document.getElementById('perfilNombreHeader');
  var rolBadge = document.getElementById('perfilRolBadge');
  var cargoDesc = document.getElementById('perfilCargoDesc');
  var emailH = document.getElementById('perfilEmailHeader');

  var nombreInp = document.getElementById('perfilNombreInput');
  var emailInp = document.getElementById('perfilEmailInput');
  var telInp = document.getElementById('perfilTelefonoInput');
  var passInp = document.getElementById('perfilPasswordInput');
  var copCont = document.getElementById('perfilColegiaturaContainer');
  var copInp = document.getElementById('perfilCopInput');
  var horInp = document.getElementById('perfilHorarioInput');

  if (currentRole === 'ODONTOLOGO') {
    if (avatarBox) {
      avatarBox.textContent = "GM";
      avatarBox.className = "w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#0C6059] to-[#0E6A60] text-white font-extrabold flex items-center justify-center text-3xl shadow-xl shrink-0";
    }
    if (nombreH) nombreH.textContent = "Dr. Kevin Jhon Lindo Alfaro";
    if (rolBadge) {
      rolBadge.textContent = "ADMINISTRADOR";
      rolBadge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0C6059]/20 text-[#0C6059] border border-[#0C6059]/40";
    }
    if (cargoDesc) cargoDesc.textContent = "Director Clínico & Cirujano Odontólogo (14 años de experiencia)";
    if (emailH) emailH.textContent = "admin@clinica.example";

    if (nombreInp) nombreInp.value = "Dr. Kevin Jhon Lindo Alfaro";
    if (emailInp) emailInp.value = "admin@clinica.example";
    if (telInp) telInp.value = "+51 000 000 005";
    if (passInp) passInp.value = "demo-odontologo";
    if (copCont) copCont.classList.remove('hidden');
    if (copInp) copInp.value = "COP 34892 - RNE 12904";
    if (horInp) horInp.value = "Lunes a Sábado: 09:00 AM - 07:00 PM";
  } else {
    if (avatarBox) {
      avatarBox.textContent = "SR";
      avatarBox.className = "w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#BBDDD6] to-[#EAF5F2] text-neutral-900 font-extrabold flex items-center justify-center text-3xl shadow-xl shrink-0";
    }
    if (nombreH) nombreH.textContent = "Sofía Ramírez";
    if (rolBadge) {
      rolBadge.textContent = "AYUDANTE";
      rolBadge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[#274E74] border border-blue-500/40";
    }
    if (cargoDesc) cargoDesc.textContent = "Asistente Dental & Recepción de Pacientes";
    if (emailH) emailH.textContent = "asistente@clinica.example";

    if (nombreInp) nombreInp.value = "Sofía Ramírez";
    if (emailInp) emailInp.value = "asistente@clinica.example";
    if (telInp) telInp.value = "+51 000 000 008";
    if (passInp) passInp.value = "demo-asistente";
    if (copCont) copCont.classList.add('hidden');
    if (horInp) horInp.value = "Lunes a Sábado: 08:30 AM - 06:30 PM";
  }
}

// =====================================================================
// 8. NOTIFICACIONES EN VIVO & CHIME SONORO (TOPBAR & SIDEBAR)
// =====================================================================
function initNotifications() {
  var btnTopbar = document.getElementById('btnNotificacionesTopbar');
  var dropdownTopbar = document.getElementById('dropdownNotificacionesTopbar');
  var btnLimpiarTopbar = document.getElementById('btnLimpiarNotifsTopbar');

  var btnSidebar = document.getElementById('btnNotificacionesSidebar');
  var dropdownSidebar = document.getElementById('dropdownNotificacionesSidebar');
  var btnLimpiarSidebar = document.getElementById('btnLimpiarNotifsSidebar');

  function bindDropdown(btn, dropdown) {
    if (!btn || !dropdown) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  bindDropdown(btnTopbar, dropdownTopbar);
  bindDropdown(btnSidebar, dropdownSidebar);

  function clearNotifications() {
    var lTop = document.getElementById('listaNotifsTopbar');
    var lSide = document.getElementById('listaNotifsSidebar');
    var bTop = document.getElementById('topbarNotifBadge');
    var bSide = document.getElementById('sidebarNotifBadge');

    if (lTop) lTop.innerHTML = '<p class="text-[11px] text-neutral-600 py-3 text-center">Bandeja al día.</p>';
    if (lSide) lSide.innerHTML = '<p class="text-[11px] text-neutral-600 py-3 text-center">Bandeja al día.</p>';
    if (bTop) bTop.classList.add('hidden');
    if (bSide) bSide.classList.add('hidden');
    DemoDatabase.saveNotificaciones([]);
    showToast('Bandeja Limpia', 'Se vaciaron las notificaciones.');
  }

  if (btnLimpiarTopbar) btnLimpiarTopbar.addEventListener('click', clearNotifications);
  if (btnLimpiarSidebar) btnLimpiarSidebar.addEventListener('click', clearNotifications);

  window.addEventListener('nueva-notificacion-cita', function(e) {
    playGentleChime();
    var notif = e.detail;
    showToast(notif.titulo, notif.mensaje);
    reloadNotificacionesData();
  });
}

async function reloadNotificacionesData() {
  var listaTopbar = document.getElementById('listaNotifsTopbar');
  var badgeTopbar = document.getElementById('topbarNotifBadge');
  var listaSidebar = document.getElementById('listaNotifsSidebar');
  var badgeSidebar = document.getElementById('sidebarNotifBadge');

  try {
    var notifs = await ClinicaAPI.getNotificaciones();
    var count = notifs ? notifs.length : 0;

    if (badgeTopbar) {
      if (count > 0) {
        badgeTopbar.textContent = count;
        badgeTopbar.classList.remove('hidden');
      } else {
        badgeTopbar.classList.add('hidden');
      }
    }
    if (badgeSidebar) {
      if (count > 0) {
        badgeSidebar.textContent = count;
        badgeSidebar.classList.remove('hidden');
      } else {
        badgeSidebar.classList.add('hidden');
      }
    }

    if (!notifs || notifs.length === 0) {
      var emptyMsg = '<p class="text-[11px] text-neutral-600 py-3 text-center">Bandeja al día.</p>';
      if (listaTopbar) listaTopbar.innerHTML = emptyMsg;
      if (listaSidebar) listaSidebar.innerHTML = emptyMsg;
      return;
    }

    var html = '';
    for (var i = 0; i < notifs.length; i++) {
      var n = notifs[i];
      html += '\
        <div class="p-2.5 rounded-xl bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200 text-[11px] space-y-1 transition">\
          <div class="flex items-center justify-between">\
            <span class="font-bold text-[#0C6059] truncate block">' + n.titulo + '</span>\
            <span class="text-[9px] text-neutral-600 shrink-0 font-mono">' + (n.horaRegistroStr || 'Reciente') + '</span>\
          </div>\
          <p class="text-neutral-700 text-[11px] leading-tight">' + n.mensaje + '</p>\
        </div>\
      ';
    }

    if (listaTopbar) listaTopbar.innerHTML = html;
    if (listaSidebar) listaSidebar.innerHTML = html;
  } catch (err) {
    // Silencioso
  }
}

// Simulador de nueva cita web interactivo
async function simularNuevaCitaWeb() {
  var hoyStr = new Date().toISOString().split('T')[0];
  var nombresPrueba = ["Patricia Mendoza", "Rodrigo Cárdenas", "Andrea Morales", "Víctor Alarcón"];
  var randomName = nombresPrueba[Math.floor(Math.random() * nombresPrueba.length)];

  try {
    var nueva = await ClinicaAPI.crearReserva({
      nombreCompleto: randomName,
      telefono: "+51 000 000 009",
      email: "paciente12@clinica.example",
      documentoIdentidad: "7" + Math.floor(1000000 + Math.random() * 9000000),
      tratamientoId: 2,
      fechaCita: hoyStr,
      horaCita: "16:15:00",
      motivoConsulta: "Evaluación solicitada desde la web"
    });

    await ClinicaAPI.crearNotificacion({
      titulo: '🔔 ¡Nueva Cita Agendada en Línea!',
      mensaje: randomName + ' acaba de reservar una cita para hoy a las 04:15 PM.',
      pacienteNombre: randomName,
      horaRegistroStr: new Date().toLocaleTimeString()
    });

    await reloadCitasData(hoyStr);
    playGentleChime();
    showToast('¡Nueva Cita Web Recibida!', randomName + ' ha reservado en tiempo real.');
  } catch (e) {
    alert(e.message);
  }
}

// Chime de audio suave usando Web Audio API
function playGentleChime() {
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    var ctx = new AudioContext();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Navegador sin permiso de audio
  }
}

// Toast Flotante (Desactivado para no mostrar carteles emergentes)
function showToast(title, message) {
  // Sin popups emergentes invasivos en pantalla
}

// Menú Móvil / Drawer
function initMobileDrawer() {
  var btnAbrir = document.getElementById('btnAbrirSidebarMobile');
  var btnCerrar = document.getElementById('btnCerrarSidebarMobile');
  var sidebar = document.getElementById('sidebarPortal');

  if (btnAbrir && sidebar) {
    btnAbrir.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.remove('-translate-x-full');
    });
  }
  if (btnCerrar && sidebar) {
    btnCerrar.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.add('-translate-x-full');
    });
  }
}

// Carga de todos los datos
async function reloadAllData() {
  var hoyStr = new Date().toISOString().split('T')[0];
  await reloadCitasData(hoyStr);
  await reloadBracketsData();
  await reloadSeguimientosData();
  await reloadControlesSeguimiento();
  await reloadHistorialData();
  await reloadOdontogramaData();
  await reloadNotificacionesData();
  renderAdminChatMessages();
}

// =====================================================================
// 9. CONSOLA DE CHAT EN VIVO CON CLIENTES (ADMIN & AYUDANTE)
// UBICADA EN LA ESQUINA INFERIOR DERECHA (EN EL MISMO LUGAR QUE EL CLIENTE)
// =====================================================================
function initAdminChatHub() {
  var btnFloating = document.getElementById('btnCarinoChatToggleAdmin');
  var btnTopbar = document.getElementById('btnAbrirChatAdmin');
  var chatWin = document.getElementById('carinoChatWindowAdmin');
  var btnCerrar = document.getElementById('btnCerrarModalChatAdmin');
  var btnExpand = document.getElementById('btnChatAdminExpand');
  var iconBubbles = document.getElementById('iconChatAdminBubbles');
  var iconClose = document.getElementById('iconChatAdminClose');
  var form = document.getElementById('formAdminResponderChat');
  var input = document.getElementById('inputAdminRespuestaChat');
  var chatExpanded = false;

  function toggleAdminChat(abrir) {
    if (!chatWin) return;
    var isHidden = chatWin.classList.contains('hidden');
    var force = (typeof abrir === 'boolean') ? abrir : isHidden;

    if (force) {
      chatWin.classList.remove('hidden');
      if (iconBubbles) iconBubbles.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
      var badge = document.getElementById('badgeChatAdminCount');
      if (badge) badge.classList.add('hidden');
      renderAdminChatMessages();
      setTimeout(function() {
        if (input) input.focus();
      }, 150);
    } else {
      chatWin.classList.add('hidden');
      if (iconBubbles) iconBubbles.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    }
  }

  if (btnFloating) {
    btnFloating.addEventListener('click', function() {
      toggleAdminChat();
    });
  }

  if (btnTopbar) {
    btnTopbar.addEventListener('click', function() {
      toggleAdminChat(true);
    });
  }

  if (btnCerrar) {
    btnCerrar.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleAdminChat(false);
    });
  }

  if (btnExpand) {
    btnExpand.addEventListener('click', function() {
      chatExpanded = !chatExpanded;
      if (chatExpanded) {
        chatWin.classList.add('sm:w-[560px]', 'sm:h-[680px]');
        chatWin.classList.remove('sm:w-[420px]', 'h-[560px]');
      } else {
        chatWin.classList.remove('sm:w-[560px]', 'sm:h-[680px]');
        chatWin.classList.add('sm:w-[420px]', 'h-[560px]');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var txt = input ? input.value.trim() : '';
      if (!txt) return;

      var remitenteNom = (currentRole === 'ODONTOLOGO')
        ? 'Dr. Kevin Jhon Lindo Alfaro (Cirujano Odontólogo)'
        : 'Sofía Ramírez (Recepción & Ayudante)';

      try {
        await ClinicaAPI.enviarMensajeChat({
          remitente: 'ADMIN',
          remitenteNombre: remitenteNom,
          texto: txt
        });

        if (input) input.value = '';
        renderAdminChatMessages();
        showToast('Respuesta Enviada', 'Tu mensaje fue enviado directamente al cliente en vivo.');
      } catch (err) {
        alert("Error al enviar mensaje: " + err.message);
      }
    });
  }

  // Escuchar mensajes entrantes de clientes
  window.addEventListener('nuevo-mensaje-chat', function(e) {
    var msg = e.detail;
    if (msg.remitente === 'CLIENTE') {
      playGentleChime();
      showToast('💬 Nuevo Mensaje de Cliente', (msg.clienteNombre || 'Cliente') + ': "' + msg.texto + '"');
      var badge = document.getElementById('badgeChatAdminCount');
      if (badge) badge.classList.remove('hidden');
    }
    renderAdminChatMessages();
  });

  window.addEventListener('storage', function(e) {
    if (e.key === 'demo_chat_mensajes') {
      renderAdminChatMessages();
    }
  });

  // Carga inicial
  renderAdminChatMessages();
}

function renderAdminChatMessages() {
  var container = document.getElementById('adminChatMessagesBody');
  if (!container || !window.ClinicaAPI) return;

  var mensajes = ClinicaAPI.getChatMensajes ? ClinicaAPI.getChatMensajes() : [];
  if (mensajes && typeof mensajes.then === 'function') {
    mensajes.then(function(res) {
      dibujarMensajesAdmin(container, res);
    });
  } else {
    dibujarMensajesAdmin(container, mensajes);
  }
}

function dibujarMensajesAdmin(container, mensajes) {
  if (!mensajes || mensajes.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-500 py-10 text-center">No hay mensajes recientes de clientes aún.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < mensajes.length; i++) {
    var m = mensajes[i];
    var esCliente = (m.remitente === 'CLIENTE');

    if (esCliente) {
      html += '\
        <div class="flex items-start gap-2.5 max-w-[85%]">\
          <div class="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow">\
            ' + (m.clienteNombre ? m.clienteNombre.substring(0, 1) : 'C') + '\
          </div>\
          <div class="p-3.5 rounded-2xl rounded-tl-sm bg-white text-black shadow-lg space-y-1">\
            <div class="flex items-center justify-between gap-3 border-b border-gray-200 pb-1">\
              <span class="text-xs font-bold text-black">' + (m.clienteNombre || 'Visitante Web') + '</span>\
              <span class="text-[9px] text-gray-500 font-mono">' + (m.horaStr || '') + '</span>\
            </div>\
            <p class="text-xs font-medium leading-relaxed pt-0.5">' + m.texto + '</p>\
            ' + (m.clienteTelefono ? '<div class="text-[9px] text-gray-600 font-mono">📱 Tel: ' + m.clienteTelefono + '</div>' : '') + '\
          </div>\
        </div>\
      ';
    } else {
      html += '\
        <div class="flex justify-end">\
          <div class="max-w-[85%] p-3.5 rounded-2xl rounded-tr-sm bg-[#262626] border border-white/20 text-white shadow-lg space-y-1">\
            <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-1">\
              <span class="text-[11px] font-bold text-[#90DDCF]">' + (m.remitenteNombre || 'Consultorio Clínico') + '</span>\
              <span class="text-[9px] text-gray-400 font-mono">' + (m.horaStr || '') + '</span>\
            </div>\
            <p class="text-xs leading-relaxed text-gray-200 pt-0.5">' + m.texto + '</p>\
          </div>\
        </div>\
      ';
    }
  }

  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

window.insertarPlantillaChatAdmin = function(texto) {
  var input = document.getElementById('inputAdminRespuestaChat');
  if (input) {
    input.value = texto;
    input.focus();
  }
};