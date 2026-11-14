import type { ProductSlide } from './products';
import { SHOWCASE_SHOTS, PRIMARY_SHOWCASE_IMAGE, SHOWCASE_BASE } from './showcaseImages';

export const ABI_PRIMARY_IMAGE = PRIMARY_SHOWCASE_IMAGE;

const toSlide = (shot: (typeof SHOWCASE_SHOTS)[number]): ProductSlide => ({
  src: shot.src,
  alt: shot.alt,
  caption: shot.caption ?? shot.alt,
  captionDesc: shot.captionDesc ?? shot.alt,
});

export const ABI_HERO_SLIDES: ProductSlide[] = SHOWCASE_SHOTS.slice(0, 4).map(toSlide);

export const ABI_GALLERY = SHOWCASE_SHOTS.map((s) => ({ src: s.src, alt: s.alt }));

export const ABI_PAGE_PREVIEW: Record<string, string> = {
  '/arena-breakout-infinite-esp/': `${SHOWCASE_BASE}/bo7-esp-red-dot.webp`,
  '/arena-breakout-infinite-aimbot/': `${SHOWCASE_BASE}/bo7-aimbot-scope.webp`,
  '/arena-breakout-infinite-cheats-pricing/': `${SHOWCASE_BASE}/bo7-esp-terrace.webp`,
  '/cloud-dma-for-arena-breakout-infinite/': `${SHOWCASE_BASE}/bo7-esp-rooftop.webp`,
};