/**
 * Central titles/descriptions for high-traffic routes (mirrors content/pages frontmatter).
 */

export interface PageSeoEntry {
  title: string;
  description: string;
}

export const PAGE_SEO: Record<string, PageSeoEntry> = {
  '/': {
    title: 'Black Ops 7 Cheats for PC | Aimbot & ESP',
    description:
      'Explore Black Ops 7 cheats with aimbot, ESP, radar and recoil controls. Check features, PC requirements and available plans.',
  },
  '/cloud-dma/': {
    title: 'Cloud DMA for Black Ops 7 | Setup & Requirements',
    description:
      'See how Cloud DMA for Black Ops 7 works, including its single-PC Hyper-V setup, required components and Windows requirements.',
  },
  '/hwid-spoofer/': {
    title: 'Black Ops 7 HWID Spoofer | PC Product Details',
    description:
      'Explore the Black Ops 7 HWID spoofer, listed Ricochet compatibility, Windows requirements and available subscription options.',
  },
  '/guides/bo7-cheat-requirements/': {
    title: 'Black Ops 7 Cheat System Requirements | PC Guide',
    description:
      'Check Windows, TPM, Secure Boot, HVCI and virtualization requirements for the BO7 setup before choosing a product.',
  },
  '/faq/': {
    title: 'BO7 Cheats FAQ | Support answers',
    description:
      'Frequently asked questions about Black Ops 7 cheat delivery, compatibility, Cloud DMA, and HWID utilities on PC.',
  },
  '/support/': {
    title: 'BO7 Cheats Support | Contact',
    description: 'Contact BO7 Cheats support with order details, Windows build, and setup context for faster help.',
  },
  '/about/': {
    title: 'About BO7 Cheats',
    description: 'Independent information site for Black Ops 7 PC software, compatibility guides, and product checkout links.',
  },
  '/privacy/': {
    title: 'BO7 Cheats Privacy Policy',
    description: 'How bo7-cheats.com handles analytics, cookies, and affiliate checkout referrals.',
  },
  '/terms/': {
    title: 'BO7 Cheats Terms & Conditions',
    description: 'Terms governing use of bo7-cheats.com content and third-party product checkout links.',
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