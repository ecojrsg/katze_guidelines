import { mountSiteFooter, mountSiteNav } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import { bindCopyButton } from '../components/moodboard-ui.js';

const FRONTEND_SLIDES_PROMPT = `Usa /frontend-slides para crear una presentación de Katze en un único HTML autocontenido con escenario fijo 16:9 (1920x1080, incluyendo viewport-base.css completo y @page { size: 1920px 1080px; margin: 0; }).

Reglas visuales obligatorias (Katze Graphite):
- 0% negro puro (#000000): usar --stage-bg: #111116 y --slide-bg: #16161B, superficies #1C1C23 / #1E1E26, Katze Plum #2E1A47, acentos #9B5DE5 y #D16FFF (solo en foco), Odoo Plum #714B67 solo en el distintivo Partner.
- Tipografía: Expletus Sans (h1 92px, h2 62px), Inter (cuerpo 24-28px), JetBrains Mono (cotas FIG_XX y metadatos 16-18px).
- Incluir slides con textura punteada Bayer 4x4 (n8n) ubicada en bottom, right, top y diagonal-right para despejar el contenido.
- Incluir al menos un slide con el formato "Sistema diseñado como plano técnico" (rejilla fija de 5 columnas con líneas de 1px y zonas punteadas #15151A).
- Para elementos visuales flotantes, combinar instrumentos físicos sólidos isométricos de /anatomy (4 tonos grafito + una sola pieza en #D16FFF) y cuadros del estilo "Sobriedad en reposo. Claridad al interactuar." sin contenedor externo.
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

function mountRecreationPrompt() {
  const pre = document.querySelector('[data-slides-prompt]');
  const btn = document.querySelector('[data-copy-slides-prompt]');
  if (pre) pre.textContent = FRONTEND_SLIDES_PROMPT;
  bindCopyButton(btn, FRONTEND_SLIDES_PROMPT, {
    copiedLabel: 'Prompt copiado',
    toastMessage: 'Prompt de /frontend-slides copiado',
  });
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
