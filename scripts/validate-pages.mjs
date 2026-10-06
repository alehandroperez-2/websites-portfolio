import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'pages-dist');
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
const failures = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function filesWithin(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    else files.push(path);
  }
  return files;
}

function localReference(value) {
  const trimmed = value.trim();
  return trimmed && !/^(?:[a-z]+:|\/\/|#)/i.test(trimmed);
}

async function validateReference(file, rawReference) {
  const reference = rawReference.split(/[?#]/, 1)[0];
  if (!localReference(reference)) return;
  const target = resolve(dirname(file), reference);
  const resolvedTarget = reference.endsWith('/') ? resolve(target, 'index.html') : target;
  if (!resolvedTarget.startsWith(root) || !await exists(resolvedTarget)) {
    failures.push(`${file}: missing local reference ${rawReference}`);
  }
}

if (!await exists(resolve(root, 'index.html'))) failures.push('Missing root index.html');
if (!await exists(resolve(root, '.nojekyll'))) failures.push('Missing .nojekyll');

const landing = await readFile(resolve(root, 'index.html'), 'utf8');
for (const site of sites) {
  if (!await exists(resolve(root, site, 'index.html'))) failures.push(`Missing ${site}/index.html`);
  if (!landing.includes(`href="./${site}/"`)) failures.push(`Landing page is missing ${site}`);
}

for (const file of await filesWithin(root)) {
  const extension = extname(file).toLowerCase();
  if (!['.html', '.css'].includes(extension)) continue;
  const content = await readFile(file, 'utf8');

  for (const match of content.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    await validateReference(file, match[1]);
  }
  for (const match of content.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const candidate of match[1].split(',')) {
      await validateReference(file, candidate.trim().split(/\s+/, 1)[0]);
    }
  }
  for (const match of content.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    await validateReference(file, match[1]);
  }

  if (/(?:src|href|srcset)=["']\/(?!\/)|url\(["']?\/(?!\/)/.test(content)) {
    failures.push(`${file}: contains a root-relative asset reference`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`GitHub Pages artifact validated: ${sites.length} demos and all local asset references resolved.`);
