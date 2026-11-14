import { checkoutPath } from '../config/checkout';
import { MONTHLY_ACCESS_DAYS } from './productPricing';
import { PLACEHOLDER_COPY } from './placeholders';

export const PUBLISHER_DISCLAIMER =
  'This site is independent and is not affiliated with, endorsed by, or sponsored by any game publisher. Game names are descriptive references only.';

export const FEATURE_TOOL_DISCLAIMER =
  'Replace this disclaimer with accurate product positioning before launch.';

export const CLOUD_DMA_ADDITIONAL_SERVICES = [
  {
    name: 'GREENWARD',
    summary: 'Required activation and routing service purchased outside this site.',
  },
  {
    name: 'Static Server',
    summary: 'Dedicated server component with its own recurring or upfront fee.',
  },
  {
    name: 'AWS',
    summary: 'Cloud hosting resources billed separately from the $50 Cloud DMA license.',
  },
] as const;

export const MAIN_PRODUCT_CHECKOUT = checkoutPath('mainProduct');
export const CLOUD_DMA_CHECKOUT = checkoutPath('cloudDma');
export const HWID_SPOOFER_CHECKOUT = checkoutPath('hwidSpoofer');

export const mainProductOffers = [
  { name: `${PLACEHOLDER_COPY.productName} — Monthly`, priceUsd: 35, url: MAIN_PRODUCT_CHECKOUT },
  { name: `${PLACEHOLDER_COPY.productName} — Lifetime`, priceUsd: 150, url: MAIN_PRODUCT_CHECKOUT },
] as const;

export const cloudDmaOffer = {
  name: 'Cloud DMA for Black Ops 7 (lifetime)',
  priceUsd: 50,
  url: CLOUD_DMA_CHECKOUT,
} as const;

export const hwidSpooferOffer = {
  name: 'HWID Spoofer (lifetime)',
  priceUsd: 50,
  url: HWID_SPOOFER_CHECKOUT,
} as const;

export const mainProductFeatures = [
  'Aimbot with smoothing, FOV, and target highlighting',
  'ESP boxes, skeletons, names, and distance readouts',
  'Triggerbot helpers and recoil control profiles',
  '2D radar and stream-proof overlay modes',
  'Optional speed adjustments where enabled in the build',
  'Screenshots from verified Black Ops 7 PC sessions',
] as const;

export const mainProductRequirements = [
  'Client: Call of Duty: Black Ops 7 on PC',
  'OS: Windows 10/11 x64 with current updates',
  'Hardware: Discrete GPU and 16 GB+ RAM recommended',
  'Security: TPM, Secure Boot, and HVCI per compatibility guide',
  'Infrastructure: Cloud DMA license only when DMA modules are required',
] as const;

export const cloudDmaRequirements = [
  'Single PC with Hyper-V and CPU virtualization enabled',
  'Windows 10/11 build listed in the requirements guide',
  'Separate GREENWARD, Static Server, and AWS accounts',
  'Cloud DMA license ($50 lifetime listing) before activation',
  'Main BO7 module bundle when DMA-dependent features are used',
] as const;

export const monthlyPlanCopy = {
  priceUsd: 35,
  durationLabel: '30-day access',
  renewal: 'Placeholder renewal terms — replace before launch.',
} as const;

export const lifetimePlanCopy = {
  priceUsd: 150,
  durationLabel: 'Lifetime access',
  renewal: 'Placeholder lifetime terms — replace before launch.',
} as const;
