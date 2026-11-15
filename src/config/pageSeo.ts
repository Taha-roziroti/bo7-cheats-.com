/**
 * Central titles/descriptions for high-traffic routes (mirrors content/pages frontmatter).
 */

export interface PageSeoEntry {
  title: string;
  description: string;
}

export const PAGE_SEO: Record<string, PageSeoEntry> = {
  '/': {
    title: 'Black Ops 7 PC Cheats | Aimbot, ESP & Radar Tools',
    description:
      'Explore Black Ops 7 cheats with aimbot, ESP, radar and recoil controls on PC. Review live screenshots, requirements, and monthly or lifetime plans.',
  },
  '/cloud-dma/': {
    title: 'Cloud DMA for Black Ops 7 | Setup & Requirements',
    description:
      'See how Cloud DMA for Black Ops 7 works on a single-PC Hyper-V split, which third-party services you must buy, and the Windows checks before checkout.',
  },
  '/hwid-spoofer/': {
    title: 'Black Ops 7 HWID Spoofer | Ricochet & PC Utility',
    description:
      'Review the Black Ops 7 HWID spoofer listing, Ricochet compatibility notes, Windows administrator requirements, and monthly or lifetime checkout options.',
  },
  '/guides/bo7-cheat-requirements/': {
    title: 'Black Ops 7 Cheat Requirements | Full Windows Guide',
    description:
      'Check Windows 10 and 11, TPM, Secure Boot, HVCI, virtualization, and RAM requirements for BO7 cheats, Cloud DMA, and the HWID utility before you purchase.',
  },
  '/faq/': {
    title: 'Black Ops 7 Cheats FAQ | Plans, Setup & Support',
    description:
      'Get answers on BO7 cheat delivery, module toggles, ban risk, Windows builds, Cloud DMA billing, HWID utilities, and what to send support before checkout.',
  },
  '/support/': {
    title: 'BO7 Cheats Support Desk | Orders, Setup & Billing',
    description:
      'Contact BO7 Cheats support with your order email, Windows build, product purchased, and loader or Hyper-V errors so we can reply with accurate setup steps.',
  },
  '/about/': {
    title: 'About BO7 Cheats Publisher | Black Ops 7 PC Guides',
    description:
      'Learn how bo7-cheats.com documents Black Ops 7 PC software with screenshots, compatibility guides, and affiliate checkout bridges for buyers.',
  },
  '/privacy/': {
    title: 'BO7 Cheats Privacy Policy | Cookies, Analytics & Data',
    description:
      'How bo7-cheats.com uses analytics cookies, measures traffic, and handles affiliate checkout referrals to third-party operators and privacy contacts.',
  },
  '/terms/': {
    title: 'BO7 Cheats Terms of Service | Site & Checkout Rules',
    description:
      'Terms for bo7-cheats.com content, affiliate checkout links, operator refunds, and your responsibilities under game publisher and local law.',
  },
};

export function normalizeSeoPath(pathname: string): string {
  let path = pathname || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  return path;
}

export function getPageSeoEntry(pathname: string): PageSeoEntry | undefined {
  return PAGE_SEO[normalizeSeoPath(pathname)];
}