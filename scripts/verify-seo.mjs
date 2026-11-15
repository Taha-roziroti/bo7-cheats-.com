import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL, TEMPLATE_SHELL } from '../config/site.mjs';
import { contentBodyHtml } from './lib/contentBodyHtml.mjs';

if (TEMPLATE_SHELL) {
  console.log('verify-seo: skipped (TEMPLATE_SHELL)');
  process.exit(0);
}

const dist = path.join(process.cwd(), 'dist');
const errors = [];

/** Same indexable set as seo-audit HTML crawl. */
const INDEXABLE_ROUTES = [
  '/',
  '/cloud-dma/',
  '/hwid-spoofer/',
  '/guides/bo7-cheat-requirements/',
  '/faq/',
  '/about/',
  '/support/',
  '/privacy/',
  '/terms/',
];

const MONEY_ROUTES = new Set([
  '/',
  '/cloud-dma/',
  '/hwid-spoofer/',
  '/guides/bo7-cheat-requirements/',
]);

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;
const MIN_BODY_WORDS = 400;

function readHtml(route) {
  const file = path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}index.html`);
  if (!fs.existsSync(file)) {
    errors.push(`Missing built page: ${route}`);
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

function bodyWordCount(html) {
  const chunk = contentBodyHtml(html);
  if (!chunk) return 0;
  const text = chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function checkPage(route) {
  const html = readHtml(route);
  if (!html) return;

  const robots = html.match(/name="robots" content="([^"]*)"/i)?.[1] ?? '';
  if (/noindex/i.test(robots)) {
    errors.push(`${route}: indexable route must not use noindex`);
  }
  if (/nofollow/i.test(robots)) {
    errors.push(`${route}: indexable route must not use nofollow`);
  }

  const titleMatchEarly = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatchEarly) {
    const len = titleMatchEarly[1].length;
    if (len < TITLE_MIN || len > TITLE_MAX) {
      errors.push(`${route}: title length ${len} (target ${TITLE_MIN}–${TITLE_MAX}): ${titleMatchEarly[1]}`);
    }
  }

  const descMatchEarly = html.match(/name="description" content="([^"]*)"/i);
  if (descMatchEarly) {
    const len = descMatchEarly[1].length;
    if (len < DESC_MIN || len > DESC_MAX) {
      errors.push(`${route}: meta description length ${len} (target ${DESC_MIN}–${DESC_MAX})`);
    }
  }

  const words = bodyWordCount(html);
  if (words < MIN_BODY_WORDS) {
    errors.push(`${route}: main copy ~${words} words (minimum ${MIN_BODY_WORDS})`);
  }

  if (!html.includes('@media')) {
    errors.push(`${route}: missing responsive @media rules in document`);
  }

  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    errors.push(`${route}: canonical must be ${canonical}`);
  }

  if (!html.includes('rel="image_src"')) {
    errors.push(`${route}: missing rel=image_src`);
  }

  if (!html.includes('property="og:image:width" content="1200"')) {
    errors.push(`${route}: og:image:width must be 1200`);
  }

  if (!html.includes('property="og:image:height" content="630"')) {
    errors.push(`${route}: og:image:height must be 630`);
  }

  if (!html.includes(`${SITE_URL}/og/`)) {
    errors.push(`${route}: og:image must use ${SITE_URL}/og/*.jpg`);
  }

  if (html.includes('name="keywords"')) {
    errors.push(`${route}: meta keywords must not be present`);
  }

  if (html.includes('SearchAction')) {
    errors.push(`${route}: SearchAction JSON-LD is not allowed`);
  }

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count !== 1) {
    errors.push(`${route}: expected 1 h1 tag(s), found ${h1Count}`);
  }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const ogTitleMatch = html.match(/property="og:title" content="([^"]*)"/i);
  const descMatch = html.match(/name="description" content="([^"]*)"/i);
  const ogDescMatch = html.match(/property="og:description" content="([^"]*)"/i);

  if (titleMatch && ogTitleMatch && titleMatch[1] !== ogTitleMatch[1]) {
    errors.push(`${route}: og:title must match <title>`);
  }
  if (descMatch && ogDescMatch && descMatch[1] !== ogDescMatch[1]) {
    errors.push(`${route}: og:description must match meta description`);
  }

  if (!html.includes('"@type":"Organization"') && !html.includes('"@type": "Organization"')) {
    errors.push(`${route}: missing Organization JSON-LD`);
  }
  if (!html.includes('"@type":"WebSite"') && !html.includes('"@type": "WebSite"')) {
    errors.push(`${route}: missing WebSite JSON-LD`);
  }

  const requiresProduct =
    route !== '/faq/' &&
    !route.startsWith('/guides/') &&
    MONEY_ROUTES.has(route);
  if (
    requiresProduct &&
    !html.includes('"@type":"Product"') &&
    !html.includes('"@type": "Product"')
  ) {
    errors.push(`${route}: missing Product JSON-LD on money page`);
  }

  const productFaqRoutes = new Set(['/cloud-dma/', '/hwid-spoofer/']);
  if (
    productFaqRoutes.has(route) &&
    !html.includes('"@type":"FAQPage"') &&
    !html.includes('"@type": "FAQPage"')
  ) {
    errors.push(`${route}: missing FAQPage JSON-LD`);
  }
}

const titles = new Map();

for (const route of INDEXABLE_ROUTES) {
  checkPage(route);
  const html = readHtml(route);
  if (!html) continue;
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    if (titles.has(title)) {
      errors.push(`Duplicate title "${title}" on ${titles.get(title)} and ${route}`);
    } else {
      titles.set(title, route);
    }
  }
}

const sitemapPath = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('dist/sitemap.xml missing');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes('image:image')) {
    errors.push('sitemap.xml must include at least one image:image entry');
  }
  if (!sitemap.includes('<?xml-stylesheet')) {
    errors.push('sitemap.xml must reference sitemap.css stylesheet');
  }
  if (sitemap.includes('dotacheats.com')) {
    errors.push('sitemap.xml must not reference dotacheats.com');
  }
}

const robots = fs.readFileSync(path.join(process.cwd(), 'public', 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
  errors.push('robots.txt must point to apex sitemap');
}

if (errors.length) {
  console.error('verify-seo failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-seo: OK (${INDEXABLE_ROUTES.length} indexable routes + sitemap/robots)`);