import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const sites = ['dental','vet','restaurant','hotel','realestate','construction','construction-fieldbook','saas','analytics','legal','shop'];
const errors = [];

async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

for (const site of sites) {
  const root = resolve('sites', site);
  const html = await readFile(join(root, 'index.html'), 'utf8');
  const js = await readFile(join(root, 'main.js'), 'utf8');
  if (!html.includes('Portfolio concept') || !html.includes('by Mykola M')) errors.push(`${site}: missing portfolio ownership notice`);
  if (!html.includes('https://mykolams.com/')) errors.push(`${site}: missing portfolio link`);
  if (/<form(?![^>]*(?:data-mock-form|data-local-form))/i.test(html)) errors.push(`${site}: form missing local-only safeguard`);
  if (/fetch\s*\(|XMLHttpRequest|sendBeacon|https?:\/\/(?!mykolams\.com)/i.test(js)) errors.push(`${site}: possible network write/external request`);
  if (!html.includes('viewport')) errors.push(`${site}: missing responsive viewport`);
  await stat(join(root, 'dist', 'index.html')).catch(() => errors.push(`${site}: build output missing`));

  const publicRoot = join(root, 'public');
  if (!['saas', 'analytics'].includes(site)) {
    const media = await walk(publicRoot).catch(() => []);
    const images = media.filter((path) => ['.webp', '.avif'].includes(extname(path).toLowerCase()));
    if (!images.length) errors.push(`${site}: expected reviewed image asset is missing`);
    for (const image of images) {
      const info = await stat(image);
      if (info.size >= 25 * 1024 * 1024) errors.push(`${image}: exceeds Cloudflare Pages 25 MiB limit`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Validated ${sites.length} demos: notices, portfolio links, form safeguards, local-only scripts, responsive metadata, builds, and asset limits.`);
