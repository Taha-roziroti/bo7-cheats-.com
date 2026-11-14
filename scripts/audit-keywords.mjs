/**
 * Keyword stuffing limits — cursor-seo-audit-prompt §5 (keywords.json + content/pages/*.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXABLE_MONEY_ROUTES } from '../config/site.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, '..');
const dist = path.join(projectRoot, 'dist');
const keywordsPath = path.join(projectRoot, 'keywords.json');
const contentDir = path.join(projectRoot, 'content', 'pages');

const MD_BY_ROUTE = {
  '/': 'index.md',
  '/cloud-dma/': 'cloud-dma.md',
  '/hwid-spoofer/': 'hwid-spoofer.md',
  '/guides/bo7-cheat-requirements/': 'bo7-cheat-requirements.md',
};

const errors = [];

function stripFrontmatter(md) {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('---', 3);
  return end >= 0 ? md.slice(end + 3) : md;
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countPhrase(text, phrase) {
  const lower = text.toLowerCase();
  const p = phrase.toLowerCase();
  if (!p) return 0;
  let count = 0;
  let i = 0;
  while ((i = lower.indexOf(p, i)) !== -1) {
    count++;
    i += p.length;
  }
  return count;
}

function headingTextsFromMd(md) {
  const out = [];
  for (const line of md.split('\n')) {
    const m = line.match(/^#{1,6}\s+(.+)/);
    if (m) out.push(m[1].replace(/\*\*/g, '').trim());
  }
  return out;
}

function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

function textForPage(page, html) {
  const mdFile = MD_BY_ROUTE[page];
  if (mdFile && fs.existsSync(path.join(contentDir, mdFile))) {
    const md = stripFrontmatter(fs.readFileSync(path.join(contentDir, mdFile), 'utf8'));
    return { text: md.replace(/[#*_\[\]()]/g, ' ').replace(/\s+/g, ' ').trim(), headings: headingTextsFromMd(md), source: 'markdown' };
  }
  return { text: visibleText(html), headings: [], source: 'html' };
}

function main() {
  if (!fs.existsSync(keywordsPath)) {
    console.error('audit-keywords: keywords.json missing');
    process.exit(1);
  }
  if (!fs.existsSync(dist)) {
    console.error('audit-keywords: dist/ missing');
    process.exit(1);
  }

  const { pages } = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

  const primaryOwners = new Map();
  for (const page of pages) {
    const key = page.primary.toLowerCase();
    const prev = primaryOwners.get(key);
    if (prev && prev !== page.route) {
      errors.push(`keywords: duplicate primary "${page.primary}" on ${prev} and ${page.route}`);
    }
    primaryOwners.set(key, page.route);
  }

  for (const page of pages) {
    const file =
      page.route === '/'
        ? path.join(dist, 'index.html')
        : path.join(dist, page.route.slice(1), 'index.html');
    if (!fs.existsSync(file)) continue;

    const html = fs.readFileSync(file, 'utf8');
    const { text, headings, source } = textForPage(page.route, html);
    const wordCount = words(text).length;
    if (!wordCount) continue;

    const isMoney = INDEXABLE_MONEY_ROUTES.includes(page.route);
    const primary = page.primary;
    const primaryCount = countPhrase(text, primary);
    const density = (primaryCount / wordCount) * 100;

    const densityMax = page.primaryDensityMax ?? 1.5;
    const headingMax = page.headingPrimaryMax ?? 2;

    if (isMoney || source === 'markdown') {
      if (density > densityMax) {
        errors.push(
          `${page.route}: primary "${primary}" density ${density.toFixed(2)}% (${primaryCount}/${wordCount} words, max ${densityMax}%)`,
        );
      }
      const headingList = headings.length ? headings : [];
      const primaryInHeadings = headingList.filter((h) =>
        h.toLowerCase().includes(primary.toLowerCase()),
      ).length;
      if (primaryInHeadings > headingMax) {
        errors.push(
          `${page.route}: primary in ${primaryInHeadings} headings (max ${headingMax})`,
        );
      }
    }

    for (const sec of page.secondaries ?? []) {
      if (!isMoney) continue;
      const secCount = countPhrase(text, sec);
      const secMax = Math.ceil(wordCount / 250) + 2;
      if (secCount > secMax) {
        errors.push(
          `${page.route}: secondary "${sec}" ${secCount}× (max ~${secMax} for ${wordCount} words)`,
        );
      }
    }

    if (['/about/', '/support/', '/privacy/', '/terms/', '/faq/'].includes(page.route)) {
      const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
      if (title && h1 && title.trim() === h1.trim()) {
        errors.push(`${page.route}: title and H1 are identical`);
      }
    }
  }

  if (errors.length) {
    console.error('audit-keywords failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }

  console.log(`audit-keywords: OK (${pages.length} pages in keywords.json)`);
}

main();