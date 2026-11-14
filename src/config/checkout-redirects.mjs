/** External checkout destinations (Zadeyo affiliate). */

export const CHECKOUT_URLS = {
  mainProduct: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fblack-ops-7',
  cloudDma: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fcloud-dma',
  hwidSpoofer: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fhwid-spoofer',
  dota2: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fblack-ops-7',
  skinChanger: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fblack-ops-7',
  ugc: 'https://zadeyo.com/go/TAHA?to=%2Fproducts%2Fblack-ops-7',
};

/** Slugs served by `src/pages/go/[slug].astro` (instant client redirect — no edge 302). */
export const CHECKOUT_BRIDGE_SLUGS = ['main-product', 'cloud-dma', 'hwid-spoofer'];

const bridgePathSet = new Set(CHECKOUT_BRIDGE_SLUGS.map((s) => `/go/${s}/`));

/** Edge / serve redirects for legacy `/go/*` paths only (bridge slugs use static HTML). */
export const CHECKOUT_PATH_REDIRECTS = new Map([
  ['/go/borderlands-3', CHECKOUT_URLS.mainProduct],
  ['/go/borderlands-3/', CHECKOUT_URLS.mainProduct],
  ['/go/dota-2', CHECKOUT_URLS.dota2],
  ['/go/dota-2/', CHECKOUT_URLS.dota2],
  ['/go/skin-changer', CHECKOUT_URLS.skinChanger],
  ['/go/skin-changer/', CHECKOUT_URLS.skinChanger],
  ['/go/ugc', CHECKOUT_URLS.ugc],
  ['/go/ugc/', CHECKOUT_URLS.ugc],
]);

export function checkoutDestinationForSlug(slug) {
  switch (slug) {
    case 'main-product':
    case 'borderlands-3':
      return CHECKOUT_URLS.mainProduct;
    case 'cloud-dma':
      return CHECKOUT_URLS.cloudDma;
    case 'hwid-spoofer':
      return CHECKOUT_URLS.hwidSpoofer;
    case 'dota-2':
      return CHECKOUT_URLS.dota2;
    case 'skin-changer':
      return CHECKOUT_URLS.skinChanger;
    case 'ugc':
      return CHECKOUT_URLS.ugc;
    default:
      return null;
  }
}

function mergeSearchParams(destination, search) {
  if (!search || search === '?') return destination;
  const raw = search.startsWith('?') ? search.slice(1) : search;
  if (!raw) return destination;
  const dest = new URL(destination);
  const extra = new URLSearchParams(raw);
  for (const [key, value] of extra) {
    dest.searchParams.set(key, value);
  }
  return dest.toString();
}

export function resolveCheckoutPathRedirect(pathname, search = '') {
  if (pathname === '/go' || pathname === '/go/') return null;

  const normalized =
    pathname !== '/' && !pathname.endsWith('/') ? `${pathname}/` : pathname;

  if (bridgePathSet.has(normalized)) return null;

  let base =
    CHECKOUT_PATH_REDIRECTS.get(pathname) ??
    (pathname !== '/' && !pathname.endsWith('/')
      ? (CHECKOUT_PATH_REDIRECTS.get(`${pathname}/`) ?? null)
      : null);

  if (!base) return null;
  return mergeSearchParams(base, search);
}

/** Unique /go paths for static host redirect files (Netlify / Cloudflare Pages). */
export function checkoutRedirectLines() {
  const seen = new Set();
  const lines = [];
  for (const [from, to] of CHECKOUT_PATH_REDIRECTS) {
    if (seen.has(from)) continue;
    seen.add(from);
    lines.push(`${from} ${to} 302`);
  }
  return lines.sort((a, b) => a.localeCompare(b));
}