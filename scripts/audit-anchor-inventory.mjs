/**
 * Build audit/anchor-inventory.json and enforce anchor rules from cursor-seo-audit-prompt §3.
 * Chrome (header/footer/breadcrumb) is excluded from global body-uniqueness — see AUDIT_LOG.md Decisions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXABLE_MONEY_ROUTES, SITE_URL } from '../config/site.mjs';
import { contentBodyHtml } from './lib/contentBodyHtml.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, '..');
const dist = path.join(projectRoot, 'dist');
const outDir = path.join(projectRoot, 'audit');
const outFile = path.join(outDir, 'anchor-inventory.json');

const AUDIT_ROUTES = new Set([
  ...INDEXABLE_MONEY_ROUTES,
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/faq/',
]);

const GENERIC_ANCHORS = new Set([
  'click here',
  'here',
  'read more',
  'learn more',
  'more',
  'view',
  'see more',
  'details',
  'continue',
  'this page',
  'link',
]);

const errors = [];

function routeFromFile(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  const m = rel.match(/^(.+)\/index\.html$/);
  return m ? `/${m[1]}/` : null;
}

function walkHtml(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, files);
    else if (ent.name.endsWith('.html')) files.push(p);
  }
  return files;
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function anchorTextFromInner(inner) {
  const imgAlt = inner.match(/<img[^>]*\salt=["']([^"']+)["']/i)?.[1];
  if (imgAlt && !inner.replace(/<img[^>]*>/gi, '').trim()) return imgAlt;
  return inner
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveRegion(html, matchIndex, openTag) {
  const before = html.slice(0, matchIndex);
  const headerOpen = before.lastIndexOf('<header');
  const headerClose = before.lastIndexOf('</header>');
  if (headerOpen >= 0 && headerClose < headerOpen) return 'header';

  const footerOpen = before.lastIndexOf('<footer');
  const footerClose = before.lastIndexOf('</footer>');
  if (footerOpen >= 0 && footerClose < footerOpen) return 'footer';

  const slice = html.slice(Math.max(0, matchIndex - 400), matchIndex + 200);
  if (/\bbreadcrumb/i.test(slice) || /data-breadcrumb/i.test(slice)) return 'breadcrumb';

  if (openTag.includes('data-toc') || /\bclass="[^"]*toc/i.test(slice)) return 'toc';

  return 'body';
}

function normalizeHref(href) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:'))
    return null;
  let p = href.split('#')[0].trim();
  if (p.startsWith(SITE_URL)) p = p.slice(SITE_URL.length);
  if (!p.startsWith('/') && !p.startsWith('http')) return null;
  if (p.startsWith('/go/')) return null;
  if (!p.endsWith('/') && p.startsWith('/') && !p.includes('.')) p = `${p}/`;
  return p;
}

/** Body rules apply only to main editorial copy (matches verify-anchor-text scope). */
function bodyScopeHtml(html) {
  return contentBodyHtml(html);
}

function extractAnchors(html, page, scopeHtml = html) {
  const entries = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  const scan = scopeHtml === html ? html : scopeHtml;
  let m;
  while ((m = re.exec(scan)) !== null) {
    const index = scopeHtml === html ? m.index : html.indexOf(scan) + m.index;
    const attrs = m[1];
    const inner = m[2];
    if (/<a\b/i.test(inner)) {
      errors.push(`${page}: nested <a> tags detected`);
      continue;
    }
    const href = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href || href === '#') continue;
    const rel = attrs.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
    const aria = attrs.match(/\baria-label\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
    const text = anchorTextFromInner(inner);
    if (!text && !aria) {
      errors.push(`${page}: empty anchor → ${href}`);
      continue;
    }
    const visible = text || aria;
    const region = scopeHtml === html ? resolveRegion(html, index, attrs) : 'body';
    entries.push({
      page,
      region,
      text: visible,
      normalized: normalizeText(visible),
      href,
      normalizedHref: normalizeHref(href),
      rel,
    });
  }
  return entries;
}

function auditPage(entries, page) {
  const chromeLabels = new Set(
    entries.filter((e) => e.region !== 'body').map((e) => e.normalized),
  );

  const byRegion = new Map();
  for (const e of entries) {
    const list = byRegion.get(e.region) ?? [];
    list.push(e);
    byRegion.set(e.region, list);
  }

  for (const [region, list] of byRegion) {
    const seen = new Map();
    for (const e of list) {
      const hits = seen.get(e.normalized) ?? [];
      hits.push(e);
      seen.set(e.normalized, hits);
    }
    for (const [norm, hits] of seen) {
      if (hits.length > 1 && region !== 'body') {
        const hrefs = new Set(hits.map((h) => h.normalizedHref ?? h.href));
        if (hrefs.size > 1) {
          errors.push(
            `${page} [${region}]: label "${hits[0].text}" points to ${[...hrefs].join(' and ')}`,
          );
        } else if (region === 'footer') {
          errors.push(
            `${page} [footer]: repeated anchor "${hits[0].text}" (${hits.length}×) → ${[...hrefs][0]}`,
          );
        }
      }
    }
  }

  const bodyLinks = entries.filter((e) => e.region === 'body' && e.normalizedHref);
  const bodyByHref = new Map();
  const bodyByText = new Map();
  for (const e of bodyLinks) {
    const h = e.normalizedHref;
    const tHits = bodyByText.get(e.normalized) ?? [];
    tHits.push(e);
    bodyByText.set(e.normalized, tHits);

    const hits = bodyByHref.get(h) ?? [];
    hits.push(e);
    bodyByHref.set(h, hits);

    if (GENERIC_ANCHORS.has(e.normalized)) {
      errors.push(`${page} [body]: generic anchor "${e.text}"`);
    }
    if (chromeLabels.has(e.normalized)) {
      errors.push(`${page} [body]: anchor reuses chrome label "${e.text}"`);
    }
    const words = e.normalized.split(' ').filter(Boolean);
    if (words.length < 1 || words.length > 10) {
      if (e.normalized.length > 60) {
        errors.push(`${page} [body]: anchor too long (${words.length} words): "${e.text.slice(0, 40)}…"`);
      }
    }
  }

  for (const [href, hits] of bodyByHref) {
    if (href === page || href === page.replace(/\/$/, '')) {
      errors.push(`${page} [body]: self-link ${href}`);
    }
  }

  for (const [norm, hits] of bodyByText) {
    if (hits.length > 1) {
      const hrefs = new Set(hits.map((h) => h.normalizedHref));
      if (hrefs.size === 1) {
        errors.push(`${page} [body]: repeated anchor "${hits[0].text}" (${hits.length}×)`);
      }
    }
  }

  return { bodyByText, bodyLinks };
}

function main() {
  if (!fs.existsSync(dist)) {
    console.error('audit-anchor-inventory: dist/ missing — run build first');
    process.exit(1);
  }

  const inventory = [];
  const globalBodyText = new Map();

  for (const file of walkHtml(dist)) {
    const page = routeFromFile(file);
    if (!page || !AUDIT_ROUTES.has(page)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const allEntries = extractAnchors(html, page, html);
    inventory.push(...allEntries);
    const bodyChunk = bodyScopeHtml(html);
    const bodyEntries = bodyChunk ? extractAnchors(html, page, bodyChunk) : [];
    const chromeEntries = allEntries.filter((e) => e.region !== 'body');
    const { bodyByText } = auditPage([...chromeEntries, ...bodyEntries], page);

    for (const [norm, hits] of bodyByText) {
      const existing = globalBodyText.get(norm) ?? [];
      existing.push(...hits.map((h) => ({ page: h.page, href: h.normalizedHref })));
      globalBodyText.set(norm, existing);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify({ generated: new Date().toISOString(), anchors: inventory }, null, 2)}\n`);

  /** Money-route markdown body only — avoids chrome/checkout widget CTAs site-wide. */
  const mdGlobal = new Map();
  const mdDir = path.join(projectRoot, 'content', 'pages');
  if (fs.existsSync(mdDir)) {
    for (const file of fs.readdirSync(mdDir).filter((f) => f.endsWith('.md'))) {
      const text = fs.readFileSync(path.join(mdDir, file), 'utf8');
      for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        const norm = normalizeText(m[1].replace(/\*\*/g, ''));
        const href = m[2].split('#')[0].trim();
        if (href.includes('AFFILIATE')) continue;
        const hits = mdGlobal.get(norm) ?? [];
        hits.push({ file, href });
        mdGlobal.set(norm, hits);
      }
    }
    for (const [norm, hits] of mdGlobal) {
      const hrefs = new Set(hits.map((h) => h.href));
      if (hits.length > 1 && hrefs.size === 1) {
        errors.push(`markdown: repeated anchor "${hits[0].file}" text "${norm}" (${hits.length}×)`);
      }
      if (hrefs.size > 1) {
        errors.push(`markdown: "${norm}" → ${[...hrefs].join(' and ')}`);
      }
    }
  }

  if (errors.length) {
    console.error(`audit-anchor-inventory failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join('\n'));
    console.error(`\nWrote ${path.relative(projectRoot, outFile)} (${inventory.length} anchors)`);
    process.exit(1);
  }

  console.log(
    `audit-anchor-inventory: OK — ${inventory.length} anchors → ${path.relative(projectRoot, outFile)}`,
  );
}

main();