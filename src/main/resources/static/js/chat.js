/**
 * CARINO DENTAL STUDIO - CHAT EN VIVO DE ATENCIÓN AL CLIENTE & DUDAS
 * Color: Blanco y Negro (Black & White Luxury)
 * Ubicación: Esquina inferior derecha (Floating Bottom-Right)
 * Permite al cliente resolver dudas y comunicarse en tiempo real con el Administrador (Dr. Morales / Asistente)
 */

(function() {
  'use strict';

  var chatWidgetInitialized = false;
  var chatWindowExpanded = false;
  var currentCliente = null;

  function obtenerIdentidadCliente() {
    // Si hay sesión de paciente registrada
    var sesion = localStorage.getItem('sesion_paciente');
    if (sesion) {
      try {
        var obj = JSON.parse(sesion);
        if (obj && (obj.nombreCompleto || obj.email)) {
          return {
            id: obj.id || 'paciente_' + (obj.dni || 'user'),
            nombre: obj.nombreCompleto || 'Paciente',
            telefono: obj.telefono || '',
            email: obj.email || ''
          };
        }
      } catch (e) {
        // Ignorar
      }
    }

    // Si es visitante web anónimo
    var anon = localStorage.getItem('chat_cliente_anonimo');
    if (anon) {
      try {
        return JSON.parse(anon);
      } catch (e) {
        // Ignorar
      }
    }

    var nuevoAnon = {
      id: 'visitante_' + Math.floor(1000 + Math.random() * 9000),
      nombre: 'Visitante Web',
      telefono: '',
      email: ''
    };
    localStorage.setItem('chat_cliente_anonimo', JSON.stringify(nuevoAnon));
    return nuevoAnon;
  }

  function renderChatWidgetHtml() {
    if (document.getElementById('carinoChatFloatingContainer')) return;

    var container = document.createElement('div');
    container.id = 'carinoChatFloatingContainer';
    container.className = 'fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans';

    // HTML del Botón Flotante y de la Ventana de Chat (en Blanco y Negro)
    container.innerHTML = '\
      <!-- VENTANA DE CHAT FLOTANTE (ESTILO BLANCO Y NEGRO) -->\
      <div id="carinoChatWindow" class="hidden mb-3 w-[92vw] sm:w-[380px] max-w-[400px] h-[520px] max-h-[82vh] bg-[#171717] text-white border-2 border-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden transition-all duration-300 animate-fade-in">\
        \
        <!-- CABECERA DEL CHAT (NEGRO CON DETALLES EN BLANCO) -->\
        <div class="bg-black border-b border-white/20 px-4 py-3.5 flex items-center justify-between shrink-0 select-none">\
          <div class="flex items-center gap-3">\
            <div class="relative w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-base shadow-md shrink-0">\
              <span>🦷</span>\
              <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" title="En línea"></span>\
            </div>\
            <div>\
              <div class="flex items-center gap-2">\
                <h3 class="text-sm font-bold text-white tracking-wide">Luzy</h3>\
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-black uppercase tracking-wider">Carino Studio</span>\
              </div>\
              <p class="text-[11px] text-gray-300 flex items-center gap-1.5">\
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>\
                En línea • Resolvemos tus dudas\
              </p>\
            </div>\
          </div>\
\
          <!-- BOTONES MINIMIZAR / EXPANDIR / CERRAR -->\
          <div class="flex items-center gap-1.5 text-gray-300">\
            <button id="btnChatExpand" type="button" class="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-150" title="Expandir">\
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path></svg>\
            </button>\
            <button id="btnChatClose" type="button" class="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-150" title="Cerrar chat">\
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>\
            </button>\
          </div>\
        </div>\
\
        <!-- MENSAJE DE IDENTIFICACIÓN DE PACIENTE (SI NO HA PUESTO SU NOMBRE) -->\
        <div id="panelIdentidadChat" class="bg-zinc-900 border-b border-white/10 px-3.5 py-2 text-xs flex items-center justify-between gap-2 shrink-0">\
          <div class="flex items-center gap-1.5 truncate">\
            <span class="text-gray-400 text-[11px]">Hablas como:</span>\
            <strong id="labelNombreClienteChat" class="text-white truncate font-semibold">Visitante Web</strong>\
          </div>\
          <button id="btnCambiarNombreChat" type="button" class="text-[10px] text-white underline hover:text-gray-300 shrink-0 transition">Cambiar datos</button>\
        </div>\
\
        <!-- CUERPO DE MENSAJES CON SCROLL -->\
        <div id="carinoChatMessagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#171717] text-xs">\
          \
          <!-- Burbuja de bienvenida Luzy 1 -->\
          <div class="flex items-start gap-2 max-w-[85%] animate-fade-in">\
            <div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">L</div>\
            <div class="p-3 rounded-2xl rounded-tl-sm bg-white text-black shadow-md space-y-1">\
              <p class="font-medium text-xs leading-relaxed">Hola ¿Te puedo ayudar?</p>\
            </div>\
          </div>\
\
          <!-- Burbuja de bienvenida Luzy 2 -->\
          <div class="flex items-start gap-2 max-w-[85%] animate-fade-in">\
            <div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">L</div>\
            <div class="p-3 rounded-2xl rounded-tl-sm bg-white text-black shadow-md space-y-1">\
              <p class="text-xs leading-relaxed">Soy Luzy de Carino Dental Studio. Te puedo ayudar a elegir tu tratamiento, consultar costos de brackets o comunicarte directamente con el Dr. Kevin Jhon Lindo Alfaro.</p>\
            </div>\
          </div>\
\
          <!-- PREGUNTAS RÁPIDAS EN BLANCO Y NEGRO (COMO EN LA IMAGEN DE REFERENCIA) -->\
          <div id="chatPreguntasRapidas" class="pt-2 space-y-1.5 max-w-[95%]">\
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Preguntas frecuentes:</span>\
            <button type="button" class="btn-pregunta-rapida w-full text-left px-3 py-2 rounded-xl bg-black border border-white text-white hover:bg-white hover:text-black font-semibold text-[11px] transition-all duration-200 shadow-sm block hover:translate-x-1" data-pregunta="¿Cómo puedo agendar una cita ahora mismo?">\
              ¿Cómo puedo agendar una cita ahora mismo?\
            </button>\
            <button type="button" class="btn-pregunta-rapida w-full text-left px-3 py-2 rounded-xl bg-black border border-white text-white hover:bg-white hover:text-black font-semibold text-[11px] transition-all duration-200 shadow-sm block hover:translate-x-1" data-pregunta="¿Cuánto cuesta el control mensual de brackets?">\
              ¿Cuánto cuesta el control mensual de brackets?\
            </button>\
            <button type="button" class="btn-pregunta-rapida w-full text-left px-3 py-2 rounded-xl bg-black border border-white text-white hover:bg-white hover:text-black font-semibold text-[11px] transition-all duration-200 shadow-sm block hover:translate-x-1" data-pregunta="Tengo una molestia o dolor dental urgente">\
              Tengo una molestia o dolor dental urgente\
            </button>\
            <button type="button" class="btn-pregunta-rapida w-full text-left px-3 py-2 rounded-xl bg-black border border-white text-white hover:bg-white hover:text-black font-semibold text-[11px] transition-all duration-200 shadow-sm block hover:translate-x-1" data-pregunta="Deseo comunicarme directamente con el Dr. Kevin Jhon Lindo Alfaro">\
              Deseo comunicarme con el Dr. Kevin Jhon Lindo Alfaro\
            </button>\
          </div>\
\
          <!-- Contenedor dinámico de mensajes -->\
          <div id="chatHistorialDinamico" class="space-y-3 pt-2"></div>\
\
        </div>\
\
        <!-- PIE DEL CHAT / CAJA DE TEXTO (BLANCO Y NEGRO) -->\
        <div class="p-3 bg-black border-t border-white/20 shrink-0">\
          <form id="formEnviarChatCliente" class="flex items-center gap-2">\
            <div class="flex-1 bg-zinc-900 border border-white/40 focus-within:border-white focus-within:ring-1 focus-within:ring-white rounded-2xl px-3 py-2 flex items-center gap-2 transition-all duration-150">\
              <button type="button" id="btnChatAdjunto" class="text-gray-400 hover:text-white transition" title="Adjuntar archivo o consulta">\
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>\
              </button>\
              <input type="text" id="inputMensajeChatCliente" required placeholder="Escribe tu consulta aquí..." class="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none">\
            </div>\
            <button type="submit" class="w-10 h-10 rounded-2xl bg-white text-black hover:bg-gray-200 active:scale-95 transition-all duration-150 flex items-center justify-center shrink-0 shadow-md font-bold" title="Enviar mensaje">\
              <svg class="w-4 h-4 rotate-90 transform ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>\
            </button>\
          </form>\
          <div class="text-[9px] text-gray-400 text-center mt-1.5">\
            Llega directo al consultorio del Dr. Kevin Jhon Lindo Alfaro\
          </div>\
        </div>\
      </div>\
\
      <!-- BOTÓN REDONDO FLOTANTE CON EL DIENTE DENTAL BONITO -->\
      <button id="btnCarinoChatToggle" type="button" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-slate-200 shadow-[0_10px_25px_rgba(15,23,42,0.18)] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 relative ml-auto group p-1" title="¿Tienes dudas? Chatea con nosotros">\
        <div id="iconChatBubbles" class="w-full h-full flex items-center justify-center">\
          <img src="img/chat-tooth.png" alt="Chat Dental" class="w-full h-full object-contain rounded-full transition-transform duration-200 group-hover:scale-105">\
        </div>\
        <div id="iconChatClose" class="hidden w-full h-full flex items-center justify-center bg-slate-900 rounded-full text-white">\
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>\
        </div>\
        <span id="badgeChatNoLeidos" class="hidden absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse shadow">1</span>\
      </button>\
    ';

    document.body.appendChild(container);
  }

  function initChatEvents() {
    var btnToggle = document.getElementById('btnCarinoChatToggle');
    var chatWin = document.getElementById('carinoChatWindow');
    var btnClose = document.getElementById('btnChatClose');
    var btnExpand = document.getElementById('btnChatExpand');
    var iconBubbles = document.getElementById('iconChatBubbles');
    var iconClose = document.getElementById('iconChatClose');
    var form = document.getElementById('formEnviarChatCliente');
    var input = document.getElementById('inputMensajeChatCliente');
    var btnCambiarNombre = document.getElementById('btnCambiarNombreChat');
    var labelNombre = document.getElementById('labelNombreClienteChat');

    if (!btnToggle || !chatWin) return;

    currentCliente = obtenerIdentidadCliente();
    if (labelNombre) labelNombre.textContent = currentCliente.nombre;

    function toggleChat(abrir) {
      var isHidden = chatWin.classList.contains('hidden');
      var force = (typeof abrir === 'boolean') ? abrir : isHidden;

      if (force) {
        chatWin.classList.remove('hidden');
        if (iconBubbles) iconBubbles.classList.add('hidden');
        if (iconClose) iconClose.classList.remove('hidden');
        var badge = document.getElementById('badgeChatNoLeidos');
        if (badge) badge.classList.add('hidden');
        renderHistorialMensajes();
        setTimeout(function() {
          if (input) input.focus();
        }, 150);
      } else {
        chatWin.classList.add('hidden');
        if (iconBubbles) iconBubbles.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
      }
    }

    btnToggle.addEventListener('click', function() {
      toggleChat();
    });

    if (btnClose) {
      btnClose.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleChat(false);
      });
    }

    if (btnExpand) {
      btnExpand.addEventListener('click', function() {
        chatWindowExpanded = !chatWindowExpanded;
        if (chatWindowExpanded) {
          chatWin.classList.add('sm:w-[500px]', 'sm:h-[650px]');
          chatWin.classList.remove('sm:w-[380px]', 'h-[520px]');
        } else {
          chatWin.classList.remove('sm:w-[500px]', 'sm:h-[650px]');
          chatWin.classList.add('sm:w-[380px]', 'h-[520px]');
        }
      });
    }

    if (btnCambiarNombre) {
      btnCambiarNombre.addEventListener('click', function() {
        var nuevoNom = prompt("¿Cómo te llamas para que el Dr. Morales te responda?", currentCliente.nombre);
        if (nuevoNom && nuevoNom.trim()) {
          currentCliente.nombre = nuevoNom.trim();
          var cel = prompt("Ingresa tu número de WhatsApp para contactarte:", currentCliente.telefono || "");
          if (cel) currentCliente.telefono = cel.trim();
          localStorage.setItem('chat_cliente_anonimo', JSON.stringify(currentCliente));
          if (labelNombre) labelNombre.textContent = currentCliente.nombre;
        }
      });
    }

    // Botones de preguntas rápidas
    var btnsRapidas = document.querySelectorAll('.btn-pregunta-rapida');
    for (var i = 0; i < btnsRapidas.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function() {
          var pregunta = btn.getAttribute('data-pregunta');
          if (pregunta) {
            enviarMensajeDesdeCliente(pregunta);
          }
        });
      })(btnsRapidas[i]);
    }

    // Envío del formulario
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var txt = input.value.trim();
        if (!txt) return;
        enviarMensajeDesdeCliente(txt);
        input.value = '';
      });
    }

    // Escuchar mensajes entrantes (del doctor/admin o respuestas)
    window.addEventListener('nuevo-mensaje-chat', function(e) {
      var msg = e.detail;
      renderHistorialMensajes();
      // Si el chat está cerrado y es del doctor, mostrar badge y chime
      if (chatWin.classList.contains('hidden') && msg.remitente === 'ADMIN') {
        var badge = document.getElementById('badgeChatNoLeidos');
        if (badge) badge.classList.remove('hidden');
        playChimeChat();
      }
    });

    // Escuchar eventos de storage si hay varias pestañas abiertas
    window.addEventListener('storage', function(e) {
      if (e.key === 'demo_chat_mensajes') {
        renderHistorialMensajes();
      }
    });
  }

  async function enviarMensajeDesdeCliente(texto) {
    if (!window.ClinicaAPI) return;

    try {
      // 1. Enviar el mensaje del cliente
      var enviado = await ClinicaAPI.enviarMensajeChat({
        clienteId: currentCliente.id,
        clienteNombre: currentCliente.nombre,
        clienteTelefono: currentCliente.telefono,
        remitente: 'CLIENTE',
        texto: texto
      });

      renderHistorialMensajes();

      // 2. Respuesta automática inteligente y amable de Luzy según la pregunta
      setTimeout(async function() {
        var respuestaAuto = null;
        var txtLower = texto.toLowerCase();

        if (txtLower.indexOf('agenda') !== -1 || txtLower.indexOf('cita') !== -1) {
          respuestaAuto = "¡Por supuesto! Puedes agendar tu cita presionando el botón 'Agendar Cita' en la página o elegir tu horario favorito. Ya le avisamos al Dr. Kevin Jhon Lindo Alfaro sobre tu interés.";
        } else if (txtLower.indexOf('bracket') !== -1 || txtLower.indexOf('cuota') !== -1 || txtLower.indexOf('precio') !== -1) {
          respuestaAuto = "En Carino Dental Studio el control mensual de brackets tiene una cuota de S/ 120.00 (metálicos) o S/ 160.00 (zafiro), incluyendo recambio de ligaduras, arco NiTi y profilaxis. Tu consulta ya llegó al doctor para darte más detalles.";
        } else if (txtLower.indexOf('urgencia') !== -1 || txtLower.indexOf('dolor') !== -1 || txtLower.indexOf('molestia') !== -1) {
          respuestaAuto = "🚨 Tomamos las urgencias con máxima prioridad. Acércate a nuestro consultorio en Jr. Bellido 245, Huamanga o llámanos al +51 000 000 005. El Dr. Kevin Jhon Lindo Alfaro está en alerta.";
        } else if (txtLower.indexOf('morales') !== -1 || txtLower.indexOf('doctor') !== -1) {
          respuestaAuto = "El Dr. Kevin Jhon Lindo Alfaro (COP 34892) ha recibido tu recado. Se conectará en breve a esta conversación para responderte de forma personalizada.";
        } else {
          respuestaAuto = "Gracias por escribir a Carino Dental Studio. Tu mensaje fue enviado con éxito al consultorio. El Dr. Kevin Jhon Lindo Alfaro o nuestra asistente te responderán aquí mismo.";
        }

        if (respuestaAuto) {
          await ClinicaAPI.enviarMensajeChat({
            clienteId: currentCliente.id,
            clienteNombre: currentCliente.nombre,
            remitente: 'ADMIN',
            remitenteNombre: 'Luzy • Asistente Carino Dental',
            texto: respuestaAuto
          });
          renderHistorialMensajes();
        }
      }, 700);

    } catch (err) {
      alert("Error al enviar mensaje: " + err.message);
    }
  }

  function renderHistorialMensajes() {
    var container = document.getElementById('chatHistorialDinamico');
    if (!container || !window.ClinicaAPI) return;

    var mensajes = ClinicaAPI.getChatMensajes ? ClinicaAPI.getChatMensajes() : [];
    // Si la función devuelve promesa, manejarla sincrónica si es mock
    if (mensajes && typeof mensajes.then === 'function') {
      mensajes.then(function(res) {
        mostrarMensajesHtml(container, res);
      });
    } else {
      mostrarMensajesHtml(container, mensajes);
    }
  }

  function mostrarMensajesHtml(container, mensajes) {
    if (!mensajes) return;
    var html = '';

    for (var i = 0; i < mensajes.length; i++) {
      var m = mensajes[i];
      var esCliente = (m.remitente === 'CLIENTE');

      if (esCliente) {
        // Mensaje enviado por el cliente (a la derecha, blanco con texto negro)
        html += '\
          <div class="flex justify-end">\
            <div class="max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-white text-black shadow-md space-y-1">\
              <p class="text-xs leading-relaxed font-medium">' + m.texto + '</p>\
              <div class="text-[9px] text-gray-500 text-right">' + (m.horaStr || '') + ' • Enviado</div>\
            </div>\
          </div>\
        ';
      } else {
        // Mensaje del doctor o asistente (a la izquierda, negro con borde blanco)
        html += '\
          <div class="flex items-start gap-2 max-w-[85%]">\
            <div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">\
              ' + (m.remitenteNombre ? m.remitenteNombre.substring(0, 1) : 'D') + '\
            </div>\
            <div class="p-3 rounded-2xl rounded-tl-sm bg-[#262626] border border-white/20 text-white shadow-md space-y-1">\
              <span class="text-[10px] font-bold text-[#90DDCF] block">' + (m.remitenteNombre || 'Dr. Kevin Jhon Lindo Alfaro') + '</span>\
              <p class="text-xs leading-relaxed text-gray-200">' + m.texto + '</p>\
              <div class="text-[9px] text-gray-400">' + (m.horaStr || '') + '</div>\
            </div>\
          </div>\
        ';
      }
    }

    container.innerHTML = html;

    // Scroll automático al final
    var scrollContainer = document.getElementById('carinoChatMessagesContainer');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  function playChimeChat() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      var ctx = new AudioContext();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Silencioso
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      renderChatWidgetHtml();
      initChatEvents();
    });
  } else {
    renderChatWidgetHtml();
    initChatEvents();
  }

  window.CarinoChat = {
    abrir: function() {
      var w = document.getElementById('carinoChatWindow');
      if (w) w.classList.remove('hidden');
    },
    cerrar: function() {
      var w = document.getElementById('carinoChatWindow');
      if (w) w.classList.add('hidden');
    }
  };

})();
