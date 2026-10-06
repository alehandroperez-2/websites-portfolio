import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const port = Number(process.env.PORT || 4179);
const root = resolve('pages-dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  let target = resolve(root, `.${pathname}`);

  if (!target.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = resolve(target, 'index.html');
    const fileInfo = await stat(target);
    if (!fileInfo.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': types[extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(target).pipe(response);
  } catch {
    const fallback = resolve(root, '404.html');
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    createReadStream(fallback).pipe(response);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`GitHub Pages preview ready at http://127.0.0.1:${port}/`);
});
