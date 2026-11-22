import {
  boxCorners,
  corners,
  cylinder,
  depthOf,
  dotGrid,
  dotsSvg,
  extrude,
  faceTextSvg,
  figureSvg,
  fitProjection,
  groupSvg,
  haloOf,
  insetPlan,
  iso,
  knurl,
  lineOnTop,
  lineSvg,
  planOutline,
  pointsAt,
  radialTicks,
  ring,
  sideSeam,
  slabOf,
  solidSvg,
  topMatrix,
  topTicks,
  translateAlong,
  wireSvg,
} from './iso-kit.mjs';

const hostCleanups = new WeakMap();

function isReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
  );
}

function follow(current, target, dt, tau) {
  if (tau <= 0) return target;
  return current + (target - current) * (1 - Math.exp(-dt / tau));
}

function mountFigure(host, createScene, buildSvg, attachInteraction, options = {}) {
  if (!host) return null;
  hostCleanups.get(host)?.();

  const scene = createScene();
  host.innerHTML = buildSvg(scene);
  const teardown = attachInteraction(host, scene, options.interactive !== false);

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    teardown();
    if (hostCleanups.get(host) === destroy) {
      hostCleanups.delete(host);
    }
    if (options.clearOnDestroy) host.innerHTML = '';
  };

  hostCleanups.set(host, destroy);
  return { destroy, element: host.querySelector('svg') };
}

function attachLoop(host, onFrame) {
  let disposed = false;
  let visible = false;
  let rafId = 0;
  let io = null;
  let lastT = performance.now();

  function tick(now) {
    rafId = 0;
    if (disposed) return;
    const calm = isReducedMotion();
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    onFrame(now / 1000, dt, calm);
    if (visible && !calm && !disposed) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function start() {
    if (!disposed && !rafId) {
      lastT = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  }

  onFrame(0, 0.016, isReducedMotion());

  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(
      (entries) => {
        if (disposed) return;
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !isReducedMotion()) {
          start();
        } else if (!visible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.1 }
    );
    io.observe(host);
  } else {
    visible = true;
    start();
  }

  return {
    kick: start,
    destroy() {
      disposed = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      io?.disconnect();
      io = null;
    },
  };
}

function bindHoverFlag(target, onChange) {
  const onEnter = () => onChange(true);
  const onLeave = () => onChange(false);
  target.addEventListener('mouseenter', onEnter);
  target.addEventListener('mouseleave', onLeave);
  return () => {
    target.removeEventListener('mouseenter', onEnter);
    target.removeEventListener('mouseleave', onLeave);
  };
}

function bindToggleClick(target, onToggle) {
  const prevCursor = target.style.cursor;
  target.style.cursor = 'pointer';
  target.addEventListener('click', onToggle);
  return () => {
    target.removeEventListener('click', onToggle);
    target.style.cursor = prevCursor;
  };
}

function buildKatzeIsoCss(paperColor = '#15151a') {
  return `
.iso{
  --anatomy-paper:${paperColor};
  --anatomy-face:#241838;
  --anatomy-top:#23232e;
  --anatomy-shade-0:#16161e;
  --anatomy-shade-1:#1a1a23;
  --anatomy-shade-2:#1f1f2a;
  --anatomy-shade-3:#252532;
  --anatomy-lit-top:#3e2466;
  --anatomy-lit-shade:#2b1849;
  --anatomy-hi:#cbc7da;
  --anatomy-mid:#7d7991;
  --anatomy-lo:#4b485c;
  --anatomy-faint:#2f2d3b;
  --anatomy-lit:#d16fff;
  --anatomy-halo:#0d0c14;
  --anatomy-halo-opacity:.72;
  --anatomy-dot:#e6e2f2;
  --anatomy-blue:#9b5de5;
  --anatomy-weight:.72px;
  --anatomy-mono:'JetBrains Mono',ui-monospace,monospace;
}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-blue);stroke-width:var(--anatomy-weight)}
.iso-dots[data-tone="mid"] circle{opacity:.5}
.iso-dots[data-tone="lo"] circle{opacity:.25}
`;
}

function buildSortedFeet(plan, opts, P) {
  const { footInset, footRadius, footHeight, footSteps } = opts;
  return corners(plan, footInset)
    .map((pt) => ({ pt, d: depthOf([pt[0], pt[1], 0], P) }))
    .sort((a, b) => a.d - b.d)
    .map(({ pt }) =>
      solidSvg(cylinder(pt[0], pt[1], footRadius, 0, footHeight, P, footSteps), {
        tone: 'lo',
      })
    );
}

function buildPlinthBase(plan, opts, P) {
  const topZ = opts.footHeight + opts.slabHeight;
  const parts = [
    `<path class="iso-halo" d="${haloOf(plan, 0, opts.footHeight, P)}"/>`,
    ...buildSortedFeet(plan, opts, P),
    solidSvg(slabOf(plan, opts.footHeight, opts.slabHeight, P, 8, opts.bevel), {
      tone: 'mid',
      inner: lineSvg(sideSeam(plan, opts.seamZ, P, 8), { tone: 'faint' }),
    }),
  ];

  if (opts.grooveInset != null) {
    parts.push(
      lineSvg(planOutline(insetPlan(plan, opts.grooveInset), topZ, P, opts.grooveSteps ?? 8), {
        tone: 'faint',
      })
    );
  }

  parts.push(
    dotsSvg(pointsAt(corners(plan, opts.screwInset).map(([x, y]) => [x, y, topZ]), P), {
      size: opts.screwSize,
      tone: 'mid',
    })
  );

  return parts;
}

function buildFigureSvgOutput(dims, label, body, options = {}) {
  const {
    paperColor = '#15151a',
    includeStyles = false,
    includeBackground = false,
    className = '',
    standalone = false,
    includeDimensions = false,
  } = options;

  const finalBody = includeBackground
    ? [`<rect width="${dims.W}" height="${dims.H}" fill="${paperColor}"/>`, ...body]
    : body;

  const inlineStyle =
    standalone || options.paperColor || includeBackground
      ? `--anatomy-paper:${paperColor};`
      : '';

  return figureSvg({
    width: dims.W,
    height: dims.H,
    label,
    body: finalBody,
    standalone,
    className: className || undefined,
    extraCss: includeStyles ? buildKatzeIsoCss(paperColor) : '',
    inlineStyle,
    includeDimensions,
  });
}

/* ==========================================================================
   FIG_01 — Precision Optical Layer Calibrator (Surface / Accent / Grid)
   ========================================================================== */
function createFig01Scene() {
  const W = 540;
  const H = 310;
  const base = { x: 0, y: 0, w: 176, d: 118, r: 9 };
  const plate = { x: 18, y: 15, w: 124, d: 88, r: 6 };
  const P = fitProjection([...boxCorners(base, 0, 96), [190, 60, 40]], W, H, {
    pad: 22,
    headroom: 18,
    azimuth: 42,
    elevation: 30,
  });
  return { W, H, base, plate, P };
}

function buildFig01Base(base, P) {
  const knobX = base.x + base.w - 15;
  const baseTicks = topTicks(24, 136, 4, 5, base.y + base.d - 4, 16, [-2.5, -5.2], P, 'x');
  return [
    ...buildPlinthBase(
      base,
      {
        footInset: 14,
        footRadius: 6,
        footHeight: 4,
        footSteps: 18,
        slabHeight: 12,
        bevel: 1.0,
        seamZ: 10,
        grooveInset: 5,
        grooveSteps: 8,
        screwInset: 8,
        screwSize: 0.7,
      },
      P
    ),
    lineSvg(baseTicks.minor, { tone: 'lo' }),
    lineSvg(baseTicks.major, { tone: 'mid' }),
    faceTextSvg(topMatrix([knobX, base.y + 18], 16, P, 'x'), 'Z-CAL', {
      size: 4.2,
      tone: 'lo',
      anchor: 'middle',
    }),
  ];
}

function buildCalibratorKnob(base, P) {
  const knobX = base.x + base.w - 15;
  const knobY = base.y + base.d * 0.5;
  const svg = groupSvg(
    [
      solidSvg(cylinder(knobX, knobY, 10, 16, 4, P, 24), { tone: 'lo' }),
      solidSvg(cylinder(knobX, knobY, 8.2, 20, 11, P, 26, 0.7), {
        tone: 'hi',
        inner: lineSvg(knurl(knobX, knobY, 8.2, 20.8, 30.2, 16, P), { tone: 'lo' }),
      }),
      lineSvg(ring(knobX, knobY, 4.4, 31, P, 18), { tone: 'faint' }),
    ],
    { 'data-part': 'knob' }
  );
  return { svg, depth: depthOf([knobX, knobY, 16], P) };
}

function buildPost([px, py], P) {
  return (
    solidSvg(cylinder(px, py, 4.4, 16, 3, P, 16), { tone: 'lo' }) +
    solidSvg(cylinder(px, py, 2.2, 19, 62, P, 16), { tone: 'mid' }) +
    solidSvg(cylinder(px, py, 3.6, 81, 3, P, 16, 0.5), { tone: 'hi' })
  );
}

function splitPostsByDepth(plate, P) {
  const sorted = corners(insetPlan(plate, -2), 11)
    .map((pt, idx) => ({ pt, idx, d: depthOf([pt[0], pt[1], 16], P) }))
    .sort((a, b) => a.d - b.d);
  return {
    rearPosts: sorted.slice(0, 2),
    frontPosts: sorted.slice(2),
  };
}

function buildFig01Layer1(plate, P) {
  const p1 = insetPlan(plate, 0);
  return groupSvg(
    [
      solidSvg(slabOf(p1, 24, 5, P, 6, 0.7), { tone: 'lo' }),
      lineSvg(planOutline(insetPlan(p1, 5), 29, P, 6), { tone: 'faint' }),
      dotsSvg(dotGrid(p1.x + 14, p1.y + 14, 7, 4, 16, 29, P), { size: 0.48, tone: 'lo' }),
    ],
    { 'data-layer': '1' }
  );
}

function buildFig01Layer2(plate, P) {
  const p2 = insetPlan(plate, 3);
  const p2Inner = insetPlan(p2, 11);
  const cx2 = p2.x + p2.w / 2;
  const cy2 = p2.y + p2.d / 2;
  return groupSvg(
    [
      `<path class="iso-halo" d="${haloOf(p2, 42, 4, P)}"/>`,
      solidSvg(slabOf(p2, 43, 6, P, 6, 0.9), { lit: true }),
      lineSvg(planOutline(p2Inner, 49, P, 6), { tone: 'lit' }),
      lineSvg(ring(cx2, cy2, 16, 49, P, 28), { tone: 'lit' }),
      lineSvg(lineOnTop([cx2 - 22, cy2], [cx2 - 8, cy2], 49, P), { tone: 'lit' }),
      lineSvg(lineOnTop([cx2 + 8, cy2], [cx2 + 22, cy2], 49, P), { tone: 'lit' }),
      lineSvg(lineOnTop([cx2, cy2 - 20], [cx2, cy2 - 8], 49, P), { tone: 'lit' }),
      lineSvg(lineOnTop([cx2, cy2 + 8], [cx2, cy2 + 20], 49, P), { tone: 'lit' }),
      dotsSvg(pointsAt([[cx2, cy2, 49]], P), { size: 1.1, tone: 'hi' }),
    ],
    { 'data-layer': '2' }
  );
}

function buildFig01Layer3(plate, P) {
  const p3 = insetPlan(plate, 0);
  const p3Ticks = topTicks(p3.x + 14, p3.x + p3.w - 14, 5, 4, p3.y + 5, 67, [2.2, 4.6], P, 'x');
  return groupSvg(
    [
      solidSvg(slabOf(p3, 62, 5, P, 6, 0.8), { tone: 'hi' }),
      lineSvg(planOutline(insetPlan(p3, 7), 67, P, 6), { tone: 'mid' }),
      lineSvg(p3Ticks.minor, { tone: 'lo' }),
      lineSvg(p3Ticks.major, { tone: 'hi' }),
      faceTextSvg(topMatrix([p3.x + 16, p3.y + p3.d - 16], 67, P, 'x'), 'GRID 1PX · TYPE', {
        size: 4.8,
        tone: 'mid',
      }),
    ],
    { 'data-layer': '3' }
  );
}

function buildFig01Svg(scene, options = {}) {
  const { W, H, base, plate, P } = scene;
  const staticBack = buildFig01Base(base, P);
  const { rearPosts, frontPosts } = splitPostsByDepth(plate, P);
  const knob = buildCalibratorKnob(base, P);
  const frontItems = [
    ...frontPosts.map((p) => ({ depth: p.d, svg: buildPost(p.pt, P) })),
    knob,
  ].sort((a, b) => a.depth - b.depth);

  const body = [
    ...staticBack,
    ...rearPosts.map((p) => buildPost(p.pt, P)),
    buildFig01Layer1(plate, P),
    buildFig01Layer2(plate, P),
    buildFig01Layer3(plate, P),
    ...frontItems.map((item) => item.svg),
  ];

  return buildFigureSvgOutput(
    { W, H },
    'Instrumento isométrico de calibración de capas del sistema Katze',
    body,
    options
  );
}

function attachFig01Interaction(host, scene, interactive = true) {
  const { P } = scene;
  const g1 = host.querySelector('[data-layer="1"]');
  const g2 = host.querySelector('[data-layer="2"]');
  const g3 = host.querySelector('[data-layer="3"]');

  let hoverBoost = 0;
  let currentLift = 0;
  const cell = host.closest('.rc-dotted') || host;
  const unbindHover = interactive
    ? bindHoverFlag(cell, (hovered) => {
        hoverBoost = hovered ? 1 : 0;
      })
    : () => {};

  const loop = attachLoop(host, (t, dt, calm) => {
    const wave = calm ? 0.35 : (Math.sin(t * 0.95) + 1) * 0.5;
    const target = hoverBoost ? 1 : wave * 0.82;
    currentLift = follow(currentLift, target, dt, 0.28);

    g1?.setAttribute('transform', translateAlong(P, [0, 0, -currentLift * 2.5]));
    g2?.setAttribute('transform', translateAlong(P, [0, 0, currentLift * 5.5]));
    g3?.setAttribute('transform', translateAlong(P, [0, 0, currentLift * 13.5]));
  });

  return () => {
    unbindHover();
    loop.destroy();
  };
}

export function mountFig01(host, options = {}) {
  return mountFigure(host, createFig01Scene, buildFig01Svg, attachFig01Interaction, options);
}

/* ==========================================================================
   FIG_02 — Multi-Format 16:9 Drafting Frame & Sliding Vernier Gantry
   ========================================================================== */
function createFig02Scene() {
  const W = 520;
  const H = 290;
  const plinth = { x: 0, y: 0, w: 192, d: 112, r: 8 };
  const frame = { x: 10, y: 10, w: 172, d: 92, r: 5 };
  const screen = insetPlan(frame, 10);
  const P = fitProjection(boxCorners(plinth, 0, 56), W, H, {
    pad: 22,
    headroom: 14,
    azimuth: 40,
    elevation: 32,
  });
  return { W, H, plinth, frame, screen, P };
}

function buildFig02Bezel(frame, screen, P) {
  const topRuler = topTicks(
    frame.x + 16,
    frame.x + frame.w - 16,
    5,
    4,
    frame.y + frame.d - 3,
    25,
    [-2, -4.5],
    P,
    'x'
  );
  return [
    solidSvg(slabOf(frame, 15, 10, P, 6, 0.8), { tone: 'hi' }),
    lineSvg(planOutline(screen, 25, P, 4), { tone: 'mid' }),
    lineSvg(
      lineOnTop([screen.x + screen.w / 3, screen.y], [screen.x + screen.w / 3, screen.y + screen.d], 25, P),
      { tone: 'faint' }
    ),
    lineSvg(
      lineOnTop([screen.x + (screen.w * 2) / 3, screen.y], [screen.x + (screen.w * 2) / 3, screen.y + screen.d], 25, P),
      { tone: 'faint' }
    ),
    lineSvg(
      lineOnTop([screen.x, screen.y + screen.d / 2], [screen.x + screen.w, screen.y + screen.d / 2], 25, P),
      { tone: 'faint' }
    ),
    lineSvg(topRuler.minor, { tone: 'lo' }),
    lineSvg(topRuler.major, { tone: 'mid' }),
    faceTextSvg(topMatrix([screen.x + 8, screen.y + screen.d - 8], 25, P, 'x'), '16:9 · 8PX', {
      size: 4.5,
      tone: 'mid',
    }),
  ];
}

function buildFig02FocalCore(screen, P) {
  const cx = screen.x + screen.w * 0.5;
  const cy = screen.y + screen.d * 0.5;
  const diamondRing = [
    [cx, cy - 17],
    [cx + 20, cy],
    [cx, cy + 17],
    [cx - 20, cy],
  ];
  return groupSvg(
    [
      solidSvg(extrude(diamondRing, 25, 5, P, { bevel: 0.6 }), { lit: true }),
      lineSvg(ring(cx, cy, 6, 30, P, 20), { tone: 'lit' }),
    ],
    { 'data-core': '1' }
  );
}

function buildFig02Carriage(frame, P) {
  const bridgeX = frame.x + 42;
  const bridgeBar = { x: bridgeX, y: frame.y + 1, w: 12, d: frame.d - 2, r: 2 };
  return groupSvg(
    [
      solidSvg(slabOf(bridgeBar, 38, 5, P, 4, 0.5), { tone: 'hi' }),
      solidSvg(cylinder(bridgeX + 6, frame.y + frame.d - 10, 5.2, 43, 6, P, 18, 0.4), {
        lit: true,
        inner: lineSvg(knurl(bridgeX + 6, frame.y + frame.d - 10, 5.2, 43.6, 48.4, 12, P), {
          tone: 'lo',
        }),
      }),
      lineSvg(
        lineOnTop([bridgeX + 6, frame.y + 6], [bridgeX + 6, frame.y + frame.d - 18], 43, P),
        { tone: 'lit' }
      ),
    ],
    { 'data-carriage': '1' }
  );
}

function buildFig02Rails(frame, P) {
  const backRails = [
    [frame.x + 6, frame.y + 4],
    [frame.x + frame.w - 6, frame.y + 4],
  ];
  const frontRails = [
    [frame.x + 6, frame.y + frame.d - 4],
    [frame.x + frame.w - 6, frame.y + frame.d - 4],
  ];
  return {
    back: [
      ...backRails.map(([x, y]) => solidSvg(cylinder(x, y, 2.8, 25, 16, P, 14), { tone: 'mid' })),
      solidSvg(slabOf({ x: frame.x + 4, y: frame.y + 2.5, w: frame.w - 8, d: 3, r: 1 }, 39, 3, P, 4), {
        tone: 'mid',
      }),
    ],
    front: [
      ...frontRails.map(([x, y]) => solidSvg(cylinder(x, y, 2.8, 25, 16, P, 14), { tone: 'mid' })),
      solidSvg(
        slabOf({ x: frame.x + 4, y: frame.y + frame.d - 5.5, w: frame.w - 8, d: 3, r: 1 }, 39, 3, P, 4),
        { tone: 'hi' }
      ),
    ],
  };
}

function buildFig02Svg(scene, options = {}) {
  const { W, H, plinth, frame, screen, P } = scene;
  const rails = buildFig02Rails(frame, P);
  const body = [
    ...buildPlinthBase(
      plinth,
      {
        footInset: 14,
        footRadius: 5.5,
        footHeight: 4,
        footSteps: 16,
        slabHeight: 11,
        bevel: 0.9,
        seamZ: 9.5,
        grooveInset: null,
        screwInset: 6,
        screwSize: 0.65,
      },
      P
    ),
    ...buildFig02Bezel(frame, screen, P),
    buildFig02FocalCore(screen, P),
    ...rails.back,
    buildFig02Carriage(frame, P),
    ...rails.front,
  ];

  return buildFigureSvgOutput(
    { W, H },
    'Marco técnico isométrico 16:9 con carro vernier deslizante',
    body,
    options
  );
}

function attachFig02Interaction(host, scene) {
  const { P } = scene;
  const gCarriage = host.querySelector('[data-carriage="1"]');
  const gCore = host.querySelector('[data-core="1"]');
  let curX = 0;

  const loop = attachLoop(host, (t, dt, calm) => {
    const targetX = calm ? 22 : (Math.sin(t * 0.72) * 0.5 + 0.5) * 86;
    curX = follow(curX, targetX, dt, 0.25);
    gCarriage?.setAttribute('transform', translateAlong(P, [curX, 0, 0]));
    const pulseZ = calm ? 0 : Math.sin(t * 1.44) * 1.6;
    gCore?.setAttribute('transform', translateAlong(P, [0, 0, pulseZ]));
  });

  return () => loop.destroy();
}

export function mountFig02(host, options = {}) {
  return mountFigure(host, createFig02Scene, buildFig02Svg, attachFig02Interaction, options);
}

/* ==========================================================================
   FIG_03 — Tactile Key Plunger & Rotary Precision Gauge (Primitivas Sobrias)
   ========================================================================== */
function createFig03Scene() {
  const W = 280;
  const H = 220;
  const base = { x: 0, y: 0, w: 124, d: 86, r: 8 };
  const P = fitProjection(boxCorners(base, 0, 48), W, H, {
    pad: 18,
    headroom: 12,
    azimuth: 44,
    elevation: 32,
  });
  return { W, H, base, gx: 92, gy: 43, P };
}

function buildFig03Plunger(P) {
  const socket = { x: 14, y: 18, w: 42, d: 48, r: 6 };
  const plunger = { x: 19, y: 23, w: 32, d: 38, r: 5 };
  return [
    solidSvg(slabOf(socket, 16.5, 5, P, 6, 0.5), { tone: 'lo' }),
    groupSvg(
      [
        solidSvg(slabOf(plunger, 22, 11, P, 6, 0.9), { lit: true }),
        lineSvg(lineOnTop([plunger.x + 9, plunger.y + 19], [plunger.x + 15, plunger.y + 25], 33, P), {
          tone: 'lit',
        }),
        lineSvg(lineOnTop([plunger.x + 15, plunger.y + 25], [plunger.x + 24, plunger.y + 13], 33, P), {
          tone: 'lit',
        }),
      ],
      { 'data-plunger': '1' }
    ),
  ];
}

function buildFig03Gauge(gx, gy, P) {
  const dialTicks = radialTicks(gx, gy, 14.5, 16, 4, 29, [2.2, 4.2], P, -Math.PI * 0.75, Math.PI * 1.5);
  return [
    wireSvg(iso([56, 42, 16.5], P), iso([74, 42, 16.5], P), {
      tone: 'blue',
      flow: true,
      ends: 'both',
      size: 1.1,
    }),
    solidSvg(cylinder(gx, gy, 19.5, 16.5, 12.5, P, 36, 0.7), {
      tone: 'hi',
      inner: lineSvg(knurl(gx, gy, 19.5, 17.5, 28, 22, P), { tone: 'lo' }),
    }),
    lineSvg(ring(gx, gy, 15.8, 29, P, 30), { tone: 'mid' }),
    lineSvg(dialTicks.minor, { tone: 'lo' }),
    lineSvg(dialTicks.major, { tone: 'hi' }),
    `<path class="iso-line" data-tone="lit" data-needle="1" d="${lineOnTop([gx, gy], [gx, gy - 11], 29.2, P)}"/>`,
    solidSvg(cylinder(gx, gy, 3.2, 29, 2.5, P, 14), { lit: true }),
  ];
}

function buildFig03Svg(scene, options = {}) {
  const { W, H, base, gx, gy, P } = scene;
  const body = [
    ...buildPlinthBase(
      base,
      {
        footInset: 11,
        footRadius: 4.6,
        footHeight: 3.5,
        footSteps: 14,
        slabHeight: 13,
        bevel: 0.9,
        seamZ: 10,
        grooveInset: 4.5,
        grooveSteps: 6,
        screwInset: 7,
        screwSize: 0.65,
      },
      P
    ),
    ...buildFig03Plunger(P),
    ...buildFig03Gauge(gx, gy, P),
  ];

  return buildFigureSvgOutput(
    { W, H },
    'Jig mecánico de pulsador y dial rotatorio para primitivas de interfaz',
    body,
    options
  );
}

function attachFig03Interaction(host, scene, interactive = true) {
  const { gx, gy, P } = scene;
  const gPlunger = host.querySelector('[data-plunger="1"]');
  const needle = host.querySelector('[data-needle="1"]');
  let manualPress = false;
  let pressVal = 0;

  const cell = host.closest('.rc-dotted') || host;
  const unbindClick = interactive
    ? bindToggleClick(cell, () => {
        manualPress = !manualPress;
      })
    : () => {};

  const loop = attachLoop(host, (t, dt, calm) => {
    const cycle = calm ? 0.25 : Math.sin(t * 1.35) > 0.2 ? 1 : 0;
    const target = manualPress ? 1 : cycle;
    pressVal = follow(pressVal, target, dt, 0.14);

    gPlunger?.setAttribute('transform', translateAlong(P, [0, 0, -pressVal * 4.6]));
    const angle = -Math.PI * 0.75 + pressVal * Math.PI * 1.25;
    const tipX = gx + Math.sin(angle) * 11.5;
    const tipY = gy - Math.cos(angle) * 11.5;
    needle?.setAttribute('d', lineOnTop([gx, gy], [tipX, tipY], 29.2, P));
  });

  return () => {
    unbindClick();
    loop.destroy();
  };
}

export function mountFig03(host, options = {}) {
  return mountFigure(host, createFig03Scene, buildFig03Svg, attachFig03Interaction, options);
}

/* ==========================================================================
   FIG_04 — Dual-Channel State Deck & Live Signal Meter (Reposo vs. Foco)
   ========================================================================== */
function createFig04Scene() {
  const W = 280;
  const H = 220;
  const base = { x: 0, y: 0, w: 126, d: 88, r: 8 };
  const P = fitProjection(boxCorners(base, 0, 44), W, H, {
    pad: 18,
    headroom: 12,
    azimuth: 45,
    elevation: 32,
  });
  return { W, H, base, P };
}

function buildFig04Channels(P) {
  const trackA = { x: 18, y: 18, w: 58, d: 20, r: 10 };
  const trackB = { x: 18, y: 48, w: 58, d: 22, r: 11 };
  return [
    solidSvg(slabOf(trackA, 15.5, 4, P, 8, 0.4), { tone: 'lo' }),
    solidSvg(cylinder(trackA.x + 12, trackA.y + 10, 7.6, 19.5, 7, P, 22, 0.5), { tone: 'mid' }),
    solidSvg(slabOf(trackB, 15.5, 4.5, P, 8, 0.5), { tone: 'hi' }),
    groupSvg(
      [
        solidSvg(cylinder(trackB.x + 13, trackB.y + 11, 8.2, 20, 8.5, P, 24, 0.6), {
          lit: true,
          inner: lineSvg(knurl(trackB.x + 13, trackB.y + 11, 8.2, 21, 27.6, 14, P), {
            tone: 'lo',
          }),
        }),
        lineSvg(ring(trackB.x + 13, trackB.y + 11, 3.8, 28.5, P, 16), { tone: 'lit' }),
      ],
      { 'data-puck': '1' }
    ),
  ];
}

function buildFig04Meter(P) {
  const meterBase = { x: 92, y: 20, w: 20, d: 48, r: 4 };
  const meterTicks = topTicks(meterBase.y + 6, meterBase.y + 42, 4, 3, meterBase.x + 3, 21.5, [2, 4.5], P, 'y');
  return [
    wireSvg(iso([76, 59, 15.5], P), iso([94, 59, 15.5], P), {
      tone: 'blue',
      flow: true,
      ends: 'both',
      size: 1.1,
    }),
    solidSvg(slabOf(meterBase, 15.5, 6, P, 4, 0.5), { tone: 'lo' }),
    lineSvg(meterTicks.minor, { tone: 'lo' }),
    lineSvg(meterTicks.major, { tone: 'mid' }),
    groupSvg(
      [solidSvg(slabOf({ x: 99, y: 26, w: 7, d: 9, r: 2 }, 21.5, 4.5, P, 4, 0.3), { lit: true })],
      { 'data-meter': '1' }
    ),
  ];
}

function buildFig04Svg(scene, options = {}) {
  const { W, H, base, P } = scene;
  const body = [
    ...buildPlinthBase(
      base,
      {
        footInset: 11,
        footRadius: 4.5,
        footHeight: 3.5,
        footSteps: 14,
        slabHeight: 12,
        bevel: 0.9,
        seamZ: 9.5,
        grooveInset: 4.5,
        grooveSteps: 6,
        screwInset: 7,
        screwSize: 0.65,
      },
      P
    ),
    ...buildFig04Channels(P),
    ...buildFig04Meter(P),
  ];

  return buildFigureSvgOutput(
    { W, H },
    'Consola de interruptores isométricos de reposo y estado activo Katze',
    body,
    options
  );
}

function attachFig04Interaction(host, scene, interactive = true) {
  const { P } = scene;
  const gPuck = host.querySelector('[data-puck="1"]');
  const gMeter = host.querySelector('[data-meter="1"]');
  let toggled = true;
  let slideVal = 1;

  const cell = host.closest('.rc-dotted') || host;
  const unbindClick = interactive
    ? bindToggleClick(cell, () => {
        toggled = !toggled;
      })
    : () => {};

  const loop = attachLoop(host, (t, dt, calm) => {
    const autoState = calm ? 1 : Math.floor(t / 2.6) % 2 === 0 ? 1 : 0;
    const target = toggled ? autoState : 1 - autoState;
    slideVal = follow(slideVal, target, dt, 0.16);

    gPuck?.setAttribute('transform', translateAlong(P, [slideVal * 32, 0, 0]));
    gMeter?.setAttribute('transform', translateAlong(P, [0, slideVal * 26, 0]));
  });

  return () => {
    unbindClick();
    loop.destroy();
  };
}

export function mountFig04(host, options = {}) {
  return mountFigure(host, createFig04Scene, buildFig04Svg, attachFig04Interaction, options);
}

/* ==========================================================================
   Standalone SVG Builder & Bulk Initializer
   ========================================================================== */
const FIGURE_BUILDERS = {
  '01': () => ({ scene: createFig01Scene(), build: buildFig01Svg }),
  '02': () => ({ scene: createFig02Scene(), build: buildFig02Svg }),
  '03': () => ({ scene: createFig03Scene(), build: buildFig03Svg }),
  '04': () => ({ scene: createFig04Scene(), build: buildFig04Svg }),
};

function normalizeStandaloneClassName(className, includeStyles) {
  const tokens = String(className || '')
    .split(/\s+/)
    .filter(Boolean);
  if (includeStyles) {
    return tokens.filter((token) => token !== 'iso').join(' ');
  }
  if (!tokens.includes('iso')) {
    tokens.unshift('iso');
  }
  return tokens.join(' ');
}

export function buildStandaloneFigureSvg(figId, options = {}) {
  const normalizedId = String(figId ?? '').trim().padStart(2, '0');
  const entry = FIGURE_BUILDERS[normalizedId];
  if (!entry) {
    throw new Error(`Unknown Katze anatomy figure id: ${figId}`);
  }

  const {
    paperColor = '#15151a',
    includeStyles = true,
    includeBackground = false,
    className = '',
  } = options;

  const { scene, build } = entry();
  return build(scene, {
    paperColor,
    includeStyles,
    includeBackground,
    className: normalizeStandaloneClassName(className, includeStyles),
    standalone: includeStyles,
    includeDimensions: true,
  });
}

export function initAllKatzeAnatomyFigs(root = document) {
  const handles = [
    mountFig01(root.querySelector('[data-anatomy-fig="01"]')),
    mountFig02(root.querySelector('[data-anatomy-fig="02"]')),
    mountFig03(root.querySelector('[data-anatomy-fig="03"]')),
    mountFig04(root.querySelector('[data-anatomy-fig="04"]')),
  ].filter(Boolean);

  return {
    destroy() {
      handles.forEach((handle) => handle.destroy());
    },
  };
}
