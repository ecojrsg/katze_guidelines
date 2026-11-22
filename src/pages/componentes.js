import { mountSiteFooter, mountSiteNav } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import {
  mountFig01,
  mountFig02,
  mountFig03,
  mountFig04,
} from '../components/katze-anatomy-figs.js';
import { bindCopyButton, initPaletteCopy } from '../components/moodboard-ui.js';

const HOURGLASS_WIDTHS = [20, 18, 14, 12, 10, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 10, 12, 14, 18, 20];

const ANATOMY_MOUNTERS = {
  '01': mountFig01,
  '02': mountFig02,
  '03': mountFig03,
  '04': mountFig04,
};

const COMPONENTS = [
  {
    id: 'hero-dither',
    code: 'CMP_01',
    name: 'Hero + Puntos Bayer (n8n)',
    summary:
      'Lienzo oscuro #16161B con textura de cruces por dithering Bayer 4×4 pixelado 4×, rastro FIFO reactivo al cursor (#D16FFF → #9B5DE5) y caminatas ambientales automáticas.',
    rules: [
      'Usar #16161B como base (nunca #000000) y degradado suave con mask-image en los bordes.',
      'Mantener celdas lógicas de 16×16 px (4×4 píxeles internos con image-rendering: pixelated).',
      'Soporta 4 emplazamientos sin estorbar contenido: bottom, right, top y diagonal-right.',
      'Respetar prefers-reduced-motion desactivando las caminatas automáticas.',
    ],
    snippet: `<section class="v3-hero dot-host">
  <canvas class="dot-trail-layer" data-dot-trail data-placement="bottom" aria-hidden="true"></canvas>
  <div class="wrap">...</div>
</section>

<script type="module">
  import { initDotTrailCanvas } from './src/components/dot-trail-canvas.js';
  initDotTrailCanvas(document.querySelector('[data-dot-trail]'), {
    placement: 'bottom', // 'bottom' | 'right' | 'top' | 'diagonal-right'
    glowPrimary: '209, 111, 255',
    glowSecondary: '155, 93, 229',
  });
</script>`,
    prompt: `Crea una sección Hero para Katze sobre fondo grafito #16161B (0% negro puro) con tipografía Expletus Sans para el titular e Inter para el texto. Añade en la capa inferior un canvas <canvas> con image-rendering: pixelated escalado 4x aplicando una matriz Bayer 4x4 a opacidad 0.20 (malla de micro-cruces) con mask-image vertical. Al mover el mouse, ilumina celdas de 16x16px con rastro FIFO que disuelve píxeles en orden Bayer pasando de #D16FFF en la cabeza a #9B5DE5 en la cola, más caminatas ortogonales automáticas en reposo.`,
    mount: mountHeroDitherDemo,
  },
  {
    id: 'floating-3d',
    code: 'CMP_02',
    name: 'Visor 3D Flotante (.glb)',
    summary:
      'Animación katze-showcase-animated.glb (KatzeFullShowcase, 24 s) flotando libre sobre el lienzo sin tarjeta, sin bordes, sin botones y sin recorte en ningún fotograma.',
    rules: [
      'Cero contenedor exterior, cero botones de control y cero grid isométrico detrás.',
      'Usar cámara con margen amplio (cameraZ >= 2.38 y altura mínima de 460–520 px) para no cortar las orejas del logo ni Odoo.',
      'Iluminación de estudio con rim-light en #9B5DE5 y #D16FFF sobre acabado grafito satinado.',
      'Mantener Three.js cargado únicamente vía importmap CDN para el archivo .glb.',
    ],
    snippet: `<div class="v3-floating-3d" data-three-stage aria-label="Animación 3D Katze"></div>

<script type="module">
  import { initThreeStage } from './src/components/three-stage.js';
  initThreeStage(document.querySelector('[data-three-stage]'), {
    preset: 'graphite',
    initialModel: 'showcase',
    cameraZ: 2.38,
  });
</script>`,
    prompt: `Integra el modelo 3D katze-showcase-animated.glb de Katze usando Three.js con fondo 100% transparente flotando directamente sobre #16161B. Prohibido encerrarlo en tarjetas, ponerle bordes o añadir botones alrededor. Ajusta cameraZ a 2.38 con altura generosa para que nunca se recorte ningún extremo durante la animación de 24 segundos, ilumina con rim-lights en #9B5DE5 y #D16FFF y desactiva el zoom de rueda para no secuestrar el scroll.`,
    mount: mountFloating3dDemo,
  },
  {
    id: 'spec-strip',
    code: 'CMP_03',
    name: 'Banda de Especificaciones',
    summary:
      'División arquitectónica horizontal de 4 columnas separadas por líneas finas de 1px justo debajo del Hero para anclar los 4 pilares técnicos de la guía.',
    rules: [
      'Fondo #18181F con bordes superior, inferior y verticales en rgba(243, 242, 247, 0.085).',
      'Etiqueta superior en JetBrains Mono 0.70rem en mayúsculas; valor en Inter 0.84rem peso 500.',
      'Colapsa a 2 columnas en móvil (< 820px) sin desbordamiento horizontal.',
    ],
    snippet: `<div class="v3-spec-strip">
  <div class="v3-spec-cell">
    BASE CROMÁTICA
    <strong>Grafito #16161B · 0% negro puro</strong>
  </div>
  <div class="v3-spec-cell">
    TEXTURA REACTIVA
    <strong>Bayer 4×4 DitherTrailGrid (n8n)</strong>
  </div>
  <!-- 4 celdas en total -->
</div>`,
    prompt: `Agrega una franja divisoria arquitectónica de 4 columnas a todo lo ancho debajo del Hero para Katze. Fondo #18181F, separadores de 1px en rgba(243,242,247,0.085), sin border-radius ni sombras. Cada celda lleva una etiqueta corta en JetBrains Mono (#767385) arriba y un valor conciso en Inter 500 (#F3F2F7) abajo. En pantallas menores a 820px pasa a 2 columnas.`,
    mount: mountSpecStripDemo,
  },
  {
    id: 'pillars',
    code: 'CMP_04',
    name: 'Cuadros de Pilares (Sobriedad)',
    summary:
      'Tres cuadros interactivos distintos inspirados en Langflow sin contenedor externo ni etiquetas debajo: monocromo sobrio en reposo y luz controlada al pasar el cursor.',
    rules: [
      'Cero card envolviendo cuadro + texto: cada columna tiene solo el cuadro rounded-24px y la descripción suelta debajo.',
      'El marco exterior brilla suavemente en blanco/plata en hover; el acento violeta se concentra en el elemento interno activo.',
      'Cuadro 1: dos slides visibles a la vez con toggle limpio; Cuadro 2: 4 curvas SVG ancladas exactas; Cuadro 3: reloj de arena binario atravesando el centro desvanecido.',
    ],
    snippet: `<div class="lf3-row">
  <div class="lf3-item">
    <div class="lf3-tile lf3-t1" data-slide="0" data-t1-tile>...</div>
    <h3 class="lf3-caption">Un mismo lenguaje para web, presentaciones y piezas gráficas</h3>
  </div>
  <!-- Cuadro 2 (.lf3-t2) y Cuadro 3 (.lf3-t3) -->
</div>`,
    prompt: `Construye una fila de 3 elementos interactivos estilo "Sobriedad en reposo. Claridad al interactuar." para Katze sin tarjetas envolventes ni etiquetas debajo. Cada elemento consta únicamente de un cuadro redondeado (radius 24px, fondo #15151B, borde 1.5px que en hover genera brillo interior blanco sutil) y un título ligero en Inter 300 debajo. Los 3 cuadros deben ser distintos entre sí: (1) carrusel con dos slides visibles y borde violeta #9B5DE5 solo en el activo, (2) 3 nodos centrales monocromos que pasan a color con 4 píldoras periféricas conectadas por curvas SVG ancladas, (3) píldora horizontal con centro desvanecido atravesado por un reloj de arena binario vivo.`,
    mount: mountPillarsDemo,
  },
  {
    id: 'blueprint-anatomy',
    code: 'CMP_05',
    name: 'Plano Técnico + /anatomy (FIG_01–04)',
    summary:
      'Hoja técnica continua de 5 columnas con líneas de 1px difuminadas en los 4 bordes y 4 instrumentos físicos sólidos isométricos creados con iso-kit.mjs.',
    rules: [
      'Retícula de 5 columnas (márgenes laterales + 3 columnas centrales de 360px) con gap: 1px; cero tarjetas anidadas.',
      'Zonas de diagrama con fondo punteado #15151A y etiqueta monoespaciada FIG_XX.',
      'Objetos físicos sólidos con sombreado de 4 tonos, orden de profundidad real (depthOf) y un solo elemento iluminado (.iso-lit en #D16FFF).',
      'En FIG_01, el potenciómetro se pinta delante de las capas ópticas respetando profundidad real.',
    ],
    snippet: `import { mountFig01 } from './src/components/katze-anatomy-figs.js';

const host = document.querySelector('[data-anatomy-fig="01"]');
const handle = mountFig01(host);
// Para limpiar al desmontar:
// handle.destroy();`,
    prompt: `Diseña una sección tipo hoja técnica de 5 columnas con líneas divisorias de 1px que se difuminan en los 4 bordes hacia #16161B, sin border-radius ni cajas anidadas. En las celdas con fondo punteado (#15151A), coloca una etiqueta monoespaciada FIG_01..FIG_04 y dibuja mecanismos físicos isométricos sólidos (no wireframes vacíos ni cajas con flechas) con sombreado en 4 tonos grafito y una única pieza focal iluminada en #9B5DE5 / #D16FFF con movimiento calmo pausado fuera de pantalla.`,
    mount: mountAnatomyDemo,
  },
  {
    id: 'tokens-buttons',
    code: 'CMP_06',
    name: 'Tokens de Color y Botones',
    summary:
      'Barra tonal unificada de 7 colores con copia en un clic y botones minimalistas sobrios que respetan la proporción 80/15/5.',
    rules: [
      'Paleta unificada en una sola tira dividida por líneas de 1px (no 7 tarjetas sueltas).',
      'Botón primario reservado a una sola acción principal por vista (#9B5DE5); botones secundarios en #1C1C23 con borde fino.',
      'Sello Odoo Ready Partner reservado exclusivamente al tono oficial #714B67.',
    ],
    snippet: `<div class="palette-strip">
  <button type="button" class="palette-col" data-copy-hex="#16161B">
    <div class="palette-tone" style="background:#16161b"></div>
    <div class="palette-info">
      <div class="palette-name">Carbon</div>
      <div class="palette-hex">#16161B</div>
    </div>
  </button>
</div>
<button type="button" class="k-btn k-btn--primary">Acción principal</button>`,
    prompt: `Crea los controles y barra de tokens de Katze siguiendo la proporción 80% grafito (#16161B/#1E1E26), 15% tinta y líneas de 1px, 5% acento violeta (#9B5DE5/#D16FFF). Muestra la paleta en una sola tira dividida por líneas de 1px con copia de HEX al clic y toast discreto en #2E1A47 con borde #D16FFF. Usa botones limpios con radius 8px y fuente JetBrains Mono 0.78rem.`,
    mount: mountTokensButtonsDemo,
  },
  {
    id: 'navigation',
    code: 'CMP_07',
    name: 'Navegación y Footer',
    summary:
      'Cabecera fija minimalista de 64px con logotipo en blanco, 5 rutas claras, cajón móvil accesible (Escape / clic fuera) y pie arquitectónico con sello Odoo Ready Partner.',
    rules: [
      'Altura fija de 64px, fondo translúcido rgba(22,22,27,0.84) con blur 14px y línea inferior de 1px.',
      'Sin botones de venta ni insignias ruidosas en el header; el sello Odoo Ready Partner vive con sobriedad en el footer.',
      'Un solo módulo site-nav.js inyecta header y footer consistentes en todas las páginas.',
    ],
    snippet: `<header class="v3-header" data-site-header></header>
<!-- contenido -->
<footer class="v3-footer" data-site-footer></footer>

<script type="module">
  import { mountSiteNav, mountSiteFooter } from './src/components/site-nav.js';
  mountSiteNav('componentes');
  mountSiteFooter('componentes');
</script>`,
    prompt: `Implementa un header sticky de 64px y un footer arquitectónico para Katze en HTML/CSS/JS puros. El header lleva a la izquierda el isotipo Katze en blanco junto a "Katze" en Expletus Sans 600 y a la derecha enlaces limpios en Inter 0.875rem (#A7A4B5, activo en #D16FFF) con botón Menú desplegable en móvil. El footer sobre #15151A incluye el eslogan "Convertimos tecnología en resultados." y el distintivo discreto "Odoo Ready Partner" en #714B67.`,
    mount: mountNavigationDemo,
  },
];

function buildHourglassText() {
  return HOURGLASS_WIDTHS.map((width) => {
    let row = '';
    for (let i = 0; i < width; i++) {
      row += Math.random() > 0.5 ? '1' : '0';
    }
    return row;
  }).join('\n');
}

function mountHeroDitherDemo(container) {
  let activePlacement = 'bottom';
  let ditherHandle = null;

  container.innerHTML = `
    <div class="comp-live-controls">
      <button type="button" class="placement-tab is-active" data-set-place="bottom">bottom</button>
      <button type="button" class="placement-tab" data-set-place="right">right</button>
      <button type="button" class="placement-tab" data-set-place="top">top</button>
      <button type="button" class="placement-tab" data-set-place="diagonal-right">diagonal-right</button>
    </div>
    <div class="dither-stage" data-placement="bottom" data-demo-dither-stage>
      <canvas class="dot-trail-layer" data-demo-canvas aria-hidden="true"></canvas>
      <div class="dither-stage-copy">
        <h4>Convertimos tecnología en resultados.</h4>
        <p>Mueve el cursor dentro del lienzo para probar el rastro Bayer 4×4 en la posición activa.</p>
      </div>
    </div>
  `;

  const stage = container.querySelector('[data-demo-dither-stage]');
  const canvas = container.querySelector('[data-demo-canvas]');
  const tabs = [...container.querySelectorAll('[data-set-place]')];

  function rebuildCanvas(placement) {
    ditherHandle?.destroy();
    activePlacement = placement;
    stage.dataset.placement = placement;
    ditherHandle = initDotTrailCanvas(canvas, {
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
      const next = tab.dataset.setPlace;
      if (next === activePlacement) return;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      rebuildCanvas(next);
    });
  });

  rebuildCanvas('bottom');
  return () => ditherHandle?.destroy();
}

function mountFloating3dDemo(container) {
  let stageHandle = null;
  let disposed = false;

  container.innerHTML = `
    <div
      class="v3-floating-3d"
      style="height: 380px;"
      data-demo-3d
      aria-label="Vista viva del visor 3D flotante Katze"
    ></div>
    <p class="mono" style="margin: 8px 0 0; font-size: 0.72rem; color: var(--ink-muted); text-align: center;">
      Arrastra el modelo para rotar · Sin caja, sin bordes, cameraZ: 2.38
    </p>
  `;

  const host = container.querySelector('[data-demo-3d]');
  import('../components/three-stage.js')
    .then(({ initThreeStage }) => {
      if (disposed || !host) return;
      stageHandle = initThreeStage(host, {
        preset: 'graphite',
        initialModel: 'showcase',
        cameraZ: 2.38,
      });
    })
    .catch(() => {
      if (host) {
        host.innerHTML =
          '<p class="mono" style="padding:24px;color:var(--ink-muted)">Visor 3D requiere conexión a Three.js CDN.</p>';
      }
    });

  return () => {
    disposed = true;
    stageHandle?.destroy();
  };
}

function mountSpecStripDemo(container) {
  container.innerHTML = `
    <div class="v3-spec-strip" style="border: 1px solid var(--hairline); border-radius: 8px; overflow: hidden;">
      <div class="v3-spec-cell">
        BASE CROMÁTICA
        <strong>Grafito #16161B · 0% negro puro</strong>
      </div>
      <div class="v3-spec-cell">
        TEXTURA REACTIVA
        <strong>Bayer 4×4 DitherTrailGrid (n8n)</strong>
      </div>
      <div class="v3-spec-cell">
        IDENTIDAD 3D
        <strong>KatzeFullShowcase flotante</strong>
      </div>
      <div class="v3-spec-cell">
        TIPOGRAFÍA
        <strong>Expletus Sans · Inter · JetBrains Mono</strong>
      </div>
    </div>
  `;
  return () => {};
}

function mountPillarsDemo(container) {
  container.innerHTML = `
    <div class="lf3-row" style="margin-top: 0;">
      <div class="lf3-item">
        <div class="lf3-tile lf3-t1" data-slide="0" data-demo-t1>
          <div class="lf3-t1-viewport">
            <div class="lf3-t1-track">
              <div class="lf3-t1-slide is-current" data-demo-slide="0">
                <div class="lf3-t1-inner-card">
                  <span class="lf3-t1-mini-title">katze.ui</span>
                  <div class="lf3-t1-bars"><span style="width:82%"></span><span style="width:58%"></span></div>
                  <span class="lf3-t1-mini-title">&gt;_</span>
                </div>
              </div>
              <div class="lf3-t1-slide" data-demo-slide="1">
                <div class="lf3-t1-inner-card">
                  <span class="lf3-t1-mini-title">deck 16:9</span>
                  <div class="lf3-t1-bars"><span style="width:72%"></span><span style="width:44%"></span></div>
                  <span class="lf3-t1-mini-title">01 / 12</span>
                </div>
              </div>
            </div>
          </div>
          <div class="lf3-t1-bar">
            <button type="button" class="lf3-t1-tab" data-demo-set="0">Web UI</button>
            <button type="button" class="lf3-t1-tab" data-demo-set="1">Slides 16:9</button>
          </div>
        </div>
        <h3 class="lf3-caption">Un mismo lenguaje multiformato</h3>
      </div>

      <div class="lf3-item">
        <div class="lf3-tile lf3-t2">
          <div class="lf3-t2-stage">
            <svg class="lf3-t2-svg" viewBox="0 0 340 332" aria-hidden="true">
              <path d="M 108 54 C 146 54 166 28 174 0" fill="none" stroke="rgba(243,242,247,0.32)" stroke-width="1" />
              <path d="M 214 54 C 182 54 170 86 170 127" fill="none" stroke="rgba(243,242,247,0.32)" stroke-width="1" />
              <path d="M 132 278 C 158 278 170 246 170 205" fill="none" stroke="rgba(243,242,247,0.32)" stroke-width="1" />
              <path d="M 226 278 C 188 278 168 304 156 332" fill="none" stroke="rgba(243,242,247,0.32)" stroke-width="1" />
            </svg>
            <span class="lf3-t2-pill lf3-t2-pill--tl">0% #000</span>
            <span class="lf3-t2-pill lf3-t2-pill--tr">WCAG AA</span>
            <span class="lf3-t2-pill lf3-t2-pill--bl">GRID 8PX</span>
            <span class="lf3-t2-pill lf3-t2-pill--br">EXPLETUS</span>
            <div class="lf3-t2-nodes">
              <div class="lf3-t2-node"><img src="./assets/katze-logo-purple.png" alt="Katze" /></div>
              <div class="lf3-t2-node"><div class="lf3-t2-swatch-dots"><span></span><span></span><span></span></div></div>
              <div class="lf3-t2-node"><span class="display" style="font-size:1.5rem;font-weight:600">Aa</span></div>
            </div>
          </div>
        </div>
        <h3 class="lf3-caption">Consistencia cromática verificada</h3>
      </div>

      <div class="lf3-item">
        <div class="lf3-tile lf3-t3" data-demo-t3>
          <div class="lf3-t3-halo" aria-hidden="true"></div>
          <div class="lf3-t3-pill">
            <svg class="lf3-t3-icon lf3-t3-icon--left" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            <svg class="lf3-t3-icon lf3-t3-icon--right" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <polygon points="12 3 21 12 12 21 3 12 12 3"></polygon>
              <circle cx="12" cy="12" r="2.2"></circle>
            </svg>
          </div>
          <pre class="lf3-t3-binary" data-demo-hg aria-hidden="true"></pre>
        </div>
        <h3 class="lf3-caption">Criterio visual que despierta en hover</h3>
      </div>
    </div>
  `;

  const t1 = container.querySelector('[data-demo-t1]');
  const slides = [...container.querySelectorAll('[data-demo-slide]')];
  container.querySelectorAll('[data-demo-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.demoSet;
      t1.dataset.slide = idx;
      slides.forEach((s) => s.classList.toggle('is-current', s.dataset.demoSlide === idx));
    });
  });

  const t3 = container.querySelector('[data-demo-t3]');
  const hg = container.querySelector('[data-demo-hg]');
  hg.textContent = buildHourglassText();
  let timer = 0;
  const onEnter = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      hg.textContent = buildHourglassText();
    }, 120);
  };
  const onLeave = () => clearInterval(timer);
  t3.addEventListener('mouseenter', onEnter);
  t3.addEventListener('mouseleave', onLeave);

  return () => {
    clearInterval(timer);
    t3.removeEventListener('mouseenter', onEnter);
    t3.removeEventListener('mouseleave', onLeave);
  };
}

function mountAnatomyDemo(container) {
  let figHandle = null;

  container.innerHTML = `
    <div class="comp-live-controls">
      <button type="button" class="placement-tab is-active" data-pick-fig="01">FIG_01 · Calibrador</button>
      <button type="button" class="placement-tab" data-pick-fig="02">FIG_02 · Marco 16:9</button>
      <button type="button" class="placement-tab" data-pick-fig="03">FIG_03 · Pulsador</button>
      <button type="button" class="placement-tab" data-pick-fig="04">FIG_04 · Interruptor</button>
    </div>
    <div class="rc-dotted" style="border: 1px solid var(--hairline); border-radius: 8px; min-height: 320px;">
      <div class="rc-fig-bar">
        <span class="rc-fig-label" data-demo-fig-label>FIG_01</span>
        <span class="rc-fig-hint">HOVER / CLIC INTERACTIVO</span>
      </div>
      <div class="rc-diagram-wrap" data-demo-fig-host></div>
    </div>
  `;

  const host = container.querySelector('[data-demo-fig-host]');
  const label = container.querySelector('[data-demo-fig-label]');
  const tabs = [...container.querySelectorAll('[data-pick-fig]')];

  function showFig(id) {
    figHandle?.destroy();
    label.textContent = `FIG_${id}`;
    const mountFn = ANATOMY_MOUNTERS[id];
    figHandle = mountFn ? mountFn(host) : null;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      showFig(tab.dataset.pickFig);
    });
  });

  showFig('01');
  return () => figHandle?.destroy();
}

function mountTokensButtonsDemo(container) {
  container.innerHTML = `
    <div class="palette-strip" style="margin-bottom: 24px;">
      <button type="button" class="palette-col" data-copy-hex="#16161B">
        <div class="palette-tone" style="background:#16161b;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Carbon</div><div class="palette-hex">#16161B</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#1E1E26">
        <div class="palette-tone" style="background:#1e1e26;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Slate</div><div class="palette-hex">#1E1E26</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#2E1A47">
        <div class="palette-tone" style="background:#2e1a47;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Plum</div><div class="palette-hex">#2E1A47</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#9B5DE5">
        <div class="palette-tone" style="background:#9b5de5;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Amethyst</div><div class="palette-hex">#9B5DE5</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#D16FFF">
        <div class="palette-tone" style="background:#d16fff;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Lavender</div><div class="palette-hex">#D16FFF</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#714B67">
        <div class="palette-tone" style="background:#714b67;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Odoo</div><div class="palette-hex">#714B67</div></div>
      </button>
      <button type="button" class="palette-col" data-copy-hex="#F3F2F7">
        <div class="palette-tone" style="background:#f3f2f7;height:52px"></div>
        <div class="palette-info"><div class="palette-name">Ink</div><div class="palette-hex">#F3F2F7</div></div>
      </button>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <button type="button" class="k-btn k-btn--primary">Acción primaria</button>
      <button type="button" class="k-btn">Acción secundaria</button>
      <span class="v3-odoo-badge">Odoo Ready Partner</span>
    </div>
  `;
  return initPaletteCopy(container);
}

function mountNavigationDemo(container) {
  container.innerHTML = `
    <div style="border:1px solid var(--hairline-strong);border-radius:10px;overflow:hidden;">
      <div style="background:rgba(22,22,27,0.92);border-bottom:1px solid var(--hairline);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
        <span class="v3-brand">
          <img src="./assets/katze-logo-purple.png" alt="Katze" width="24" height="24" />
          <span class="v3-brand-name">Katze</span>
          <span class="v3-brand-sep">Brand Guideline</span>
        </span>
        <span style="display:flex;gap:18px;font-size:0.82rem;color:var(--ink-secondary);flex-wrap:wrap;">
          <span>Inicio</span>
          <span>Diseño</span>
          <span style="color:var(--accent-bright)">Componentes</span>
          <span>Brand Knowledge</span>
          <span>Slides</span>
        </span>
      </div>
      <div style="background:#15151a;padding:24px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
        <div>
          <strong class="display" style="font-size:1rem;">Katze</strong>
          <p class="v3-footer-slogan" style="margin:4px 0 8px;">Convertimos tecnología en resultados.</p>
          <span class="v3-odoo-badge">Odoo Ready Partner</span>
        </div>
        <span class="mono" style="font-size:0.7rem;color:var(--ink-muted);">Sistema Graphite · 0% #000000</span>
      </div>
    </div>
  `;
  return () => {};
}

function createWorkbenchController(root) {
  const rail = root.querySelector('[data-comp-rail]');
  const titleEl = root.querySelector('[data-comp-title]');
  const summaryEl = root.querySelector('[data-comp-summary]');
  const liveBox = root.querySelector('[data-comp-live]');
  const rulesEl = root.querySelector('[data-comp-rules]');
  const codeEl = root.querySelector('[data-comp-code]');
  const promptEl = root.querySelector('[data-comp-prompt]');
  const copySnippetBtn = root.querySelector('[data-copy-snippet]');
  const copyPromptBtn = root.querySelector('[data-copy-prompt]');

  let currentComponent = COMPONENTS[0];
  let activeCleanup = () => {};

  rail.innerHTML = COMPONENTS.map(
    (item, idx) => `
      <button type="button" class="comp-nav-btn ${idx === 0 ? 'is-active' : ''}" data-select-comp="${item.id}">
        <span class="comp-nav-id">${item.code}</span>
        <span class="comp-nav-name">${item.name}</span>
      </button>
    `
  ).join('');

  const railButtons = [...rail.querySelectorAll('[data-select-comp]')];

  function selectComponent(id) {
    const found = COMPONENTS.find((c) => c.id === id) || COMPONENTS[0];
    activeCleanup();
    activeCleanup = () => {};
    currentComponent = found;

    railButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.selectComp === found.id);
    });

    titleEl.textContent = found.name;
    summaryEl.textContent = found.summary;
    rulesEl.innerHTML = found.rules.map((rule) => `<li>${rule}</li>`).join('');
    codeEl.textContent = found.snippet;
    promptEl.textContent = found.prompt;

    activeCleanup = found.mount(liveBox) || (() => {});
  }

  railButtons.forEach((btn) => {
    btn.addEventListener('click', () => selectComponent(btn.dataset.selectComp));
  });

  bindCopyButton(copySnippetBtn, () => currentComponent.snippet, {
    toastMessage: 'Código de componente copiado',
  });
  bindCopyButton(copyPromptBtn, () => currentComponent.prompt, {
    copiedLabel: 'Prompt copiado',
    toastMessage: 'Prompt de componente copiado para IA',
  });

  selectComponent(COMPONENTS[0].id);
}

function initComponentesPage() {
  mountSiteNav('componentes');
  mountSiteFooter('componentes');

  const heroCanvas = document.querySelector('[data-dot-trail]');
  if (heroCanvas) {
    initDotTrailCanvas(heroCanvas, {
      placement: 'diagonal-right',
      baseColor: '204, 202, 214',
      backgroundOpacity: 0.2,
      backgroundDitherAlpha: 54,
      glowPrimary: '209, 111, 255',
      glowSecondary: '155, 93, 229',
    });
  }

  const workbench = document.querySelector('[data-component-workbench]');
  if (workbench) createWorkbenchController(workbench);
}

initComponentesPage();
