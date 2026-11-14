import { getCollection, getEntry } from 'astro:content';

function normalizeRoute(value: string): string {
  if (value === '' || value === '/') return '/';
  return value.endsWith('/') ? value : `${value}/`;
}

type PageData = { slug?: string; route?: string };

function pageMatchesId(page: { id: string; data: unknown }, id: string): boolean {
  if (page.id === id) return true;

  const data = page.data as PageData;
  const normalizedId = normalizeRoute(id.startsWith('/') ? id : `/${id}`);

  if (data.slug && normalizeRoute(data.slug) === normalizedId) return true;
  if (data.route && normalizeRoute(data.route) === normalizedId) return true;

  const stem = page.id.replace(/^\//, '').replace(/\/$/, '').replace(/\.md$/, '');
  const wantStem = id.replace(/^\//, '').replace(/\/$/, '').replace(/\.md$/, '');
  if (stem === wantStem) return true;
  if (wantStem.includes('/') && data.slug && normalizeRoute(data.slug) === normalizeRoute(id)) return true;
  if (!wantStem.includes('/') && data.slug && normalizeRoute(data.slug).endsWith(`/${wantStem}/`)) return true;

  if ((id === 'home' || id === 'index') && data.slug === '/') return true;

  return false;
}

/** Resolve a `pages` collection entry by filename stem, route, or marketing slug. */
export async function loadContentPage(id: string) {
  const ref = { collection: 'pages' as const, id };
  let entry = await getEntry(ref);

  if (!entry) {
    const pages = await getCollection('pages');
    entry = pages.find((page) => pageMatchesId(page, id));
  }

  if (!entry) {
    const available = (await getCollection('pages')).map((page) => page.id).join(', ');
    throw new Error(
      `Content page not found: ${id}${available ? `. Available: ${available}` : ' (pages collection is empty — run astro sync or restart dev)'}`,
    );
  }

  return entry;
}
