#!/usr/bin/env node
/**
 * Katze Graphite — Instalador portable para la skill global /frontend-slides.
 * Uso:
 *   node skill/katze-frontend-slides/install-template.mjs
 *   node skill/katze-frontend-slides/install-template.mjs --skill-dir "/ruta/a/frontend-slides"
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(SCRIPT_DIR, 'katze-graphite');
const TEMPLATE_FILES = ['preview.md', 'design.md', 'template.html'];

function parseSkillDirArg(argv) {
  const flagIndex = argv.indexOf('--skill-dir');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return path.resolve(argv[flagIndex + 1]);
  }
  return null;
}

function resolveFrontendSlidesDir(argv) {
  const explicit = parseSkillDirArg(argv);
  if (explicit) return explicit;

  const home = os.homedir();
  const candidates = [
    path.join(home, '.gemini', 'config', 'skills', 'frontend-slides'),
    path.join(home, '.claude', 'skills', 'frontend-slides'),
    path.join(home, '.codex', 'skills', 'frontend-slides'),
  ];

  const found = candidates.find((dir) => fs.existsSync(path.join(dir, 'bold-template-pack')));
  return found || candidates[0];
}

function copyTemplateFiles(packDir) {
  const destDir = path.join(packDir, 'templates', 'katze-graphite');
  fs.mkdirSync(destDir, { recursive: true });

  for (const filename of TEMPLATE_FILES) {
    const src = path.join(SOURCE_DIR, filename);
    const dst = path.join(destDir, filename);
    if (!fs.existsSync(src)) {
      throw new Error(`No se encontró el archivo fuente: ${src}`);
    }
    fs.copyFileSync(src, dst);
  }
  return destDir;
}

function registerInSelectionIndex(packDir) {
  const indexPath = path.join(packDir, 'selection-index.json');
  const entryPath = path.join(SOURCE_DIR, 'selection-index-entry.json');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`No se encontró selection-index.json en: ${indexPath}`);
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = JSON.parse(fs.readFileSync(entryPath, 'utf8'));

  const existingIdx = indexData.templates.findIndex((item) => item.slug === entry.slug);
  if (existingIdx >= 0) {
    indexData.templates[existingIdx] = entry;
  } else {
    indexData.templates.push(entry);
  }
  indexData.template_count = indexData.templates.length;

  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2) + '\n', 'utf8');
  return { indexPath, count: indexData.template_count, updated: existingIdx >= 0 };
}

function main() {
  const skillDir = resolveFrontendSlidesDir(process.argv.slice(2));
  const packDir = path.join(skillDir, 'bold-template-pack');

  if (!fs.existsSync(packDir)) {
    console.error(`No se encontró la skill /frontend-slides en:\n  ${skillDir}`);
    console.error('Instala primero /frontend-slides o pasa la ruta con: --skill-dir "<ruta>"');
    process.exit(1);
  }

  const destDir = copyTemplateFiles(packDir);
  const { indexPath, count, updated } = registerInSelectionIndex(packDir);

  console.log('Katze Graphite instalado correctamente en /frontend-slides:');
  console.log(`  • Plantilla: ${destDir}`);
  console.log(`  • Índice:    ${indexPath} (${updated ? 'actualizada' : 'agregada'}, total: ${count})`);
}

main();
