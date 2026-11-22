---
version: 1.0.0
name: Katze Graphite
description: Architectural dark-graphite presentation system (0% pure black) built for Katze Brand Guidelines, engineering consulting, DevOps, and Odoo ERP decks. Combines cool carbon surfaces (#16161B), razor-thin 1px hairlines, Expletus Sans / Inter / JetBrains Mono typography, an ALWAYS-INTERACTIVE Bayer 4×4 ordered-dither grid in 4 safe placements (bottom, right, top, diagonal-right), 5-column technical blueprint sheets, solid 4-tone isometric /anatomy mechanisms, and monochrome-to-light hover tiles.

colors:
  stage-bg: "#111116"
  carbon: "#16161B"
  elevated: "#1C1C23"
  slate: "#1E1E26"
  graphite: "#252530"
  katze-plum: "#2E1A47"
  amethyst: "#9B5DE5"
  lavender: "#D16FFF"
  odoo-plum: "#714B67"
  ink-primary: "#F3F2F7"
  ink-secondary: "#A7A4B5"
  ink-muted: "#767385"
  hairline: "rgba(243, 242, 247, 0.10)"
  hairline-strong: "rgba(243, 242, 247, 0.20)"

typography:
  hero-display:
    fontFamily: "'Expletus Sans', sans-serif"
    fontSize: 92px
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.025em
  slide-heading:
    fontFamily: "'Expletus Sans', sans-serif"
    fontSize: 62px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.02em
  subhead:
    fontFamily: "'Inter', sans-serif"
    fontSize: 28px
    fontWeight: 300
    lineHeight: 1.48
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.56
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: 25px
    fontWeight: 300
    lineHeight: 1.35
  mono-meta:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: 16px
    fontWeight: 400
    letterSpacing: 0.08em

spacing:
  unit: 8px
  slide-padding: "88px 108px 96px"
  grid-gap: 1px
  radius-tile: 26px
  radius-panel: 14px

canvas:
  width: 1920px
  height: 1080px
  model: fixed-stage
---

# Katze Graphite — Design System & Presentation Recipe

## 1. Core Invariants (NON-NEGOTIABLE)

1. **Zero Pure Black (`#000000` is banned):** Every canvas, shadow, and surface uses cool carbon/slate graphite (`#16161B`, `#1C1C23`, `#1E1E26`, `#252530`) or deep plum (`#2E1A47`).
2. **80 / 15 / 5 Color Ratio:** 80% graphite and negative space, 15% crisp ink (`#F3F2F7` / `#A7A4B5`) and `1px` hairlines, 5% Katze violet (`#9B5DE5` / `#D16FFF`) reserved strictly for focus, active states, and the single lit element per figure. `#714B67` is reserved exclusively for the *Odoo Ready Partner* badge.
3. **Fixed `1920×1080` Stage:** Include the entire `viewport-base.css` inline. Scale `.deck-stage` uniformly to fit the viewport; never reflow slide layout on phones. Switch slides using `.active` / `.visible`, never `display: none`.
4. **No Visual Noise:** No nested cards inside cards, no eyebrow/kicker tags above headings, no gradient text, and no flat box-and-arrow diagrams.

---

## 2. Mandatory Rule: Interactive Bayer 4×4 Dotted Texture (`DitherTrailGrid`)

**NON-NEGOTIABLE INTERACTIVITY CONTRACT:**
Whenever a Katze Graphite HTML slide includes the n8n-inspired Bayer 4×4 dotted texture (`<canvas class="slide-dither" data-slide-dither="...">`), **it MUST always be interactive in live HTML — never a frozen static image.**

Required behavior on every HTML slide using the Bayer texture:
1. **Pixelated 4× Bitmap:** `image-rendering: pixelated; image-rendering: crisp-edges;`, logical cell size `16×16 px` (`4×4` internal canvas pixels per cell), 4×4 Bayer ordered-dithering matrix (`[0,8,2,10, 12,4,14,6, 3,11,1,9, 15,7,13,5]`) with base threshold `51 > (bayerVal + 0.5) * 16` painted at `rgba(204, 202, 214, 0.22)` so 3 of every 4 micro-dots form the woven cross lattice.
2. **Scale-Calibrated Cursor Tracking:** Because `.deck-stage` uses `transform: translate(...) scale(...)`, convert pointer events with `(e.clientX - rect.left) / rect.width * canvas.width / 4` and `(e.clientY - rect.top) / rect.height * canvas.height / 4`. This guarantees pixel-exact tracking at full screen, `1280×720`, mobile, or embedded inside an `<iframe>`.
3. **FIFO Bayer Dissolution Trail:** Grid-snapped 1-cell path with linear interpolation for fast strokes, solid `#D16FFF` (Lavender) head, FIFO tail drain (`hold ~620ms`, `fade ~760ms`) where sub-pixels drop out in Bayer order (`bayerVal >= progress² × 16`) while transitioning color smoothly from `#D16FFF` to `#9B5DE5`.
4. **Autonomous Ambient Walks:** When the pointer is idle for > 2.6 s (and `prefers-reduced-motion` is not set), run slow orthogonal 14–26 step walks inside the placement's safe zone. Pause animation loops automatically on non-active slides for 60 fps efficiency.
5. **Four Non-Intrusive Placements:**
   - `bottom` (`left: 0; bottom: 0; width: 1920px; height: 440px;`): Title slides, hero statements, colorimetry slides.
   - `right` (`right: 0; top: 0; width: 780px; height: 1080px;`): Left-aligned narrative slides, typography, brand knowledge.
   - `top` (`left: 0; top: 0; width: 1920px; height: 360px;`): Dense grids, 5-value matrices, bottom-weighted layouts.
   - `diagonal-right` (`inset: 0; width: 1920px; height: 1080px;`, `225deg` mask): Mission/Vision, executive callouts, closing slides.
6. **Print / PDF Compatibility:** Pre-seed one clean Bayer trail frame on initial load so static `@media print` / PDF snapshots still display the signature dissolved trail even without pointer input.

---

## 3. Slide Archetypes & Interactive Components

### A. Architectural 5-Column Blueprint Slide ("Sistema diseñado como plano técnico")
- Exact desktop grid at `1920×1080`: `grid-template-columns: 110px 460px 620px 620px 110px;` with `gap: 1px; background: rgba(243, 242, 247, 0.10);`.
- Dotted diagram cells (`#15151A`, `1.5px` dots every `20px`) with monospace `FIG_01`–`FIG_04` corner labels.
- Zero rounded corners or nested card boxes inside grid cells.

### B. Floating Solid Isometric Instruments (`/anatomy`)
- Built with `iso-kit.mjs`: real physical instruments (layer calibrator, 16:9 vernier drafting frame, tactile detent plunger & dial, dual-channel rocker deck) with 4-tone graphite side shading (`#16161E`..`#252532`), corner fasteners, ticks, knurls, true painter's depth order (`depthOf`), and **one lit focal part** (`#D16FFF` edge / `#3E2466` top).
- Interactive in HTML: calm idle/hover motion (layer separation on `FIG_01`, vernier glide on `FIG_02`, click actuation on `FIG_03` & `FIG_04`), automatically paused when the slide is not active.

### C. Floating Monochrome-to-Light Tiles ("Sobriedad en reposo. Claridad al interactuar.")
- 3 distinct bare columns (zero outer card wrapping tile + caption): rounded `26px` visual frame (`#15151B`) + bare `Inter 300` caption below.
- Outer frame glows softly in cool white/silver on hover (`inset 0 10px 48px -14px rgba(243, 242, 247, 0.24)`), while Katze violet illuminates only the active internal mechanism:
  1. Dual-visible slide carousel with interactive `Web UI` / `Slides 16:9` toggle and `#9B5DE5` active outline.
  2. Three center monochrome squares shifting into color on hover + 4 peripheral pills (`0% #000`, `WCAG AA`, `GRID 8PX`, `EXPLETUS`) connected by exact anchored curved SVG paths.
  3. Horizontal pill with center-masked borders fading behind a live animated binary hourglass stream (`010101`) + concentrated `#D16FFF` lateral halo.

---

## 4. Deck Chrome & Inline Editing

- Keep `.deck-controls` outside `.deck-stage` (centered bottom pill in `#16161B` with subtle `#D16FFF` border).
- Support keyboard navigation (`ArrowLeft`, `ArrowRight`, `Space`, `PageUp`, `PageDown`, `Home`, `End`), touch swipe, and mouse wheel.
- Include inline text editing toggled by `E` or the top-left `80×80` hotzone with a JS `400ms` grace timeout (never CSS `~` sibling hover) and `localStorage` persistence.
- Include `@page { size: 1920px 1080px; margin: 0; }` inside `@media print`.
