/**
 * ============================================================
 *  CONFIG.JS — Invitación de María Agustina & Ignacio
 * ============================================================
 *  Único archivo que se edita para esta boda. Datos tomados del
 *  cuestionario que completaron (noviembre 2026).
 * ============================================================
 */

const WEDDING_CONFIG = {

  // ------------------------------------------------------------
  // META (lo que se ve al compartir el link por WhatsApp)
  // Cuando esté el dominio, completar url y poner ogImage absoluta
  // (ej. https://agusypancu.com.ar/assets/fotos/portada.jpg)
  // ------------------------------------------------------------
  meta: {
    pageTitle: "María Agustina & Ignacio · 10 de abril de 2027",
    description: "Nos casamos y queremos compartir este día con vos. Toda la información de la ceremonia, la fiesta y cómo confirmar tu asistencia.",
    ogImage: "https://agusypancu.com.ar/assets/fotos/portada.jpg",
    url: "https://agusypancu.com.ar/",
    favicon: "assets/favicon.svg"
  },

  // ------------------------------------------------------------
  // PAREJA
  // ------------------------------------------------------------
  couple: {
    brideName: "María Agustina",
    groomName: "Ignacio",
    // Sello del sobre y pie: "I · A", como su logo
    brideInitial: "I",
    groomInitial: "A",
    monogramSeparator: "·",
    weddingDate: "2027-04-10T15:30:00",
    weddingDateLabel: "10 de abril de 2027",
    heroPhrase: "Un sí a lo que somos y a todo lo que viene.",
    heroImage: "assets/fotos/portada.jpg"
  },

  // ------------------------------------------------------------
  // SOBRE DE APERTURA
  // ------------------------------------------------------------
  intro: {
    enabled: true,
    eyebrow: "Tenés una invitación",
    hint: "Tocá el sello para abrir"
  },

  // ------------------------------------------------------------
  // COLORES — paleta de la pareja (marfil, chocolate, borgoña, champagne)
  // ------------------------------------------------------------
  colors: {
    background: "#F6F2EC",   // marfil
    ink: "#3B2A22",          // chocolate
    primary: "#3B2A22",      // chocolate: botones, franja de la cuenta regresiva, sobre
    accent: "#6B1E2B",       // borgoña: lacre, detalles y filetes
    blush: "#E7D8C2",        // champagne: pétalos
    surface: "#FFFDF9",
    envelope: "#3B2A22"      // sobre chocolate, como en su mockup
  },

  // ------------------------------------------------------------
  // TIPOGRAFÍAS — Yeseva One (alternativa a Recoleta) + Inter
  // ------------------------------------------------------------
  fonts: {
    display: "Yeseva One",
    body: "Inter",
    italic: false // Yeseva One no tiene cursiva
  },

  // ------------------------------------------------------------
  // MÚSICA — arranca al abrir el sobre. "Run Together" de Mumford & Sons
  // desde el segundo 45: el archivo ya está recortado de 0:45 a 2:28
  // (sacado del video que mandaron), así que no hace falta startAt
  // ------------------------------------------------------------
  music: {
    enabled: true,
    src: "assets/run-together.mp3",
    playOnOpen: true,
    volume: 0.7,
    title: "Run Together · Mumford & Sons"
  },

  // ------------------------------------------------------------
  // NUESTRA HISTORIA — pidieron que no vaya
  // ------------------------------------------------------------
  story: {
    enabled: false,
    title: "",
    text: "",
    image: ""
  },

  // ------------------------------------------------------------
  // GALERÍA — en blanco y negro, como pidieron
  // ------------------------------------------------------------
  gallery: [
    "assets/fotos/galeria-01.jpg",
    "assets/fotos/galeria-02.jpg",
    "assets/fotos/galeria-03.jpg",
    "assets/fotos/galeria-04.jpg",
    "assets/fotos/galeria-05.jpg",
    "assets/fotos/galeria-06.jpg",
    "assets/fotos/galeria-07.jpg",
    "assets/fotos/galeria-08.jpg",
    "assets/fotos/galeria-09.jpg",
    "assets/fotos/galeria-10.jpg"
  ],

  // ------------------------------------------------------------
  // CEREMONIA
  // ------------------------------------------------------------
  ceremony: {
    name: "Ceremonia religiosa",
    time: "15:30 hs",
    venue: "Parroquia María Madre del Redentor y de los Santos Juan y Pablo",
    address: "Lucas de Figueroa y Mendoza 879, Urca, Córdoba",
    mapEmbedQuery: "Parroquia María Madre del Redentor, Lucas de Figueroa y Mendoza 879, Córdoba",
    mapDirectionsQuery: "Parroquia María Madre del Redentor, Lucas de Figueroa y Mendoza 879, Córdoba",
    mapsLink: "https://share.google/A64Gtpl87tn91eoua",
    icon: "church"
  },

  // ------------------------------------------------------------
  // FIESTA
  // ------------------------------------------------------------
  party: {
    name: "Fiesta",
    time: "17:00 hs",
    venue: "Salón Agua Canta",
    address: "Av. Amadeo Sabattini 30, Unquillo, Córdoba",
    mapEmbedQuery: "Salón Agua Canta, Avenida Amadeo Sabattini 30, Unquillo, Córdoba",
    mapDirectionsQuery: "Salón Agua Canta, Avenida Amadeo Sabattini 30, Unquillo, Córdoba",
    mapsLink: "https://share.google/oHW6QXZn0u5XjUZsg",
    icon: "cheers"
  },

  // ------------------------------------------------------------
  // ITINERARIO — "a definir": se activa cuando lo confirmen
  // ------------------------------------------------------------
  timeline: {
    enabled: false,
    title: "El gran día",
    items: []
  },

  // ------------------------------------------------------------
  // DRESS CODE
  // ------------------------------------------------------------
  dressCode: {
    title: "Formal elegante",
    text: "Te esperamos con tu mejor look de fiesta para celebrar juntos.",
    icons: [
      { icon: "dress", label: "Ellas", text: "Vestido largo o de cóctel" },
      { icon: "suit", label: "Ellos", text: "Traje" }
    ],
    palette: []
  },

  // ------------------------------------------------------------
  // REGALOS — no mandaron datos todavía
  // ------------------------------------------------------------
  gifts: {
    enabled: false,
    intro: "",
    arsAlias: { enabled: false },
    usdAccount: { enabled: false },
    giftList: { enabled: false },
    qr: { enabled: false }
  },

  // ------------------------------------------------------------
  // PREGUNTAS FRECUENTES
  // ------------------------------------------------------------
  faq: {
    enabled: true,
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Pueden ir chicos?", a: "Esta vez la celebración es solo para adultos. ¡Gracias por entender!" },
      { q: "¿Hay estacionamiento?", a: "Sí, el salón tiene estacionamiento." },
      { q: "¿Hasta qué hora es la fiesta?", a: "La fiesta termina a las 3 de la mañana." }
    ]
  },

  // ------------------------------------------------------------
  // RSVP — Plan Premium: las confirmaciones van a una planilla
  // compartida con Pancusa05@gmail.com (falta crear el Apps Script)
  // ------------------------------------------------------------
  rsvp: {
    mode: "sheets",
    deadlineLabel: "10 de marzo de 2027",
    perPerson: true, // cada invitado confirma por su cuenta
    perPersonNote: "La confirmación es individual: cada invitado completa la suya.",
    comments: false, // sin "Un mensaje para nosotros"
    oneTime: true,   // después de confirmar no se puede mandar otra desde ese celular
    whatsapp: { phoneNumber: "" },
    sheets: { webAppUrl: "https://script.google.com/macros/s/AKfycbwcyCqVMxWrvqGTbXin0Ua1X-VD8H4mtUI1Xrt-HUop5V9AjTsSyOCAzFDnSO3LAGYSRQ/exec" },
    menuOptions: ["Tradicional", "Sin TACC", "Para diabéticos"],
    menuNote: "Si necesitás menú sin TACC o para diabéticos, elegilo acá así lo preparan especialmente para vos."
  },

  // ------------------------------------------------------------
  // CÁMARA DESCARTABLE (regalo de Koba Digital)
  // ------------------------------------------------------------
  camara: {
    enabled: false, // la cámara se la manda Koba en otro link
    url: "https://solmelocchi.github.io/camaradigital/?b=agusypancu"
  },

  // ------------------------------------------------------------
  // FOOTER
  // ------------------------------------------------------------
  footer: {
    contactEmail: "",
    share: false, // sin botón de compartir: el pie termina en la fecha y la firma
    social: {},
    agencyName: "Hecho con amor por solmelocchi1@yahoo.com",
    agencyUrl: "mailto:solmelocchi1@yahoo.com"
  }
};

// IMPORTANTE: main.js y rsvp.js leen window.WEDDING_CONFIG
window.WEDDING_CONFIG = WEDDING_CONFIG;
