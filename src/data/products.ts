import { checkoutForSlug, checkoutPath } from '../config/checkout';
import type { IconName } from '../components/icons/types';
import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE_ALT } from './placeholders';

export interface ProductSlide {
  src: string;
  alt: string;
  caption: string;
  captionDesc: string;
}

export interface ProductOverview {
  title: string;
  paragraphs: string[];
}

export interface AcquisitionStep {
  num: string;
  title: string;
  desc: string;
}

export interface ProductAcquisition {
  title: string;
  steps: AcquisitionStep[];
}

export interface SystemRequirement {
  icon: IconName;
  text: string;
}

export interface ProductPage {
  slug: string;
  kind: 'tier' | 'utility';
  badge: string;
  category?: string;
  tier?: string;
  name: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  more: number;
  variant?: 'essential' | 'popular' | 'limited';
  buyUrl: string;
  images: ProductSlide[];
  overview: ProductOverview;
  acquisition: ProductAcquisition;
  goodToKnow: string;
  limitations: string;
  fullFeatures: string[];
  systemRequirements: SystemRequirement[];
  about?: { type: 'h2' | 'p'; text: string }[];
  body: { type: 'h2' | 'p'; text: string }[];
  relatedBlogSlugs: string[];
}

export const productRelatedBlogSlugs: Record<string, string[]> = {
  lite: ['placeholder-post'],
  pro: ['placeholder-post'],
  elite: ['placeholder-post'],
  'hwid-spoofer': ['placeholder-post'],
  ugc: ['placeholder-post'],
  'unlock-all': ['placeholder-post'],
};

const slide: ProductSlide = {
  src: PLACEHOLDER_IMAGE,
  alt: PLACEHOLDER_IMAGE_ALT,
  caption: 'Screenshot placeholder',
  captionDesc: PLACEHOLDER_COPY.feature,
};

const defaultAcquisition: ProductAcquisition = {
  title: 'How to purchase (placeholder)',
  steps: [
    { num: '01', title: 'Review requirements', desc: PLACEHOLDER_COPY.feature },
    { num: '02', title: 'Choose a plan', desc: PLACEHOLDER_COPY.feature },
    { num: '03', title: 'Complete checkout', desc: PLACEHOLDER_COPY.feature },
  ],
};

const placeholderRequirements: SystemRequirement[] = [
  { icon: 'reqWindows', text: 'OS requirement placeholder' },
  { icon: 'reqWifi', text: 'Connectivity placeholder' },
];

function utilityPage(slug: string, title: string): ProductPage {
  return {
    slug,
    kind: 'utility',
    badge: 'Available',
    category: 'Utility',
    name: title,
    title,
    subtitle: 'Utility subtitle placeholder',
    desc: PLACEHOLDER_COPY.subtitle,
    features: ['Feature placeholder one', 'Feature placeholder two'],
    more: 0,
    variant: 'essential',
    buyUrl: checkoutForSlug(slug),
    images: [slide],
    overview: { title: 'Overview placeholder', paragraphs: [PLACEHOLDER_COPY.feature] },
    acquisition: defaultAcquisition,
    goodToKnow: PLACEHOLDER_COPY.feature,
    limitations: PLACEHOLDER_COPY.feature,
    fullFeatures: ['Feature placeholder'],
    systemRequirements: placeholderRequirements,
    body: [{ type: 'p', text: PLACEHOLDER_COPY.subtitle }],
    relatedBlogSlugs: productRelatedBlogSlugs[slug] ?? [],
  };
}

export const productPages: ProductPage[] = [
  utilityPage('hwid-spoofer', 'Utility A (placeholder)'),
  utilityPage('ugc', 'Utility B (placeholder)'),
  utilityPage('unlock-all', 'Utility C (placeholder)'),
];

export const cheatPages = productPages.filter((p) => p.kind === 'tier');

export function getProductPage(slug: string) {
  return productPages.find((p) => p.slug === slug);
}

export function getCheatPage(slug: string) {
  return cheatPages.find((p) => p.slug === slug);
}

export function getAllProductSlugs() {
  return productPages.map((p) => p.slug);
}

export function getAllCheatSlugs() {
  return cheatPages.map((p) => p.slug);
}

export const heroSlides: ProductSlide[] = [slide, slide, slide];

export const productHub = {
  path: '/products/dota-2-cheats/',
  title: PLACEHOLDER_COPY.title,
  subtitle: PLACEHOLDER_COPY.subtitle,
  description: PLACEHOLDER_COPY.subtitle,
  buyUrl: checkoutPath('mainProduct'),
};