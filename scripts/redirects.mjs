/** Static path redirects (301). Keys are pathname without query/hash. */
export const PATH_REDIRECTS = new Map([
  ['/blog', '/blog/'],
  ['/about', '/about/'],
  ['/contact', '/support/'],
  ['/contact/', '/support/'],
  ['/support', '/support/'],
  ['/privacy', '/privacy/'],
  ['/terms', '/terms/'],
  ['/faq', '/faq/'],
  ['/cheats', '/'],
  ['/cheats/', '/'],
  ['/cheats/lite', '/'],
  ['/cheats/lite/', '/'],
  ['/cheats/pro', '/'],
  ['/cheats/pro/', '/'],
  ['/cheats/elite', '/'],
  ['/cheats/elite/', '/'],
  ['/cheats/compare', '/blog/dota-2-lite-vs-pro/'],
  ['/cheats/compare/', '/blog/dota-2-lite-vs-pro/'],
  ['/products/dota-2-cheats/utilities', '/products/dota-2-cheats/utilities/'],
  ['/products/dota-2-cheats', '/'],
  ['/products/dota-2-cheats/', '/'],
  ['/products/dota-2-cheats/account-recovery', '/products/dota-2-cheats/ugc/'],
  ['/products/dota-2-cheats/account-recovery/', '/products/dota-2-cheats/ugc/'],
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
  ['/guides/borderlands-3-cheat-system-requirements', '/guides/bo7-cheat-requirements/'],
  ['/guides/borderlands-3-cheat-system-requirements/', '/guides/bo7-cheat-requirements/'],
  ['/guides/system-requirements', '/guides/bo7-cheat-requirements/'],
  ['/guides/system-requirements/', '/guides/bo7-cheat-requirements/'],
  ['/cloud-dma-setup', '/cloud-dma/'],
  ['/cloud-dma-setup/', '/cloud-dma/'],
  ['/guides/cloud-dma-setup', '/cloud-dma/'],
  ['/guides/cloud-dma-setup/', '/cloud-dma/'],
  ['/sitemap-index.xml', '/sitemap.xml'],
  ['/sitemap-0.xml', '/sitemap.xml'],
]);

/** Paths that should not receive a forced trailing slash. */
export const TRAILING_SLASH_SKIP = /\.[a-z0-9]+$/i;

export function resolvePathRedirect(pathname) {
  const direct = PATH_REDIRECTS.get(pathname);
  if (direct) return direct;
  if (!pathname.endsWith('/') && !TRAILING_SLASH_SKIP.test(pathname)) {
    return PATH_REDIRECTS.get(`${pathname}/`);
  }
  return null;
}