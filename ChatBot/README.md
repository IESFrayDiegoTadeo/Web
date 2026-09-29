# Chatbot del IES Fray Diego Tadeo González

Chatbot estático para alojar en GitHub Pages e incrustar posteriormente en la web del centro mediante `iframe`.

## Características

- HTML, CSS y JavaScript puro.
- No utiliza ChatGPT, Gemini ni ninguna API externa.
- No requiere servidor ni base de datos.
- Respuestas 100 % preprogramadas.
- Permite escribir preguntas en texto libre.
- Usa palabras clave para localizar la respuesta adecuada.
- Incluye botones de preguntas frecuentes.
- Responsive para ordenador y móvil.
- Preparado para mostrarse dentro de un `iframe`.

## Archivos

- `index.html`: interfaz principal.
- `css/style.css`: estilos visuales.
- `js/chatbot.js`: motor del chatbot.
- `data/respuestas.js`: base de conocimiento editable.

## Añadir respuestas

Edita `data/respuestas.js`.

Cada respuesta tiene esta estructura:

```javascript
{
  id: "identificador-unico",
  pregunta: "Texto que aparecerá en los botones",
  palabrasClave: [
    "palabra o frase",
    "otra palabra"
  ],
  respuesta:
    "Texto de la respuesta. Puede contener HTML sencillo.",
  sugerencias: [
    "id-de-otra-respuesta"
  ]
}
```

## Publicación en GitHub Pages

Sube la carpeta completa al repositorio que utilices para GitHub Pages.

Si la carpeta publicada se llama `chatbot`, la dirección normalmente tendrá una forma similar a:

`https://USUARIO.github.io/REPOSITORIO/chatbot/`

o, según cómo esté configurado el repositorio:

`https://USUARIO.github.io/chatbot/`

## Ejemplo de iframe para Educacyl

```html
<iframe
  src="URL_DE_GITHUB_PAGES"
  width="100%"
  height="720"
  frameborder="0"
  loading="lazy"
  title="Asistente virtual del IES">
</iframe>
```

## Nota

El archivo `data/respuestas.js` contiene únicamente dos respuestas de prueba.
