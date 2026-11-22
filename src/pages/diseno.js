import { mountSiteFooter, mountSiteNav } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import { bindCopyButton, initPaletteCopy } from '../components/moodboard-ui.js';

const PLACEMENT_COPY = {
  bottom: {
    title: 'Emplazamiento inferior (bottom)',
    desc: 'Ancla visual para Heroes y portadas. Mueve el mouse aquí para encender el rastro #D16FFF → #9B5DE5 o espera 3 s para ver el recorrido automático.',
  },
  right: {
    title: 'Emplazamiento lateral derecho (right)',
    desc: 'Despeja toda la columna izquierda para titulares y lectura limpia en diapositivas o páginas de documentación.',
  },
  top: {
    title: 'Emplazamiento superior (top)',
    desc: 'Aporta textura sutil en el borde superior sin invadir el área de tablas, tarjetas o cierres.',
  },
  'diagonal-right': {
    title: 'Emplazamiento diagonal derecho (diagonal-right)',
    desc: 'Degradado diagonal hacia la esquina superior derecha para dar dinamismo manteniendo libre el bloque principal de contenido.',
  },
};

const ASSET_CATALOG = [
  {
    title: 'Hero + Puntos Bayer en vivo',
    desc: 'Captura real del Hero Graphite con trazo violeta del cursor sobre la malla Bayer 4×4.',
    preview: './skill/katze-design-system/assets/hero-dither-mouse.png',
    downloads: [
      { label: 'PNG', href: './skill/katze-design-system/assets/hero-dither-mouse.png' },
    ],
  },
  {
    title: 'FIG_01 — Calibrador óptico (/anatomy)',
    desc: 'Instrumento isométrico de 3 capas con el potenciómetro frontal corregido en profundidad.',
    preview: './skill/katze-design-system/assets/fig-01-calibrator.svg',
    downloads: [
      { label: 'SVG', href: './skill/katze-design-system/assets/fig-01-calibrator.svg' },
      { label: 'PNG', href: './skill/katze-design-system/assets/fig-01-fixed.png' },
    ],
  },
  {
    title: 'Sobriedad en reposo (3 cuadros)',
    desc: 'Captura de referencia de los 3 cuadros monocromo→luz sin contenedor externo.',
    preview: './skill/katze-design-system/assets/pilares-sobriedad.png',
    downloads: [
      { label: 'PNG', href: './skill/katze-design-system/assets/pilares-sobriedad.png' },
    ],
  },
  {
    title: 'Hoja técnica 5 columnas (Raycast)',
    desc: 'Captura completa de la retícula continua de líneas 1px con figuras /anatomy.',
    preview: './skill/katze-design-system/assets/plano-tecnico-raycast.png',
    downloads: [
      { label: 'PNG', href: './skill/katze-design-system/assets/plano-tecnico-raycast.png' },
    ],
  },
  {
    title: 'Textura Bayer — Inferior (bottom)',
    desc: 'Gráfico listo para colocar en el pie de diapositivas 16:9 sobre #16161B.',
    preview: './skill/katze-design-system/assets/dither-bottom.svg',
    downloads: [
      { label: 'SVG', href: './skill/katze-design-system/assets/dither-bottom.svg' },
      { label: 'PNG', href: './skill/katze-design-system/assets/dither-bottom.png' },
    ],
  },
  {
    title: 'Textura Bayer — Derecha (right)',
    desc: 'Banda lateral derecha difuminada hacia el centro para slides de texto a la izquierda.',
    preview: './skill/katze-design-system/assets/dither-right.svg',
    downloads: [
      { label: 'SVG', href: './skill/katze-design-system/assets/dither-right.svg' },
      { label: 'PNG', href: './skill/katze-design-system/assets/dither-right.png' },
    ],
  },
  {
    title: 'Textura Bayer — Superior (top)',
    desc: 'Trama en el borde superior con rastro disuelto para encabezados y cierres.',
    preview: './skill/katze-design-system/assets/dither-top.svg',
    downloads: [
      { label: 'SVG', href: './skill/katze-design-system/assets/dither-top.svg' },
      { label: 'PNG', href: './skill/katze-design-system/assets/dither-top.png' },
    ],
  },
  {
    title: 'Textura Bayer — Diagonal derecha',
    desc: 'Esquina diagonal derecha despejando el área de lectura principal del slide.',
    preview: './skill/katze-design-system/assets/dither-diagonal-right.svg',
    downloads: [
      { label: 'SVG', href: './skill/katze-design-system/assets/dither-diagonal-right.svg' },
      { label: 'PNG', href: './skill/katze-design-system/assets/dither-diagonal-right.png' },
    ],
  },
  {
    title: 'Paleta Graphite & Figuras FIG_02–04',
    desc: 'Tarjeta vectorial de colorimetría 0% negro puro e instrumentos isométricos adicionales.',
    preview: './skill/katze-design-system/assets/palette-graphite.svg',
    downloads: [
      { label: 'Paleta SVG', href: './skill/katze-design-system/assets/palette-graphite.svg' },
      { label: 'FIG_02 SVG', href: './skill/katze-design-system/assets/fig-02-drafting-frame.svg' },
      { label: 'FIG_03 SVG', href: './skill/katze-design-system/assets/fig-03-detent-plunger.svg' },
      { label: 'FIG_04 SVG', href: './skill/katze-design-system/assets/fig-04-state-deck.svg' },
    ],
  },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInlineMarkdown(line) {
  return escapeHtml(line)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\(\.\/assets\/([^)]+)\)/g,
      '<a href="./skill/katze-design-system/assets/$2" download style="color:var(--accent-bright);text-decoration:underline">$1</a>'
    );
}

function markdownToSimpleHtml(md) {
  const withoutFrontmatter = md.replace(/^---[\s\S]*?---\s*/, '');
  const lines = withoutFrontmatter.split(/\r?\n/);
  const html = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line === '---') {
      closeList();
      html.push('<hr style="border:0;border-top:1px solid var(--hairline);margin:20px 0"/>');
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      html.push(`<h3>${renderInlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      html.push(`<h2>${renderInlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      closeList();
      html.push(`<h1>${renderInlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      if (!inList) {
        html.push('<ul class="rules-list" style="margin:10px 0 14px">');
        inList = true;
      }
      const item = line.replace(/^(-\s|\d+\.\s)/, '');
      html.push(`<li>${renderInlineMarkdown(item)}</li>`);
    } else if (line.startsWith('|')) {
      closeList();
      if (!/^\|[\s-|]+\|$/.test(line)) {
        html.push(`<p class="mono" style="font-size:0.76rem;margin:4px 0">${renderInlineMarkdown(line)}</p>`);
      }
    } else {
      closeList();
      html.push(`<p style="margin:8px 0">${renderInlineMarkdown(line)}</p>`);
    }
  }

  closeList();
  return html.join('\n');
}

function mountAssetGallery() {
  const host = document.querySelector('[data-asset-gallery]');
  if (!host) return;
  host.innerHTML = ASSET_CATALOG.map(
    (asset) => `
      <article class="asset-tile">
        <div class="asset-thumb">
          <img src="${asset.preview}" alt="${asset.title}" loading="lazy" />
        </div>
        <div class="asset-meta">
          <h3 class="asset-title">${asset.title}</h3>
          <p class="asset-desc">${asset.desc}</p>
          <div class="asset-downloads">
            ${asset.downloads
              .map(
                (dl) =>
                  `<a class="dl-link" href="${dl.href}" download>${dl.label} ↓</a>`
              )
              .join('')}
          </div>
        </div>
      </article>
    `
  ).join('');
}

function mountInteractiveDitherLab() {
  const stage = document.querySelector('[data-dither-preview]');
  const canvas = document.querySelector('[data-dither-preview-canvas]');
  const titleEl = document.querySelector('[data-dither-title]');
  const descEl = document.querySelector('[data-dither-desc]');
  const tabs = [...document.querySelectorAll('[data-dither-pos]')];
  if (!stage || !canvas) return;

  let handle = null;

  function setPlacement(placement) {
    handle?.destroy();
    stage.dataset.placement = placement;
    const copy = PLACEMENT_COPY[placement];
    if (copy) {
      if (titleEl) titleEl.textContent = copy.title;
      if (descEl) descEl.textContent = copy.desc;
    }
    handle = initDotTrailCanvas(canvas, {
      placement,
      listenTarget: stage,
      baseColor: '204, 202, 214',
      backgroundOpacity: 0.2,
      backgroundDitherAlpha: 56,
      glowPrimary: '209, 111, 255',
      glowSecondary: '155, 93, 229',
      trailOpacity: 0.92,
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      setPlacement(tab.dataset.ditherPos);
    });
  });

  setPlacement('bottom');
}

async function loadAndRenderSkillMd() {
  const container = document.querySelector('[data-skill-render]');
  let rawMarkdown = '';

  try {
    const res = await fetch('./skill/katze-design-system/SKILL.md');
    if (res.ok) {
      rawMarkdown = await res.text();
      if (container) container.innerHTML = markdownToSimpleHtml(rawMarkdown);
    }
  } catch {
    if (container) container.textContent = 'No se pudo cargar SKILL.md.';
  }

  document.querySelectorAll('[data-copy-skill-md]').forEach((btn) => {
    bindCopyButton(btn, () => rawMarkdown, {
      copiedLabel: 'SKILL.md copiado',
      toastMessage: 'SKILL.md copiado al portapapeles',
    });
  });
}

function initDisenoPage() {
  mountSiteNav('diseno');
  mountSiteFooter('diseno');
  initPaletteCopy();

  const heroCanvas = document.querySelector('[data-dot-trail]');
  if (heroCanvas) {
    initDotTrailCanvas(heroCanvas, {
      placement: 'bottom',
      baseColor: '204, 202, 214',
      backgroundOpacity: 0.2,
      backgroundDitherAlpha: 54,
      glowPrimary: '209, 111, 255',
      glowSecondary: '155, 93, 229',
    });
  }

  mountInteractiveDitherLab();
  mountAssetGallery();
  loadAndRenderSkillMd();
}

initDisenoPage();
