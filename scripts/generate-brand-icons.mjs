import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const source = path.join(publicDir, 'brand', 'bo7-logo-source.png');

/** Matches BO7 logo artwork (black field). */
const ICON_BG = { r: 0, g: 0, b: 0, alpha: 1 };

if (!fs.existsSync(source)) {
  console.error('generate-brand-icons: missing source at', source);
  process.exit(1);
}

function squarePng(size) {
  return sharp(source)
    .resize(size, size, {
      fit: 'contain',
      background: ICON_BG,
    })
    .png();
}

await squarePng(180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
await squarePng(32).toFile(path.join(publicDir, 'favicon-32.png'));
await squarePng(16).toFile(path.join(publicDir, 'favicon-16.png'));
await squarePng(32).toFile(path.join(publicDir, 'favicon.ico'));

const png180 = await squarePng(180).toBuffer();
const base64 = png180.toString('base64');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="BO7 Cheats">
  <image href="data:image/png;base64,${base64}" width="180" height="180"/>
</svg>
`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
fs.writeFileSync(path.join(publicDir, 'logo.svg'), faviconSvg, 'utf8');

console.log('Brand icons generated from public/brand/bo7-logo-source.png');