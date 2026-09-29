# Chatbot del IES Fray Diego Tadeo González

Chatbot estático para GitHub Pages e integración mediante `iframe`.

## Versión actual

Esta versión funciona sin IA generativa y añade un sistema de conversación guiada:

- respuestas 100 % preprogramadas;
- búsqueda por tema y palabras clave;
- conceptos generales (`horario`, `acceso`, `credenciales`, `ayuda`...);
- contexto conversacional;
- desambiguación mediante botones;
- categorías para navegar cuando la consulta no se reconoce;
- respuestas contextuales a preguntas breves.

### Ejemplo

Si el usuario escribe:

`recreos`

el chatbot responde sobre los Recreos TIC y guarda ese tema como contexto.

Si después escribe:

`horas`

el sistema interpreta que pregunta por **el horario de los Recreos TIC**, en lugar de buscar la palabra "horas" de forma aislada.

Si el usuario escribe `horas` al comenzar una conversación, el sistema no presupone el tema: muestra las opciones relacionadas con horarios.

---

## Archivos principales

### `data/respuestas.js`

Es el archivo que normalmente tendrás que modificar para añadir contenido.

Contiene:

- `CONFIG_CHATBOT`
- `CONCEPTOS`
- `CATEGORIAS`
- `RESPUESTAS`

Cada respuesta puede indicar:

```javascript
{
  id: "recreos-tic",
  pregunta: "¿Cuándo son los Recreos TIC?",
  categoria: "tic",

  temas: [
    "recreos tic",
    "recreos"
  ],

  palabrasClave: [
    "horario recreos tic"
  ],

  conceptos: [
    "horario",
    "ayuda"
  ],

  respuesta: "Respuesta principal",

  respuestasContextuales: {
    horario: "Respuesta específica para una pregunta posterior sobre horarios"
  },

  sugerencias: [
    "problemas-educacyl"
  ]
}
```

### `js/chatbot.js`

Contiene el motor de conversación.

El orden de búsqueda es:

1. contexto de la conversación;
2. coincidencia directa;
3. conceptos generales;
4. sugerencias por proximidad;
5. navegación por categorías.

Normalmente no es necesario modificarlo al añadir nuevas preguntas.

---

## Publicación

Sube la carpeta completa a GitHub Pages.

Ejemplo:

```html
<iframe
  src="https://iesfraydiegotadeo.github.io/slider/chatbot-ies-fray-diego/"
  width="100%"
  height="720"
  frameborder="0"
  scrolling="yes"
  title="Asistente virtual del IES Fray Diego Tadeo González">
</iframe>
```

## Archivos que no cambian en esta versión

- `index.html`
- `css/style.css`
