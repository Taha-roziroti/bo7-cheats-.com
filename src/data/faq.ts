import type { IconName } from '../components/icons/types';
import { SUPPORT_EMAIL } from './site';
import { PRIMARY_CHECKOUT_PATH } from '../config/checkout';
import { normalizeInternalPath, ROUTES } from '../utils/path';

export type FaqTopic =
  | 'all'
  | 'plans'
  | 'esp'
  | 'scripts'
  | 'safety'
  | 'products'
  | 'blog'
  | 'setup';

export interface SiteFaqItem {
  id: string;
  topic: FaqTopic;
  icon: IconName;
  q: string;
  a: string;
  aHtml?: string;
  scopes?: string[];
}

function a(text: string): string {
  return text;
}

function link(text: string, href: string): string {
  return `<a href="${normalizeInternalPath(href)}">${text}</a>`;
}

const checkout = link('main product checkout', PRIMARY_CHECKOUT_PATH);
const requirements = link('BO7 system requirements guide', '/guides/bo7-cheat-requirements/');
const requirementsBeforeSupport = link(
  'PC compatibility checklist',
  '/guides/bo7-cheat-requirements/',
);
const cloudDma = link('Cloud DMA overview', '/cloud-dma/');
const hwid = link('HWID Spoofer page', '/hwid-spoofer/');

export const siteFaqs: SiteFaqItem[] = [
  {
    id: 'bo7-modules',
    topic: 'products',
    icon: 'faqWhatIsEsp',
    q: 'What modules ship with the Black Ops 7 package?',
    a: a(
      'The listing covers aimbot, player ESP, triggerbot, recoil control, wallhack, radar, speed, and stream-proof options—each toggled from the operator portal after checkout.',
    ),
  },
  {
    id: 'after-buy',
    topic: 'setup',
    icon: 'faqAfterBuy',
    q: 'What happens right after I pay?',
    a: `You receive operator portal access through the ${checkout} flow. Match your Windows build and virtualization settings to the ${requirements} before you load anything.`,
  },
  {
    id: 'ban-risk',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Can BO7 cheats guarantee zero bans?',
    a: a(
      'No honest vendor can. Ricochet and platform enforcement change often—use accurate PC specs, follow setup guides, and treat risk as yours before you purchase.',
    ),
  },
  {
    id: 'platforms',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'Which Windows builds are supported?',
    a: a(
      'Supported builds are listed on each product page and in the requirements guide. Confirm Hyper-V, virtualization, and driver baselines match your edition of Windows 10 or 11.',
    ),
  },
  {
    id: 'cloud-dma-extra',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'Is Cloud DMA billed with the main BO7 license?',
    a: `Cloud DMA is a separate single-PC Hyper-V layer. Pricing, GREENWARD, and AWS costs are documented on the ${cloudDma} page—not bundled into the main cheat plans.`,
  },
  {
    id: 'hwid-extra',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'When do I need the HWID Spoofer?',
    a: `Use it when you need a hardware-ID utility alongside BO7 on PC. Plans and Ricochet notes live on the ${hwid} page.`,
  },
  {
    id: 'support',
    topic: 'plans',
    icon: 'navSupport',
    q: 'How do I reach support?',
    a: `Email ${SUPPORT_EMAIL} with your order reference, Windows version, and any loader or Hyper-V errors—or start from the support page after you review the ${requirementsBeforeSupport}.`,
  },
];

export const FAQ_TOPIC_LABELS: Record<FaqTopic, string> = {
  all: 'All topics',
  plans: 'Plans',
  esp: 'Features',
  scripts: 'Automation',
  safety: 'Safety',
  products: 'Products',
  blog: 'Blog',
  setup: 'Setup',
};

export function faqTopicsForHome(): FaqTopic[] {
  return ['products', 'setup', 'safety', 'plans'];
}

export function topicLabel(topic: FaqTopic): string {
  return FAQ_TOPIC_LABELS[topic] ?? topic;
}

export const FAQ_DISCLAIMER =
  'Module availability, pricing, and compatibility notes on this site mirror the operator portal when possible and can change after game or Windows updates.';

export function getLandingFaqs(): SiteFaqItem[] {
  return siteFaqs.filter((f) => ['bo7-modules', 'after-buy', 'ban-risk', 'platforms'].includes(f.id));
}

const CONTENT_PAGE_FAQ_IDS: Record<string, string[]> = {
  '/guides/bo7-cheat-requirements/': ['guide-hyperv', 'guide-windows', 'guide-support'],
};

export const contextualGuideFaqs: SiteFaqItem[] = [
  {
    id: 'guide-hyperv',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'Why does the requirements guide mention Hyper-V?',
    a: a(
      'Cloud DMA for BO7 runs on a single-PC Hyper-V split. The checklist here ensures your CPU, firmware, and Windows roles are ready before you buy that license.',
    ),
  },
  {
    id: 'guide-windows',
    topic: 'setup',
    icon: 'faqAfterBuy',
    q: 'Do I need the same Windows build for every product?',
    a: a(
      'The main cheat package, Cloud DMA, and HWID Spoofer each list their own minimums. Match the strictest requirement on this page before checkout.',
    ),
  },
  {
    id: 'guide-support',
    topic: 'plans',
    icon: 'navSupport',
    q: 'Something in this checklist does not match my PC—what now?',
    a: `Pause checkout until you confirm virtualization and RAM with support. Include DxDiag or system info when you write to ${SUPPORT_EMAIL}.`,
  },
];

export function getContentPageFaqs(route: string): SiteFaqItem[] | null {
  const ids = CONTENT_PAGE_FAQ_IDS[route];
  if (!ids) return null;
  if (route === '/guides/bo7-cheat-requirements/') {
    return contextualGuideFaqs.filter((f) => ids.includes(f.id));
  }
  return ids
    .map((id) => siteFaqs.find((f) => f.id === id))
    .filter((f): f is SiteFaqItem => Boolean(f));
}

export function getAllFaqs(): SiteFaqItem[] {
  return [...siteFaqs, ...contextualGuideFaqs.filter((f) => !siteFaqs.some((s) => s.id === f.id))];
}

export const SITE_FAQ_SECTION_COPY = {
  eyebrow: 'All topics',
  title: 'Browse FAQ by category',
  subtitle: 'Filter BO7 plans, Cloud DMA, HWID utilities, and Windows setup without wading through every product page.',
} as const;

export const SITE_FAQ_FILTER_TOPICS: FaqTopic[] = ['all', 'plans', 'esp', 'scripts', 'safety', 'products', 'setup'];

export const HOME_LANDING_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Quick answers before checkout',
  subtitle: 'Short responses on modules, delivery, risk, and Windows compatibility for Black Ops 7 on PC.',
} as const;

export const CONTEXTUAL_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Questions about this page',
  subtitle: 'Answers tied to the topic on this URL—not the full site FAQ index.',
} as const;

export function faqFilterTopicsForItems(items: SiteFaqItem[]): FaqTopic[] {
  const present = new Set(items.map((item) => item.topic));
  const topics: FaqTopic[] = ['all'];
  for (const topic of SITE_FAQ_FILTER_TOPICS) {
    if (topic !== 'all' && present.has(topic)) topics.push(topic);
  }
  return topics;
}

export function getProductFaqs(_slug: string, _kind: 'tier' | 'utility'): SiteFaqItem[] {
  return siteFaqs.slice(0, 4);
}

export function getBlogFaqs(_tag: string, _slug: string): SiteFaqItem[] {
  return siteFaqs.filter((f) => f.topic === 'setup' || f.topic === 'safety').slice(0, 4);
}

export const compareRows = [
  { feature: 'Row placeholder A', icon: 'comparePlayerEsp' as const, lite: true, pro: true, elite: true },
  { feature: 'Row placeholder B', icon: 'compareWardLocator' as const, lite: true, pro: true, elite: false },
  { feature: 'Row placeholder C', icon: 'compareAutoCombo' as const, lite: false, pro: true, elite: true },
];