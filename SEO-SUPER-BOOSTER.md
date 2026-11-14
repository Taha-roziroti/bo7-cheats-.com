# SEO checklist (bo7-cheats.com)

**Canonical host:** `config/site.mjs` — `SITE_HOST`, `SITE_URL`, `INDEXABLE_MONEY_ROUTES`, `buildSitemapImages()`. Astro, `src/data/site.ts`, and Node build scripts import from there.

**Current host:** `bo7-cheats.com` (`TEMPLATE_SHELL` is false when host is not `example.com`).

**Indexable money routes** (only these four carry primary commercial SEO):

| Route | Content file |
| --- | --- |
| `/` | `content/pages/index.md` |
| `/hwid-spoofer/` | `content/pages/hwid-spoofer.md` |
| `/cloud-dma/` | `content/pages/cloud-dma.md` |
| `/guides/bo7-cheat-requirements/` | `content/pages/bo7-cheat-requirements.md` |

**Site copy & routes:** `src/data/site.ts` — `SEO_ROUTE_INTENTS`, `OG_IMAGES`, `KEYWORD_REDIRECTS`, `SITEMAP_IMAGES` (re-exported from `config/site.mjs`). Showcase imagery lives under `/images/showcase/bo7-*.webp` — money pages must not use `placeholder.svg`.

**Post-build verifiers** (run via `npm run build`):

- `scripts/verify-redirects.mjs` — Astro redirects, `public/_redirects`, checkout bridges
- `scripts/verify-seo.mjs` — canonicals, titles/descriptions, OG dimensions, JSON-LD, single `h1`, `robots.txt`, sitemap image namespace
- `scripts/verify-unique-copy.mjs` — duplicate meta/paragraphs across money routes
- `scripts/verify-images.mjs` — alts, resolvable image URLs, manifest assets, no `placeholder.svg` on money pages
- `scripts/verify-anchor-text.mjs` — duplicate anchor text on money routes

**Legacy redirects** (301 → canonical):

- `/guides/system-requirements/` → `/guides/bo7-cheat-requirements/`
- `/guides/borderlands-3-cheat-system-requirements/` → `/guides/bo7-cheat-requirements/`
- `/guides/cloud-dma-setup/`, `/cloud-dma-setup/` → `/cloud-dma/`
- `/cloud-dma-for-arena-breakout-infinite/` → `/cloud-dma/`
- `/arena-breakout-infinite-hwid-spoofer/` → `/hwid-spoofer/`
- ESP / aimbot / pricing ABI URLs → `/`

Sources: `astro.config.mjs`, `public/_redirects`, `scripts/redirects.mjs` (keep in sync with `src/data/site.ts` `KEYWORD_REDIRECTS`).

**Full audit:** `npm run audit` runs build (unless `SKIP_BUILD=1`) and all verifiers above plus link/sitemap/hygiene checks in `scripts/seo-audit.mjs`.

**Launch tweak:** change `SITE_HOST` in `config/site.mjs` only, then run `npm run build` (updates `public/robots.txt` sitemap URL and canonical URLs everywhere).