(() => {
  "use strict";

  const chatMessages = document.getElementById("chatMessages");
  const quickActions = document.getElementById("quickActions");
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");

  /*
    ESTADO DE LA CONVERSACIÓN
    -------------------------
    Permite interpretar mensajes cortos como:
      "horas"
      "y cuándo"
      "problemas"
    según el tema del que se estaba hablando.
  */
  const estado = {
    temaActual: null,
    categoriaActual: null
  };

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
    return RESPUESTAS.find((item) => item.id === id) || null;
  }

  function obtenerCategoriaPorId(id) {
    return CATEGORIAS.find((item) => item.id === id) || null;
  }

  function obtenerRespuestasDeCategoria(categoriaId) {
    return RESPUESTAS.filter((item) => item.categoria === categoriaId);
  }

  function crearBoton(texto, callback) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "quick-action";
    boton.textContent = texto;
    boton.addEventListener("click", callback);
    return boton;
  }

  function limpiarAcciones() {
    quickActions.innerHTML = "";
  }

  function mostrarAcciones(ids) {
    limpiarAcciones();

    ids
      .map(obtenerRespuestaPorId)
      .filter(Boolean)
      .forEach((item) => {
        quickActions.appendChild(
          crearBoton(item.pregunta, () => {
            agregarMensaje(item.pregunta, "user");
            responderCon(item);
          })
        );
      });
  }

  function mostrarCategorias() {
    limpiarAcciones();

    CATEGORIAS.forEach((categoria) => {
      quickActions.appendChild(
        crearBoton(categoria.nombre, () => {
          agregarMensaje(categoria.nombre, "user");
          mostrarTemasDeCategoria(categoria.id);
        })
      );
    });
  }

  function mostrarTemasDeCategoria(categoriaId) {
    const categoria = obtenerCategoriaPorId(categoriaId);
    const temas = obtenerRespuestasDeCategoria(categoriaId);

    estado.categoriaActual = categoriaId;

    if (categoria) {
      agregarMensaje(
        `${categoria.nombre}: elige la opción que mejor se ajuste a tu consulta.`,
        "bot"
      );
    }

    limpiarAcciones();

    temas.forEach((item) => {
      quickActions.appendChild(
        crearBoton(item.pregunta, () => {
          agregarMensaje(item.pregunta, "user");
          responderCon(item);
        })
      );
    });
  }

  function detectarConceptos(consulta) {
    const q = normalizar(consulta);
    const encontrados = [];

    Object.entries(CONCEPTOS).forEach(([concepto, expresiones]) => {
      const coincide = expresiones.some((expresion) => {
        const e = normalizar(expresion);
        return q === e || q.includes(e);
      });

      if (coincide) {
        encontrados.push(concepto);
      }
    });

    return encontrados;
  }

  function puntuarConsulta(consulta, item) {
    const q = normalizar(consulta);
    if (!q) return 0;

    let puntuacion = 0;
    const palabrasConsulta = new Set(q.split(" ").filter(Boolean));

    const pregunta = normalizar(item.pregunta);

    if (q === pregunta) {
      puntuacion += 100;
    } else if (q.includes(pregunta) || pregunta.includes(q)) {
      puntuacion += 10;
    }

    (item.temas || []).forEach((tema) => {
      const t = normalizar(tema);

      if (q === t) {
        puntuacion += 30;
      } else if (q.includes(t)) {
        puntuacion += t.includes(" ") ? 16 : 9;
      } else {
        const palabrasTema = t.split(" ").filter(Boolean);
        let coincidencias = 0;

        palabrasTema.forEach((palabra) => {
          if (palabrasConsulta.has(palabra)) {
            coincidencias++;
          }
        });

        puntuacion += coincidencias * 3;
      }
    });

    (item.palabrasClave || []).forEach((clave) => {
      const k = normalizar(clave);

      if (q === k) {
        puntuacion += 25;
      } else if (q.includes(k)) {
        puntuacion += k.includes(" ") ? 12 : 6;
      } else {
        const palabrasClave = k.split(" ").filter(Boolean);
        let coincidencias = 0;

        palabrasClave.forEach((palabra) => {
          if (palabrasConsulta.has(palabra)) {
            coincidencias++;
          }
        });

        puntuacion += coincidencias * 2;
      }
    });

    return puntuacion;
  }

  function buscarResultados(consulta) {
    return RESPUESTAS
      .map((item) => ({
        item,
        puntuacion: puntuarConsulta(consulta, item)
      }))
      .sort((a, b) => b.puntuacion - a.puntuacion);
  }

  function intentarRespuestaContextual(consulta) {
    if (!estado.temaActual) {
      return false;
    }

    const item = obtenerRespuestaPorId(estado.temaActual);
    if (!item) {
      return false;
    }

    const conceptos = detectarConceptos(consulta);
    if (conceptos.length === 0) {
      return false;
    }

    for (const concepto of conceptos) {
      if (
        item.respuestasContextuales &&
        item.respuestasContextuales[concepto]
      ) {
        agregarMensaje(
          item.respuestasContextuales[concepto],
          "bot",
          true
        );

        if (Array.isArray(item.sugerencias) && item.sugerencias.length > 0) {
          mostrarAcciones(item.sugerencias);
        }

        return true;
      }
    }

    /*
      Si el concepto pertenece al tema actual pero no tiene una respuesta
      contextual específica, devolvemos la respuesta principal.
    */
    const perteneceAlTema = conceptos.some((concepto) =>
      (item.conceptos || []).includes(concepto)
    );

    if (perteneceAlTema) {
      responderCon(item);
      return true;
    }

    return false;
  }

  function candidatosPorConceptos(conceptos) {
    if (conceptos.length === 0) {
      return [];
    }

    return RESPUESTAS.filter((item) =>
      conceptos.some((concepto) =>
        (item.conceptos || []).includes(concepto)
      )
    );
  }

  function mostrarDesambiguacion(candidatos, texto = null) {
    const unicos = [];
    const vistos = new Set();

    candidatos.forEach((item) => {
      if (!vistos.has(item.id)) {
        vistos.add(item.id);
        unicos.push(item);
      }
    });

    if (unicos.length === 0) {
      mostrarNavegacionGeneral();
      return;
    }

    agregarMensaje(
      texto || "No estoy seguro de qué tema quieres consultar. ¿Te refieres a alguno de estos?",
      "bot"
    );

    limpiarAcciones();

    unicos.slice(0, 5).forEach((item) => {
      quickActions.appendChild(
        crearBoton(item.pregunta, () => {
          agregarMensaje(item.pregunta, "user");
          responderCon(item);
        })
      );
    });

    quickActions.appendChild(
      crearBoton("Ver todos los temas", () => {
        agregarMensaje("Ver todos los temas", "user");
        mostrarNavegacionGeneral();
      })
    );
  }

  function mostrarNavegacionGeneral() {
    agregarMensaje(CONFIG_CHATBOT.mensajeNoEncontrado, "bot");
    mostrarCategorias();
  }

  function responderCon(item) {
    estado.temaActual = item.id;
    estado.categoriaActual = item.categoria || null;

    window.setTimeout(() => {
      agregarMensaje(item.respuesta, "bot", true);

      if (Array.isArray(item.sugerencias) && item.sugerencias.length > 0) {
        mostrarAcciones(item.sugerencias);
      } else {
        mostrarAcciones(CONFIG_CHATBOT.accionesIniciales);
      }
    }, 140);
  }

  function procesarPregunta(texto) {
    const consulta = String(texto || "").trim();
    if (!consulta) return;

    agregarMensaje(consulta, "user");
    userInput.value = "";

    /*
      NIVEL 1: CONTEXTO
      -----------------
      Si veníamos hablando de Recreos TIC y el usuario escribe "horas",
      primero se interpreta dentro de ese tema.
    */
    if (intentarRespuestaContextual(consulta)) {
      return;
    }

    /*
      NIVEL 2: BÚSQUEDA DIRECTA
      -------------------------
      Coincidencia suficientemente clara con una respuesta.
    */
    const resultados = buscarResultados(consulta);
    const mejor = resultados[0];
    const segundo = resultados[1];

    if (
      mejor &&
      mejor.puntuacion >= 9 &&
      (
        !segundo ||
        mejor.puntuacion >= segundo.puntuacion + 3
      )
    ) {
      responderCon(mejor.item);
      return;
    }

    /*
      NIVEL 3: DESAMBIGUACIÓN POR CONCEPTOS
      --------------------------------------
      "horas" sin contexto no pertenece a un único tema.
      Buscamos respuestas relacionadas con el concepto "horario"
      y ofrecemos opciones.
    */
    const conceptos = detectarConceptos(consulta);
    const candidatosConceptuales = candidatosPorConceptos(conceptos);

    if (candidatosConceptuales.length > 0) {
      mostrarDesambiguacion(
        candidatosConceptuales,
        "La consulta parece estar relacionada con estos temas. ¿Cuál quieres consultar?"
      );
      return;
    }

    /*
      NIVEL 4: SUGERENCIAS POR PROXIMIDAD
      -----------------------------------
      Si la consulta no alcanza el umbral para responder directamente,
      pero hay resultados con alguna coincidencia, ofrecemos opciones.
    */
    const candidatosProximos = resultados
      .filter((resultado) => resultado.puntuacion >= 2)
      .slice(0, 4)
      .map((resultado) => resultado.item);

    if (candidatosProximos.length > 0) {
      mostrarDesambiguacion(candidatosProximos);
      return;
    }

    /*
      NIVEL 5: NAVEGACIÓN GUIADA
      --------------------------
      Si no sabemos qué quiere decir, nunca terminamos simplemente con
      "no tengo información": mostramos las categorías disponibles.
    */
    mostrarNavegacionGeneral();
  }

  chatForm.addEventListener("submit", (evento) => {
    evento.preventDefault();
    procesarPregunta(userInput.value);
  });

  agregarMensaje(CONFIG_CHATBOT.mensajeBienvenida, "bot");
  mostrarAcciones(CONFIG_CHATBOT.accionesIniciales);
})();
