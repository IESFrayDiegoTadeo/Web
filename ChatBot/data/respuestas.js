/*
  BASE DE CONOCIMIENTO DEL CHATBOT
  =================================

  Esta versión incorpora:
  - Categorías.
  - Conceptos generales (horario, acceso, ayuda...).
  - Contexto conversacional.
  - Respuestas contextuales cortas.
  - Sugerencias guiadas cuando una consulta es ambigua.

  Para añadir contenido normalmente solo tendrás que editar este archivo.
*/

const CONFIG_CHATBOT = {
  nombreCentro: "IES Fray Diego Tadeo González",

  mensajeBienvenida:
    "Hola. Soy el asistente informativo del IES Fray Diego Tadeo González. " +
    "Puedo ayudarte con información preprogramada del centro.",

  mensajeNoEncontrado:
    "No he podido identificar con seguridad qué información buscas. " +
    "Elige uno de los temas disponibles:",

  accionesIniciales: [
    "recreos-tic",
    "problemas-educacyl"
  ]
};


/*
  CONCEPTOS GENERALES
  -------------------
  No pertenecen a una única respuesta.

  Por ejemplo, "hora" o "horas" significan que el usuario pregunta
  por un HORARIO. El motor usa después el contexto para saber de qué.
*/
const CONCEPTOS = {
  horario: [
    "hora",
    "horas",
    "horario",
    "horarios",
    "cuando",
    "cuando es",
    "cuando son",
    "a que hora",
    "que hora",
    "que dias",
    "que dia",
    "dias"
  ],

  acceso: [
    "entrar",
    "acceder",
    "acceso",
    "login",
    "iniciar sesion",
    "no puedo entrar",
    "no puedo acceder"
  ],

  credenciales: [
    "usuario",
    "clave",
    "contrasena",
    "password",
    "credenciales",
    "he olvidado la clave",
    "no recuerdo la contrasena"
  ],

  ayuda: [
    "ayuda",
    "problema",
    "problemas",
    "incidencia",
    "incidencias",
    "soporte",
    "no funciona"
  ]
};


/*
  CATEGORÍAS
  ----------
  Se muestran como navegación guiada cuando el sistema no sabe
  con seguridad qué respuesta elegir.
*/
const CATEGORIAS = [
  {
    id: "tic",
    nombre: "Educacyl, acceso y soporte TIC",
    descripcion: "Acceso a Educacyl, Microsoft Authenticator y Recreos TIC."
  }
];


/*
  RESPUESTAS
  ----------

  Estructura recomendada:

  {
    id: "identificador-unico",
    pregunta: "Texto visible en botones",
    categoria: "id-categoria",

    temas: [
      "formas de mencionar el tema"
    ],

    palabrasClave: [
      "expresiones más concretas"
    ],

    conceptos: [
      "horario",
      "acceso"
    ],

    respuesta: "Respuesta principal",

    respuestasContextuales: {
      horario: "Respuesta específica si el usuario pregunta por el horario
                después de estar hablando de este tema."
    },

    sugerencias: [
      "id-de-otra-respuesta"
    ]
  }
*/

const RESPUESTAS = [
  {
    id: "recreos-tic",

    pregunta: "¿Cuándo son los Recreos TIC?",

    categoria: "tic",

    temas: [
      "recreos tic",
      "recreo tic",
      "recreos",
      "soporte tic",
      "ayuda informatica",
      "soporte informatico"
    ],

    palabrasClave: [
      "cuando son los recreos tic",
      "horario recreos tic",
      "horas recreos tic",
      "dias recreos tic",
      "problemas informaticos"
    ],

    conceptos: [
      "horario",
      "ayuda"
    ],

    respuesta:
      "Los <strong>Recreos TIC</strong> se realizan los " +
      "<strong>martes, jueves y viernes</strong>.<br><br>" +
      "Puedes acudir en cualquiera de estos dos periodos:<br>" +
      "• <strong>10:15 - 10:30</strong><br>" +
      "• <strong>12:15 - 12:35</strong><br><br>" +
      "Están pensados para resolver incidencias informáticas relacionadas con el centro, " +
      "por ejemplo problemas de acceso a Educacyl o con Microsoft Authenticator.",

    respuestasContextuales: {
      horario:
        "El horario de los <strong>Recreos TIC</strong> es:<br>" +
        "• <strong>martes, jueves y viernes</strong><br>" +
        "• <strong>10:15 - 10:30</strong><br>" +
        "• <strong>12:15 - 12:35</strong>",

      ayuda:
        "Los <strong>Recreos TIC</strong> están pensados para ayudar con incidencias " +
        "informáticas relacionadas con el centro, como problemas de acceso a Educacyl " +
        "o con Microsoft Authenticator."
    },

    sugerencias: [
      "problemas-educacyl"
    ]
  },

  {
    id: "problemas-educacyl",

    pregunta: "Tengo problemas para acceder a Educacyl",

    categoria: "tic",

    temas: [
      "educacyl",
      "microsoft authenticator",
      "authenticator",
      "acceso educacyl"
    ],

    palabrasClave: [
      "problemas educacyl",
      "no puedo entrar en educacyl",
      "no puedo acceder a educacyl",
      "clave educacyl",
      "contrasena educacyl",
      "password educacyl",
      "usuario educacyl",
      "problemas authenticator",
      "microsoft authenticator"
    ],

    conceptos: [
      "acceso",
      "credenciales",
      "ayuda"
    ],

    respuesta:
      "Si tienes problemas para acceder a <strong>Educacyl</strong> o con " +
      "<strong>Microsoft Authenticator</strong>, puedes acudir a los Recreos TIC para recibir ayuda.<br><br>" +
      "Puedes consultar el horario de los Recreos TIC desde el botón que aparece a continuación.",

    respuestasContextuales: {
      ayuda:
        "Para problemas de acceso a <strong>Educacyl</strong> o con " +
        "<strong>Microsoft Authenticator</strong>, puedes acudir a los Recreos TIC.",

      acceso:
        "Si no puedes acceder a <strong>Educacyl</strong>, puedes solicitar ayuda " +
        "durante los Recreos TIC.",

      credenciales:
        "Si el problema está relacionado con tu usuario, contraseña o credenciales de " +
        "<strong>Educacyl</strong>, puedes acudir a los Recreos TIC para recibir ayuda."
    },

    sugerencias: [
      "recreos-tic"
    ]
  }
];
