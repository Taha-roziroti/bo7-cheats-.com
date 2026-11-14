/**
 * Canonical site host — imported by Astro, src/data/site.ts, and Node build scripts.
 * Update only here before launch.
 */

export const SITE_HOST = 'bo7-cheats.com';
export const SITE_URL = `https://${SITE_HOST}`;

/** When true, postbuild SEO/copy verifiers exit successfully (shell site). */
export const TEMPLATE_SHELL = SITE_HOST === 'example.com';

export const INDEXABLE_MONEY_ROUTES = [
  '/',
  '/hwid-spoofer/',
  '/cloud-dma/',
  '/guides/bo7-cheat-requirements/',
];

const showcase = (file, title) => ({
  loc: `${SITE_URL}/images/showcase/${file}`,
  title,
});

/** Google sitemap image namespace entries (keep in sync with src/data/site.ts). */
export function buildSitemapImages(siteUrl = SITE_URL) {
  const withHost = (entry) => ({
    loc: entry.loc.replace(SITE_URL, siteUrl),
    title: entry.title,
  });

  return {
    '/': [
      withHost(showcase('bo7-esp-red-dot.webp', 'Black Ops 7 cheat interface showing player ESP through red-dot optic')),
      withHost(showcase('bo7-esp-terrace.webp', 'BO7 gameplay demonstration featuring enemy ESP with distance markers')),
    ],
    '/cloud-dma/': [
      withHost(showcase('bo7-esp-rooftop.webp', 'Cloud DMA interface showing the BO7 setup in a long-range overwatch scene')),
      withHost(showcase('bo7-radar-map.webp', 'Single-PC Hyper-V Cloud DMA setup companion radar overlay')),
    ],
    '/hwid-spoofer/': [
      withHost(showcase('bo7-esp-warehouse.webp', 'Black Ops 7 HWID spoofer product interface context in warehouse map')),
    ],
    '/guides/bo7-cheat-requirements/': [
      withHost(showcase('bo7-esp-facility.webp', 'Black Ops 7 PC compatibility checklist on a tuned Windows build')),
      withHost(showcase('bo7-esp-indoor-combat.webp', 'Windows security settings for BO7 compatibility during indoor combat overlay')),
    ],
  };
}