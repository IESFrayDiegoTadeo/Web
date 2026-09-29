(() => {
  "use strict";

  const chatMessages = document.getElementById("chatMessages");
  const quickActions = document.getElementById("quickActions");
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");

  function normalizar(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!.,;:()[\]{}"'`´]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  function agregarMensaje(contenido, tipo = "bot", permitirHTML = false) {
    const fila = document.createElement("div");
    fila.className = `message ${tipo}`;

    const burbuja = document.createElement("div");
    burbuja.className = "bubble";

    if (permitirHTML) {
      burbuja.innerHTML = contenido;
    } else {
      burbuja.innerHTML = escaparHTML(contenido);
    }

    fila.appendChild(burbuja);
    chatMessages.appendChild(fila);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function obtenerRespuestaPorId(id) {
    return RESPUESTAS.find((item) => item.id === id);
  }

  function mostrarAcciones(ids) {
    quickActions.innerHTML = "";

    const respuestas = ids
      .map(obtenerRespuestaPorId)
      .filter(Boolean);

    respuestas.forEach((item) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "quick-action";
      boton.textContent = item.pregunta;

      boton.addEventListener("click", () => {
        agregarMensaje(item.pregunta, "user");
        responderCon(item);
      });

      quickActions.appendChild(boton);
    });
  }

  function puntuarConsulta(consulta, item) {
    const q = normalizar(consulta);
    if (!q) return 0;

    let puntuacion = 0;

    const preguntaNormalizada = normalizar(item.pregunta);

    if (q === preguntaNormalizada) {
      puntuacion += 100;
    }

    if (preguntaNormalizada.includes(q) || q.includes(preguntaNormalizada)) {
      puntuacion += 12;
    }

    item.palabrasClave.forEach((clave) => {
      const k = normalizar(clave);

      if (!k) return;

      if (q === k) {
        puntuacion += 20;
        return;
      }

      if (q.includes(k)) {
        puntuacion += k.includes(" ") ? 10 : 5;
      }

      const palabrasClave = k.split(" ").filter(Boolean);
      const palabrasConsulta = new Set(q.split(" "));

      let coincidencias = 0;
      palabrasClave.forEach((palabra) => {
        if (palabrasConsulta.has(palabra)) coincidencias++;
      });

      if (palabrasClave.length > 0) {
        puntuacion += coincidencias * 2;
      }
    });

    return puntuacion;
  }

  function buscarMejorRespuesta(consulta) {
    const resultados = RESPUESTAS
      .map((item) => ({
        item,
        puntuacion: puntuarConsulta(consulta, item)
      }))
      .sort((a, b) => b.puntuacion - a.puntuacion);

    const mejor = resultados[0];

    // Umbral deliberadamente prudente para evitar respuestas incorrectas.
    if (!mejor || mejor.puntuacion < 4) {
      return null;
    }

    return mejor.item;
  }

  function responderCon(item) {
    window.setTimeout(() => {
      agregarMensaje(item.respuesta, "bot", true);

      if (Array.isArray(item.sugerencias) && item.sugerencias.length > 0) {
        mostrarAcciones(item.sugerencias);
      } else {
        mostrarAcciones(CONFIG_CHATBOT.accionesIniciales);
      }
    }, 180);
  }

  function procesarPregunta(texto) {
    const consulta = String(texto || "").trim();

    if (!consulta) return;

    agregarMensaje(consulta, "user");
    userInput.value = "";

    const respuesta = buscarMejorRespuesta(consulta);

    if (respuesta) {
      responderCon(respuesta);
    } else {
      window.setTimeout(() => {
        agregarMensaje(CONFIG_CHATBOT.mensajeNoEncontrado, "bot");
        mostrarAcciones(CONFIG_CHATBOT.accionesIniciales);
      }, 180);
    }
  }

  chatForm.addEventListener("submit", (evento) => {
    evento.preventDefault();
    procesarPregunta(userInput.value);
  });

  // Inicio del chatbot.
  agregarMensaje(CONFIG_CHATBOT.mensajeBienvenida, "bot");
  mostrarAcciones(CONFIG_CHATBOT.accionesIniciales);
})();
