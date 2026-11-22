# Katze — Brand Guidelines (Sistema Graphite)

> **Convertimos tecnología en resultados.**  
> *El sistema sigue al criterio.*

Guía oficial de identidad, sistema de diseño, componentes interactivos, Brand Knowledge y estilo de presentaciones (`/frontend-slides`) de **Katze** (*Odoo Ready Partner* enfocado en PyMEs del sector productivo).

Construido en **HTML, CSS y JavaScript puros** (sin pasos de compilación; `Three.js` se carga únicamente vía CDN para el visor `.glb` flotante).

## Estructura del proyecto

- `index.html` — Página principal (versión final **Graphite v3** con `FIG_01` corregido).
- `diseno.html` — **Página 1: Guía de Diseño & Skill para IA**, colorimetría (0% `#000000`), tipografías, textura punteada Bayer 4×4 (`DitherTrailGrid`) y galería de activos PNG/SVG descargables.
- `componentes.html` — **Página 2: Componentes Clave**, explorador interactivo con vista viva, reglas visuales, código de implementación y prompts listos para IA.
- `brand.html` — **Página 3: Brand Knowledge**, historia de origen, Misión, Visión, los 5 Valores, símbolo y tono de voz.
- `slides.html` — **Página 4: Estilo `/frontend-slides`**, guía para recrear presentaciones Katze, visor embebido de la presentación de 12 láminas y descarga directa en PDF.
- `skill/katze-design-system/` — Carpeta de skill visual (`SKILL.md` + `assets/*.svg` y `assets/*.png` para IA y presentaciones).
- `skill/katze-frontend-slides/STYLE_GUIDE.md` — Receta de diseño 16:9 (`1920×1080`) para `/frontend-slides`.
- `presentacion/katze-guideline-deck.html` — Presentación interactiva autocontenida (12 slides, 1920×1080).
- `presentacion/katze-guideline-deck.pdf` — Versión estática multipágina en PDF (12 páginas 16:9).
- `server.mjs` — Servidor estático ligero con Node nativo (puerto por defecto `4174`).

## Cómo abrirlo localmente

```bash
node server.mjs
```

Luego abre `http://127.0.0.1:4174/index.html` en tu navegador.
