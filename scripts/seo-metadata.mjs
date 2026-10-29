import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const portfolioOrigin = 'https://alehandroperez-2.github.io/websites-portfolio/';
const creator = { '@type': 'Person', '@id': 'https://mykolams.com/#person', name: 'Mykola M', url: 'https://mykolams.com/' };
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const decodeHtml = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');

export async function writeSeoMetadata(output, sites) {
  const items = [];
  for (const site of ['', ...sites]) {
    const file = resolve(output, site, 'index.html');
    let html = await readFile(file, 'utf8');
    const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Websites Portfolio | Mykola M');
    const description = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i)?.[1] || 'Fictional website portfolio concept by Mykola M.');
    const url = `${portfolioOrigin}${site ? `${site}/` : ''}`;
    if (site) items.push({ '@type': 'ListItem', position: items.length + 1, name: title, url });
    const page = {
      '@type': site ? 'WebPage' : 'CollectionPage', '@id': `${url}#webpage`, url, name: title,
      description, inLanguage: 'en', creator: { '@id': creator['@id'] },
      ...(site ? { isPartOf: { '@id': `${portfolioOrigin}#webpage` } } : {})
    };
    // Existing demos remain indexable. Do not turn fictional brands into real business entities.
    html = html.replace(/\s*<link\b[^>]*rel="canonical"[^>]*>/gi, '')
      .replace(/\s*<meta\b[^>]*(?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/gi, '')
      .replace(/\s*<script\b[^>]*id="portfolio-seo"[^>]*>[\s\S]*?<\/script>/gi, '');
    const tags = [
      `<link rel="canonical" href="${url}">`,
      '<meta property="og:type" content="website">',
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      `<meta property="og:image" content="${portfolioOrigin}og-image.png">`,
      `<meta property="og:image:secure_url" content="${portfolioOrigin}og-image.png">`,
      '<meta property="og:image:type" content="image/png">',
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      '<meta property="og:image:alt" content="Mykola M fictional website portfolio concepts">',
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      `<meta name="twitter:image" content="${portfolioOrigin}og-image.png">`,
      `<script id="portfolio-seo" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [creator, page] }).replaceAll('<', '\\u003c')}</script>`
    ];
    html = html.replace(/<\/head>/i, `  ${tags.join('\n  ')}\n</head>`);
    await writeFile(file, html);
  }
  const indexFile = resolve(output, 'index.html');
  let indexHtml = await readFile(indexFile, 'utf8');
  indexHtml = indexHtml.replace(/(<script id="portfolio-seo" type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const data = JSON.parse(json);
    data['@graph'][1].mainEntity = { '@type': 'ItemList', itemListElement: items };
    return open + JSON.stringify(data).replaceAll('<', '\\u003c') + close;
  });
  await writeFile(indexFile, indexHtml);
  const urls = ['', ...sites].map((site) => `  <url><loc>${portfolioOrigin}${site ? `${site}/` : ''}</loc></url>`);
  await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
}
