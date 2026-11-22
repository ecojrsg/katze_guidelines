# Instalar la plantilla `katze-graphite` en `/frontend-slides` (cualquier computadora)

Esta carpeta contiene **todo lo necesario** para instalar el estilo oficial **Katze Graphite** dentro de la skill global **`/frontend-slides`** en cualquier equipo con Windows, macOS o Linux.

---

## Archivos incluidos en este paquete

```text
skill/katze-frontend-slides/
├── INSTALL.md                                  # Esta guía de instalación
├── STYLE_GUIDE.md                              # Guía visual y reglas del estilo
├── install-template.mjs                        # Instalador automático (Node.js, 0 dependencias)
└── katze-graphite/
    ├── preview.md                              # Tarjeta compacta de previsualización
    ├── design.md                               # Especificación completa + regla Bayer interactiva
    ├── template.html                           # Deck de referencia completo 1920×1080
    └── selection-index-entry.json              # Entrada lista para selection-index.json
```

---

## Opción 1 — Instalación en 1 comando (recomendada)

Requiere tener instalada la skill global `/frontend-slides` y Node.js (v18+). Desde la raíz del repositorio `katze_guidelines`:

### Windows (PowerShell) / macOS / Linux
```bash
node skill/katze-frontend-slides/install-template.mjs
```

El script detecta automáticamente la carpeta global de la skill:
- Antigravity / Gemini: `~/.gemini/config/skills/frontend-slides`
- Claude Code: `~/.claude/skills/frontend-slides`
- Codex: `~/.codex/skills/frontend-slides`

Si tu skill está en otra carpeta, indícala explícitamente:
```bash
node skill/katze-frontend-slides/install-template.mjs --skill-dir "RUTA/A/frontend-slides"
```

---

## Opción 2 — Instalación manual (paso a paso)

1. **Ubica la carpeta global de `/frontend-slides`:**
   - **Windows:** `%USERPROFILE%\.gemini\config\skills\frontend-slides\bold-template-pack\`
   - **macOS / Linux:** `~/.gemini/config/skills/frontend-slides/bold-template-pack/`

2. **Crea la carpeta de la plantilla** dentro de `bold-template-pack/templates/`:
   ```text
   bold-template-pack/templates/katze-graphite/
   ```

3. **Copia estos 3 archivos** desde `skill/katze-frontend-slides/katze-graphite/` hacia esa carpeta:
   - `preview.md`
   - `design.md`
   - `template.html`

4. **Registra la plantilla en `bold-template-pack/selection-index.json`:**
   - Incrementa `"template_count"` en `+1`.
   - Agrega al final del arreglo `"templates": [...]` el objeto JSON completo de [`katze-graphite/selection-index-entry.json`](./katze-graphite/selection-index-entry.json).

---

## Opción 3 — Pedirle a tu agente IA que la instale

Si clonaste el repositorio `katze_guidelines` en otra computadora, basta con enviarle este prompt a tu agente:

> Instala la plantilla `katze-graphite` de `skill/katze-frontend-slides/katze-graphite/` dentro de mi skill global `/frontend-slides` (`bold-template-pack/templates/katze-graphite/`) y regístrala en `bold-template-pack/selection-index.json` usando `selection-index-entry.json` (o ejecutando `node skill/katze-frontend-slides/install-template.mjs`). Verifica al final que `selection-index.json` sea JSON válido y contenga `katze-graphite`.

---

## Verificación

Confirma que la plantilla quedó registrada ejecutando:

```bash
node -e "const d = JSON.parse(require('fs').readFileSync(require('os').homedir() + '/.gemini/config/skills/frontend-slides/bold-template-pack/selection-index.json','utf8')); console.log('Total:', d.template_count, '| Katze:', Boolean(d.templates.find(t => t.slug === 'katze-graphite')))"
```

A partir de ese momento, en cualquier conversación solo pide:
> *"Crea una presentación con `/frontend-slides` usando la plantilla `katze-graphite`."*
