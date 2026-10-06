import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('.');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp', '.svg':'image/svg+xml' };
const server = createServer(async (request, response) => {
  const parts = new URL(request.url, 'http://localhost').pathname.split('/').filter(Boolean);
  const site = parts.shift() || 'dental';
  let relative = parts.join('/') || 'index.html';
  const base = join(root, 'sites', site, 'dist');
  const requested = normalize(join(base, relative));
  if (!requested.startsWith(base)) { response.writeHead(403).end('Forbidden'); return; }
  try {
    const info = await stat(requested);
    const file = info.isDirectory() ? join(requested, 'index.html') : requested;
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    response.end(content);
  } catch { response.writeHead(404).end('Not found'); }
});
server.listen(4190, '127.0.0.1', () => console.log('Built demos: http://127.0.0.1:4190/<site>/'));

