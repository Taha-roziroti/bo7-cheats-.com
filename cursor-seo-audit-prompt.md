# Cursor `/goal` Prompt: Full Website SEO Audit (v2)

Paste everything below the line after `/goal ` in Cursor.

---

## OBJECTIVE

Audit this entire website and fix every issue directly, in repeated full passes, until it is technically and structurally perfect for SEO. Do not ask for permission before making fixes. Work autonomously until a STOP CONDITION below is met, then stop completely.

"Perfect" means all of the following at once: zero broken links, zero anchor text redundancy, pages that balance text with visuals, headings proportional to content, smooth navigation between pages, top-tier performance, and natural keyword usage with no stuffing.

## AUTONOMY RULES

- Fix everything you find immediately. Do not ask for approval, and do not stop to report between passes.
- Only pause if a required input is truly missing (for example the real affiliate URL, a keyword list, or an image that must be supplied). In that case use a clearly marked placeholder, log it in AUDIT_LOG.md, and keep going on everything else.
- Commit locally after each green pass (`audit pass N: <summary>`). Never push, deploy, or modify any template/source repo unless I explicitly say so.
- Do not redesign the site. Preserve the existing look, layout, components, animations, and responsiveness unless a specific fix requires a change.
- Never "pass" an audit by cheating. Specifically, do not: delete pages or content, add noindex or nofollow, loosen thresholds, skip checks, or mark items verified without running the command that proves it. Also do not: hide duplicate anchors behind aria-labels, remove images or content just to raise a Lighthouse score, or add meaningless decorative images just to satisfy the text-to-visual ratio.

## PRIORITY ORDER WHEN RULES CONFLICT

Several requirements pull against each other (for example more images vs. faster loading, or smooth transitions vs. performance). Resolve conflicts in this order, and record each resolution in the "Decisions" list so it is never flip-flopped:

1. Correctness: the build passes and no link is broken.
2. Performance and accessibility: never trade these away for polish. If an image slows a page, optimize the image (smaller dimensions, AVIF/WebP, correct `sizes`) rather than removing it.
3. SEO structure: anchors, headings, keywords, canonicals, metadata.
4. Visual polish and motion.

## STEP 0: RECON AND TOOLING (before any fixes)

1. Detect the stack (expected: Astro), build/dev commands, hosting/redirect config (_redirects, netlify.toml, vercel.json, astro.config redirects, etc.), and the keyword map/source of truth if one exists in the repo. If no machine-readable keyword map exists, create `keywords.json` from the keywords I supplied (page, primary, secondaries, intent) and treat it as the single source of truth for every script.
2. Create `scripts/seo-audit.mjs` (or equivalent) plus an `npm run audit` script. It must build the site, crawl the built output, run every scriptable check below, print a failure list grouped by category, and exit non-zero if anything fails. Also create `npm run audit:perf`, which runs Lighthouse (see section 10) against a production preview of the built site. **Every scriptable check described in this document must exist in the script by the end of pass 1.** After pass 3 the script is FROZEN, apart from fixing a bug in the script itself.
3. Create `AUDIT_LOG.md`. After every pass record: pass number, issues found per category, issues fixed, issues remaining, files changed, and evidence (command output). Also keep a "Decisions" list (fixes chosen and why) and a "Blocked" list. Re-read this file at the start of every turn so progress survives context resets.
4. Write the first Decisions entries before touching anything:
   - The anchor text regions (see section 3) and how each is detected.
   - Any intentional affiliate bridge routes (for example `/go/*`), if the codebase has them. These are the only allowed exception to the "no internal links to redirects" rule. They must stay out of the sitemap, and every link to them still carries the correct rel values.
5. Run a baseline audit and log it as pass 0.

## PASS LOOP

Repeat: run `npm run audit` -> fix everything it reports plus anything found in the judgment reviews -> rebuild -> re-run the scriptable audit -> log -> commit. Run `npm run audit:perf` on every template whose files changed in that pass.

If a fix breaks the build or a previously passing check, revert that fix and solve it a different way.

## LOOP SAFETY AND STOP CONDITIONS

Prevent endless rechecking. These rules override everything else.

- **Hard cap:** at most 8 passes after the baseline. Track the pass number in AUDIT_LOG.md. On reaching the cap, stop and write the final report with whatever remains.
- **Per-issue cap:** try at most 3 genuinely different fixes for any single issue. If it still fails, add it to "Blocked" with the reason and what I would need to do, and exclude it from the pass/fail condition. Do not keep retrying it.
- **No-progress rule:** if the number of open issues does not drop for 2 consecutive passes, move every remaining issue to "Blocked" and go straight to final verification.
- **No-change rule:** if a pass makes zero file changes, do not run another pass. Treat the remaining failures as Blocked, run final verification, and stop.
- **Never re-check what has not changed.** Judgment reviews (sections 12-15 and the keyword/anchor read-throughs) and Lighthouse run only on pages or templates whose files changed since they last passed. A page marked pass stays pass until its files change. Full-site judgment reviews happen only on the first pass and the final verification.
- **Cap subjective rewriting** at 2 rounds per page for spacing, relevancy, wording, keyword naturalness, and visual balance. After that, mark the page pass or Blocked. Do not endlessly polish.
- **External link checks** run at most once per pass, with at most 2 retries. Timeouts, 429s, and bot-blocking 403s count as "unverified", not failures. List them in the final report and do not let them block completion.
- **Lighthouse noise:** scores vary slightly between runs. Always use the median of 3 runs, and never re-run just to chase a 1-point swing. Treat a median at or above the required floor as pass.
- **Do not undo earlier decisions.** Before reversing any past fix, check the "Decisions" list. If two fixes conflict, find one solution that satisfies both, or move the item to Blocked. Never flip-flop.
- **Do not move the goalposts.** No new check categories, stricter thresholds, or extra scope after pass 3.
- **Final verification** is exactly 3 consecutive clean runs of `npm run audit` (exit 0), with the last two requiring no code changes, followed by one final `npm run audit:perf` across every template. When they pass, write the final report, mark the goal complete, and stop. Do not run further audits, builds, or reviews after the final report.

## WHAT TO CHECK

### 1. Links and redirects

- Every internal link, anchor, and #fragment resolves (200). Zero 404s. Crawl the built output and test every `<a href>`, plus every URL in the sitemap, canonical tags, Open Graph tags, and JSON-LD.
- No internal links pointing at a redirect; link straight to the final URL (except the bridge routes noted in Step 0).
- No redirect chains, loops, or redirects to missing targets. Every redirect is a single-hop 301.
- Consistent trailing slashes, lowercase URLs, no index.html or duplicate-host variants (www/non-www, http/https).
- No placeholder hrefs (`#`, `javascript:void(0)`), no empty hrefs, no localhost/staging/dev URLs. Every link has an accessible name. `mailto:` and `tel:` links are well-formed.
- Real 404 page that returns a 404 status, includes the normal header and footer, and offers links back into the site.
- External links: valid HTTPS, correct rel (affiliate links use rel="sponsored noopener"; other external links use rel="noopener"). Verify live where network allows (HEAD first, GET as fallback). If an external link redirects, update the href to its final URL. List anything unverifiable in the log.
- Buy/pricing buttons use the single AFFILIATE_LINK_PLACEHOLDER until a real link is supplied. Never invent affiliate URLs.

### 2. Smooth, seamless navigation between pages

Every link, internal or external, should feel instant and predictable.

- **Transitions between pages:** prefer zero-JS cross-document view transitions (`@view-transition { navigation: auto; }`) with a short fade (200ms or less), a persistent header, and everything wrapped in `@media (prefers-reduced-motion: no-preference)`. Do NOT add a client-side router or any JS whose only purpose is page transitions. Keep the transition only if it passes the performance budgets in section 10.
- **Instant loading:** enable internal link prefetching (Astro's built-in prefetch with a hover or viewport strategy, or the Speculation Rules API at moderate eagerness), whichever is lighter. Verify it does not hurt Lighthouse scores or bandwidth on mobile.
- **No flashes or jumps:** consistent page background color during navigation (no white flash), critical CSS inlined, fonts preloaded with matched fallback metrics, header height reserved. Measured CLS across a click-through of the main flows must stay at or below 0.01.
- **In-page anchors and fragments:** every fragment target has `scroll-margin-top` at least equal to the sticky header height. Smooth scrolling applies only under `prefers-reduced-motion: no-preference`. If a smooth-scroll library such as Lenis is in use, fragment navigation must go through it and still land correctly. Focus moves to the target, the URL updates, and the Back button restores the previous scroll position.
- **Consistent link behavior:** internal links open in the same tab. External links open in a new tab (`target="_blank"`) with the rel values from section 1, and show a small external-link icon (the icon is `aria-hidden`; any visually hidden "opens in a new tab" text is excluded from anchor text checks).
- **Link states:** every link has distinct hover, focus-visible, and active states. Current page is marked in navigation with `aria-current="page"`. State transitions are 200ms or less and respect reduced motion.
- **Scripted check (Playwright):** click every header and footer link and at least one in-content link per template. Assert status 200, no console errors, correct `aria-current`, working Back/Forward, no layout shift, and fragment links landing with the target visible below the sticky header.

### 3. Anchor text: ZERO redundancy (absolute rule)

First build an **anchor inventory** from the built HTML (`audit/anchor-inventory.json`): for every `<a>`, record the page, region, normalized text (trimmed, lowercased, whitespace collapsed; for image links use the image's alt), destination URL, and rel. Regions are: `header`, `footer`, `breadcrumb`, `toc` (in-page table of contents), and `body` (everything else, including cards and CTA buttons).

The following are hard failures:

1. **Body anchors are globally unique.** No two body links anywhere on the site share the same normalized anchor text, even if they point to the same destination. This includes CTA and buy buttons: each needs distinct, descriptive wording suited to its context.
2. **Body anchors never reuse a chrome label.** A body anchor may not equal any header, footer, breadcrumb, or toc label.
3. **One destination, one body link per page.** A page never links to the same destination twice from its body, and never links to itself from its body.
4. **Chrome stays consistent but not duplicated.** Within the header, footer, breadcrumb, and toc, no label repeats. The same destination uses the same label in every chrome region, and one label never points to two destinations.
5. **No generic anchors:** "click here", "here", "read more", "learn more", "more", "view", "see more", "details", "continue", "this page", "link", and similar. Card grids need a unique descriptive anchor per card.
6. **Descriptive and short:** 2-7 words, no full sentences, no bare URLs as anchor text, and the text must accurately describe the destination's topic.
7. **Exact-match limit:** for each destination page, at most one inbound body link site-wide uses its exact primary keyword. All other inbound anchors use varied natural phrasing (descriptive, partial-match, branded, or contextual).
8. **No stacked duplicate links.** A card or media object is a single `<a>` wrapping image and text. Never an image link plus a title link plus a "read more" link to the same place. No nested links, no empty anchors.
9. **aria-label is not a loophole.** Visible text is what counts, and any aria-label must include the visible text.

Judgment read-through (items counted in the loop-safety caps): confirm each anchor reads naturally in its sentence and matches what the destination page is actually about. Rewrite the surrounding sentence if needed rather than forcing an anchor.

### 4. Technical SEO

- Unique title (about 50-60 chars) and meta description (about 140-160 chars) on every page. Literal and descriptive, no clickbait.
- Exactly one H1 per page, no skipped heading levels.
- Self-referencing absolute canonicals, correct robots meta, no stray noindex from staging.
- Valid robots.txt referencing the sitemap. sitemap.xml lists only canonical, indexable, 200 URLs.
- Open Graph and Twitter tags complete, with working images.
- JSON-LD valid and matching visible content (Organization, WebSite, BreadcrumbList, plus Product/FAQ only where genuinely applicable). No fabricated ratings or reviews.
- US English only: `lang="en-US"`, no hreflang tags anywhere.
- Clean URL structure: short, lowercase, hyphenated, no query parameters.

### 5. Keyword usage (natural, never stuffed)

- Use only the keywords I supplied as targets. One primary keyword per page, with secondaries assigned deliberately in `keywords.json`. Natural synonyms and related phrasing are encouraged in prose, but never target a keyword I did not supply.
- No two pages targeting the same primary keyword (cannibalization).
- **Proper placement** (natural, never forced): the primary keyword appears in the title (ideally near the front), the H1 (worded differently from the title), the meta description, the first ~100 words, and the URL slug where it reads naturally. Secondaries belong in H2s and body copy only where they fit. Keywords are not required in alt text, anchors, or footers.
- **Stuffing limits (scripted):**
  - Primary exact-match: at most 1.5% of the page's words and at most 1 occurrence per ~150 words.
  - Each secondary exact-match: at most 1 per ~250 words.
  - Primary exact-match appears in at most 2 headings per page (the H1 plus at most one other).
  - At most 1 image alt per page contains the primary keyword, and only if it truly describes the image.
  - Title, H1, and meta description are never identical strings, and the same phrase is not repeated across every heading, alt text, anchor, and footer link.
  - No keyword-only lists, footer keyword blocks, or hidden/off-screen text.
- **Naturalness read-through:** read each page's copy as a human would. If a sentence exists only to host a keyword, or the same phrase appears in consecutive sentences or paragraph openings, rewrite it with varied, specific wording.
- Flag repetitive wording across pages and boilerplate paragraphs. Rewrite to be natural and varied.

### 6. Information architecture

- Logical hierarchy where URL paths, navigation, and breadcrumbs agree.
- Every page reachable within 3 clicks of the homepage. No orphan or dead-end pages.
- Strong, relevant contextual internal linking (hub and spoke), following the anchor rules in section 3. Every spoke page is linked from its hub and links back up to it.
- Consistent header/footer navigation, no duplicate nav items.
- Zero template leakage: no leftover text, images, links, or data from any template repo. Remove files unrelated to this site's topic.

### 7. Content hygiene

- No lorem ipsum, TODO, placeholder, or duplicated paragraphs. Consistent brand name, no AI-sounding filler.

### 8. Page composition: headings and visuals

Pages should be scannable and visual, not walls of text.

**Visual balance**

- No more than ~250 consecutive words (about 3 paragraphs) of main content without a visual break: an image, captioned figure, diagram, table, comparison or stats component, icon list, or callout.
- Every page has a relevant lead image at or near the top, then roughly one meaningful visual per 200-300 words.
- Prefer text and image side by side (alternating layout) over stacked blocks. Images must teach or show something (the product, an in-game example, the interface, a diagram), not just decorate.
- Paragraphs stay at about 4 sentences or ~90 words at most. Turn parallel lists of 3+ items into lists or tables.
- Word-count guardrails: flag commercial/landing pages over ~1,000 words and guides over ~1,500 words, and trim or split them. Flag pages under ~250 words unless they are utility pages (404, legal). Trim padding before adding visuals.
- If a page genuinely needs an image that does not exist in the repo, do not use a stock or AI image presented as authentic and do not ship a broken placeholder. Log the exact filename, dimensions, and description under "Inputs needed", mark the page Blocked for visual balance, and continue.

**Heading proportions**

- Headings must be proportional to text: on average one heading (H2-H6) per ~100-300 words, and no section runs longer than ~400 words without a subheading.
- Each H2 or H3 section has at least ~40 words of real content beneath it. Exempt: FAQ blocks and card/link grids on hub pages.
- No heading directly followed by another heading with no content between them. No lone H3 under an H2 (use two or more, or none).
- Headings are descriptive, under ~70 characters, not full sentences, unique within the page, varied across the site, and never used purely for styling (use CSS classes instead).
- Pages under ~300 words typically need just an H1 and 1-3 H2s.

### 9. Images and media

- Every image exists, is non-empty, high-definition, and relevant. Descriptive alt text (not stuffed), empty alt only for decorative images.
- Width/height set to prevent layout shift. Modern formats (WebP/AVIF), responsive srcset and correct `sizes`, lazy-load below the fold, LCP image eager with fetchpriority="high".
- No unnecessary image repetition across pages. No AI-generated or stock images presented as authentic screenshots or photos. Captions where useful.
- Weight budgets: hero image 150 KB or less, other images 120 KB or less each after optimization. Adding images for section 8 must not push any page past the section 10 budgets.

### 10. Performance and build integrity

Target: perfect. Required floor is a median score of 95 or higher in every Lighthouse category on every unique template, and the goal is 100.

- Build completes with zero errors and zero warnings. Type checks and lint pass. No console errors in the browser.
- **Lighthouse (`npm run audit:perf`):** run against a production preview of the built site (never the dev server), mobile and desktop, on one representative page per unique template (home, hub, spoke/article, pricing/commercial, forum/FAQ, 404). Use the median of 3 runs. Performance, Accessibility, Best Practices, and SEO must each be at least 95, and every flagged opportunity or diagnostic above the noise level must be fixed or logged with a reason.
- **Lab targets (mobile):** LCP 2.0 s or less, FCP 1.2 s or less, TBT 100 ms or less, CLS 0.01 or less.
- **Resource budgets (scripted):** JavaScript 30 KB gzipped or less per page (zero where possible, islands only where needed), CSS 25 KB gzipped or less, HTML 60 KB or less, at most 2 font families and 4 font files (self-hosted, subset woff2, `font-display` set, critical font preloaded), DOM under 1,500 nodes, zero third-party requests unless I approve one.
- No render-blocking resources. Preload only the LCP image and critical font. Use `content-visibility: auto` with `contain-intrinsic-size` for heavy below-the-fold sections where it helps. Inline small stylesheets, and hash static assets with long-lived immutable cache headers.
- Animations use only transform and opacity, run off the main thread where possible, and never cause layout shift.
- No mixed content, leaked secrets, committed .env files, or leftover dev/debug code.

### 11. Accessibility and responsiveness

- Contrast, visible focus states, keyboard navigation, landmarks, skip link, labeled form fields, aria-labels where needed, prefers-reduced-motion respected for all animations and transitions.
- No horizontal scroll or layout breakage at 320, 375, 768, 1024, and 1440 px. Check with a headless browser (e.g., Playwright) if available.

### 12. Spelling and language (judgment)

- Add a spell-check step (e.g., cspell) to `npm run audit` covering all page content, metadata, alt text, and JSON-LD. Maintain a project dictionary only for legitimate brand, product, and game names. Never add a misspelling to it.
- Check US English spelling consistency, grammar, capitalization consistency (headings, buttons, brand name), and punctuation. Fix every error directly.

### 13. Spacing and visual layout (judgment)

- Use Playwright (or equivalent) to screenshot every page at 375, 768, 1024, and 1440 px. Visually inspect each screenshot yourself.
- Flag and fix: large unexplained empty gaps, sections with too little content for their height, inconsistent padding/margins between similar sections, cramped or touching elements, text hugging screen edges, overlapping elements, orphaned single words or headings at the end of a block, and uneven card or grid heights.
- Also confirm the text-and-image rhythm from section 8 looks balanced at every breakpoint: no long text-only stretches, no images stacked without context.
- Measure computed section padding and gaps with script checks, and make spacing follow one consistent scale across the site.
- Keep fixes within the existing design system. Do not redesign.

### 14. Image and alt text accuracy (judgment)

- Open and look at every image file. For each one, confirm the alt text accurately describes what is actually visible, uses natural language, and avoids repeating the page's primary keyword unless it truly describes the image.
- Confirm each image is relevant to its page's topic, matches its caption, and is not reused across pages without reason. Fix or replace alt text, and flag any image that is irrelevant, blurry, or low resolution.

### 15. Content relevancy (judgment)

- For every page, review the actual copy and log in AUDIT_LOG.md: assigned primary keyword, search intent (informational, commercial, or transactional), and whether the page content genuinely satisfies that intent.
- Check that content stays on the site's niche, headings match the content beneath them, titles and meta descriptions accurately describe the page, internal link anchors match their destination page's topic, and FAQ/forum content is relevant and not generic filler.
- Rewrite off-topic, vague, repetitive, or padded sections directly. Add missing coverage where a page doesn't satisfy its intent, without breaking the word-count and visual-balance guardrails in section 8. Use only the keywords I supplied.

## REVIEW TABLE

Judgment-based checks (sections 12-15 and the keyword and anchor read-throughs) cannot be proven by a script alone, so verify them by completing a per-page table in AUDIT_LOG.md with columns: page, spelling, spacing, images and alt, relevancy, keywords and anchors, headings and visual balance, status, last-changed hash. Every row must be marked pass (or Blocked, with a reason) and include a one-line justification. Follow the LOOP SAFETY rules above for when pages get re-reviewed.

## DEFINITION OF DONE (stop as soon as one of these is met)

- **A. Success:** `npm run build` succeeds with zero errors and zero warnings, `npm run audit` exits 0 on 3 consecutive runs (the last two with no code changes), `npm run audit:perf` passes on every template (all categories at or above 95, median of 3), the anchor inventory shows zero violations, the link crawl shows zero broken internal links, and the REVIEW TABLE has every page marked pass, all logged with evidence in AUDIT_LOG.md.
- **B. Exhausted:** the 8-pass cap, the no-progress rule, or the no-change rule is reached. Everything remaining is listed under "Blocked" with reasons.

Either way, write the final report and stop.

## FINAL REPORT

Summarize: passes completed, issues fixed per category, a Lighthouse score table per template (mobile and desktop, all four categories), anchor inventory totals and any remaining violations, Blocked items with reasons and what I need to do, anything that could not be verified (such as external links offline), and any inputs I still need to supply (such as the affiliate URL, keyword list, or specific images). Then stop.
