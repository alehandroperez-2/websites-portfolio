import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.env.PORT || 4178);
const root = resolve('sites');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  const clean = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const parts = clean.split('/').filter(Boolean);
  const site = parts.shift();
  if (!site) { response.writeHead(302, { Location: '/construction/' }); response.end(); return; }
  const relative = parts.length ? parts.join('/') : 'index.html';
  const target = normalize(join(root, site, 'dist', relative));
  const siteRoot = resolve(root, site, 'dist');
  if (!resolve(target).startsWith(siteRoot)) { response.writeHead(403); response.end('Forbidden'); return; }
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio preview server ready at http://127.0.0.1:${port}`));
