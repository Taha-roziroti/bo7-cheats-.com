import type { ProductSlide } from './products';
import {
  CLOUD_DMA_CHECKOUT,
  HWID_SPOOFER_CHECKOUT,
  MAIN_PRODUCT_CHECKOUT,
} from './productCatalog';
import type { IconName } from '../components/icons/types';
import { PLACEHOLDER_COPY } from './placeholders';
import { HERO_SHOWCASE_SLIDES } from './showcaseImages';

export interface LandingCatalogProduct {
  slug: string;
  label: string;
  title: string;
  href: string;
  buyUrl: string;
  features: string[];
  more: number;
  icon: IconName;
  badge?: string;
  variant?: 'essential' | 'popular' | 'limited';
}

export const heroSlides: ProductSlide[] = HERO_SHOWCASE_SLIDES;

export const landingProducts: LandingCatalogProduct[] = [
  {
    slug: 'main-product',
    label: 'BO7 cheats',
    title: PLACEHOLDER_COPY.productName,
    href: '/',
    buyUrl: MAIN_PRODUCT_CHECKOUT,
    badge: 'Popular',
    variant: 'popular',
    icon: 'coreProduct',
    features: [
      'Aimbot, ESP, radar & recoil controls',
      '$35/month or $150 lifetime',
      'Stream-proof overlay modes',
    ],
    more: 0,
  },
  {
    slug: 'hwid-spoofer',
    label: 'HWID utility',
    title: 'Black Ops 7 HWID Spoofer',
    href: '/hwid-spoofer/',
    buyUrl: HWID_SPOOFER_CHECKOUT,
    badge: 'Standalone',
    variant: 'essential',
    icon: 'shieldCheck',
    features: ['Hardware ID tooling for supported builds', 'Separate from main cheat license', '$50 lifetime listing'],
    more: 0,
  },
  {
    slug: 'cloud-dma',
    label: 'Infrastructure',
    title: 'Cloud DMA for Black Ops 7',
    href: '/cloud-dma/',
    buyUrl: CLOUD_DMA_CHECKOUT,
    badge: 'Hyper-V',
    variant: 'essential',
    icon: 'reqCpu',
    features: ['Single-PC Hyper-V architecture', 'Not external DMA hardware', '$50 lifetime + third-party services'],
    more: 0,
  },
];

export const guideCards = [
  {
    title: 'Cloud DMA for BO7',
    desc: 'Single-PC Hyper-V setup, activation, and required GREENWARD / Static Server / AWS components.',
    href: '/cloud-dma/',
    readLabel: 'Cloud DMA setup for BO7',
  },
  {
    title: 'HWID spoofer details',
    desc: 'Standalone hardware-ID utility scope, Ricochet notes, and delivery expectations.',
    href: '/hwid-spoofer/',
    readLabel: 'Black Ops 7 HWID spoofer details',
  },
  {
    title: 'PC requirements',
    desc: 'Windows, TPM, Secure Boot, HVCI, and virtualization checklist before you buy.',
    href: '/guides/bo7-cheat-requirements/',
    readLabel: 'BO7 PC compatibility requirements',
  },
] as const;