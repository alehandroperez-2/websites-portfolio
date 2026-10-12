import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { deflateSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..');
const pages = resolve(root, 'pages');

const colors = {
  background: [11, 15, 13, 255],
  foreground: [241, 243, 236, 255],
  accent: [130, 239, 199, 255],
  transparent: [0, 0, 0, 0],
};

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  }
  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function encodePng(width, height, pixels) {
  const stride = width * 4;
  const scanlines = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const target = y * (stride + 1);
    scanlines[target] = 0;
    pixels.copy(scanlines, target + 1, y * stride, (y + 1) * stride);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(scanlines, { level: 9 })),
    chunk('IEND'),
  ]);
}

function canvas(width, height, color = colors.transparent) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let offset = 0; offset < pixels.length; offset += 4) {
    pixels.set(color, offset);
  }
  return { width, height, pixels };
}

function setPixel(image, x, y, color) {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) return;
  image.pixels.set(color, (y * image.width + x) * 4);
}

function fillRect(image, x, y, width, height, color) {
  for (let py = Math.max(0, Math.floor(y)); py < Math.min(image.height, Math.ceil(y + height)); py += 1) {
    for (let px = Math.max(0, Math.floor(x)); px < Math.min(image.width, Math.ceil(x + width)); px += 1) {
      setPixel(image, px, py, color);
    }
  }
}

function fillRoundedRect(image, x, y, width, height, radius, color) {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const right = Math.ceil(x + width);
  const bottom = Math.ceil(y + height);
  for (let py = top; py < bottom; py += 1) {
    for (let px = left; px < right; px += 1) {
      const cx = Math.max(x + radius, Math.min(px + 0.5, x + width - radius));
      const cy = Math.max(y + radius, Math.min(py + 0.5, y + height - radius));
      if ((px + 0.5 - cx) ** 2 + (py + 0.5 - cy) ** 2 <= radius ** 2) {
        setPixel(image, px, py, color);
      }
    }
  }
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function fillPolygon(image, points, color) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y += 1) {
    for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x += 1) {
      if (pointInPolygon(x + 0.5, y + 0.5, points)) setPixel(image, x, y, color);
    }
  }
}

function drawMark(image, x, y, size) {
  const scale = size / 64;
  fillRoundedRect(image, x, y, size, size, 14 * scale, colors.background);
  const mark = [
    [13, 47], [13, 17], [21, 17], [32, 34], [43, 17], [51, 17],
    [51, 47], [43, 47], [43, 29], [32, 45], [21, 29], [21, 47],
  ].map(([px, py]) => [x + px * scale, y + py * scale]);
  fillPolygon(image, mark, colors.foreground);
  fillRoundedRect(image, x + 10 * scale, y + 54 * scale, 44 * scale, 3 * scale, 1.5 * scale, colors.accent);
}

function iconPng(size) {
  const image = canvas(size, size);
  drawMark(image, 0, 0, size);
  return encodePng(size, size, image.pixels);
}

function ogPng() {
  const image = canvas(1200, 630, colors.background);
  fillRect(image, 0, 0, 1200, 8, colors.accent);
  fillRect(image, 0, 622, 1200, 8, colors.accent);
  drawMark(image, 386, 101, 428);
  return encodePng(image.width, image.height, image.pixels);
}

function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const favicon32 = iconPng(32);
await Promise.all([
  writeFile(resolve(pages, 'favicon-32.png'), favicon32),
  writeFile(resolve(pages, 'favicon-512.png'), iconPng(512)),
  writeFile(resolve(pages, 'apple-touch-icon.png'), iconPng(180)),
  writeFile(resolve(pages, 'favicon.ico'), icoFromPng(favicon32, 32)),
  writeFile(resolve(pages, 'og-image.png'), ogPng()),
]);

console.log('Generated portfolio favicon, touch icon, manifest icon, and Open Graph preview assets.');
