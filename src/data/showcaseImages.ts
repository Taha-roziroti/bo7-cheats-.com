/** Product showcase screenshots — base paths under /images/showcase (responsive variants from optimize-images). */

export const SHOWCASE_BASE = '/images/showcase';

export interface ShowcaseShot {
  src: string;
  alt: string;
  caption?: string;
  captionDesc?: string;
}

const shot = (
  file: string,
  alt: string,
  caption: string,
  captionDesc: string,
): ShowcaseShot => ({
  src: `${SHOWCASE_BASE}/${file}`,
  alt,
  caption,
  captionDesc,
});

export const SHOWCASE_SHOTS: ShowcaseShot[] = [
  shot(
    'bo7-esp-red-dot.webp',
    'Red-dot ESP with skeleton overlay and distance readout in Black Ops 7 gameplay',
    'Player ESP through optics',
    'Names, skeleton lines, and distance tags aligned with your red-dot sight picture.',
  ),
  shot(
    'bo7-esp-terrace.webp',
    'Enemy boxes, health, and snaplines on a terrace map in Black Ops 7',
    'Enemy ESP & snaplines',
    'Box outlines, health bars, and meter readouts for quick target prioritization.',
  ),
  shot(
    'bo7-esp-facility.webp',
    'Skeleton ESP through walls in a modern facility map',
    'Skeleton ESP',
    'Bone highlights and bounding boxes for targets behind cover.',
  ),
  shot(
    'bo7-esp-prison.webp',
    'Prison map ESP showing wireframe players through concrete',
    'Wallhack wireframes',
    'See poses and positions through solid geometry during prison fights.',
  ),
  shot(
    'bo7-esp-indoor-combat.webp',
    'Indoor combat with red skeleton and distance markers',
    'Indoor ESP',
    'Tight CQB readouts with distance caps and stance tracking.',
  ),
  shot(
    'bo7-esp-skeleton-indoor.webp',
    'Skeleton overlay and box ESP on stairs during a double kill',
    'Combat overlays',
    'Skeleton and box pairs stay readable during fast trades.',
  ),
  shot(
    'bo7-esp-warehouse.webp',
    'Warehouse ESP with enemy box, nameplate, and skeleton',
    'Named ESP',
    'Enemy labels and bounding boxes in industrial lanes.',
  ),
  shot(
    'bo7-radar-map.webp',
    'Tactical 2D radar overlay with grid and teammate markers',
    '2D radar',
    'Compact radar with pings, grid sectors, and player icons.',
  ),
  shot(
    'bo7-aimbot-scope.webp',
    'High-magnification scope with highlighted enemy silhouette',
    'Aimbot & chams',
    'Scope view with visible target highlight for long-range picks.',
  ),
  shot(
    'bo7-esp-rooftop.webp',
    'Rooftop overwatch through scope with coastal map backdrop',
    'Overwatch ESP',
    'Long-range ESP while holding roof lines on large maps.',
  ),
  shot(
    'bo7-esp-double-kill.webp',
    'Double kill feed with skeleton ESP on stair engagement',
    'Kill feed + ESP',
    'ESP stays on during multi-kill streaks and heavy trades.',
  ),
];

export const HERO_SHOWCASE_SLIDES = SHOWCASE_SHOTS.slice(0, 7).map((s) => ({
  src: s.src,
  alt: s.alt,
  caption: s.caption ?? 'Feature preview',
  captionDesc: s.captionDesc ?? s.alt,
}));

export const PRIMARY_SHOWCASE_IMAGE = SHOWCASE_SHOTS[0]!.src;

export const HERO_SECTION_BACKGROUND = '/images/hero/bo7-hero-background.webp';
export const HERO_SECTION_LCP_PRELOAD = '/images/hero/bo7-hero-background-960.webp';

/** Map homepage feature card titles to showcase stills. */
export const FEATURE_SHOWCASE_BY_TITLE: Record<string, ShowcaseShot> = {
  'Player ESP': SHOWCASE_SHOTS[1]!,
  'Aimbot': SHOWCASE_SHOTS[8]!,
  'Skeleton ESP': SHOWCASE_SHOTS[2]!,
  '2D radar': SHOWCASE_SHOTS[7]!,
  'Loot & items': SHOWCASE_SHOTS[6]!,
  'Stream overlay': SHOWCASE_SHOTS[5]!,
};

export const PAGE_SHOWCASE_SHOTS: Record<string, ShowcaseShot[]> = {
  '/cloud-dma/': [SHOWCASE_SHOTS[9]!, SHOWCASE_SHOTS[7]!],
  '/hwid-spoofer/': [SHOWCASE_SHOTS[6]!],
};