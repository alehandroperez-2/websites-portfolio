import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'pages-dist');
const sites = [
  'dental',
  'vet',
  'restaurant',
  'hotel',
  'realestate',
  'construction',
  'construction-fieldbook',
  'saas',
  'analytics',
  'legal',
  'shop',
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const site of sites) {
  const source = resolve(root, 'sites', site, 'dist');
  await access(resolve(source, 'index.html'));
  await cp(source, resolve(output, site), { recursive: true });
}

await cp(resolve(root, 'pages'), output, { recursive: true });
await writeFile(resolve(output, '.nojekyll'), '');

console.log(`GitHub Pages artifact assembled at ${output}`);
