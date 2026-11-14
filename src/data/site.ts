/** Canonical SEO / site identity — host from config/site.mjs; copy and routes here. */

import { SITE_HOST as CANONICAL_HOST, SITE_URL as CANONICAL_URL, buildSitemapImages } from '../../config/site.mjs';
import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE } from './placeholders';

export const SITE_HOST = CANONICAL_HOST;
export const SITE_URL = CANONICAL_URL;

export const SITE_NAME = PLACEHOLDER_COPY.siteName;
export const SITE_BRAND = SITE_NAME;
export const SUPPORT_EMAIL = `support@${SITE_HOST}`;

export const PRODUCT_BASE = '/';
export const TITLE_PREFIX = PLACEHOLDER_COPY.title;

export const PRODUCT_ID = `${SITE_URL}/#product`;

export const SITE_PURPOSE =
  'BO7 Cheats documents Black Ops 7 PC software—aimbot, ESP, radar, Cloud DMA, and HWID utilities—with real screenshots and compatibility guides.';

export const SITE_ABOUT = [
  'Black Ops 7 aimbot, ESP, and radar modules',
  'Single-PC Cloud DMA infrastructure',
  'HWID spoofer utility for supported PC builds',
  'Windows 10/11 compatibility and setup guides',
] as const;

export const LISTED_PRICES = {
  monthlyUsd: 35,
  lifetimeUsd: 150,
  cloudDmaLifetimeUsd: 50,
} as const;

export const SEO_ROUTE_INTENTS: Record<string, string> = {
  '/': 'Black Ops 7 cheats, BO7 cheats, aimbot, ESP',
  '/cloud-dma/': 'Cloud DMA for Black Ops 7, BO7 Cloud DMA',
  '/hwid-spoofer/': 'Black Ops 7 HWID spoofer, Ricochet HWID spoofer',
  '/guides/bo7-cheat-requirements/': 'Black Ops 7 cheat system requirements, BO7 PC requirements',
  '/faq/': 'BO7 product support questions',
  '/support/': 'customer support',
};

export { INDEXABLE_MONEY_ROUTES } from '../../config/site.mjs';

/** JPEG OG cards generated at build time from showcase art. */
export const OG_IMAGES: Record<string, string> = {
  '/': '/og/home.jpg',
  '/cloud-dma/': '/og/cloud-dma.jpg',
  '/hwid-spoofer/': '/og/default.jpg',
  '/guides/bo7-cheat-requirements/': '/og/requirements.jpg',
  '/faq/': '/og/faq.jpg',
  default: '/og/default.jpg',
};

export function ogImageForPath(pathname: string): string {
  const path = pathname.endsWith('/') || pathname === '' ? pathname || '/' : `${pathname}/`;
  return OG_IMAGES[path] ?? OG_IMAGES.default!;
}

export const SITEMAP_IMAGES = buildSitemapImages(SITE_URL) as Record<string, { loc: string; title: string }[]>;

export const KEYWORD_REDIRECTS: [string, string][] = [
  ['/pricing', '/'],
  ['/pricing/', '/'],
  ['/arena-breakout-infinite-esp', '/'],
  ['/arena-breakout-infinite-esp/', '/'],
  ['/arena-breakout-infinite-aimbot', '/'],
  ['/arena-breakout-infinite-aimbot/', '/'],
  ['/arena-breakout-infinite-cheats-pricing', '/'],
  ['/arena-breakout-infinite-cheats-pricing/', '/'],
  ['/cloud-dma-for-arena-breakout-infinite', '/cloud-dma/'],
  ['/cloud-dma-for-arena-breakout-infinite/', '/cloud-dma/'],
  ['/arena-breakout-infinite-hwid-spoofer', '/hwid-spoofer/'],
  ['/arena-breakout-infinite-hwid-spoofer/', '/hwid-spoofer/'],
  ['/guides/system-requirements', '/guides/bo7-cheat-requirements/'],
  ['/guides/system-requirements/', '/guides/bo7-cheat-requirements/'],
  ['/guides/borderlands-3-cheat-system-requirements', '/guides/bo7-cheat-requirements/'],
  ['/guides/borderlands-3-cheat-system-requirements/', '/guides/bo7-cheat-requirements/'],
  ['/cloud-dma-setup', '/cloud-dma/'],
  ['/cloud-dma-setup/', '/cloud-dma/'],
  ['/guides/cloud-dma-setup', '/cloud-dma/'],
  ['/guides/cloud-dma-setup/', '/cloud-dma/'],
  ['/sitemap-index.xml', '/sitemap.xml'],
  ['/sitemap-0.xml', '/sitemap.xml'],
];