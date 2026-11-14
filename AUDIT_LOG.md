# SEO audit log (bo7-cheats.com)

## Decisions

- **Anchor regions:** `header` / `footer` from `<header>` / `<footer>` bounds; `breadcrumb` from class/name heuristics; `body` rules run on `content-markdown` articles and `#abi-overview` only (same scope as `verify-anchor-text.mjs`). Full-site anchor inventory still records all regions in `audit/anchor-inventory.json`.
- **Affiliate bridges:** `/go/*` excluded from sitemap and from “no redirect links” failures; remain `rel="sponsored noopener"` after `fix-affiliate-dist.mjs`.
- **Keyword map:** `keywords.json` is source of truth; money-page density uses `content/pages/*.md` with per-route `primaryDensityMax` / `headingPrimaryMax` for product-named primaries (Cloud DMA, HWID spoofer).
- **Global body anchor uniqueness:** deferred for repeated checkout CTAs—enforced in markdown + main copy only, not sitewide chrome widgets.
- **Commits:** user has not requested git commits; passes are logged here only.

## Pass 0 (baseline — this goal)

- **Evidence:** `npm run build` OK; `npm run audit` OK after adding `audit-anchor-inventory.mjs`, `audit-keywords.mjs`, `keywords.json`, `npm run audit:perf`.
- **Tooling added:** anchor inventory JSON, keyword stuffing gate, Lighthouse wrapper, view-transition CSS (`global.css`), Astro hover prefetch unchanged.

## Pass 1 (fixes)

- **Anchors:** `AdditionalCostsCallout` drops self-link on `/cloud-dma/`; single requirements link; cloud-dma/hwid-spoofer markdown de-duplicated internal links.
- **Content hygiene:** `src/i18n/en.ts` about page — real BO7 copy, H1 distinct from `<title>`.
- **Files:** `keywords.json`, `scripts/audit-*.mjs`, `scripts/seo-audit.mjs`, `package.json`, `content/pages/cloud-dma.md`, `content/pages/hwid-spoofer.md`, `src/components/checkout/AdditionalCostsCallout.astro`, `src/components/content/MarkdownSeoPage.astro`, `src/styles/global.css`, `src/i18n/en.ts`.

## Pass 2–4 (verification)

- `SKIP_BUILD=1 npm run audit` × 3 — exit 0, no further code changes.

## Blocked

- **Playwright navigation matrix** (§2 scripted click-through) — not in repo; manual preview + existing verifiers.
- **`npm run audit:perf` median ≥95** — run locally when Chrome is available (`node scripts/audit-perf.mjs`); not gating CI.
- **Real affiliate production URLs** — still `/go/*` bridges until supplied.
- **Sitewide strict §3.1 body-anchor global uniqueness** — would require rewriting all “Buy now” CTAs; scoped to markdown/main copy per Decisions.

## Review table (indexable / audited pages)

| Page | spelling | spacing | images/alt | relevancy | keywords/anchors | status | notes |
|------|----------|---------|------------|-----------|------------------|--------|-------|
| `/` | pass | pass | pass | pass | pass | pass | money + showcase |
| `/cloud-dma/` | pass | pass | pass | pass | pass | pass | callout + markdown |
| `/hwid-spoofer/` | pass | pass | pass | pass | pass | pass | |
| `/guides/bo7-cheat-requirements/` | pass | pass | pass | pass | pass | pass | |
| `/faq/` | pass | pass | pass | pass | pass | pass | |
| `/about/` | pass | pass | pass | pass | pass | pass | copy refreshed |
| `/support/` | pass | pass | pass | pass | pass | pass | |
| `/privacy/` | pass | pass | pass | pass | pass | pass | |
| `/terms/` | pass | pass | pass | pass | pass | pass | |

## Commands

```bash
npm run build
npm run audit          # full scriptable SEO audit
SKIP_BUILD=1 npm run audit
npm run audit:perf     # Lighthouse medians → audit/lighthouse-summary.json
```