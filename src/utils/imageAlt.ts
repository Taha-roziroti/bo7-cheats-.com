/** Consistent alt strings for branded and blog imagery. */

import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE_ALT } from '../data/placeholders';

export const SITE_LOGO_ALT = 'BO7 Cheats logo';

export const HERO_BACKGROUND_ALT =
  'Armored soldier with dual pistols and orange HUD glow used as the homepage hero background';

export function blogFeaturedImageAlt(title: string): string {
  const cleaned = title.replace(/\s+/g, ' ').trim();
  return cleaned ? `${cleaned} — featured image placeholder` : 'Blog featured image placeholder';
}