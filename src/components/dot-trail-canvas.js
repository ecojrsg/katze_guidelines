const BAYER_4X4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

const PLACEMENT_SPECS = {
  bottom: {
    maskGradient:
      'linear-gradient(rgba(22, 22, 27, 0) 8%, rgba(22, 22, 27, 0.82) 95%, rgba(22, 22, 27, 0.54) 100%)',
    ambientBounds: {
      colMin: 0.15,
      colMax: 0.85,
      rowMin: 0.35,
      rowMax: 0.85,
      preferHorizontal: true,
      isInside: null,
    },
    buildSeedPath(cols, rows) {
      const startC = Math.max(1, Math.min(cols - 10, Math.round(cols * 0.24)));
      const startR = Math.max(2, Math.min(rows - 2, Math.round(rows * 0.62)));
      const points = [];
      for (let i = 0; i < 8; i++) points.push([startC + i, startR]);
      const endC = startC + 7;
      const stepR = startR >= 6 ? -1 : 1;
      for (let j = 1; j <= 4; j++) points.push([endC, startR + j * stepR]);
      return points;
    },
  },
  right: {
    maskGradient:
      'linear-gradient(to right, rgba(22, 22, 27, 0) 6%, rgba(22, 22, 27, 0.84) 88%, rgba(22, 22, 27, 0.58) 100%)',
    ambientBounds: {
      colMin: 0.28,
      colMax: 0.88,
      rowMin: 0.14,
      rowMax: 0.86,
      preferHorizontal: false,
      isInside: null,
    },
    buildSeedPath(cols, rows) {
      const startC = Math.max(1, Math.min(cols - 6, Math.round(cols * 0.52)));
      const startR = Math.max(1, Math.min(rows - 10, Math.round(rows * 0.26)));
      const points = [];
      for (let i = 0; i < 8; i++) points.push([startC, startR + i]);
      const endR = startR + 7;
      for (let j = 1; j <= 4; j++) points.push([startC + j, endR]);
      return points;
    },
  },
  top: {
    maskGradient:
      'linear-gradient(to top, rgba(22, 22, 27, 0) 8%, rgba(22, 22, 27, 0.82) 95%, rgba(22, 22, 27, 0.54) 100%)',
    ambientBounds: {
      colMin: 0.15,
      colMax: 0.85,
      rowMin: 0.14,
      rowMax: 0.64,
      preferHorizontal: true,
      isInside: null,
    },
    buildSeedPath(cols, rows) {
      const startC = Math.max(1, Math.min(cols - 10, Math.round(cols * 0.3)));
      const startR = Math.max(1, Math.min(rows - 6, Math.round(rows * 0.32)));
      const points = [];
      for (let i = 0; i < 8; i++) points.push([startC + i, startR]);
      const endC = startC + 7;
      for (let j = 1; j <= 4; j++) points.push([endC, startR + j]);
      return points;
    },
  },
  'diagonal-right': {
    maskGradient:
      'linear-gradient(225deg, rgba(22, 22, 27, 0.88) 0%, rgba(22, 22, 27, 0.62) 38%, rgba(22, 22, 27, 0) 72%)',
    ambientBounds: {
      colMin: 0.56,
      colMax: 0.92,
      rowMin: 0.12,
      rowMax: 0.72,
      preferHorizontal: true,
      isInside: (c, r, cols, rows) => c / cols + (1 - r / rows) >= 1.05,
    },
    buildSeedPath(cols, rows) {
      const startC = Math.max(1, Math.min(cols - 11, Math.round(cols * 0.62)));
      const startR = Math.max(1, Math.min(rows - 6, Math.round(rows * 0.2)));
      const points = [];
      for (let i = 0; i < 5; i++) points.push([startC + i, startR]);
      for (let j = 1; j <= 4; j++) points.push([startC + 4, startR + j]);
      for (let k = 1; k <= 4; k++) points.push([startC + 4 + k, startR + 4]);
      return points;
    },
  },
};

function parseColorRgb(value, fallback) {
  if (Array.isArray(value) && value.length === 3) {
    return value.map((n) => Number(n) || 0);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('#')) {
      const hex = trimmed.slice(1);
      if (hex.length === 3) {
        return [...hex].map((ch) => parseInt(ch + ch, 16));
      }
      if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
    }
    const parts = trimmed.split(',').map((n) => Number(n.trim()));
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
      return parts;
    }
  }
  return fallback;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getPlacementSpec(placement) {
  return PLACEMENT_SPECS[placement] || PLACEMENT_SPECS.bottom;
}

function createGridConfig(options) {
  const placement = PLACEMENT_SPECS[options.placement] ? options.placement : 'bottom';
  const cellSize = options.cellSize || 16;
  const canvasPixelSize = options.canvasPixelSize || 4;
  return {
    placement,
    cellSize,
    canvasPixelSize,
    subPerCell: Math.max(1, Math.round(cellSize / canvasPixelSize)),
    baseColor: parseColorRgb(options.baseColor, [206, 204, 214]),
    backgroundOpacity: options.backgroundOpacity ?? 0.2,
    backgroundDitherAlpha: options.backgroundDitherAlpha ?? 54,
    trailHeadColor: parseColorRgb(options.glowPrimary, [209, 111, 255]),
    trailTailColor: parseColorRgb(options.glowSecondary, [155, 93, 229]),
    trailOpacity: options.trailOpacity ?? 0.92,
    revealDurationMs: 180,
    stepDelayMs: 20,
    trailHoldDurationMs: 620,
    fifoIntervalMs: 36,
    trailFadeDurationMs: 760,
    seedInitialTrail: Boolean(options.seedInitialTrail),
    staticSeed: Boolean(options.staticSeed),
    enableAmbient: options.enableAmbient ?? true,
    listenTarget: options.listenTarget || window,
  };
}

function applyPlacementMask(canvas, placementSpec, placement) {
  canvas.dataset.placement = placement;
  const computed = window.getComputedStyle(canvas);
  const hasCssMask =
    (computed.maskImage && computed.maskImage !== 'none') ||
    (computed.webkitMaskImage && computed.webkitMaskImage !== 'none');
  if (!hasCssMask) {
    canvas.style.webkitMaskImage = placementSpec.maskGradient;
    canvas.style.maskImage = placementSpec.maskGradient;
  }
}

function drawBayerBaseMesh(ctx, bmWidth, bmHeight, config) {
  const img = ctx.createImageData(bmWidth, bmHeight);
  const data = img.data;
  const [br, bg, bb] = config.baseColor;
  const thresholdInput = Math.round(config.backgroundOpacity * 255);
  const outAlpha = config.backgroundDitherAlpha;

  for (let y = 0; y < bmHeight; y++) {
    const by = (y & 3) * 4;
    for (let x = 0; x < bmWidth; x++) {
      const bayerVal = BAYER_4X4[by + (x & 3)];
      if (thresholdInput > (bayerVal + 0.5) * 16) {
        const idx = (y * bmWidth + x) * 4;
        data[idx] = br;
        data[idx + 1] = bg;
        data[idx + 2] = bb;
        data[idx + 3] = outAlpha;
      }
    }
  }
  return img;
}

function upsertTrailCell(
  activeCells,
  cols,
  rows,
  col,
  row,
  now,
  source,
  revealedAt,
  holdMs,
  pinned = false,
  pinnedProgress = 0
) {
  if (col < 0 || col >= cols || row < 0 || row >= rows) return;
  const key = `${col},${row}`;
  const entry = {
    col,
    row,
    source,
    revealedAt,
    fadeAt: revealedAt + holdMs,
    touchedAt: now,
    pinned,
    pinnedProgress,
  };
  if (activeCells.has(key)) {
    activeCells.delete(key);
  }
  activeCells.set(key, entry);
}

function interpolateTrailSteps(fromCell, toCell, now, config, state) {
  const dc = toCell.col - fromCell.col;
  const dr = toCell.row - fromCell.row;
  const steps = Math.max(Math.abs(dc), Math.abs(dr));
  for (let s = 1; s <= steps; s++) {
    const t = s / steps;
    const ic = Math.round(fromCell.col + dc * t);
    const ir = Math.round(fromCell.row + dr * t);
    const revealedAt = now + (s - 1) * config.stepDelayMs;
    upsertTrailCell(
      state.activeCells,
      state.cols,
      state.rows,
      ic,
      ir,
      now,
      'pointer',
      revealedAt,
      config.trailHoldDurationMs
    );
  }
}

function refreshPointerFifo(activeCells, now, config) {
  let prevFade = 0;
  for (const cell of activeCells.values()) {
    if (cell.source !== 'pointer') continue;
    if (prevFade && cell.fadeAt < prevFade + config.fifoIntervalMs) {
      cell.fadeAt = Math.min(
        now + config.trailHoldDurationMs,
        prevFade + config.fifoIntervalMs
      );
    }
    prevFade = cell.fadeAt;
  }
}

function seedTrailSegment(state, config, placementSpec, now) {
  const points = placementSpec.buildSeedPath(state.cols, state.rows);
  const total = points.length;
  const pinned = Boolean(config.staticSeed || state.reducedMotion);

  points.forEach(([col, row], index) => {
    const tailDist = (total - 1 - index) / Math.max(1, total - 1);
    const revealedAt = now - 220 - (total - 1 - index) * 75;
    upsertTrailCell(
      state.activeCells,
      state.cols,
      state.rows,
      col,
      row,
      now,
      'seed',
      revealedAt,
      2400,
      pinned,
      tailDist * 0.55
    );
  });
}

function resizeCanvasGrid(canvas, ctx, state, config, placementSpec) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) {
    state.hidden = true;
    return;
  }

  state.hidden = false;
  const cssW = Math.max(16, Math.floor(rect.width));
  const cssH = Math.max(16, Math.floor(rect.height));
  state.bmWidth = Math.max(4, Math.ceil(cssW / config.canvasPixelSize));
  state.bmHeight = Math.max(4, Math.ceil(cssH / config.canvasPixelSize));
  canvas.width = state.bmWidth;
  canvas.height = state.bmHeight;
  state.cols = Math.ceil(state.bmWidth / config.subPerCell);
  state.rows = Math.ceil(state.bmHeight / config.subPerCell);
  state.baseImageData = drawBayerBaseMesh(ctx, state.bmWidth, state.bmHeight, config);

  if (config.seedInitialTrail && !state.hasSeeded) {
    seedTrailSegment(state, config, placementSpec, performance.now());
    state.hasSeeded = true;
  }
}

function pickStartInsideBounds(bounds, cols, rows) {
  for (let attempt = 0; attempt < 16; attempt++) {
    const c = Math.floor(cols * (bounds.colMin + Math.random() * (bounds.colMax - bounds.colMin)));
    const r = Math.floor(rows * (bounds.rowMin + Math.random() * (bounds.rowMax - bounds.rowMin)));
    if (!bounds.isInside || bounds.isInside(c, r, cols, rows)) {
      return [Math.max(1, Math.min(cols - 2, c)), Math.max(1, Math.min(rows - 2, r))];
    }
  }
  return [
    Math.max(1, Math.min(cols - 2, Math.floor(cols * ((bounds.colMin + bounds.colMax) / 2)))),
    Math.max(1, Math.min(rows - 2, Math.floor(rows * ((bounds.rowMin + bounds.rowMax) / 2)))),
  ];
}

function advanceAmbientWalk(state, config, placementSpec) {
  if (state.reducedMotion || !config.enableAmbient || state.cols < 8 || state.rows < 4) return;
  state.ambientTimers.forEach((id) => clearTimeout(id));
  state.ambientTimers = [];

  const bounds = placementSpec.ambientBounds;
  const totalSteps = 16 + Math.floor(Math.random() * 13);
  const turnAt = 9 + Math.floor(Math.random() * 8);
  let dir = bounds.preferHorizontal
    ? (Math.random() > 0.5 ? [1, 0] : [-1, 0])
    : (Math.random() > 0.5 ? [0, 1] : [0, -1]);
  let [c, r] = pickStartInsideBounds(bounds, state.cols, state.rows);

  for (let step = 0; step < totalSteps; step++) {
    const id = setTimeout(() => {
      if (state.destroyed || state.pointerInside) return;
      const now = performance.now();
      upsertTrailCell(state.activeCells, state.cols, state.rows, c, r, now, 'ambient', now, 900);

      if (step === turnAt) {
        dir =
          dir[0] !== 0
            ? (Math.random() > 0.5 ? [0, 1] : [0, -1])
            : (Math.random() > 0.5 ? [1, 0] : [-1, 0]);
      }

      let nc = c + dir[0];
      let nr = r + dir[1];
      const outOfBounds =
        nc < 1 ||
        nc >= state.cols - 1 ||
        nr < 1 ||
        nr >= state.rows - 1 ||
        (bounds.isInside && !bounds.isInside(nc, nr, state.cols, state.rows));

      if (outOfBounds) {
        dir = [-dir[0], -dir[1]];
        nc = c + dir[0];
        nr = r + dir[1];
      }
      c = Math.max(0, Math.min(state.cols - 1, nc));
      r = Math.max(0, Math.min(state.rows - 1, nr));
    }, step * 55);

    state.ambientTimers.push(id);
  }
}

function renderTrailOverlay(ctx, activeCells, now, subPerCell, config) {
  if (activeCells.size === 0) return;

  const [hr, hg, hb] = config.trailHeadColor;
  const [tr, tg, tb] = config.trailTailColor;
  const fadeDur = config.trailFadeDurationMs;
  const revDur = config.revealDurationMs;

  for (const [key, cell] of activeCells.entries()) {
    if (now < cell.revealedAt) continue;

    let alpha = config.trailOpacity;
    let progress = cell.pinnedProgress || 0;

    if (!cell.pinned) {
      const endAt = cell.fadeAt + fadeDur;
      if (now >= endAt) {
        activeCells.delete(key);
        continue;
      }

      const sinceReveal = now - cell.revealedAt;
      if (sinceReveal < revDur) {
        alpha *= easeOutCubic(Math.max(0, sinceReveal / revDur));
      }
      if (now > cell.fadeAt) {
        const fadeT = Math.min(1, (now - cell.fadeAt) / fadeDur);
        alpha *= 1 - easeInOutCubic(fadeT);
      }

      if (alpha <= 0.01) continue;
      const totalLife = Math.max(1, endAt - cell.revealedAt);
      progress = Math.max(0, Math.min(1, (now - cell.revealedAt) / totalLife));
    }

    const ditherCutoff = progress * progress * 16;
    const colorT = Math.min(1, progress * 1.15);
    const r = Math.round(lerp(hr, tr, colorT));
    const g = Math.round(lerp(hg, tg, colorT));
    const b = Math.round(lerp(hb, tb, colorT));

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
    const bx = cell.col * subPerCell;
    const by = cell.row * subPerCell;

    for (let dy = 0; dy < subPerCell; dy++) {
      for (let dx = 0; dx < subPerCell; dx++) {
        const bayerVal = BAYER_4X4[(dy & 3) * 4 + (dx & 3)];
        if (bayerVal >= ditherCutoff) {
          ctx.fillRect(bx + dx, by + dy, 1, 1);
        }
      }
    }
  }
}

function renderFrame(ctx, state, config, now) {
  if (state.hidden || !state.baseImageData) return;
  ctx.putImageData(state.baseImageData, 0, 0);
  renderTrailOverlay(ctx, state.activeCells, now, config.subPerCell, config);
}

function createDotTrailState() {
  return {
    bmWidth: 1,
    bmHeight: 1,
    cols: 1,
    rows: 1,
    baseImageData: null,
    activeCells: new Map(),
    lastCell: null,
    lastPointerTime: 0,
    pointerInside: false,
    nextAmbientAt: performance.now() + 2600,
    ambientTimers: [],
    hasSeeded: false,
    hidden: false,
    destroyed: false,
    reducedMotion: Boolean(
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ),
  };
}

function handleDotTrailPointerMove(event, canvas, state, config) {
  if (state.hidden) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
    state.pointerInside = false;
    state.lastCell = null;
    return;
  }

  state.pointerInside = true;
  const now = performance.now();
  state.lastPointerTime = now;

  const col = Math.floor(x / config.cellSize);
  const row = Math.floor(y / config.cellSize);
  if (state.lastCell && state.lastCell.col === col && state.lastCell.row === row) return;

  if (state.lastCell) {
    interpolateTrailSteps(state.lastCell, { col, row }, now, config, state);
  } else {
    upsertTrailCell(
      state.activeCells,
      state.cols,
      state.rows,
      col,
      row,
      now,
      'pointer',
      now,
      config.trailHoldDurationMs
    );
  }

  refreshPointerFifo(state.activeCells, now, config);
  state.lastCell = { col, row };
}

function bindDotTrailEvents(canvas, state, config) {
  const abortController = new AbortController();
  const onPointerMove = (event) => handleDotTrailPointerMove(event, canvas, state, config);
  const onPointerLeave = () => {
    state.pointerInside = false;
    state.lastCell = null;
  };

  config.listenTarget.addEventListener('pointermove', onPointerMove, {
    passive: true,
    signal: abortController.signal,
  });
  if (config.listenTarget === window) {
    document.addEventListener('mouseleave', onPointerLeave, {
      signal: abortController.signal,
    });
  } else {
    config.listenTarget.addEventListener('pointerleave', onPointerLeave, {
      signal: abortController.signal,
    });
  }
  return abortController;
}

function createDotTrailLoop(ctx, state, config, placementSpec) {
  let rafId = 0;

  function tick(now) {
    if (state.destroyed) return;
    rafId = requestAnimationFrame(tick);

    if (
      config.enableAmbient &&
      !state.reducedMotion &&
      !state.pointerInside &&
      now - state.lastPointerTime > 3200 &&
      now >= state.nextAmbientAt
    ) {
      advanceAmbientWalk(state, config, placementSpec);
      state.nextAmbientAt = now + 4200 + Math.random() * 2800;
    }

    renderFrame(ctx, state, config, now);
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

function disposeDotTrail(state, stopLoop, ro, abortController) {
  if (state.destroyed) return;
  state.destroyed = true;
  stopLoop();
  state.ambientTimers.forEach((id) => clearTimeout(id));
  state.ambientTimers = [];
  state.activeCells.clear();
  ro.disconnect();
  abortController.abort();
}

export function initDotTrailCanvas(canvas, options = {}) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) return null;

  const config = createGridConfig(options);
  const placementSpec = getPlacementSpec(config.placement);
  applyPlacementMask(canvas, placementSpec, config.placement);

  const state = createDotTrailState();
  const abortController = bindDotTrailEvents(canvas, state, config);

  const performResize = () => {
    if (state.destroyed) return;
    resizeCanvasGrid(canvas, ctx, state, config, placementSpec);
    renderFrame(ctx, state, config, performance.now());
  };

  const ro = new ResizeObserver(performResize);
  ro.observe(canvas);
  performResize();

  const stopLoop = createDotTrailLoop(ctx, state, config, placementSpec);

  return {
    destroy: () => disposeDotTrail(state, stopLoop, ro, abortController),
    triggerAmbientWalk() {
      if (!state.destroyed) {
        advanceAmbientWalk(state, config, placementSpec);
      }
    },
    resize: performResize,
  };
}
