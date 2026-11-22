import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = 4174;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown; charset=utf-8',
};

function resolvePort() {
  const envPort = Number(process.env.PORT);
  if (Number.isInteger(envPort) && envPort > 0) return envPort;

  const cliPort = Number(process.argv[2]);
  if (Number.isInteger(cliPort) && cliPort > 0) return cliPort;

  return DEFAULT_PORT;
}

function resolveFile(urlPath, rootDir) {
  const rawPath = (urlPath || '/').split('?')[0].split('#')[0];
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return null;
  }

  const normalizedPath = decoded === '/' ? '/index.html' : decoded;
  const relPath = normalizedPath.replace(/^\/+/, '');
  const target = path.resolve(rootDir, relPath);

  if (target !== rootDir && !target.startsWith(rootDir + path.sep)) {
    return null;
  }

  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return null;
  }

  return target;
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(message);
}

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      sendError(res, 500, '500 Internal Server Error');
    } else {
      res.destroy();
    }
  });
  stream.pipe(res);
}

function createStaticServer(rootDir) {
  const resolvedRoot = path.resolve(rootDir);
  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendError(res, 405, '405 Method Not Allowed');
      return;
    }

    const filePath = resolveFile(req.url, resolvedRoot);
    if (!filePath) {
      sendError(res, 404, '404 Not Found');
      return;
    }

    serveFile(req, res, filePath);
  });
}

const port = resolvePort();
const server = createStaticServer(__dirname);

server.listen(port, '127.0.0.1', () => {
  console.log(`\n  Katze Brand Guidelines serving at http://127.0.0.1:${port}`);
  console.log(`    • Principal:       http://127.0.0.1:${port}/index.html`);
  console.log(`    • Diseño & Skill:  http://127.0.0.1:${port}/diseno.html`);
  console.log(`    • Componentes:     http://127.0.0.1:${port}/componentes.html`);
  console.log(`    • Brand Knowledge: http://127.0.0.1:${port}/brand.html`);
  console.log(`    • Slides & PDF:    http://127.0.0.1:${port}/slides.html\n`);
});
