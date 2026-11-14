import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_MONEY_ROUTES, TEMPLATE_SHELL } from '../config/site.mjs';

if (TEMPLATE_SHELL) {
  console.log('verify-unique-copy: skipped (TEMPLATE_SHELL)');
  process.exit(0);
}

const dist = path.join(process.cwd(), 'dist');
const MIN_CHARS = 90;
const errors = [];

function readHtml(route) {
  const file = path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}index.html`);
  if (!fs.existsSync(file)) {
    errors.push(`Missing built page: ${route}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

/** Strip chrome so duplicates in nav/footer do not false-positive. */
function mainContentHtml(html) {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0];
  if (article) return article;
  const markdown = html.match(/id="abi-overview"[\s\S]*?<\/section>/i)?.[0];
  if (markdown) return markdown;
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0];
  return main ?? html;
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

const byText = new Map();

for (const route of INDEXABLE_MONEY_ROUTES) {
  const html = readHtml(route);
  if (!html) continue;

  const desc = html.match(/name="description" content="([^"]*)"/i)?.[1] ?? '';
  if (desc) {
    const key = normalizeParagraph(desc);
    if (key.length >= 40) {
      const hit = byText.get(`meta:${key}`);
      if (hit) {
        errors.push(`Duplicate meta description on ${hit} and ${route}`);
      } else {
        byText.set(`meta:${key}`, route);
      }
    }
  }

  for (const para of paragraphsFromHtml(html)) {
    const existing = byText.get(para);
    if (existing && existing !== route) {
      const preview = para.slice(0, 72);
      errors.push(`Duplicate paragraph (${preview}…) on ${existing} and ${route}`);
    } else if (!existing) {
      byText.set(para, route);
    }
  }
}

if (errors.length) {
  console.error('verify-unique-copy failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-unique-copy: OK (${INDEXABLE_MONEY_ROUTES.length} money routes)`);
