import { mountSiteFooter, mountSiteNav } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import { bindCopyButton } from '../components/moodboard-ui.js';

const FRONTEND_SLIDES_PROMPT = `Usa /frontend-slides con la plantilla registrada "katze-graphite" (bold-template-pack/templates/katze-graphite/design.md) para crear una presentación de Katze en un único HTML autocontenido con escenario fijo 16:9 (1920x1080, incluyendo viewport-base.css completo y @page { size: 1920px 1080px; margin: 0; }).

Reglas visuales e interactivas obligatorias (Katze Graphite):
- 0% negro puro (#000000): usar --stage-bg: #111116 y --slide-bg: #16161B, superficies #1C1C23 / #1E1E26, Katze Plum #2E1A47, acentos #9B5DE5 y #D16FFF (solo en foco), Odoo Plum #714B67 solo en el distintivo Partner.
- Tipografía: Expletus Sans (h1 92px, h2 62px), Inter (cuerpo 24-28px), JetBrains Mono (cotas FIG_XX y metadatos 16-18px).
- REGLA NO NEGOCIABLE DE PUNTOS BAYER 4x4: siempre que se incluya la textura punteada n8n (en bottom, right, top o diagonal-right), en los slides HTML DEBE ser interactiva en tiempo real (rastro reactivo al cursor calibrado al escenario escalado 1920x1080 con disolución FIFO #D16FFF -> #9B5DE5 + caminatas ortogonales automáticas, pausada en slides inactivos).
- Incluir al menos un slide con el formato "Sistema diseñado como plano técnico" (rejilla fija de 5 columnas con líneas de 1px y zonas punteadas #15151A).
- Para elementos visuales flotantes, combinar instrumentos físicos sólidos isométricos de /anatomy (4 tonos grafito + una sola pieza en #D16FFF, interactivos en hover/clic) y cuadros del estilo "Sobriedad en reposo. Claridad al interactuar." sin contenedor externo (monocromos en reposo, vivos al interactuar).
- Eslogan de marca: "Convertimos tecnología en resultados."`;

function bindInlineViewerButton() {
  const openBtn = document.querySelector('[data-open-deck-inline]');
  const section = document.getElementById('visor-slides');
  const frame = document.querySelector('.deck-embed-frame');
  if (!openBtn || !section) return;

  openBtn.addEventListener('click', () => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => frame?.focus(), 450);
  });
}

const INSTALL_CLI_COMMANDS = `git clone https://github.com/ecojrsg/katze_guidelines.git
cd katze_guidelines
node skill/katze-frontend-slides/install-template.mjs

# Si la skill está en una ruta personalizada:
# node skill/katze-frontend-slides/install-template.mjs --skill-dir "RUTA/A/frontend-slides"`;

const SELECTION_INDEX_ENTRY = `{
  "slug": "katze-graphite",
  "name": "Katze Graphite",
  "tagline": "Warm graphite dark canvas (0% pure black) with interactive n8n Bayer 4x4 dotted trails, 1px technical blueprint grids, and isometric /anatomy instruments.",
  "mood": ["technical", "minimalist", "editorial", "architectural", "calm", "high-precision"],
  "tone": ["authoritative", "sober", "modern", "transparent", "engineered"],
  "formality": "high",
  "density": "low",
  "scheme": "dark",
  "best_for": "Brand guidelines, engineering & DevOps consulting decks, Odoo ERP architecture proposals, technical executive reviews, and product design systems that want sober monochrome rest states with interactive Bayer 4x4 violet trails and solid isometric /anatomy diagrams.",
  "avoid_for": "Playful consumer campaigns, loud neon pitches, or decks that require bright white daylight backgrounds.",
  "preview_md": "bold-template-pack/templates/katze-graphite/preview.md",
  "design_md": "bold-template-pack/templates/katze-graphite/design.md"
}`;

const INSTALL_AI_PROMPT = `Instala la plantilla "katze-graphite" incluida en este repositorio (skill/katze-frontend-slides/katze-graphite/) dentro de mi skill global /frontend-slides:
1. Ejecuta "node skill/katze-frontend-slides/install-template.mjs" (o copia preview.md, design.md y template.html a bold-template-pack/templates/katze-graphite/ y agrega selection-index-entry.json a bold-template-pack/selection-index.json actualizando template_count).
2. Verifica que selection-index.json sea JSON válido y contenga el slug "katze-graphite".`;

function mountCopyBlock(preSelector, btnSelector, content, toastMessage) {
  const pre = document.querySelector(preSelector);
  const btn = document.querySelector(btnSelector);
  if (pre) pre.textContent = content;
  bindCopyButton(btn, content, {
    copiedLabel: 'Copiado',
    toastMessage,
  });
}

function mountRecreationPrompt() {
  mountCopyBlock(
    '[data-slides-prompt]',
    '[data-copy-slides-prompt]',
    FRONTEND_SLIDES_PROMPT,
    'Prompt de /frontend-slides copiado'
  );
  mountCopyBlock(
    '[data-install-cmd]',
    '[data-copy-install-cmd]',
    INSTALL_CLI_COMMANDS,
    'Comandos de instalación copiados'
  );
  mountCopyBlock(
    '[data-install-json]',
    '[data-copy-install-json]',
    SELECTION_INDEX_ENTRY,
    'Entrada JSON de selection-index copiada'
  );
  mountCopyBlock(
    '[data-install-ai-prompt]',
    '[data-copy-install-ai]',
    INSTALL_AI_PROMPT,
    'Prompt de instalación automática copiado'
  );
}

function initSlidesPage() {
  mountSiteNav('slides');
  mountSiteFooter('slides');

  const canvas = document.querySelector('[data-dot-trail]');
  if (canvas) {
    initDotTrailCanvas(canvas, {
      placement: 'diagonal-right',
      baseColor: '204, 202, 214',
      backgroundOpacity: 0.2,
      backgroundDitherAlpha: 54,
      glowPrimary: '209, 111, 255',
      glowSecondary: '155, 93, 229',
    });
  }

  bindInlineViewerButton();
  mountRecreationPrompt();
}

initSlidesPage();
