---
name: katze-frontend-slides-style
description: Guía oficial para recrear el estilo de presentaciones de Katze (katze-graphite) registrado en /frontend-slides. Define escenario fijo 1920×1080, la regla no negociable de textura punteada Bayer 4×4 SIEMPRE interactiva en HTML (4 emplazamientos), el formato de plano técnico de 5 columnas y los elementos flotantes interactivos con /anatomy y Sobriedad en reposo.
---

# Katze Presentation Style (`katze-graphite`) — Guía para `/frontend-slides`

Esta guía documenta cómo recrear desde cero una presentación con la identidad **Katze Graphite** dentro de **`/frontend-slides`** (HTML autocontenido, cero dependencias externas, escenario fijo 16:9).

El estilo está registrado oficialmente en el pack de `/frontend-slides` bajo el slug **`katze-graphite`**:
- `bold-template-pack/selection-index.json` (`slug: "katze-graphite"`)
- `bold-template-pack/templates/katze-graphite/preview.md`
- `bold-template-pack/templates/katze-graphite/design.md`
- `bold-template-pack/templates/katze-graphite/template.html`

---

## 1. Reglas No Negociables de Escenario Fijo

1. **Lienzo fijo `1920×1080`:** Todo slide se diseña en píxeles exactos (`width: 1920px; height: 1080px;`) dentro de `.deck-stage` y se escala uniformemente al viewport con `transform: translate(x, y) scale(factor)`.
2. **Incluir completo `viewport-base.css`:** Controlar la visibilidad de cada `.slide` únicamente con `.active` / `.visible` (`visibility`, `opacity`, `pointer-events`), nunca con `display: none`.
3. **Cero negro puro (`#000000`):** Usar `--stage-bg: #111116` para el letterbox exterior y `--slide-bg: #16161B` para el lienzo del slide.
4. **Exportación PDF directa:** Declarar `@page { size: 1920px 1080px; margin: 0; }` dentro de `@media print` y forzar `.reveal { opacity: 1 !important; transform: none !important; }`.

---

## 2. Regla Obligatoria: Puntos Bayer 4×4 SIEMPRE Interactivos en HTML

Siempre que un slide HTML incluya la textura punteada n8n (malla Bayer 4×4, `image-rendering: pixelated`, celdas `16×16 px`), **DEBE ser interactiva en tiempo real** — nunca una imagen estática ni un canvas pintado una sola vez:

1. **Rastro reactivo al cursor calibrado a escala:** Mapear `pointermove` usando el rectángulo escalado del canvas:
   ```js
   const col = Math.floor(((e.clientX - rect.left) / rect.width) * (canvas.width / 4));
   const row = Math.floor(((e.clientY - rect.top) / rect.height) * (canvas.height / 4));
   ```
   Esto garantiza precisión exacta tanto en pantalla completa como dentro de un `<iframe>`.
2. **Interpolación lineal + disolución FIFO Bayer 4×4:** Interpolar pasos entre celdas (`20ms` de desfase), retener `620ms`, disolver en `760ms` con corte `progress * progress * 16` e interpolar color `#D16FFF → #9B5DE5`.
3. **Caminatas autónomas en reposo:** Cuando el cursor no está sobre el canvas, lanzar recorridos ortogonales con giros de 90° dentro de la zona segura de cada emplazamiento (y sembrar un rastro inicial al activar el slide).
4. **Rendimiento y accesibilidad:** Ejecutar `requestAnimationFrame` solo en los canvas del `.slide.active` y respetar `prefers-reduced-motion: reduce`.

### Los 4 emplazamientos disponibles (sin estorbar al contenido)
- **`bottom` (`height: 440px`):** Portadas, titulares principales arriba y slides de colorimetría.
- **`right` (`width: 780px`):** Slides narrativos con texto alineado a la izquierda (Brand Knowledge, Tipografía).
- **`top` (`height: 360px`):** Slides con rejillas o tablas densas en la mitad inferior (Valores, comparativas).
- **`diagonal-right` (`inset: 0`, gradiente `225deg`):** Slides de Misión/Visión, impacto ejecutivo y cierre.

---

## 3. Otros Arquetipos de Slide del Estilo Katze

### A. Slide formato “Sistema diseñado como plano técnico”
- Rejilla CSS de **5 columnas exactas** dentro de `1920×1080`: `110px 460px 620px 620px 110px` con `gap: 1px` sobre fondo `rgba(243,242,247,0.1)` (sin bordes dobles ni esquinas redondeadas).
- Celdas de contenido con tipografía `Expletus Sans` y notas breves en `JetBrains Mono`.
- Zonas punteadas (`#15151A`, puntos `1.5px` cada `20px`) reservadas para figuras sólidas de `/anatomy` con etiqueta `FIG_01`, `FIG_02`, etc.

### B. Elementos flotantes interactivos (`/anatomy` + “Sobriedad en reposo”)
- **Instrumentos `/anatomy`:** Sólidos isométricos generados con `iso-kit.mjs`, sombreado en 4 tonos grafito (`#16161E`..`#252532`) y una única pieza iluminada en `#D16FFF` / `#3E2466`. En HTML responden suavemente a hover/clic (`FIG_01` separación de capas Z, `FIG_02` carro vernier, `FIG_03`/`FIG_04` accionamiento al clic).
- **Cuadros “Sobriedad en reposo. Claridad al interactuar.”:** 3 cuadros redondeados (`radius: 26px`, `#15151B`) monocromos en reposo que iluminan su brillo blanco/plata interior y acento violeta interno al pasar el mouse o interactuar (switcher `Web UI` / `Slides 16:9`, nodos + píldoras ancladas y stream binario vivo).

---

## 4. Paleta y Tipografía a Escala `1920×1080`

- **Superficies:** `#16161B` (slide), `#1C1C23` / `#1E1E26` (paneles), `#2E1A47` (acento estructural).
- **Acentos:** `#9B5DE5` (primario), `#D16FFF` (foco/brillo), `#714B67` (solo *Odoo Ready Partner*).
- **Escala recomendada en `1920×1080`:**
  - Portada (`h1`): `Expletus Sans 600`, `92px`, `line-height: 1.04`, `letter-spacing: -0.025em`.
  - Título de slide (`h2`): `Expletus Sans 600`, `62px`, `line-height: 1.08`.
  - Subtítulo / cuerpo: `Inter 300/400`, `25–28px`, `line-height: 1.5`.
  - Metadatos / `FIG_XX`: `JetBrains Mono`, `16–18px`.
