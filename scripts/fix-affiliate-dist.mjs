import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const PLACEHOLDER = 'AFFILIATE_LINK_PLACEHOLDER';

function hrefForFile(file) {
  const rel = file.replace(/\\/g, '/');
  if (rel.includes('/cloud-dma/') || rel.includes('cloud-dma-for-arena-breakout-infinite')) {
    return '/go/cloud-dma/';
  }
  if (rel.includes('/hwid-spoofer/') || rel.includes('arena-breakout-infinite-hwid-spoofer')) {
    return '/go/hwid-spoofer/';
  }
  return '/go/main-product/';
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith('.html')) files.push(p);
  }
  return files;
}

let count = 0;
for (const file of walk(dist)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(PLACEHOLDER)) continue;
  const href = hrefForFile(file);
  html = html.replaceAll(`href="${PLACEHOLDER}"`, `href="${href}"`);
  html = html.replaceAll(`href='${PLACEHOLDER}'`, `href='${href}'`);
  fs.writeFileSync(file, html, 'utf8');
  count += 1;
}

console.log(`fix-affiliate-dist: patched ${count} HTML file(s)`);