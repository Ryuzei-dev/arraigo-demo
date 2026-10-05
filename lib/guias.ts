// Guías prácticas. Información general para México: sin cifras, porcentajes ni precios,
// porque cambian por estado, municipio, institución y año. Cada guía pide confirmar con
// la notaría o con el sitio oficial correspondiente.

export interface SeccionGuia {
  titulo: string;
  parrafos: string[];
  /** Lista opcional de puntos concretos */
  lista?: string[];
}

export interface Guia {
  slug: string;
  titulo: string;
  resumen: string;
  /** Texto corto para la tarjeta del índice */
  para: string;
  secciones: SeccionGuia[];
  cta: { texto: string; boton: string; href: string };
  /** Fecha de la última revisión del contenido (ISO) */
  revisada: string;
}

export const guias: Guia[] = [
  {
    slug: "papeles-para-comprar-una-casa",
    titulo: "Qué papeles necesitas para comprar una casa",
    resumen:
      "La lista de documentos que suelen pedir la notaría, el banco y el vendedor, y para qué sirve cada uno.",
    para: "Si vas a comprar, de contado o con crédito.",
    revisada: "2026-10-01",
    secciones: [
      {
        titulo: "Antes de empezar",
        parrafos: [
          "En México, la compraventa de un inmueble se formaliza en una escritura pública ante notario. La notaría revisa los papeles de las dos partes y del inmueble antes de firmar, así que tener todo listo desde el principio ahorra semanas.",
          "Cada notaría, banco e instituto puede pedir algo extra según tu caso. Usa esta lista como punto de partida y confirma la lista final con tu notaría.",
        ],
      },
      {
        titulo: "Tus documentos como comprador",
        parrafos: [
          "Son los que acreditan quién eres y cuál es tu situación. Conviene tenerlos en original y copia.",
        ],
        lista: [
          "Identificación oficial vigente (INE o pasaporte).",
          "CURP.",
          "RFC con tu constancia de situación fiscal.",
          "Comprobante de domicilio reciente.",
          "Acta de nacimiento.",
          "Acta de matrimonio, si estás casado. El régimen (sociedad conyugal o separación de bienes) define a nombre de quién queda la casa y si tu cónyuge debe firmar.",
        ],
      },
      {
        titulo: "Los documentos del vendedor y del inmueble",
        parrafos: [
          "Aquí está la mayor parte del riesgo. Pide copias desde el inicio y revisa que el nombre de la escritura coincida con la identificación de quien vende.",
        ],
        lista: [
          "Escritura de propiedad inscrita en el Registro Público de la Propiedad.",
          "Identificación oficial del vendedor y, si está casado, los datos de su cónyuge.",
          "Boletas del impuesto predial pagadas al corriente.",
          "Recibos o constancia de no adeudo de agua.",
          "Si es condominio o fraccionamiento con cuotas, constancia de no adeudo de mantenimiento.",
        ],
      },
      {
        titulo: "Certificado de libertad de gravamen",
        parrafos: [
          "Lo expide el Registro Público de la Propiedad y confirma si el inmueble tiene hipotecas, embargos u otras cargas. Normalmente lo tramita la notaría antes de la firma.",
          "Si aparece un gravamen, no firmes hasta que se cancele o hasta que la notaría te explique cómo se liquidará en la misma operación.",
        ],
      },
      {
        titulo: "Avalúo",
        parrafos: [
          "Si compras con crédito bancario, Infonavit o Fovissste, la institución pide un avalúo hecho por un valuador autorizado. Sirve para confirmar que el valor del inmueble respalda el préstamo.",
          "Aunque compres de contado, la notaría puede pedir un avalúo para calcular los impuestos de la operación.",
        ],
      },
      {
        titulo: "La firma en notaría",
        parrafos: [
          "El notario revisa los documentos, calcula los impuestos y derechos, redacta la escritura y, después de la firma, la inscribe a tu nombre en el Registro Público. En la mayoría de las operaciones, el comprador cubre los gastos de escrituración.",
          "Los impuestos y honorarios cambian según el estado, el municipio y el valor del inmueble. Pide a la notaría un presupuesto por escrito antes de firmar.",
        ],
      },
    ],
    cta: {
      texto: "Revisamos contigo los papeles del inmueble antes de que firmes.",
      boton: "Agenda una asesoría",
      href: "/contacto",
    },
  },
  {
    slug: "credito-infonavit-o-fovissste",
    titulo: "Cómo usar tu crédito Infonavit o Fovissste para comprar",
    resumen:
      "Los pasos generales para comprar casa con el crédito de tu instituto, de la precalificación a la notaría.",
    para: "Si trabajas en el sector privado o en el gobierno y quieres usar tu crédito.",
    revisada: "2026-10-01",
    secciones: [
      {
        titulo: "Primero, confirma los requisitos vigentes",
        parrafos: [
          "Infonavit y Fovissste cambian sus reglas, montos y productos con frecuencia. Esta guía explica el camino general; antes de tomar cualquier decisión, revisa los requisitos actuales en los sitios oficiales: infonavit.org.mx y gob.mx/fovissste.",
        ],
      },
      {
        titulo: "¿Cuál te corresponde?",
        parrafos: [
          "Infonavit es para personas que trabajan en el sector privado y cotizan al IMSS. Fovissste es para trabajadores al servicio del Estado afiliados al ISSSTE.",
          "Ambos institutos tienen esquemas para sumar tu crédito con el de un banco o con el de otra persona. Eso puede ampliar el monto disponible, así que vale la pena preguntarlo desde el inicio.",
        ],
      },
      {
        titulo: "1. Precalificación",
        parrafos: [
          "Entra a tu cuenta en el portal del instituto para consultar si ya cumples los requisitos y cuánto te prestan. En Infonavit esto depende de una puntuación que considera tu salario, tu edad y tu ahorro en la subcuenta de vivienda, entre otros factores.",
          "Si todavía no alcanzas la puntuación mínima, el portal te dice qué te falta. No pagues a nadie por precalificarte: el trámite oficial no tiene costo.",
        ],
      },
      {
        titulo: "2. Elige la vivienda",
        parrafos: [
          "Con tu monto aproximado, busca un inmueble que encaje. Recuerda sumar los gastos de escrituración y, si el crédito no alcanza el precio completo, el enganche o la diferencia que pagarás con recursos propios.",
          "Antes de apartar, pide al vendedor la escritura, el predial y el agua al corriente. Un problema en los papeles detiene el crédito.",
        ],
      },
      {
        titulo: "3. Avalúo",
        parrafos: [
          "El instituto pide un avalúo hecho por una unidad de valuación autorizada. El valor del avalúo influye en el monto que te prestan, así que conviene hacerlo antes de cerrar el precio.",
        ],
      },
      {
        titulo: "4. Integración del expediente",
        parrafos: [
          "Reúnes tus documentos, los del vendedor y los del inmueble, y los entregas por el canal que indique el instituto. Algunos productos piden tomar un curso o taller de orientación antes de inscribir el crédito.",
        ],
      },
      {
        titulo: "5. Firma en notaría",
        parrafos: [
          "Con el crédito autorizado, firmas la escritura ante notario. El instituto paga al vendedor el monto del crédito y tú comienzas a pagar, normalmente por descuento en tu nómina.",
        ],
      },
      {
        titulo: "Cómo te ayudamos",
        parrafos: [
          "Te precalificamos sin costo, comparamos tu crédito del instituto con opciones bancarias y combinadas, y damos seguimiento a los documentos hasta la firma.",
        ],
      },
    ],
    cta: {
      texto: "Te orientamos con tu crédito y buscamos opciones que encajen con tu monto.",
      boton: "Ver el servicio de créditos",
      href: "/servicios/creditos-y-financiamiento",
    },
  },
  {
    slug: "rentar-tu-propiedad-sin-sorpresas",
    titulo: "Rentar tu propiedad sin sorpresas",
    resumen:
      "Cómo elegir inquilino, qué debe decir el contrato y qué hacer antes de entregar las llaves.",
    para: "Si tienes una casa, departamento o local y quieres rentarlo.",
    revisada: "2026-10-01",
    secciones: [
      {
        titulo: "Elige bien al inquilino",
        parrafos: [
          "La mayoría de los problemas de una renta se evitan antes de firmar. Pide identificación, comprobantes de ingresos y referencias, y confirma que el ingreso alcanza con holgura para pagar la renta.",
          "Si quien renta es una empresa, solicita su acta constitutiva, el poder de quien firma y su constancia de situación fiscal.",
        ],
      },
      {
        titulo: "Un contrato por escrito",
        parrafos: [
          "El contrato de arrendamiento protege a las dos partes. Debe decir con claridad quiénes firman, el inmueble, el monto de la renta, la fecha y forma de pago, la duración y las condiciones para renovar o terminar.",
        ],
        lista: [
          "Quién paga servicios, predial y cuotas de mantenimiento.",
          "Qué reparaciones corren por cuenta de cada parte.",
          "Si se permiten mascotas, subarrendar o hacer cambios al inmueble.",
          "Qué pasa si hay retrasos en el pago.",
          "Nombre del fiador o del aval, si lo hay.",
        ],
      },
      {
        titulo: "Depósito en garantía",
        parrafos: [
          "Es común pedir un depósito al firmar, que se devuelve al terminar el contrato si el inmueble se entrega en buen estado y sin adeudos. Anota en el contrato el monto, para qué se puede usar y en qué plazo se devuelve.",
        ],
      },
      {
        titulo: "Póliza jurídica",
        parrafos: [
          "Es un servicio que contratan muchos propietarios: incluye la investigación del inquilino y el apoyo legal si hay que recuperar el inmueble o cobrar adeudos. Compara qué cubre cada póliza antes de contratarla.",
        ],
      },
      {
        titulo: "Inventario y fotos de entrega",
        parrafos: [
          "Antes de entregar las llaves, haz un inventario con el estado de cada espacio, muebles y aparatos, y tómale fotos con fecha. Que el inquilino lo firme como anexo del contrato. Al final, revisan juntos contra ese mismo inventario.",
        ],
      },
      {
        titulo: "Mantenimiento durante la renta",
        parrafos: [
          "Define un canal para reportar fallas y atiende rápido las que te tocan. Un inmueble en buen estado conserva su valor y retiene a los buenos inquilinos.",
          "Si no tienes tiempo para dar seguimiento, una renta administrada se encarga del cobro, el mantenimiento y los reportes por ti.",
        ],
      },
    ],
    cta: {
      texto: "Colocamos y administramos tu propiedad en renta. La asesoría inicial es sin costo.",
      boton: "Quiero rentar mi propiedad",
      href: "/vender?operacion=rentar",
    },
  },
];

export function getGuia(slug: string) {
  return guias.find((g) => g.slug === slug);
}
