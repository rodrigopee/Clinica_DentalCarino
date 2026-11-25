/**
 * CARIÑO - CLÍNICA ODONTOLÓGICA
 * LÓGICA DE CLIENTE: MODAL DE RESERVA SIMPLIFICADO & NOTIFICACIONES EN VIVO
 */

document.addEventListener('DOMContentLoaded', () => {
  const botonesAbrirCita = document.querySelectorAll('[data-abrir-cita]');
  const btnCerrarModal = document.getElementById('btnCerrarModalCita');
  const modalCita = document.getElementById('modalAgendarCita');

  const formCita = document.getElementById('formCitaModal');
  const fechaInput = document.getElementById('modalFechaInput');
  const slotsContainer = document.getElementById('modalSlotsContainer');
  const slotsLoading = document.getElementById('modalSlotsLoading');

  const modalVoucher = document.getElementById('modalVoucherConfirm');
  const btnCerrarVoucher = document.getElementById('btnCerrarVoucher');

  let selectedHora = null;

  // 1. Menú de portada en pantallas pequeñas
  const menuMovil = document.getElementById('menuPortadaMovil');
  const resumenMenuMovil = menuMovil?.querySelector('summary');
  if (menuMovil && resumenMenuMovil) {
    menuMovil.addEventListener('click', (evento) => {
      if (evento.target.closest('nav a, nav button')) menuMovil.open = false;
    });
    menuMovil.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && menuMovil.open) {
        evento.preventDefault();
        menuMovil.open = false;
        resumenMenuMovil.focus();
      }
    });
    document.addEventListener('click', (evento) => {
      if (menuMovil.open && !menuMovil.contains(evento.target)) menuMovil.open = false;
    });
  }

  // 2. Control de Apertura y Cierre del Modal de Agendar Cita
  if (modalCita && formCita) {
    botonesAbrirCita.forEach((boton) => {
      boton.addEventListener('click', () => {
        modalCita.classList.remove('hidden');
        formCita.classList.remove('hidden');
        if (modalVoucher) modalVoucher.classList.add('hidden');
        renderizarHorarios();
      });
    });
  }

  if (btnCerrarModal && modalCita) {
    btnCerrarModal.addEventListener('click', () => {
      modalCita.classList.add('hidden');
    });
  }

  if (btnCerrarVoucher && modalCita) {
    btnCerrarVoucher.addEventListener('click', () => {
      modalCita.classList.add('hidden');
    });
  }

  // Cerrar al hacer clic fuera del modal
  if (modalCita) {
    modalCita.addEventListener('click', (e) => {
      if (e.target === modalCita) {
        modalCita.classList.add('hidden');
      }
    });
  }

  // 3. Configuración de Fecha por Defecto (Hoy)
  const hoyStr = new Date().toISOString().split('T')[0];
  if (fechaInput) {
    fechaInput.value = hoyStr;
    fechaInput.min = hoyStr;
    fechaInput.addEventListener('change', renderizarHorarios);
  }

  // 4. Renderizar Horarios Disponibles vs Ocupados (Sombreados de Negro)
  async function renderizarHorarios() {
    if (!fechaInput || !slotsContainer) return;
    const fecha = fechaInput.value;
    if (!fecha) return;

    selectedHora = null;
    slotsContainer.innerHTML = '';
    if (slotsLoading) slotsLoading.classList.remove('hidden');

    try {
      const slots = await ClinicaAPI.getDisponibilidad(fecha);
      if (slotsLoading) slotsLoading.classList.add('hidden');

      if (!slots || slots.length === 0) {
        slotsContainer.innerHTML = '<p class="text-xs text-neutral-600 py-3 col-span-full text-center">No hay horarios configurados para esta fecha.</p>';
        return;
      }

      slots.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `slot-btn ${slot.disponible ? 'disponible' : 'ocupado'}`;
        btn.dataset.hora = slot.hora;

        if (slot.disponible) {
          btn.innerHTML = `
            <span class="slot-time">${slot.horaFormateada}</span>
            <span class="slot-status-text">Disponible</span>
          `;
          btn.addEventListener('click', () => {
            document.querySelectorAll('#modalSlotsContainer .slot-btn.disponible').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedHora = slot.hora;
          });
        } else {
          // HORARIO OCUPADO MARCADO DE NEGRO / SOMBREADO
          btn.disabled = true;
          btn.title = slot.motivoNoDisponible || "Horario reservado";
          btn.innerHTML = `
            <span class="slot-time" style="color: #F5F5F5;">${slot.horaFormateada}</span>
            <span class="slot-status-text">Ocupado</span>
          `;
        }

        slotsContainer.appendChild(btn);
      });

    } catch (e) {
      if (slotsLoading) slotsLoading.classList.add('hidden');
      slotsContainer.innerHTML = `<p class="text-xs text-[#9B2626] py-3 col-span-full text-center">Error al consultar horarios: ${e.message}</p>`;
    }
  }

  // 5. Procesar Envío del Formulario (Solo Nombre, DNI y Teléfono)
  if (formCita) {
    formCita.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('modalNombreInput').value.trim();
      const dni = document.getElementById('modalDniInput').value.trim();
      const telefono = document.getElementById('modalTelefonoInput').value.trim();
      const motivo = document.getElementById('modalMotivoInput') ? document.getElementById('modalMotivoInput').value.trim() : '';
      const fecha = fechaInput.value;

      if (!selectedHora) {
        alert("Por favor, selecciona un horario disponible (en blanco y oro). Los turnos en negro ya están ocupados.");
        return;
      }

      const submitBtn = document.getElementById('btnConfirmarCita');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
        Registrando cita...
      `;

      // Calcular hora exacta en que el paciente registra
      const ahora = new Date();
      const horaRegistroStr = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      try {
        const payload = {
          nombreCompleto: nombre,
          documentoIdentidad: dni,
          telefono: telefono,
          tratamientoId: 1, // Evaluación General
          fechaCita: fecha,
          horaCita: selectedHora,
          motivoConsulta: motivo || "Evaluación odontológica general",
          origenReserva: 'WEB_CARINO',
          horaRegistro: horaRegistroStr
        };

        const res = await ClinicaAPI.crearReserva(payload);

        // Emitir notificación persistente para doctor y asistente con hora exacta y motivo/dolor
        const mensajeDetallado = motivo 
          ? `El paciente ${nombre} (DNI: ${dni}) agendó cita a las ${horaRegistroStr}. Motivo/Dolor: "${motivo}".`
          : `El paciente ${nombre} (DNI: ${dni}) agendó cita a las ${horaRegistroStr}.`;

        await ClinicaAPI.crearNotificacion({
          titulo: "¡Nueva Cita Registrada!",
          mensaje: mensajeDetallado,
          pacienteNombre: nombre,
          pacienteDni: dni,
          pacienteTelefono: telefono,
          fechaCita: fecha,
          horaCita: selectedHora,
          horaRegistroStr: horaRegistroStr
        });

        // Mostrar Voucher de Confirmación
        formCita.classList.add('hidden');
        modalVoucher.classList.remove('hidden');

        document.getElementById('confirmCodigo').textContent = res.codigoReserva || 'RES-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('confirmPaciente').textContent = nombre;
        document.getElementById('confirmDni').textContent = dni;
        document.getElementById('confirmTelefono').textContent = telefono;
        document.getElementById('confirmFechaHora').textContent = `${formatearFecha(fecha)} a las ${selectedHora.substring(0, 5)} hrs`;
        document.getElementById('confirmHoraRegistro').textContent = `${horaRegistroStr} (Registrado ahora)`;

        const confirmMotivo = document.getElementById('confirmMotivo');
        const confirmMotivoRow = document.getElementById('confirmMotivoRow');
        if (confirmMotivo && confirmMotivoRow) {
          if (motivo) {
            confirmMotivo.textContent = motivo;
            confirmMotivoRow.classList.remove('hidden');
          } else {
            confirmMotivoRow.classList.add('hidden');
          }
        }

        // Reset
        formCita.reset();
        selectedHora = null;

      } catch (err) {
        alert("Error al procesar reserva: " + (err.message || "Intente nuevamente"));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  function formatearFecha(iso) {
    if (!iso) return '';
    const p = iso.split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : iso;
  }

  // ===================================================================
  // 5. INICIO DE SESIÓN Y REGISTRO
  // ===================================================================
  const modalLogin = document.getElementById('modalLogin');
  const modalRegistro = document.getElementById('modalRegistro');

  const botonesAbrirLogin = document.querySelectorAll('[data-abrir-login]');
  const btnCerrarLogin = document.getElementById('btnCerrarModalLogin');

  const btnCerrarRegistro = document.getElementById('btnCerrarModalRegistro');

  const btnSwitchToRegister = document.getElementById('btnSwitchToRegister');
  const btnSwitchToLogin = document.getElementById('btnSwitchToLogin');

  const tabLoginPaciente = document.getElementById('tabLoginPaciente');
  const tabLoginStaff = document.getElementById('tabLoginStaff');
  const formLoginPaciente = document.getElementById('formLoginPaciente');
  const panelLoginStaff = document.getElementById('panelLoginStaff');

  let origenLogin = null;
  if (modalLogin) {
    botonesAbrirLogin.forEach((boton) => {
      boton.addEventListener('click', () => {
        origenLogin = menuMovil?.contains(boton) ? resumenMenuMovil : boton;
        modalLogin.classList.remove('hidden');
        btnCerrarLogin?.focus({ preventScroll: true });
      });
    });
  }
  if (btnCerrarLogin && modalLogin) {
    btnCerrarLogin.addEventListener('click', () => {
      modalLogin.classList.add('hidden');
      origenLogin?.focus({ preventScroll: true });
    });
  }
  if (btnCerrarRegistro && modalRegistro) {
    btnCerrarRegistro.addEventListener('click', () => {
      modalRegistro.classList.add('hidden');
    });
  }

  // Conmutadores entre login y registro
  if (btnSwitchToRegister && modalLogin && modalRegistro) {
    btnSwitchToRegister.addEventListener('click', () => {
      modalLogin.classList.add('hidden');
      modalRegistro.classList.remove('hidden');
    });
  }
  if (btnSwitchToLogin && modalLogin && modalRegistro) {
    btnSwitchToLogin.addEventListener('click', () => {
      modalRegistro.classList.add('hidden');
      modalLogin.classList.remove('hidden');
    });
  }

  // Envío de login unificado (reconoce Admin, Ayudante y Pacientes con Control Mensual o Registrados)
  const formLogin = document.getElementById('formLogin') || document.getElementById('formLoginPaciente');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const elCorreo = document.getElementById('loginCorreoInput');
      const elPass = document.getElementById('loginPasswordInput') || document.getElementById('loginPassInput');
      const correo = (elCorreo && elCorreo.value) ? elCorreo.value.trim().toLowerCase() : '';
      const pass = (elPass && elPass.value) ? elPass.value.trim() : '';

      if (!correo) {
        alert("Por favor ingresa tu correo electrónico.");
        return;
      }

      // 1. Rol Administrador / Odontólogo (6 Módulos)
      if (correo === 'admin@clinica.example') {
        window.location.href = 'admin.html?role=ODONTOLOGO';
        return;
      }

      // 2. Rol Ayudante / Asistente (3 Módulos)
      if (correo === 'asistente@clinica.example') {
        window.location.href = 'admin.html?role=AYUDANTE';
        return;
      }

      // 3. Revisar si es cliente de control mensual (brackets) creado por doctor/admin o paciente registrado
      try {
        const datos = await ClinicaAPI.getDatosPaciente(correo);
        if (datos && datos.paciente) {
          localStorage.setItem('sesion_paciente', JSON.stringify(datos.paciente));
          window.location.href = 'paciente.html?email=' + encodeURIComponent(correo);
          return;
        }
      } catch (err) {
        console.error(err);
      }

      // 4. Si es cualquier otro correo, guardar y abrir portal de paciente
      localStorage.setItem('sesion_paciente', JSON.stringify({ email: correo, nombreCompleto: correo.split('@')[0] }));
      window.location.href = 'paciente.html?email=' + encodeURIComponent(correo);
    });
  }

  // Envío de registro nuevo: crea cuenta e inmediatamente abre modal de Agendar Cita pre-rellenado
  const formRegistro = document.getElementById('formRegistroPaciente');
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const elNom = document.getElementById('regNombreInput');
      const elCor = document.getElementById('regCorreoInput');
      const elTel = document.getElementById('regTelefonoInput');
      const elDni = document.getElementById('regDniInput');
      const elPass = document.getElementById('regPasswordInput');

      const nombre = (elNom && elNom.value) ? elNom.value.trim() : 'Paciente';
      const correo = (elCor && elCor.value) ? elCor.value.trim().toLowerCase() : '';
      const telefono = (elTel && elTel.value) ? elTel.value.trim() : '';
      const dni = (elDni && elDni.value) ? elDni.value.trim() : '';
      const pass = (elPass && elPass.value) ? elPass.value.trim() : 'carino2026';

      try {
        // 1. Guardar usuario en base de datos
        await ClinicaAPI.registrarUsuario({
          nombreCompleto: nombre,
          email: correo,
          telefono: telefono,
          dni: dni,
          password: pass
        });

        // 2. Cerrar ventana modal de Registro
        if (modalRegistro) modalRegistro.classList.add('hidden');

        // 3. Abrir de inmediato la ventana modal de "Agendar tu Cita Dental"
        if (modalCita && formCita) {
          modalCita.classList.remove('hidden');
          formCita.classList.remove('hidden');
          if (modalVoucher) modalVoucher.classList.add('hidden');

          // 4. Pre-rellenar automáticamente los campos con los datos registrados
          const inputNom = document.getElementById('modalNombreInput');
          const inputDni = document.getElementById('modalDniInput');
          const inputTel = document.getElementById('modalTelefonoInput');
          if (inputNom) inputNom.value = nombre;
          if (inputDni) inputDni.value = dni;
          if (inputTel) inputTel.value = telefono;

          // 5. Cargar horarios disponibles en tiempo real
          renderizarHorarios();

          // 6. Mensaje de bienvenida amigable
          alert(`¡Cuenta creada con éxito, ${nombre}!\n\nHemos preparado tu reserva. Solo selecciona la fecha y el horario disponible que prefieras para confirmar tu cita.`);
        }
      } catch (err) {
        alert("Error al procesar el registro: " + (err.message || "Intente nuevamente"));
      }
    });
  }

  // Cerrar al hacer clic fuera del modal
  [modalLogin, modalRegistro].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.add('hidden');
      });
    }
  });
});
