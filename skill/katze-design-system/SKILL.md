---
name: katze-design-system
description: Guía visual oficial de la marca Katze (sistema Graphite). Describe exactamente cómo luce cada color, tipografía, textura punteada Bayer 4×4, figura isométrica /anatomy, elemento 3D flotante y composición para que cualquier IA o diseñador mantenga coherencia visual en web, presentaciones y piezas gráficas.
---

# Katze Design System — Guía Visual para IA (Graphite)

**Marca:** Katze · Odoo Ready Partner oficial  
**Eslogan:** *Convertimos tecnología en resultados.*  
**Principio rector:** *El sistema sigue al criterio.*  
**Estética:** Ingeniería sobria, minimalismo arquitectónico en modo oscuro **sin negro puro (`#000000`)**, líneas finas de `1px` y acentos violetas reservados únicamente al foco real.

---

## 1. Colorimetría (0% negro puro)

El negro absoluto (`#000000`) está prohibido en toda pieza de Katze. El lienzo siempre parte de grafito carbón frío (`#16161B`) que reduce fatiga visual y permite distinguir planos sutiles.

| Rol visual | Nombre | HEX | Cómo se percibe y dónde aparece |
| --- | --- | --- | --- |
| Base de lienzo | **Carbon** | `#16161B` | Fondo dominante de web, slides oscuros y piezas digitales. |
| Superficie elevada | **Slate** | `#1E1E26` | Paneles, barras de control y celdas activas sutiles. |
| Superficie hover / borde | **Graphite** | `#252530` | Estados hover discretos, separadores y caras superiores de sólidos. |
| ADN Katze original | **Katze Plum** | `#2E1A47` | Portadas de presentaciones, notificaciones *toast* y capas estructurales. |
| Acento principal | **Amethyst** | `#9B5DE5` | Botón primario único, contorno del slide activo y señales de foco. |
| Brillo / interacción | **Lavender** | `#D16FFF` | Cabeza del rastro del cursor, estado `.iso-lit` de `/anatomy` y halos controlados. |
| Ecosistema oficial | **Odoo Plum** | `#714B67` | Reservado exclusivamente al distintivo *Odoo Ready Partner*. |
| Tinta principal | **Ink Primary** | `#F3F2F7` | Blanco ligeramente frío de alto contraste (WCAG AA/AAA) para titulares y texto clave. |
| Tinta secundaria | **Ink Secondary** | `#A7A4B5` | Párrafos editoriales y descripciones. |
| Tinta de metadatos | **Ink Muted** | `#767385` | Cotas `FIG_01`, encabezados monoespaciados y anotaciones técnicas. |
| Líneas estructurales | **Hairline** | `rgba(243, 242, 247, 0.085)` | Divisiones de `1px` que estructuran la página sin encerrar contenido en cajas. |

**Proporción obligatoria 80 / 15 / 5:**
- **80%** grafito (`#16161B` / `#1E1E26`) y espacio negativo generoso.
- **15%** tipografía limpia (`#F3F2F7` / `#A7A4B5`) y líneas arquitectónicas de `1px`.
- **5%** acento violeta (`#9B5DE5` / `#D16FFF`), solo donde el usuario interactúa o donde vive el punto focal.

Referencia visual descargable: [`assets/palette-graphite.svg`](./assets/palette-graphite.svg)

---

## 2. Sistema Tipográfico

- **Display y marca — `Expletus Sans` (500, 600, 700):** Cortes geométricos sutiles con carácter técnico. Se usa en el logotipo, titulares principales, títulos de sección y portadas de presentaciones. Tracking máximo `-0.025em`, sin degradados sobre el texto.
- **Lectura editorial — `Inter` (300, 400, 500):** Limpia, neutral y muy legible en párrafos (medida de `65–75ch`) y pies de componente (`font-weight: 300` en subtítulos y captions tipo Langflow).
- **Datos y especificaciones — `JetBrains Mono` (400, 500):** Reservada exclusivamente a códigos HEX, etiquetas `FIG_01`, medidas (`16:9`, `8px`) y metadatos con `tabular-nums`. Nunca se usa como adorno en párrafos largos.

---

## 3. Cómo se ve el efecto punteado de n8n (`DitherTrailGrid`)

Este es uno de los sellos atmosféricos más reconocibles de Katze. Puede usarse interactivo en web o como gráfico estático en presentaciones.

### Apariencia en reposo (textura base)
- No son círculos suaves ni puntos dispersos al azar: es una **malla pixelada muy nítida de micro-cuadrados en estructura de cruces** generada mediante una matriz de *ordered dithering* **Bayer 4×4** a escala pixelada `4×` (cada celda lógica mide `16×16 px` dividida en `4×4` sub-píxeles).
- En reposo sobreviven 3 de cada 4 micro-cuadrados en tono gris lavanda suave (`#CCCAE0` al ~21% de opacidad), creando un tramado técnico sutil que se **difumina progresivamente hacia el fondo `#16161B`** mediante un degradado lineal para no competir jamás con el texto.

### Cómo luce al mover el mouse (interacción)
- Al pasar el cursor, el trazo queda **anclado exactamente a la cuadrícula de `16×16 px`** (1 celda de grosor, sin ondas circulares difusas).
- En la **cabeza del cursor**, la celda aparece como un cuadrado sólido nítido en **Lavender `#D16FFF`**.
- Conforme el cursor avanza, la cola se disuelve en orden FIFO: los `4×4` sub-píxeles de cada celda van desapareciendo uno por uno en **patrón geométrico Bayer** (pasando de cuadrado sólido → tablero/cruz → micro-puntos dispersos) mientras el color transiciona suavemente de **`#D16FFF` a `#9B5DE5`** hasta desaparecer.

### Cómo luce el efecto automático (reposo sin cursor)
- Cuando nadie mueve el mouse durante unos segundos (si `prefers-reduced-motion` no está activo), el lienzo dispara **caminatas ortogonales lentas** (16 a 28 pasos en ángulo recto, como una señal recorriendo una placa) que dejan exactamente el mismo rastro Bayer violeta y se disuelven suavemente.

### Emplazamientos permitidos para web y presentaciones
Para no estorbar el contenido, la textura punteada se ubica en 4 zonas:
1. **Abajo (`bottom`):** Portadas y heroes — [`assets/dither-bottom.svg`](./assets/dither-bottom.svg) · [`assets/dither-bottom.png`](./assets/dither-bottom.png)
2. **Lado derecho (`right`):** Slides de texto a la izquierda — [`assets/dither-right.svg`](./assets/dither-right.svg) · [`assets/dither-right.png`](./assets/dither-right.png)
3. **Arriba (`top`):** Láminas de cierre o encabezados sobrios — [`assets/dither-top.svg`](./assets/dither-top.svg) · [`assets/dither-top.png`](./assets/dither-top.png)
4. **Diagonal derecha (`diagonal-right`):** Composición dinámica que despeja la lectura principal — [`assets/dither-diagonal-right.svg`](./assets/dither-diagonal-right.svg) · [`assets/dither-diagonal-right.png`](./assets/dither-diagonal-right.png)

Captura en vivo del Hero con trazo interactivo: [`assets/hero-dither-mouse.png`](./assets/hero-dither-mouse.png)

---

## 4. Elementos 3D Flotantes

- La animación tridimensional `katze-showcase-animated.glb` (`KatzeFullShowcase`) flota **completamente libre** sobre el lienzo `#16161B`.
- **Nunca** se encierra en tarjetas, marcos ni fondos cuadriculados ni se rodea de botones.
- Acabado grafito satinado oscuro iluminado con luz clave fría y *rim-lights* en `#9B5DE5` y `#D16FFF` para perfilar las aristas con nitidez, manteniendo siempre margen generoso en los 4 bordes para evitar recortes.

---

## 5. Sobriedad en reposo. Claridad al interactuar.

Captura de referencia: [`assets/pilares-sobriedad.png`](./assets/pilares-sobriedad.png)

- **Sin contenedor exterior:** cada bloque se compone únicamente de un cuadro redondeado (`radius: 24px`, fondo `#15151B`, borde fino `1.5px`) y una frase breve ligera (`Inter 300`) directamente debajo sobre el fondo.
- **Brillo exterior vs. acento interno:** al hacer hover, el marco exterior emite un resplandor interior **blanco/plata muy sutil**, mientras que el violeta Katze ilumina solamente el mecanismo interno activo (el contorno del slide activo, las píldoras conectadas por curvas SVG ancladas exactas o el halo lateral de la píldora atravesada por el reloj de arena binario).

---

## 6. Hoja de Diseño Técnica y Figuras `/anatomy`

Capturas de referencia: [`assets/plano-tecnico-raycast.png`](./assets/plano-tecnico-raycast.png) · [`assets/fig-01-fixed.png`](./assets/fig-01-fixed.png)

- **Hoja técnica continua:** retícula de 5 columnas (2 márgenes exteriores + 3 columnas de contenido) separadas únicamente por líneas de `1px` que se difuminan en los 4 bordes hacia `#16161B`. Cero tarjetas anidadas y cero esquinas redondeadas en las celdas.
- **Figuras isométricas `/anatomy`:** en lugar de diagramas planos de cajas y flechas, cada concepto se representa como un **instrumento físico sólido** con 4 tonos grafito de sombreado, tornillos, biseles, reglas graduadas y **una única pieza iluminada en `#D16FFF` / `#3E2466`** con movimiento calmo:
  - `FIG_01` Calibrador de capas: [`assets/fig-01-calibrator.svg`](./assets/fig-01-calibrator.svg)
  - `FIG_02` Marco 16:9 con carro vernier: [`assets/fig-02-drafting-frame.svg`](./assets/fig-02-drafting-frame.svg)
  - `FIG_03` Pulsador mecánico y dial: [`assets/fig-03-detent-plunger.svg`](./assets/fig-03-detent-plunger.svg)
  - `FIG_04` Consola dual de estado: [`assets/fig-04-state-deck.svg`](./assets/fig-04-state-deck.svg)

---

## 7. Reglas Rápidas para Cualquier Pieza (Web, Slides, Gráficos)

1. **Sí:** Espacio negativo amplio, divisores de `1px`, contraste verificado, monocromo en reposo, una sola pieza focal violeta por vista.
2. **No:** Negro puro `#000000`, tarjetas dentro de tarjetas, texto con degradado, etiquetas decorativas (*kickers*) encima de títulos ni humo comercial.
