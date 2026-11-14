import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_MONEY_ROUTES, TEMPLATE_SHELL } from '../config/site.mjs';

if (TEMPLATE_SHELL) {
  console.log('verify-anchor-text: skipped (TEMPLATE_SHELL)');
  process.exit(0);
}

const dist = path.join(process.cwd(), 'dist');
const projectRoot = process.cwd();
const errors = [];

const AUDIT_ROUTES = new Set([
  ...INDEXABLE_MONEY_ROUTES,
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
]);

/** Skip global chrome: nav, footer, checkout widgets repeat labels by design. */
function contentHtml(html) {
  const article = html.match(/<article[^>]*class="[^"]*content-markdown[\s\S]*?<\/article>/i)?.[0];
  if (article) return article;
  const overview = html.match(/id="abi-overview"[\s\S]*?<\/section>/i)?.[0];
  return overview ?? '';
}

function normalizeHref(href) {
  if (!href || href.startsWith('mailto:') || href.startsWith('javascript:')) return null;
  let p = href.split('#')[0].trim();
  if (!p.startsWith('/')) return null;
  if (!p.endsWith('/') && !p.includes('.')) p = `${p}/`;
  return p;
}

function anchorTextFromHtml(inner) {
  return inner
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAnchor(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractLinks(htmlChunk) {
  const links = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(htmlChunk)) !== null) {
    const href = normalizeHref(m[1]);
    const text = anchorTextFromHtml(m[2]);
    if (!href || !text) continue;
    if (href.startsWith('/go/')) continue;
    links.push({ text, href, norm: normalizeAnchor(text) });
  }
  return links;
}

function readHtml(route) {
  const file = path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}index.html`);
  if (!fs.existsSync(file)) {
    errors.push(`Missing built page: ${route}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

/** Site-wide: one anchor phrase must not target multiple internal URLs (outside nav). */
const globalAnchorToHrefs = new Map();

for (const route of AUDIT_ROUTES) {
  const html = readHtml(route);
  if (!html) continue;

  const chunk = contentHtml(html);
  if (!chunk) continue;

  const links = extractLinks(chunk);
  const byNorm = new Map();

  for (const link of links) {
    const hits = byNorm.get(link.norm) ?? [];
    hits.push(link);
    byNorm.set(link.norm, hits);

    const global = globalAnchorToHrefs.get(link.norm) ?? new Set();
    global.add(link.href);
    globalAnchorToHrefs.set(link.norm, global);
  }

  for (const [norm, hits] of byNorm) {
    const hrefs = new Set(hits.map((h) => h.href));
    if (hrefs.size > 1) {
      errors.push(
        `${route}: anchor "${hits[0].text}" points to ${[...hrefs].join(' and ')}`,
      );
    }
    if (hits.length > 1 && hrefs.size === 1) {
      errors.push(
        `${route}: repeated anchor "${hits[0].text}" (${hits.length}×) → ${[...hrefs][0]}`,
      );
    }
  }
}

for (const [norm, hrefs] of globalAnchorToHrefs) {
  if (hrefs.size > 1 && norm.length >= 3) {
    const sample = [...hrefs].join(', ');
    errors.push(`Global anchor conflict "${norm}" → ${sample}`);
  }
}

/** Markdown money pages: unique link labels per file. */
const mdDir = path.join(projectRoot, 'content', 'pages');
for (const file of fs.readdirSync(mdDir).filter((f) => f.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(mdDir, file), 'utf8');
  const mdLinks = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({
    text: m[1].replace(/\*\*/g, '').trim(),
    href: m[2].trim(),
    norm: normalizeAnchor(m[1].replace(/\*\*/g, '')),
  }));
  const byNorm = new Map();
  for (const link of mdLinks) {
    if (link.href.includes('AFFILIATE')) continue;
    const hits = byNorm.get(link.norm) ?? [];
    hits.push(link);
    byNorm.set(link.norm, hits);
  }
  for (const [norm, hits] of byNorm) {
    const hrefs = new Set(hits.map((h) => h.href));
    if (hrefs.size > 1) {
      errors.push(`content/pages/${file}: "${hits[0].text}" → ${[...hrefs].join(' and ')}`);
    }
  }
}

if (errors.length) {
  console.error('verify-anchor-text failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-anchor-text: OK (${AUDIT_ROUTES.size} routes + markdown)`);
