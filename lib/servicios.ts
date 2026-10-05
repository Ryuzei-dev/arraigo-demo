export interface Servicio {
  slug: string;
  n: string;
  titulo: string;
  resumen: string; // tarjeta
  intro: string; // hero de la landing
  descripcion: string[];
  beneficios: string[];
  proceso: { t: string; d: string }[];
  imagen: string;
}


export const servicios: Servicio[] = [
  {
    slug: "compra-de-inmuebles",
    n: "01",
    titulo: "Compra de inmuebles",
    resumen:
      "Definimos tu perfil, filtramos el mercado y te presentamos solo opciones que valen tu tiempo. Negociamos por ti y cuidamos cada cláusula.",
    intro:
      "Comprar un inmueble es una de las decisiones más importantes de tu vida. Te acompañamos para que la tomes con información clara, sin presión y con la seguridad de un buen trato.",
    descripcion: [
      "Entendemos qué buscas (zona, presupuesto, tipo de propiedad y objetivo) y filtramos el mercado para presentarte solo opciones que realmente valen tu tiempo. Nada de tours interminables ni sorpresas.",
      "Cuando encuentras la indicada, negociamos a tu favor y revisamos cada cláusula, documento y trámite hasta que tengas las llaves en la mano. Tú decides; nosotros cuidamos los detalles.",
    ],
    beneficios: [
      "Búsqueda personalizada según tu perfil",
      "Negociación de precio y condiciones a tu favor",
      "Revisión legal y debida diligencia",
      "Acompañamiento en notaría y escrituración",
      "Asesoría de crédito si la necesitas",
    ],
    proceso: [
      { t: "Escuchamos", d: "Definimos tu objetivo, presupuesto y preferencias." },
      { t: "Buscamos", d: "Filtramos el mercado y curamos las mejores opciones." },
      { t: "Negociamos", d: "Cuidamos el precio, las condiciones y las cláusulas." },
      { t: "Cerramos", d: "Trámites, notaría y entrega, acompañándote hasta el final." },
    ],
    imagen: "/fotos/compra.jpg",
  },
  {
    slug: "venta-de-propiedades",
    n: "02",
    titulo: "Venta de propiedades",
    resumen:
      "Valuación profesional, fotografía, promoción multicanal y filtrado de prospectos para vender en el mejor tiempo y precio.",
    intro:
      "Vender bien no es poner un letrero y esperar. Diseñamos una estrategia para que tu propiedad se venda al mejor precio, en el menor tiempo y sin dolores de cabeza.",
    descripcion: [
      "Empezamos con un avalúo comercial realista y una presentación que haga justicia a tu inmueble: fotografía profesional, descripción que vende y promoción en los canales correctos.",
      "Filtramos a los prospectos para que solo recibas visitas serias, negociamos por ti y te acompañamos hasta la firma y la escrituración. Tú te enfocas en tu vida; nosotros en vender.",
    ],
    beneficios: [
      "Avalúo comercial profesional",
      "Fotografía y presentación del inmueble",
      "Promoción multicanal (portales, redes, red de contactos)",
      "Filtro y calificación de prospectos",
      "Negociación, cierre y escrituración",
    ],
    proceso: [
      { t: "Valuamos", d: "Definimos el precio correcto con datos del mercado." },
      { t: "Preparamos", d: "Fotografía, descripción y estrategia de promoción." },
      { t: "Promovemos", d: "Difundimos y filtramos a los prospectos serios." },
      { t: "Cerramos", d: "Negociamos y acompañamos la firma y escrituración." },
    ],
    imagen: "/fotos/venta.jpg",
  },
  {
    slug: "renta-y-administracion",
    n: "03",
    titulo: "Renta y administración",
    resumen:
      "Colocamos tu inmueble con inquilinos confiables y administramos cobros, contratos y mantenimiento para que solo recibas rendimientos.",
    intro:
      "Convierte tu propiedad en un ingreso sin preocupaciones. Colocamos inquilinos confiables y administramos todo para que tú solo recibas.",
    descripcion: [
      "Seleccionamos y verificamos a los inquilinos, elaboramos contratos que protegen tus intereses y nos encargamos del cobro puntual de las rentas.",
      "Si algo se descompone o hay que dar seguimiento, lo gestionamos. Tú recibes tus rendimientos y reportes claros; nosotros nos ocupamos del día a día.",
    ],
    beneficios: [
      "Selección y verificación de inquilinos",
      "Contratos que protegen tu patrimonio",
      "Cobro puntual de rentas",
      "Administración y mantenimiento",
      "Reportes claros y transparentes",
    ],
    proceso: [
      { t: "Colocamos", d: "Promovemos y elegimos al inquilino correcto." },
      { t: "Contratamos", d: "Firmamos un contrato que te protege." },
      { t: "Cobramos", d: "Gestionamos la renta puntual mes con mes." },
      { t: "Administramos", d: "Mantenimiento, seguimiento y reportes." },
    ],
    imagen: "/fotos/renta.jpg",
  },
  {
    slug: "creditos-y-financiamiento",
    n: "04",
    titulo: "Créditos y financiamiento",
    resumen:
      "Te conectamos con las mejores opciones de crédito hipotecario y te acompañamos en todo el proceso de precalificación y trámite.",
    intro:
      "El crédito correcto puede ahorrarte cientos de miles de pesos. Comparamos opciones y te acompañamos en cada paso de tu financiamiento.",
    descripcion: [
      "Analizamos tu perfil, te precalificamos y comparamos las opciones de distintos bancos e instituciones para que elijas la que más te conviene, no la primera que aparece.",
      "Te ayudamos a reunir la documentación y damos seguimiento al trámite hasta la firma. Incluye orientación sobre Infonavit, Fovissste y esquemas combinados.",
    ],
    beneficios: [
      "Precalificación sin costo",
      "Comparativa de bancos e instituciones",
      "Gestión y seguimiento de documentos",
      "Acompañamiento hasta la firma",
      "Asesoría Infonavit / Fovissste y cofinanciamiento",
    ],
    proceso: [
      { t: "Analizamos", d: "Revisamos tu perfil y capacidad de crédito." },
      { t: "Comparamos", d: "Ponemos las mejores opciones sobre la mesa." },
      { t: "Gestionamos", d: "Documentos y trámite, sin que te pierdas." },
      { t: "Firmamos", d: "Te acompañamos hasta el desembolso." },
    ],
    imagen: "/fotos/administracion.jpg",
  },
  {
    slug: "avaluos-y-peritajes",
    n: "05",
    titulo: "Avalúos y peritajes",
    resumen:
      "Valuaciones formales para compra-venta, crédito, herencias o fines fiscales, con respaldo de peritos certificados.",
    intro:
      "Un avalúo bien hecho protege tu patrimonio y evita conflictos. Trabajamos con peritos certificados para darte un valor confiable y con validez oficial.",
    descripcion: [
      "Ya sea para vender, comprar, tramitar un crédito, repartir una herencia o cumplir con el fisco, un avalúo formal te da certeza sobre cuánto vale realmente tu inmueble.",
      "Nuestros peritos certificados entregan documentos con validez oficial, sustentados en metodología y datos del mercado, listos para el trámite que necesites.",
    ],
    beneficios: [
      "Avalúo comercial",
      "Avalúo bancario para crédito",
      "Avalúo fiscal",
      "Avalúo para juicios y herencias",
      "Entrega formal con validez oficial",
    ],
    proceso: [
      { t: "Inspección", d: "Visitamos y levantamos las características del inmueble." },
      { t: "Análisis", d: "Comparamos con el mercado y aplicamos metodología." },
      { t: "Dictamen", d: "Determinamos el valor con sustento técnico." },
      { t: "Entrega", d: "Documento formal listo para tu trámite." },
    ],
    imagen: "/fotos/avaluos.jpg",
  },
  {
    slug: "asesoria-de-inversion",
    n: "06",
    titulo: "Asesoría de inversión",
    resumen:
      "Estrategia patrimonial: qué comprar, dónde y cuándo, con análisis de plusvalía y rentabilidad de cada operación.",
    intro:
      "Hacer crecer tu patrimonio con bienes raíces requiere criterio, no suerte. Te ayudamos a decidir qué comprar, dónde y cuándo, con números claros.",
    descripcion: [
      "Analizamos plusvalía, rentabilidad y riesgo de cada oportunidad para que inviertas con datos, no con corazonadas. Zona, tipo de inmueble, horizonte y objetivo: todo cuenta.",
      "Te acompañamos a construir y diversificar un portafolio inmobiliario acorde a tus metas, y damos seguimiento para ajustar la estrategia cuando el mercado se mueve.",
    ],
    beneficios: [
      "Análisis de plusvalía por zona",
      "Proyección de rentabilidad y riesgo",
      "Selección de oportunidades",
      "Diversificación de portafolio",
      "Acompañamiento y seguimiento continuo",
    ],
    proceso: [
      { t: "Diagnóstico", d: "Entendemos tu capital, metas y horizonte." },
      { t: "Estrategia", d: "Definimos qué, dónde y cuándo invertir." },
      { t: "Ejecución", d: "Seleccionamos y cerramos las oportunidades." },
      { t: "Seguimiento", d: "Ajustamos el portafolio con el tiempo." },
    ],
    imagen: "/fotos/inversion.jpg",
  },
];

export function getServicio(slug: string) {
  return servicios.find((s) => s.slug === slug);
}
