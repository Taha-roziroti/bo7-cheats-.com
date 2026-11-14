import type { IconName } from '../components/icons/types';
import { PRIMARY_CHECKOUT_PATH } from '../config/checkout';
import { PLACEHOLDER_COPY } from './placeholders';
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

const checkout = link('checkout placeholder', PRIMARY_CHECKOUT_PATH);
const faqPage = link('FAQ index', ROUTES.faq);

export const siteFaqs: SiteFaqItem[] = [
  {
    id: 'features',
    topic: 'products',
    icon: 'faqWhatIsEsp',
    q: 'What belongs on the feature overview?',
    a: a('Replace this with a concise list of modules your product actually ships.'),
  },
  {
    id: 'after-buy',
    topic: 'setup',
    icon: 'faqAfterBuy',
    q: 'What happens after checkout?',
    a: `Describe delivery steps here and link to ${link('BO7 PC compatibility requirements', '/guides/bo7-cheat-requirements/')} when ready.`,
  },
  {
    id: 'ban-risk',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Risk disclaimer placeholder?',
    a: a('Add accurate risk language for your product category before launch.'),
  },
  {
    id: 'platforms',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'Which platforms are supported?',
    a: a('List supported OS builds and clients — placeholder until confirmed.'),
  },
  {
    id: 'support',
    topic: 'plans',
    icon: 'navSupport',
    q: 'How do I get support?',
    a: `Use ${checkout} or email support with your order reference.`,
  },
  {
    id: 'more-faq',
    topic: 'all',
    icon: 'navFaq',
    q: 'Where is the full FAQ?',
    a: `This site shell links to ${faqPage} and per-page FAQs in markdown.`,
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

export const FAQ_DISCLAIMER = PLACEHOLDER_COPY.feature;

export function getLandingFaqs(): SiteFaqItem[] {
  return siteFaqs.filter((f) => ['features', 'after-buy', 'ban-risk', 'platforms'].includes(f.id));
}

const CONTENT_PAGE_FAQ_IDS: Record<string, string[]> = {
  '/cloud-dma/': ['after-buy', 'platforms', 'support'],
  '/hwid-spoofer/': ['ban-risk', 'platforms', 'support'],
  '/guides/bo7-cheat-requirements/': ['platforms', 'after-buy', 'support'],
};

export function getContentPageFaqs(route: string): SiteFaqItem[] | null {
  const ids = CONTENT_PAGE_FAQ_IDS[route];
  if (!ids) return null;
  return ids
    .map((id) => siteFaqs.find((f) => f.id === id))
    .filter((f): f is SiteFaqItem => Boolean(f));
}

export function getAllFaqs(): SiteFaqItem[] {
  return siteFaqs.filter((f) => f.id !== 'more-faq');
}

export const SITE_FAQ_SECTION_COPY = {
  eyebrow: 'All topics',
  title: 'Browse FAQ by category',
  subtitle: PLACEHOLDER_COPY.subtitle,
} as const;

export const SITE_FAQ_FILTER_TOPICS: FaqTopic[] = ['all', 'plans', 'esp', 'scripts', 'safety', 'products', 'setup'];

export const HOME_LANDING_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Common questions placeholder',
  subtitle: PLACEHOLDER_COPY.subtitle,
} as const;

export const CONTEXTUAL_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Questions about this page',
  subtitle: PLACEHOLDER_COPY.subtitle,
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