import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_MONEY_ROUTES, TEMPLATE_SHELL } from '../config/site.mjs';

if (TEMPLATE_SHELL) {
  console.log('verify-unique-copy: skipped (TEMPLATE_SHELL)');
  process.exit(0);
}

const dist = path.join(process.cwd(), 'dist');
const contentDir = path.join(process.cwd(), 'content', 'pages');
const MIN_CHARS = 90;
const MD_MIN_CHARS = 60;

const AUDIT_ROUTES = [
  ...INDEXABLE_MONEY_ROUTES,
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/faq/',
];

const errors = [];

function readHtml(route) {
  const file = path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}index.html`);
  if (!fs.existsSync(file)) {
    errors.push(`Missing built page: ${route}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

/** Main copy only — excludes site footer inside main when present. */
function mainContentHtml(html) {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0];
  if (article) return article;
  const overview = html.match(/id="abi-overview"[\s\S]*?<\/section>/i)?.[0];
  if (overview) return overview;
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) return '';
  const footerIdx = main.indexOf('<footer');
  return footerIdx >= 0 ? main.slice(0, footerIdx) : main;
}

function normalizeParagraph(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '');
}

function paragraphsFromHtml(html) {
  const chunk = mainContentHtml(html);
  const paras = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const norm = normalizeParagraph(m[1]);
    if (norm.length >= MIN_CHARS) paras.push(norm);
  }
  return paras;
}

const metaDescBy = new Map();
const titleBy = new Map();
const paraBy = new Map();

for (const route of AUDIT_ROUTES) {
  const html = readHtml(route);
  if (!html) continue;

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  if (title) {
    const key = normalizeParagraph(title);
    const prev = titleBy.get(key);
    if (prev && prev !== route) {
      errors.push(`Duplicate <title> on ${prev} and ${route}`);
    } else {
      titleBy.set(key, route);
    }
  }

  const desc = html.match(/name="description" content="([^"]*)"/i)?.[1] ?? '';
  if (desc) {
    const key = normalizeParagraph(desc);
    if (key.length >= 40) {
      const prev = metaDescBy.get(key);
      if (prev && prev !== route) {
        errors.push(`Duplicate meta description on ${prev} and ${route}`);
      } else {
        metaDescBy.set(key, route);
      }
    }
  }

  for (const para of paragraphsFromHtml(html)) {
    const existing = paraBy.get(para);
    if (existing && existing !== route) {
      const preview = para.slice(0, 72);
      errors.push(`Duplicate paragraph (${preview}…) on ${existing} and ${route}`);
    } else if (!existing) {
      paraBy.set(para, route);
    }
  }
}

if (fs.existsSync(contentDir)) {
  const mdParaBy = new Map();
  for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const body = raw.replace(/^---[\s\S]*?---\n?/, '');
    for (const block of body.split(/\n\n+/)) {
      if (block.trim().startsWith('#')) continue;
      const norm = normalizeParagraph(block);
      if (norm.length < MD_MIN_CHARS) continue;
      const prev = mdParaBy.get(norm);
      if (prev && prev !== file) {
        errors.push(`Duplicate markdown block in content/pages/${prev} and ${file}: ${norm.slice(0, 60)}…`);
      } else {
        mdParaBy.set(norm, file);
      }
    }
  }
}

if (errors.length) {
  console.error('verify-unique-copy failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-unique-copy: OK (${AUDIT_ROUTES.length} routes + markdown)`);