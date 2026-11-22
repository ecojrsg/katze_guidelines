---
name: katze-frontend-slides-style
description: Guía oficial para recrear el estilo de presentaciones de Katze (Graphite) con la skill /frontend-slides. Define escenario fijo 1920×1080, los 4 emplazamientos de textura punteada Bayer 4×4, el formato de plano técnico de 5 columnas y los elementos flotantes con /anatomy y Sobriedad en reposo.
---

# Katze Presentation Style — Guía para `/frontend-slides`

Esta guía documenta cómo recrear desde cero una presentación con la identidad **Katze Graphite** dentro de **`/frontend-slides`** (HTML autocontenido, cero dependencias externas, escenario fijo 16:9).

---

## 1. Reglas No Negociables de Escenario Fijo

1. **Lienzo fijo `1920×1080`:** Todo slide se diseña en píxeles exactos (`width: 1920px; height: 1080px;`) dentro de `.deck-stage` y se escala uniformemente al viewport con `transform: translate(x, y) scale(factor)`.
2. **Incluir completo `viewport-base.css`:** Controlar la visibilidad de cada `.slide` únicamente con `.active` / `.visible` (`visibility`, `opacity`, `pointer-events`), nunca con `display: none`.
3. **Cero negro puro (`#000000`):** Usar `--stage-bg: #111116` para el letterbox exterior y `--slide-bg: #16161B` para el lienzo del slide.
4. **Exportación PDF directa:** Declarar `@page { size: 1920px 1080px; margin: 0; }` dentro de `@media print` y forzar `.reveal { opacity: 1 !important; transform: none !important; }`.

---

## 2. Arquetipos de Slide del Estilo Katze

### A. Slides con textura punteada n8n (4 emplazamientos)
Usar la malla Bayer 4×4 pixelada (`image-rendering: pixelated`, celdas `16×16 px`, rastro `#D16FFF → #9B5DE5`) posicionada donde nunca compita con el texto:
- **`bottom` (`height: 440px`):** Portadas, titulares principales arriba y slides de colorimetría.
- **`right` (`width: 780px`):** Slides narrativos con texto alineado a la izquierda (Brand Knowledge, Tipografía).
- **`top` (`height: 360px`):** Slides con rejillas o tablas densas en la mitad inferior (Valores, comparativas).
- **`diagonal-right` (`inset: 0`, gradiente `225deg`):** Slides de Misión/Visión, impacto ejecutivo y cierre.

### B. Slide formato “Sistema diseñado como plano técnico”
- Rejilla CSS de **5 columnas exactas** dentro de `1920×1080`: `110px 460px 620px 620px 110px` con `gap: 1px` sobre fondo `rgba(243,242,247,0.1)` (sin bordes dobles ni esquinas redondeadas).
- Celdas de contenido con tipografía `Expletus Sans` y notas breves en `JetBrains Mono`.
- Zonas punteadas (`#15151A`, puntos `1.5px` cada `20px`) reservadas para figuras sólidas de `/anatomy` con etiqueta `FIG_01`, `FIG_02`, etc.

### C. Elementos flotantes (`/anatomy` + “Sobriedad en reposo”)
- **Instrumentos `/anatomy`:** Sólidos isométricos generados con `iso-kit.mjs`, sombreado en 4 tonos grafito (`#16161E`..`#252532`) y una única pieza iluminada en `#D16FFF` / `#3E2466`. Flotan limpios sin marco extra o dentro de zonas punteadas.
- **Cuadros “Sobriedad en reposo. Claridad al interactuar.”:** 3 cuadros redondeados (`radius: 26px`, `#15151B`, brillo interior blanco sutil) con el título breve directamente debajo en `Inter 300`, sin contenedor externo ni etiquetas decorativas.

---

## 3. Paleta y Tipografía a Escala `1920×1080`

- **Superficies:** `#16161B` (slide), `#1C1C23` / `#1E1E26` (paneles), `#2E1A47` (acento estructural).
- **Acentos:** `#9B5DE5` (primario), `#D16FFF` (foco/brillo), `#714B67` (solo *Odoo Ready Partner*).
- **Escala recomendada en `1920×1080`:**
  - Portada (`h1`): `Expletus Sans 600`, `92px`, `line-height: 1.04`, `letter-spacing: -0.025em`.
  - Título de slide (`h2`): `Expletus Sans 600`, `62px`, `line-height: 1.08`.
  - Subtítulo / cuerpo: `Inter 300/400`, `25–28px`, `line-height: 1.5`.
  - Metadatos / `FIG_XX`: `JetBrains Mono`, `16–18px`.
