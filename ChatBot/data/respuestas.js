/*
  BASE DE CONOCIMIENTO DEL CHATBOT
  --------------------------------
  Para añadir una nueva respuesta, copia uno de los objetos de RESPUESTAS,
  cambia su id, pregunta, palabrasClave, respuesta y sugerencias.

  - palabrasClave: términos que ayudan a localizar la respuesta.
  - respuesta: admite HTML sencillo, por ejemplo <strong>, <br> o <a>.
  - sugerencias: ids de otras respuestas relacionadas.
*/

const CONFIG_CHATBOT = {
  nombreCentro: "IES Fray Diego Tadeo González",

  mensajeBienvenida:
    "Hola. Soy el asistente informativo del IES Fray Diego Tadeo González. " +
    "Puedo ayudarte con información preprogramada del centro.",

  mensajeNoEncontrado:
    "No he encontrado una respuesta para esa consulta. " +
    "Prueba a escribirla de otra forma o utiliza uno de los temas disponibles.",

  accionesIniciales: [
    "recreos-tic",
    "problemas-educacyl"
  ]
};

const RESPUESTAS = [
  {
    id: "recreos-tic",
    pregunta: "¿Cuándo son los Recreos TIC?",
    palabrasClave: [
      "recreos tic",
      "recreo tic",
      "recreos",
      "ayuda informatica",
      "soporte informatico",
      "problemas informaticos",
      "cuando son los recreos tic",
      "horario recreos tic"
    ],
    respuesta:
      "Los <strong>Recreos TIC</strong> se realizan los " +
      "<strong>martes, jueves y viernes</strong>.<br><br>" +
      "Puedes acudir en cualquiera de estos dos periodos:<br>" +
      "• <strong>10:15 - 10:30</strong><br>" +
      "• <strong>12:15 - 12:35</strong><br><br>" +
      "Están pensados para resolver incidencias informáticas relacionadas con el centro, " +
      "por ejemplo problemas de acceso a Educacyl o con Microsoft Authenticator.",
    sugerencias: [
      "problemas-educacyl"
    ]
  },

  {
    id: "problemas-educacyl",
    pregunta: "Tengo problemas para acceder a Educacyl",
    palabrasClave: [
      "educacyl",
      "no puedo entrar",
      "no puedo acceder",
      "problemas educacyl",
      "clave educacyl",
      "contrasena educacyl",
      "password educacyl",
      "usuario educacyl",
      "authenticator",
      "microsoft authenticator"
    ],
    respuesta:
      "Si tienes problemas para acceder a <strong>Educacyl</strong> o con " +
      "<strong>Microsoft Authenticator</strong>, puedes acudir a los Recreos TIC para recibir ayuda.<br><br>" +
      "Consulta el horario de los Recreos TIC desde el botón que aparece a continuación.",
    sugerencias: [
      "recreos-tic"
    ]
  }
];
