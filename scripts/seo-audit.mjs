/**
 * Full SEO audit — builds (unless SKIP_BUILD=1), crawls dist/, runs project verifiers.
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXABLE_MONEY_ROUTES, SITE_URL, SITE_HOST } from '../config/site.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, '..');
const dist = path.join(projectRoot, 'dist');

const AUDIT_HTML_ROUTES = new Set([
  ...INDEXABLE_MONEY_ROUTES,
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/faq/',
]);

const BY_CATEGORY = {
  build: [],
  links: [],
  technical: [],
  hygiene: [],
  spells: [],
  redirects: [],
};

function fail(category, message) {
  BY_CATEGORY[category]?.push(message);
}

function walkHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtmlFiles(p, files);
    else if (ent.name.endsWith('.html')) files.push(p);
  }
  return files;
}

function routeFromFile(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  const m = rel.match(/^(.+)\/index\.html$/);
  return m ? `/${m[1]}/` : null;
}

function distFileForPath(p) {
  const rel = p.replace(/^\//, '');
  const asDir = path.join(dist, rel, 'index.html');
  if (fs.existsSync(asDir)) return asDir;
  const asFile = path.join(dist, rel);
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile;
  return null;
}

function resolveInternalHref(href) {
  let p = href;
  if (p.startsWith(SITE_URL)) p = p.slice(SITE_URL.length);
  if (!p.startsWith('/')) return null;
  const hash = p.indexOf('#');
  if (hash >= 0) p = p.slice(0, hash);
  if (!p) return null;
  if (p.startsWith('/go/')) return 'skip';
  if (/\.(xml|png|jpe?g|webp|svg|ico|webmanifest|css|js|mjs|woff2?|txt|xsl)$/i.test(p)) {
    return distFileForPath(p) ?? 'missing';
  }
  if (p === '/') return path.join(dist, 'index.html');
  if (!p.endsWith('/')) p = `${p}/`;
  return distFileForPath(p) ?? 'missing';
}

const REDIRECT_ONLY = new Set([
  '/pricing/',
  '/arena-breakout-infinite-esp/',
  '/arena-breakout-infinite-aimbot/',
  '/arena-breakout-infinite-cheats-pricing/',
  '/cloud-dma-for-arena-breakout-infinite/',
  '/arena-breakout-infinite-hwid-spoofer/',
  '/guides/system-requirements/',
  '/guides/cloud-dma-setup/',
  '/guides/borderlands-3-cheat-system-requirements/',
  '/cloud-dma-setup/',
  '/cheats/',
  '/contact/',
]);

const LEAK_PATTERNS = [
  /dotacheats\.com/i,
  /\bDota\s*2\b/i,
  /Gearbox/i,
  /\b2K\b/,
  /placeholder\.svg/i,
  /AFFILIATE_LINK_PLACEHOLDER/,
  /lorem ipsum/i,
];

function auditPage(route, html, file) {
  if (!AUDIT_HTML_ROUTES.has(route)) {
    return;
  }

  const isHome = route === '/';
  const isMoney = INDEXABLE_MONEY_ROUTES.includes(route);

  if (!html.includes('rel="canonical"')) {
    fail('technical', `${route}: missing canonical (expected audited page)`);
    return;
  }

  if (html.includes('hreflang=')) {
    fail('technical', `${route}: hreflang alternate tags are not allowed`);
  }
  if (!html.includes('lang="en-US"') && !html.includes("lang='en-US'")) {
    if (!html.match(/<html[^>]*\slang=/i)) {
      fail('technical', `${route}: missing lang="en-US" on <html>`);
    } else {
      fail('technical', `${route}: <html> lang must be en-US`);
    }
  }

  const noindex = /noindex/i.test(html);
  const indexable =
    INDEXABLE_MONEY_ROUTES.includes(route) ||
    ['/about/', '/support/', '/privacy/', '/terms/', '/faq/'].includes(route);

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const desc = html.match(/name="description" content="([^"]*)"/i)?.[1] ?? '';
  if (!title) fail('technical', `${route}: missing <title>`);
  else if (isMoney && !noindex && (title.length < 42 || title.length > 60)) {
    fail('technical', `${route}: title length ${title.length} (target 42–60): ${title.slice(0, 50)}…`);
  }
  if (indexable && noindex) {
    fail('technical', `${route}: indexable route has noindex`);
  }
  const robotsMeta = html.match(/name="robots" content="([^"]*)"/i)?.[1] ?? '';
  if (indexable && /nofollow/i.test(robotsMeta)) {
    fail('technical', `${route}: indexable route has nofollow`);
  }
  if (!desc) fail('technical', `${route}: missing meta description`);
  else if (isMoney && !noindex && (desc.length < 110 || desc.length > 165)) {
    fail('technical', `${route}: meta description length ${desc.length} (target 110–165)`);
  }

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const h1Expected = 1;
  if (h1Count !== h1Expected) {
    fail('technical', `${route}: expected ${h1Expected} h1, found ${h1Count}`);
  }

  const canonical = `${SITE_URL}${isHome ? '/' : route}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    fail('technical', `${route}: canonical must be ${canonical}`);
  }

  if (isMoney || route === '/faq/') {
    for (const pat of LEAK_PATTERNS) {
      if (pat.test(html)) {
        fail('hygiene', `${route}: template leakage matched ${pat}`);
      }
    }
  }

  const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith('javascript:') || href === '#') {
      fail('links', `${route}: placeholder href ${href}`);
      continue;
    }
    if (/localhost|127\.0\.0\.1/i.test(href)) {
      fail('links', `${route}: dev URL ${href}`);
    }
    const target = resolveInternalHref(href);
    if (!target || target === 'skip') continue;
    if (target === 'missing' || !fs.existsSync(target)) {
      fail('links', `${route}: broken internal link ${href}`);
    }
    if (
      indexable &&
      REDIRECT_ONLY.has(href.endsWith('/') ? href : `${href}/`)
    ) {
      fail('links', `${route}: links to redirect alias ${href} — use final URL`);
    }
  }
}

function auditSitemap() {
  const sitemapPath = path.join(dist, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    fail('technical', 'dist/sitemap.xml missing');
    return;
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
  for (const loc of locs) {
    if (!loc.startsWith(SITE_URL)) {
      fail('technical', `sitemap: non-canonical host in ${loc}`);
    }
    if (loc.includes('/blog/') || loc.includes('/forum/')) {
      fail('technical', `sitemap: non-money URL should not be indexed: ${loc}`);
    }
    try {
      const pathname = new URL(loc).pathname;
      const file =
        pathname === '/'
          ? path.join(dist, 'index.html')
          : path.join(dist, pathname.slice(1), 'index.html');
      if (!fs.existsSync(file)) {
        fail('technical', `sitemap: loc has no built page ${loc}`);
      }
    } catch {
      fail('technical', `sitemap: invalid loc ${loc}`);
    }
  }
}

function runSubcommand(cmd, args, label) {
  const r = spawnSync(cmd, args, { cwd: projectRoot, stdio: 'pipe', shell: true, encoding: 'utf8' });
  if (r.status !== 0) {
    fail('build', `${label} failed:\n${r.stdout}\n${r.stderr}`);
  }
}

function runCspell() {
  const globs = [
    'content/pages/index.md',
    'content/pages/cloud-dma.md',
    'content/pages/hwid-spoofer.md',
    'content/pages/bo7-cheat-requirements.md',
    'src/data/faq.ts',
    'src/pages/404.astro',
  ];
  const r = spawnSync('npx', ['cspell', 'lint', ...globs, '--no-progress'], {
    cwd: projectRoot,
    encoding: 'utf8',
    shell: true,
  });
  if (r.status !== 0) {
    const out = `${r.stdout}\n${r.stderr}`.trim();
    fail('spells', `cspell failed:\n${out.slice(0, 4000)}`);
  }
}

function main() {
  if (!process.env.SKIP_BUILD) {
    console.log('seo-audit: running npm run build…');
    try {
      execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    } catch {
      fail('build', 'npm run build failed');
    }
  } else if (!fs.existsSync(dist)) {
    fail('build', 'dist/ missing — run without SKIP_BUILD=1');
  }

  runSubcommand('node', ['scripts/verify-redirects.mjs'], 'verify-redirects');
  runSubcommand('node', ['scripts/verify-seo.mjs'], 'verify-seo');
  runSubcommand('node', ['scripts/verify-unique-copy.mjs'], 'verify-unique-copy');
  runSubcommand('node', ['scripts/verify-images.mjs'], 'verify-images');
  runSubcommand('node', ['scripts/verify-anchor-text.mjs'], 'verify-anchor-text');
  runSubcommand('node', ['scripts/audit-anchor-inventory.mjs'], 'audit-anchor-inventory');
  runSubcommand('node', ['scripts/audit-keywords.mjs'], 'audit-keywords');

  const files = walkHtmlFiles(dist);
  for (const file of files) {
    const route = routeFromFile(file);
    if (!route) continue;
    const html = fs.readFileSync(file, 'utf8');
    auditPage(route, html, file);
  }

  if (fs.existsSync(path.join(dist, '404.html'))) {
    const html = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
    if (html.includes('dotacheats')) {
      fail('hygiene', '404 page: dotacheats reference');
    }
  } else {
    fail('links', 'dist/404.html missing');
  }

  auditSitemap();
  runCspell();

  const total = Object.values(BY_CATEGORY).reduce((n, arr) => n + arr.length, 0);
  if (total === 0) {
    console.log('seo-audit: OK — all checks passed');
    process.exit(0);
  }

  console.error('seo-audit failed:\n');
  for (const [cat, items] of Object.entries(BY_CATEGORY)) {
    if (!items.length) continue;
    console.error(`## ${cat}`);
    for (const msg of items) console.error(`  - ${msg}`);
    console.error('');
  }
  process.exit(1);
}

main();
