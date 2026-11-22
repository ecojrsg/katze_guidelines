# Katze Graphite Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/katze-graphite/design.md`
- Preview card: `bold-template-pack/templates/katze-graphite/preview.md`

## Selection Metadata

- Slug: `katze-graphite`
- Tagline: Architectural dark-graphite engineering deck (0% pure black) with interactive Bayer 4×4 dither trails, 1px technical sheets, and solid isometric /anatomy instruments.
- Mood: precise, technical, minimalist, authoritative, modern
- Tone: engineering, consultative, sober, honest, crisp
- Formality: high
- Density: medium
- Scheme: dark
- Best for: Brand guidelines, technical consulting decks, ERP/DevOps architecture proposals, B2B industrial software presentations, and executive engineering reviews where clarity and restraint earn trust.
- Avoid for: Playful consumer marketing, pastel lifestyle decks, or vibrant pop-art campaigns that rely on heavy decorative gradients.

## Visual Snapshot

An architectural dark-mode presentation system built for technical clarity and zero visual noise. The canvas rests on cool carbon graphite (`#16161B` — never pure `#000000`), structured by razor-thin `1px` hairlines (`rgba(243, 242, 247, 0.1)`) and generous negative space following a strict `80 / 15 / 5` ratio (80% graphite & breathing room, 15% crisp ink and rules, 5% Katze violet focus `#9B5DE5` / `#D16FFF`). Display headlines run in `Expletus Sans`, clean editorial copy in `Inter`, and specs/figure labels in `JetBrains Mono`. Atmospheric texture comes from an **interactive n8n-inspired Bayer 4×4 ordered-dither dot grid** anchored to `bottom`, `right`, `top`, or `diagonal-right` so it never collides with content, paired with monochrome-to-light hover components and solid 4-tone isometric `/anatomy` figures.

## Preview Ingredients

- Palette: carbon #16161B; slate #1E1E26; graphite #252530; katze-plum #2E1A47; amethyst #9B5DE5; lavender #D16FFF; odoo-plum #714B67; ink-primary #F3F2F7; ink-secondary #A7A4B5
- Typography: See full design doc after selection (`Expletus Sans`, `Inter`, `JetBrains Mono`).
- Signature move: Zero pure black (`#000000` is strictly banned); every dark surface sits in cool carbon/slate graphite.
- Signature move: **Interactive Bayer 4×4 DitherTrailGrid** (`image-rendering: pixelated`, 16×16 px cells) — whenever included in HTML slides, it MUST react live to cursor movement with a FIFO `#D16FFF → #9B5DE5` Bayer dissolution trail plus calm orthogonal ambient walks.
- Signature move: Full-bleed 5-column `1px` technical blueprint slides (`FIG_01`–`FIG_04`) with dotted `#15151A` diagram zones and solid 4-tone `/anatomy` isometric mechanisms.
- Signature move: Borderless monochrome-to-light interactive tiles (*Sobriedad en reposo. Claridad al interactuar.*) with subtle white outer rim glow and concentrated violet internal focus.

## Preview Rules

- Build exactly one title slide at 1920x1080 inside the fixed-stage model (`viewport-base.css`).
- Preserve the `0% #000000` palette, 80/15/5 ratio, type roles, and interactive Bayer 4×4 canvas (calibrated to the scaled stage).
- Use the user's real title/subtitle/context; never render internal workflow text, template names, or slugs on the slide.
- Do not read `template.html` for preview generation.
- After the user picks this template for the full deck, read `bold-template-pack/templates/katze-graphite/design.md` before generating final slides.
