import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_MONEY_ROUTES, TEMPLATE_SHELL } from '../config/site.mjs';

if (TEMPLATE_SHELL) {
  console.log('verify-images: skipped (TEMPLATE_SHELL)');
  process.exit(0);
}

const root = process.cwd();
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const errors = [];

const AUDIT_ROUTES = new Set([
  ...INDEXABLE_MONEY_ROUTES,
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/faq/',
  '/blog/',
]);

const STATIC_IMAGE_MANIFESTS = [
  path.join(root, 'src/data/showcaseImages.ts'),
  path.join(root, 'content/pages/index.md'),
  path.join(root, 'content/pages/cloud-dma.md'),
  path.join(root, 'content/pages/hwid-spoofer.md'),
  path.join(root, 'content/pages/bo7-cheat-requirements.md'),
];

function readHtml(route) {
  const file =
    route === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) {
    errors.push(`Missing built page: ${route}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

function isInsideAriaHidden(html, index) {
  const before = html.slice(Math.max(0, index - 1200), index);
  const open = (before.match(/aria-hidden\s*=\s*["']true["']/gi) ?? []).length;
  const close = (before.match(/<\/(?:div|section|span|a|figure|header|footer)\s*>/gi) ?? []).length;
  return open > close;
}

function localImagePath(urlPath) {
  if (!urlPath || !urlPath.startsWith('/')) return null;
  if (urlPath.startsWith('//') || urlPath.startsWith('/_astro/')) return null;
  const clean = urlPath.split('?')[0].split('#')[0];
  return path.join(publicDir, clean.replace(/^\//, '').replace(/\//g, path.sep));
}

function distImagePath(urlPath) {
  if (!urlPath || !urlPath.startsWith('/')) return null;
  const clean = urlPath.split('?')[0].split('#')[0];
  return path.join(dist, clean.replace(/^\//, '').replace(/\//g, path.sep));
}

function urlsFromImgTag(tag) {
  const urls = [];
  const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (src && !src.startsWith('data:')) urls.push(src);
  const srcset = tag.match(/\bsrcset\s*=\s*["']([^"']+)["']/i)?.[1];
  if (srcset) {
    for (const part of srcset.split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u && !u.startsWith('data:')) urls.push(u);
    }
  }
  return urls;
}

function assertFileExists(relUrl, context) {
  const inDist = distImagePath(relUrl);
  if (inDist && fs.existsSync(inDist)) return;
  const inPublic = localImagePath(relUrl);
  if (inPublic && fs.existsSync(inPublic)) return;
  errors.push(`${context}: image not found ${relUrl}`);
}

for (const route of AUDIT_ROUTES) {
  const html = readHtml(route);
  if (!html) continue;

  const imgRe = /<img\b[^>]*>/gi;
  let match;
  let imgIndex = 0;
  while ((match = imgRe.exec(html)) !== null) {
    imgIndex += 1;
    const tag = match[0];
    const pos = match.index;
    const hasAlt = /\balt\s*=/i.test(tag);
    if (!hasAlt) {
      errors.push(`${route}: <img #${imgIndex}> missing alt attribute`);
      continue;
    }
    const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
    const decorative = isInsideAriaHidden(html, pos);
    if (!alt.trim() && !decorative) {
      errors.push(`${route}: <img #${imgIndex}> has empty alt (not decorative)`);
    }
    for (const url of urlsFromImgTag(tag)) {
      if (url.startsWith('http')) continue;
      assertFileExists(url, `${route} img #${imgIndex}`);
    }
  }

  if (INDEXABLE_MONEY_ROUTES.includes(route) && /placeholder\.svg/i.test(html)) {
    errors.push(`${route}: money page must not reference placeholder.svg`);
  }
}

for (const manifest of STATIC_IMAGE_MANIFESTS) {
  if (!fs.existsSync(manifest)) continue;
  const text = fs.readFileSync(manifest, 'utf8');
  const paths = [...text.matchAll(/\/images\/[a-z0-9./_-]+\.(?:webp|png|jpe?g|svg)/gi)].map((m) => m[0]);
  const unique = [...new Set(paths)];
  for (const rel of unique) {
    const file = path.join(publicDir, rel.replace(/^\//, '').replace(/\//g, path.sep));
    if (!fs.existsSync(file)) {
      errors.push(`manifest ${path.basename(manifest)}: missing asset ${rel}`);
    }
  }
}

/** Blog card heroes use responsive WebP variants from PNG masters. */
const blogPngDir = path.join(publicDir, 'images', 'blog');
if (fs.existsSync(blogPngDir)) {
  for (const file of fs.readdirSync(blogPngDir).filter((f) => f.endsWith('.png'))) {
    const base = file.replace(/\.png$/i, '');
    const variant = path.join(blogPngDir, `${base}-400.webp`);
    if (!fs.existsSync(variant)) {
      errors.push(`blog: missing responsive variant for ${file} (expected ${base}-400.webp)`);
    }
  }
}

if (errors.length) {
  console.error('verify-images failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-images: OK (${AUDIT_ROUTES.size} routes + manifests)`);
