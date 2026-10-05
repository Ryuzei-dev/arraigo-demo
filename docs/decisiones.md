# Decisiones del refinamiento

Demo de portafolio de LumikaStudio. Alcance acordado: refinar sin cambiar la identidad (obsidiana, oro, vino y Fraunces). El diagnóstico está en `docs/critica.md`.

## Nombre y datos ficticios
- "Grupo Milkasa" pasa a **Arraigo** (echar raíces), con monograma "A".
- Lema: "Raíces firmes para tu patrimonio".
- Teléfono (452) 000 0000 y WhatsApp 524520000000.
- Correo contacto@arraigo.example.
- Dominio de metadatos: arraigo-demo.vercel.app. Ajustarlo si la URL final cambia.

## Fallas corregidas
- Bloques invisibles y error de hidratación con "reducir movimiento" (`Reveal` y `HeroBackground`). Ahora lo resuelve el CSS.
- La ficha de propiedad se desbordaba en celular: el mapa forzaba 560px y la columna no tenía `minmax(0,1fr)`.
- Tipo del sitemap: el error de TypeScript ya existía antes de este refinamiento.

## Accesibilidad
- Texto apagado `--arena` a #9c9085, con al menos 4.9:1 sobre los fondos oscuros.
- Pie, placeholders y nota del mapa con el color legible.
- "En venta" #d4848c y números de servicios #8a6a22.
- Botón de menú de 44px, enlaces del pie de 44px en celular y puntos del carrusel de 24px.
- Títulos del pie de h4 a h2; se quitó el `aria-label` del logo que no coincidía con el texto visible.
- Resultado: 0 fallas de contraste en las 6 páginas, a 375 y 1440.

## Conversión
- Botón flotante de WhatsApp en celular. No aparece en contacto, en la ficha ni en el Studio.
- En la ficha, barra fija en celular con el precio y WhatsApp.

## Tipografía y estructura
- Space Grotesk (la fuente de datos del documento de marca) en etiquetas, precios, specs y botones.
- Fraunces sigue en titulares y Newsreader en el texto.
- Se quitaron las etiquetas entre paréntesis y las de cabecera encima de los titulares (impeccable las veta).
- Un solo cierre por página:
  - el inicio pierde la FAQ, que vive en Servicios, y el bloque "Busca más opciones";
  - Servicios pierde su cierre propio;
  - Contacto no muestra el cierre global.
- El texto vertical de la portada solo aparece desde 1600px y "Desliza" se oculta en celular.

## Copy (copywriting más copy-editing, con `.agents/product-marketing.md`)
- Portada: "Compra, vende o renta en Uruapan con asesoría", con la asesoría inicial sin costo y la comisión solo al concretar.
- Propiedades, servicios y nosotros con titulares concretos.
- Sin la fórmula "No vendemos propiedades: cuidamos patrimonios".
- Sin rayas largas.

## Fotos
- Portada, cinta, servicios y nosotros con fotos de Pexels de arquitectura mexicana: arcos, patios, teja, cantera y fraccionamientos, guardadas en `public/fotos`.
- Las fotos de las propiedades vienen de Sanity y no se tocaron: cambiarlas es editar el contenido del CMS. Pendiente decidirlo, por ejemplo el trigal del terreno comercial.

## Funciones nuevas (benchmark de sitios inmobiliarios)
- Catálogo: filtros por zona, precio, recámaras, m² y texto en la URL; orden; vista de mapa (Leaflet + OpenStreetMap); buscador en la portada.
- Tarjetas: favoritos, comparar (hasta 3), estado (nueva, rebajada, apartada), precio anterior tachado y precio por m².
- Guardado sin cuenta en el navegador (`lib/guardados.ts`): `/favoritos`, `/comparar` y "vistos recientemente".
- Ficha: asesor asignado con su WhatsApp, agendar visita o enviar mensaje, calculadora de crédito, compartir, imprimir, tour 360 (Kuula de muestra en Las Lomas), galería con visor y barra fija en móvil.
- Páginas: `/asesores`, `/vender`, `/colonias` (precios calculados de las propiedades publicadas), `/guias`, `/preguntas` con buscador.
- Asistente guiado (chatbot) con salida a WhatsApp; sustituye al botón flotante.
- Medición: GA4 con `NEXT_PUBLIC_GA_ID` (clics a WhatsApp, teléfono y correo) y verificación de Search Console con `NEXT_PUBLIC_GSC_VERIFICATION`. Ambas en `.env.example`.
- Datos de demostración en código (`lib/asesores.ts`, `lib/extras.ts`). Sanity solo recibió campos opcionales en el esquema (asesor, estado, precioAnterior, tourUrl); si se capturan ahí, mandan sobre el código.

## Rendimiento
Lo que se midió primero con aceleración real (no la estimada) daba 50 puntos en la portada: el hilo principal pasaba más de 10 s en estilo, layout y rasterizado. Causas y arreglos:

- **Grano con `mix-blend-mode` fijo sobre toda la página.** Obligaba a recomponer todo en cada cuadro. Ahora es un velo normal al 5 %.
- **Header con `backdrop-filter: blur(18px)` sobre un hero que se anima sin parar.** El desenfoque se recalculaba en cada cuadro. En táctil el header es sólido (92 %); el desenfoque queda solo con ratón.
- **Animaciones continuas (acercamiento del hero, cinta de fotos).** Solo corren mientras se ven (`data-animar` + `.enVista` desde `RevealObserver`); el acercamiento del hero solo en escritorio.
- **Se quitó `motion` y `embla-carousel-auto-scroll`.** Apariciones, acordeón de preguntas y cinta van en CSS. Un script en línea muestra al instante los bloques que ya están en pantalla.
- **43 precargas de rutas al abrir cualquier página (153 KB).** Los enlaces del pie y del menú llevan `prefetch={false}`, salvo Propiedades.
- **CSS de todo el sitio en un archivo que bloquea el pintado (83 KB).** Turbopack junta el CSS de todas las rutas e ignora `cssChunking`. El build de producción usa webpack (`next build --webpack` en `package.json`); así cada página carga su CSS. Para eso se acotaron dos selectores globales en módulos y las reglas de impresión pasaron a `globals.css`.
- **Tipografías.** Las cursivas de Fraunces y Newsreader son instancias aparte sin precarga (`--font-display-italic`, `--font-body-italic`).
- **Imágenes.** Hero con `next/image`, precarga y prioridad alta; AVIF; tamaño 520 para la cinta en móvil; calidad 50 en lo decorativo y 60 en tarjetas y galería. El asistente se carga cuando el navegador está libre.

Resultado en local (build de producción):

| Medición | Antes | Ahora |
|---|---|---|
| Portada, 4G lenta y CPU x4, primer pintado real | 2.5 s | 1.0 s |
| Portada, hilo principal en esa traza | 12 s | 3.5 s |
| Portada, Lighthouse simulado | 67 | 80 |
| Catálogo, Lighthouse simulado | 76 | 75 a 79 |
| Ficha, Lighthouse simulado | 81 | 81 a 84 |
| Bytes de imagen antes del LCP (portada) | 624 KB | 346 KB |

La simulación de Lighthouse en local no va a subir mucho más: el servidor local es HTTP/1.1 y el modelo encola las 36 peticiones en 6 conexiones con 150 ms cada una. Vercel sirve por HTTP/2 y sin esa cola, así que la cifra que vale es la de PageSpeed sobre el sitio desplegado. Accesibilidad, buenas prácticas y SEO siguen en 100.

## Pendiente
- Nosotros no tiene equipo con nombres: no se inventó.
- Los testimonios siguen siendo de ejemplo (`lib/content.ts`).
- Los rangos de presupuesto del asistente son una propuesta: confirmarlos.
- Algunas colonias tienen solo 1 o 2 propiedades, así que sus promedios son poco representativos.
- Lighthouse de producción, después del despliegue.
