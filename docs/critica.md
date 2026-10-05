# Crítica de diseño: Grupo Milkasa (impeccable /critique)

Método: dos evaluaciones aisladas (A: diseño; B: detector y navegador), sintetizadas. 3 de octubre de 2026. Alcance acordado: refinar, conservando la identidad obsidiana/oro/vino y Fraunces.

## Puntaje (Nielsen, 7 y 10 n/a): 22/32

## Veredicto
Más cerca de una plantilla de lujo que de Grupo Milkasa. Las causas:
- **Fotos:** stock internacional (mansión con alberca, trigal, bodega, alcancía).
- **Secciones:** la misma fórmula en todas: etiqueta entre paréntesis, titular con cursiva dorada y tarjetas.
- **Copy:** genérico.

## Ya corregido
- Bloques invisibles y error de hidratación con "reducir movimiento" (`Reveal` y `HeroBackground`).
- La ficha de propiedad se desbordaba a 584 px en celular (mapa con ancho mínimo y columna sin `minmax(0,1fr)`).

## Pendiente, por prioridad

**P1. Fotografía ajena a Uruapan.** Curar fotos locales o marcarlas como faltantes; quitar los clichés.

**P1. CTAs y bloques repetidos.**
- Doble cierre en servicios.
- Cierre global también en contacto.
- FAQ idéntica en inicio y servicios.

**P1. Copy genérico.**
- Mezcla de singular y plural.
- El hero omite "vende".
- Fórmula "no X, sino Y".
- Rayas largas en servicios y metadatos.

**P2. Hero.**
- En escritorio, el texto vertical choca con el titular.
- En celular, "Desliza" queda encima de los botones.

**P2. Tipografía.**
- Todo en serif (Newsreader). El documento de marca pide una sans para etiquetas, precios y datos.
- Etiquetas entre paréntesis.

**P2. Accesibilidad.**
- Contraste de texto apagado (4.44 y 3.85), pie (3.0), "EN VENTA" en vino (2.81) y números de servicios (2.31).
- Puntos del carrusel de 9 px.
- Botón de menú de 38x30.
- h4 del pie fuera de orden.
- El `aria-label` del logo no coincide con el texto visible.

**P2. Conversión en celular.**
- No hay WhatsApp en el encabezado ni botón flotante.
- En la ficha, el contacto queda lejos del precio.

**P2. Detalle.**
- El mapa sale sin estilo o vacío.
- La etiqueta "PRECIO" está desalineada.

**P2. Nosotros.** No hay personas ni equipo; la cita no tiene autor.

**P3. Detector.**
- Fondo de rejilla decorativo en 7 hojas de estilo (consultivo).
- `transition: width` en RouteProgress.

**P3. Rendimiento (en dev, solo orientativo).** Imágenes de Unsplash sin redimensionar: unos 500 KB de ahorro posible.
