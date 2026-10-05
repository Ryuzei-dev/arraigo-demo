// Contenido editorial de apoyo.
// NOTA: testimonios de ejemplo (placeholder) — reemplazar por reseñas reales del cliente.

export interface Testimonio {
  nombre: string;
  rol: string;
  cita: string;
}

export const testimonios: Testimonio[] = [
  {
    nombre: "María F.",
    rol: "Compró casa en Las Lomas",
    cita: "Nos acompañaron en cada paso, desde la primera visita hasta la firma. Nunca sentimos presión, solo información honesta.",
  },
  {
    nombre: "Jorge M.",
    rol: "Vendió su departamento",
    cita: "Valuaron con criterio y vendieron más rápido de lo que esperaba. Todo transparente y bien explicado.",
  },
  {
    nombre: "Familia Ríos",
    rol: "Renta administrada",
    cita: "Administran nuestra propiedad desde hace dos años. Inquilinos confiables y cero preocupaciones para nosotros.",
  },
  {
    nombre: "Alejandro V.",
    rol: "Invirtió en terreno comercial",
    cita: "Me asesoraron sobre plusvalía y ubicación. Fue una decisión de inversión que hoy agradezco.",
  },
  {
    nombre: "Sofía L.",
    rol: "Primera compra",
    cita: "Como compradora primeriza tenía mil dudas. Me explicaron el crédito y los trámites con toda la paciencia.",
  },
];

export type CategoriaFaq = "Comprar" | "Vender" | "Rentar" | "Crédito" | "Sobre nosotros";

export const categoriasFaq: CategoriaFaq[] = ["Comprar", "Vender", "Rentar", "Crédito", "Sobre nosotros"];

export interface Faq {
  q: string;
  a: string;
  /** Opcional para no romper usos anteriores; /preguntas filtra por este campo */
  categoria?: CategoriaFaq;
}

export const faqs: Faq[] = [
  {
    q: "¿Cobran por asesorarme antes de comprar o vender?",
    categoria: "Sobre nosotros",
    a: "La asesoría inicial es sin costo ni compromiso. Escuchamos tu objetivo y te proponemos una estrategia; solo se genera una comisión cuando concretamos una operación.",
  },
  {
    q: "¿En qué zonas operan?",
    categoria: "Sobre nosotros",
    a: "Trabajamos principalmente en Uruapan, Michoacán y su región. Si tu propiedad o tu búsqueda está fuera, cuéntanos y te decimos si podemos ayudarte.",
  },
  {
    q: "¿Me ayudan con el crédito hipotecario?",
    categoria: "Crédito",
    a: "Sí. Te conectamos con opciones de crédito, te acompañamos en la precalificación y comparamos alternativas de distintos bancos para que elijas la mejor.",
  },
  {
    q: "¿Qué documentos necesito para vender mi inmueble?",
    categoria: "Vender",
    a: "Generalmente escrituras, identificación, predial y boletas de servicios al corriente. En la primera reunión revisamos tu caso y te damos la lista exacta.",
  },
  {
    q: "¿Cuánto tarda una operación?",
    categoria: "Comprar",
    a: "Depende del tipo de inmueble y del financiamiento. Una compra de contado puede cerrarse en semanas; con crédito, suele tomar de uno a tres meses. Te damos tiempos realistas desde el inicio.",
  },
];

/**
 * Preguntas adicionales para /preguntas. Salen solo de lo que ya dice el sitio
 * (servicios, proceso, horario y documentos). Las 5 de arriba siguen siendo las de /servicios.
 */
export const faqsExtra: Faq[] = [
  {
    categoria: "Comprar",
    q: "¿Cómo es el proceso para comprar con ustedes?",
    a: "Primero escuchamos tu objetivo, presupuesto y preferencias. Después filtramos el mercado y te presentamos solo opciones que valen tu tiempo. Cuando eliges, negociamos precio y condiciones, y te acompañamos en trámites, notaría y entrega.",
  },
  {
    categoria: "Comprar",
    q: "¿Revisan los papeles del inmueble antes de que compre?",
    a: "Sí. Hacemos revisión legal y debida diligencia del inmueble y te acompañamos en la notaría y la escrituración. Si quieres saber qué documentos se suelen pedir, revisa nuestra guía de papeles para comprar una casa.",
  },
  {
    categoria: "Vender",
    q: "¿Cómo definen el precio de mi propiedad?",
    a: "Empezamos con un avalúo comercial realista, sustentado en datos del mercado. Con eso definimos el precio de salida contigo antes de promover el inmueble.",
  },
  {
    categoria: "Vender",
    q: "¿Cómo promueven mi propiedad?",
    a: "Preparamos fotografía y una descripción que haga justicia a tu inmueble, lo promovemos en portales, redes y nuestra red de contactos, y filtramos a los prospectos para que solo recibas visitas serias.",
  },
  {
    categoria: "Vender",
    q: "¿Hacen avalúos formales?",
    a: "Sí. Trabajamos con peritos certificados para avalúos comerciales, bancarios para crédito, fiscales y para juicios o herencias. El documento se entrega de manera formal y listo para tu trámite.",
  },
  {
    categoria: "Rentar",
    q: "¿Pueden rentar y administrar mi propiedad?",
    a: "Sí. Promovemos tu inmueble, seleccionamos y verificamos al inquilino, elaboramos un contrato que protege tus intereses, gestionamos el cobro de la renta y damos seguimiento al mantenimiento, con reportes claros.",
  },
  {
    categoria: "Rentar",
    q: "Busco rentar. ¿Cómo empiezo?",
    a: "Revisa las propiedades en renta del catálogo o cuéntanos qué buscas: zona, tipo de inmueble y presupuesto. Un asesor te responde con opciones y te dice qué documentos te pedirán.",
  },
  {
    categoria: "Crédito",
    q: "¿La precalificación tiene costo?",
    a: "No. Analizamos tu perfil, te precalificamos sin costo y comparamos opciones de distintos bancos e instituciones para que elijas la que más te conviene.",
  },
  {
    categoria: "Crédito",
    q: "¿Me orientan con Infonavit o Fovissste?",
    a: "Sí. Te orientamos sobre Infonavit, Fovissste y esquemas combinados con un banco (cofinanciamiento), te ayudamos a reunir la documentación y damos seguimiento al trámite hasta la firma.",
  },
  {
    categoria: "Sobre nosotros",
    q: "¿Cuál es su horario de atención?",
    a: "De lunes a viernes de 9:00 a 19:00 y los sábados de 10:00 a 14:00, en Uruapan, Michoacán. También puedes escribirnos por WhatsApp.",
  },
  {
    categoria: "Sobre nosotros",
    q: "¿Tendré un asesor asignado?",
    a: "Sí. Un mismo asesor te acompaña de principio a fin, responde tus dudas y da seguimiento en cada etapa de tu operación.",
  },
];

/** Todas las preguntas: las originales más las adicionales */
export const todasLasFaqs: Faq[] = [...faqs, ...faqsExtra];
