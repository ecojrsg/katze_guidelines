import { mountSiteNav, mountSiteFooter } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import { initAllKatzeAnatomyFigs } from '../components/katze-anatomy-figs.js';
import { initPaletteCopy, bindCopyButton } from '../components/moodboard-ui.js';

const AI_BRAND_PROMPT = `# Katze Brand Design System (Graphite)
- Empresa: Katze — Consultoría tecnológica, DevOps y Odoo Ready Partner para PyMEs productivas.
- Eslogan: "Convertimos tecnología en resultados."
- Paleta (0% negro puro #000000): Base #16161B, Superficies #1E1E26 / #252530, Katze Plum #2E1A47, Acento #9B5DE5, Foco/Glow #D16FFF, Tinta #F3F2F7 / #A7A4B5, Odoo Partner #714B67.
- Proporción: 80% grafito y espacio negativo, 15% tinta y líneas de 1px, 5% acento violeta solo en foco/estado activo.
- Tipografía: Expletus Sans (display/marca), Inter (cuerpo 65-75ch), JetBrains Mono (solo tokens, datos y cotas FIG_XX).
- Principios (/impeccable + /anatomy): cero tarjetas anidadas, cero kickers sobre titulares, cero degradado en texto, elementos interactivos monocromáticos en reposo que iluminan en hover, modelos 3D flotando libres sin recorte, y diagramas técnicos como sólidos isométricos con 4 tonos en lugar de cajas con flechas.`;

const HOURGLASS_WIDTHS = [
  20, 18, 14, 12, 10, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 10, 12, 14, 18, 20,
];

async function mountHeroThreeStage(stageEl) {
  try {
    const { initThreeStage } = await import('../components/three-stage.js');
    initThreeStage(stageEl, {
      preset: 'graphite',
      initialModel: 'showcase',
      cameraZ: 2.38,
      modelBasePath: './models/',
    });
  } catch (err) {
    console.warn('No se pudo inicializar el visor 3D:', err);
  }
}

function initHeroSection() {
  const stageEl = document.querySelector('[data-three-stage]');
  const trailEl = document.querySelector('[data-dot-trail]');

  if (stageEl) {
    mountHeroThreeStage(stageEl);
  }

  if (trailEl) {
    initDotTrailCanvas(trailEl, {
      placement: 'bottom',
      baseColor: '204, 202, 214',
      backgroundOpacity: 0.2,
      backgroundDitherAlpha: 54,
      glowPrimary: '209, 111, 255',
      glowSecondary: '155, 93, 229',
      trailOpacity: 0.92,
    });
  }
}

function initTileOneTabs() {
  const tile = document.querySelector('[data-t1-tile]');
  if (!tile) return;

  const buttons = [...tile.querySelectorAll('[data-t1-set]')];
  const slides = [...tile.querySelectorAll('[data-t1-slide]')];

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.t1Set;
      tile.dataset.slide = idx;
      buttons.forEach((b) =>
        b.setAttribute('aria-selected', String(b.dataset.t1Set === idx))
      );
      slides.forEach((s) =>
        s.classList.toggle('is-current', s.dataset.t1Slide === idx)
      );
    });
  });
}

function buildHourglassFrame(widths) {
  return widths
    .map((width) => {
      let row = '';
      for (let i = 0; i < width; i++) {
        row += Math.random() > 0.5 ? '1' : '0';
      }
      return row;
    })
    .join('\n');
}

function initTileThreeBinaryStream() {
  const streamEl = document.querySelector('[data-hourglass-stream]');
  if (!streamEl) return;

  const tile = streamEl.closest('.lf3-t3');
  streamEl.textContent = buildHourglassFrame(HOURGLASS_WIDTHS);

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
    return;
  }

  let timer = 0;
  tile?.addEventListener('mouseenter', () => {
    clearInterval(timer);
    timer = setInterval(() => {
      streamEl.textContent = buildHourglassFrame(HOURGLASS_WIDTHS);
    }, 120);
  });

  tile?.addEventListener('mouseleave', () => {
    clearInterval(timer);
  });
}

function initAiPromptCopy() {
  const button = document.querySelector('[data-copy-ai-prompt]');
  if (!button) return;

  bindCopyButton(button, AI_BRAND_PROMPT, {
    copiedLabel: 'Prompt copiado al portapapeles',
    toastMessage: 'Prompt de marca copiado al portapapeles',
  });
}

function initHomePage() {
  mountSiteNav('home');
  initHeroSection();
  initTileOneTabs();
  initTileThreeBinaryStream();
  initAllKatzeAnatomyFigs();
  initPaletteCopy();
  initAiPromptCopy();
  mountSiteFooter('home');
}

initHomePage();
