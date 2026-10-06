# Astro modernization handoff

Prepared: 2026-10-06. Status: planning complete; implementation has not started.

This document carries the agreed plan into separate implementation chats. Read it together with the current repository state before starting a phase. Complete the phases in order, update the progress record below after each phase, and preserve unrelated work.

## Goals and success criteria

- Migrate the React/Vite single-page site to a fully prerendered Astro site while preserving its visual identity.
- Render all site-owned content at build time, including all talks, articles, and gallery markup. Visitors should be able to read the page without JavaScript.
- Replace Lyra with a small browser script that filters existing talk elements. Remove unnecessary framework and library runtime costs.
- Improve responsive image delivery, gallery layout, accessibility, and maintainability.
- Simplify the map and third-party scripts while retaining the existing Google Analytics property.
- Keep GitHub Pages hosting and `https://devrel.codyfactory.eu`, with one production cutover after all phases pass validation.

## Agreed decisions and rationale

| Decision | Rationale |
| --- | --- |
| Preserve and polish the current design | The user chose modernization rather than a broader redesign. Keep colors, typography, hero presentation, and remaining section order. |
| Fully static Astro with `.astro` components | The content is local and the interactions are small. A backend, SSR adapter, or hydrated React application adds no necessary capability. |
| Keep UnoCSS; upgrade to Wind4 | Existing utilities, theme shortcuts, and icon presets are used throughout the site. This minimizes rewriting while modernizing the CSS toolchain. |
| Scoped native CSS for specialized layouts and animation | Gallery layout and hero animation are clearer as component-owned rules alongside shared theme tokens. |
| Filter prerendered talks with plain TypeScript | There are 44 talks at planning time. A search engine, client-side table model, and asynchronous index are unnecessary. |
| Search AND resource requirements AND any selected location | The user explicitly selected grouped filters. Search should narrow results; location choices within their group should be alternatives. |
| Lazy OpenStreetMap iframe | The user wants a simple embedded map with a marker. This removes local map libraries and the MapTiler API key. |
| Astro image processing | Replace handcrafted source sets and Vite image plugins with build-time responsive image generation. |
| Native masonry with ordinary CSS Grid fallback | The user accepts differing layouts across browsers and wants no JavaScript layout fallback. |
| Google Analytics only | The user explicitly chose to retain GA and remove Insights, including its link tracking. |
| Remove the Twitter timeline | The user chose to remove the feed and widget script, retaining the profile link in Socials. |

## Final implementation plan

### Phase 1 — Static Astro foundation

- Convert the existing section components to `.astro` components. Keep shared section, heading, link, and article components; add a shared document layout and homepage.
- Render every section, talk, and article at build time. Remove the React application shell, hydration, and hash-scroll workaround. Preserve native `#talks`, `#articles`, and `#socials` navigation.
- Retain typed TypeScript content files. Do not introduce a CMS or content-collection layer for the current 44 talks and 12 articles.
- Use Astro's UnoCSS integration with Wind4, the existing icon presets, and shared theme tokens. Migrate changed theme keys and use Wind4's built-in reset without injecting a second reset.
- Ensure icon classes stored in TypeScript content are discovered or explicitly safelisted in the production CSS.
- Keep specialized gallery and animation rules in scoped CSS. Preserve the current visual identity and Roboto through the existing Bunny font setup.
- Use semantic landmarks and headings. Add visible keyboard focus, a skip link, reduced-motion support, accurate image alternatives, and responsive heading sizes.
- Add description, canonical URL, and social-preview metadata using existing content and imagery.
- Upgrade to current stable Astro and compatible dependencies. Standardize on Node 24 LTS and an explicitly pinned pnpm version across development and CI. Record exact selected versions in the lockfile and this handoff.

Phase boundary: all content must exist in generated HTML. The interactive filtering replacement belongs to Phase 2; final image processing and gallery enhancement belong to Phase 3. Temporary image handling must still show the existing images. Do not deploy an intermediate state with missing behavior. Keep any transitional dependencies only while actually required, and record them for cleanup.

### Phase 2 — Search and external services

#### Talk search

- Prerender each talk as one semantic list item with build-generated search and filter attributes. Preserve source ordering and existing recording-status labels.
- Use a small TypeScript browser script to toggle `hidden`. Do not download an index, call a search API, or rerender the list.
- Search conference, talk title, location, and year using case-insensitive and accent-insensitive substring matching. Split queries on whitespace and require every term to match across the combined searchable text.
- Apply `search AND resource requirements AND any selected location`. Selecting Video and Slides requires both. Selecting Europe and USA accepts either location. An empty group imposes no restriction.
- Add explicit location classification to the talk type: USA, Europe, Asia, or Virtual. Normalize existing virtual entries and classify Japan as Asia. Include Asia in the location controls.
- Include a labelled search field, accessible toggle buttons, result count, empty state, and reset control. Update immediately on input; no debounce dependency is needed.
- Without JavaScript, show all talks and hide inactive search controls. Ensure layout styles do not override the `hidden` attribute.
- Remove Lyra/Orama search branding. Preserve historical talk titles that mention Orama.
- Preserve the existing video-state meanings: URL means a recording is available, `none` means not recorded, and an absent value means coming soon.

#### Map and analytics

- Replace the React/MapLibre map with an OpenStreetMap iframe centred on Annecy at longitude `6.133`, latitude `45.916`, with approximately the current regional framing.
- Use native lazy loading, a descriptive iframe title, reserved height, visible attribution, and an external map link that remains useful if the embed fails. Remove the map packages, map-specific CSS, and MapTiler key.
- Keep Google Analytics property `G-DMTB5F3X2D` through a production-only script in the document layout. Initialize it once; do not carry the obsolete Vite analytics plugin into the final setup.
- Remove Insights initialization, link click handlers, logging, and dependency.
- Remove the Twitter timeline section and widget script. Keep the Twitter/X profile link in Socials.

Phase boundary: search and filtering work against static HTML; map and analytics replacements are complete; no React, Lyra, table, map-library, Insights, or Twitter-widget runtime is needed.

### Phase 3 — Images, gallery, and delivery

#### Images and masonry

- Replace `vite-imagetools` and handcrafted source sets with Astro's `Picture` for hero/gallery photographs and `Image` where a single optimized format suffices. Keep SVG logos as SVG.
- Generate AVIF and WebP with JPEG fallback at build time. Supply responsive widths, accurate `sizes`, intrinsic dimensions, and appropriate cropping.
- Load the hero eagerly with high priority; lazy-load gallery images. Preserve the existing hero's high-priority intent without the React type suppression.
- Define a small typed gallery manifest with image imports, meaningful alternative text, order, aspect ratio, and featured-image status. Preserve the existing landscape/portrait treatment and wide featured image.
- Use a responsive one/two/four-column CSS Grid baseline. Enhance under `@supports (display: grid-lanes)`, retaining column spans and removing masonry-incompatible row spans in the enhanced rules. Use no layout JavaScript.
- Preserve meaningful DOM order and inspect the enhanced and fallback layouts separately.

#### Tooling and deployment

- Remove obsolete React, search, table, map, image-plugin, and analytics dependencies and configuration once their replacements are complete. Retain only packages actually used.
- Replace the React-oriented XO setup with ESLint support for Astro/TypeScript and Prettier's Astro plugin. Add `astro check`.
- Keep GitHub Pages, `dist`, and `devrel.codyfactory.eu`. Configure Astro's site URL and root base path; preserve the custom domain in deployment output/configuration.
- Update GitHub Actions and use frozen-lockfile installs. Run checks on pull requests and preserve main-only deployment.
- Document development, content editing, gallery additions, filtering, and deployment.

Phase boundary: all validation passes, obsolete dependencies are gone, and the static output is ready for the existing GitHub Pages deployment. Do not merge or push partial phases to `main`: the current workflow deploys automatically on pushes to `main`.

## Interfaces and defaults

- Public surface remains the homepage and existing section anchors. No public API or server endpoint is added.
- Keep talk and article content in typed TypeScript modules; extend the talk model with explicit filter location classification.
- The browser filtering script consumes generated attributes on each talk wrapper. Build-time content remains the source of truth; do not maintain a second manually curated search dataset.
- The gallery gains typed metadata for order, alternative text, aspect ratio, and featured status.
- Format dates at build time as unambiguous English dates using UTC, so the build machine's timezone cannot shift displayed dates.
- Target modern browsers compatible with Wind4. Use feature detection for Grid Lanes instead of making masonry support a prerequisite for reading the gallery.
- Browser JavaScript remains appropriate for filtering and GA; the external map iframe has its own runtime. “Fully prerendered” refers to site content, not an absence of all browser JavaScript or network requests.

## Constraints and approaches ruled out

- No broader visual redesign or unrequested biography/content rewrite. Preserve content and URLs except the agreed feed removal and correctness/accessibility fixes.
- Do not replace Lyra with another search engine, including Orama. No fuzzy search, search backend, pagination, or client-side data-table library is needed.
- Do not switch to Tailwind directly or rewrite all styling in native CSS. Both alternatives were considered; the user selected UnoCSS Wind4.
- Do not retain a custom MapLibre application or replace the map with only a static illustration. The user selected a lazy embed.
- Do not use CSS columns as the gallery fallback or add a JavaScript masonry polyfill. The user selected conventional Grid fallback.
- No SSR adapter, backend, CMS, React islands, or gallery lightbox is planned.
- Do not remove historical Orama references from talk titles merely because the search integration is being removed.
- Preserve unrelated changes and do not treat generated `dist` output as a verified baseline without rebuilding and inspecting it.
- Use sequential, reviewable phases and a single validated production cutover. This handoff does not authorize a deployment, merge, or unrelated repository cleanup.

## Validation and acceptance

### Before implementation

- Capture current desktop/mobile screenshots and production-build transfer sizes. Record any existing build or browser issues separately from migration regressions.
- Inspect `git status` and existing diffs before editing; preserve the pre-existing changes listed below.

### Behavior tests

- Search: case/accent normalization, multiple terms, conference/title/location/year matching, whitespace-only query, no results, and reset.
- Filters: Video plus Slides requires both; Europe plus USA accepts either; search plus filters narrows results; absent recordings and `none` do not satisfy Video.
- Data regressions: lowercase virtual entries match Virtual; Japan matches Asia and not Europe.
- Production-build browser smoke tests: all content exists without JavaScript; controls are progressively enhanced; native anchors and keyboard navigation work; hidden rows do not retain layout space or accessible content.

### Visual and delivery checks

- Check Chromium, Firefox, and Safari at desktop and mobile widths. Exercise both the ordinary grid fallback and native Grid Lanes where supported.
- Inspect image crop, responsive source selection, dimensions, layout stability, reduced motion, and focus visibility.
- Verify map lazy loading, reserved space, attribution, and external link; verify a single production GA initialization and no analytics in development.
- Confirm no React, Lyra, map-library, Insights, or Twitter-widget runtime loads in the final build.
- Require type checks, lint, formatting checks, tests, and production build to pass before cutover. Compare loading performance and transferred assets against the baseline without inventing unmeasured improvement claims.

## Repository map and known issues

Paths below are relative to the repository root.

| Area | Relevant files | Notes |
| --- | --- | --- |
| Entry points | `index.html`, `src/main.tsx`, `src/App.tsx`, `src/Home.tsx` | React mounts into an otherwise empty root; Home manually scrolls to the URL hash. |
| Shared UI | `src/Section.tsx`, `src/SectionTitle.tsx`, `src/Link.tsx` | Section/title markup uses generic divs; Link includes Insights tracking and console logging. |
| Hero | `src/Hero.tsx`, `src/cover.module.css`, `src/images/reactsummit_closeup.jpeg` | Handcrafted image sources; JPEG source incorrectly declares AVIF MIME type; hero alternative text is missing. |
| Main content | `src/About.tsx`, `src/Socials.tsx`, `src/ArticleList.tsx`, `src/Article.tsx`, `src/articles.ts`, `src/article-type.ts` | Xen logo alternative text incorrectly says NearForm. Date formatting currently depends on browser locale. |
| Talks | `src/talks/TalkList.tsx`, `src/talks/Search.tsx`, `src/talks/search-talks.ts`, `src/talks/ToggleFilter.tsx`, `src/talks/filters.ts`, `src/talks/talks.ts`, `src/talks/talk-type.ts` | Lyra plus React Table; OR composition broadens search; Europe means non-USA/non-`Virtual`, incorrectly including Japan and lowercase virtual entries. |
| Gallery | `src/Photos.tsx`, `src/gallery/` | Eight photos; filename suffixes encode big/portrait treatment; multiple glob imports and manual source-set assembly. |
| Map | `src/Location.tsx`, `src/Map.tsx`, `src/map.css` | Lazy React wrapper, MapLibre, React Map GL, and MapTiler style URL. |
| Feed | `src/Tweets.tsx` | Injects Twitter's widget script. |
| Build and styles | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `.xo-config.cjs`, `.nvmrc` | React 18/Vite 4-era tooling; UnoCSS configuration lives inside Vite config; Node 18 pin. Workspace config already permits esbuild/sharp build scripts. |
| Deployment | `.github/workflows/ci-cd.yml` | Currently pnpm 8/Node 18; builds and publishes `dist` on pushes to main using `peaceiris/actions-gh-pages`; custom domain is configured here. |

## Existing changes and implementation status

No application code was changed during planning. This handoff is the only file added by the planning/handoff work. No new build, test suite, browser baseline, or deployment was completed during planning.

Pre-existing working-tree state, rechecked when saving this document:

- Modified `src/Hero.tsx`: a `@ts-expect-error` comment was added above `fetchPriority="high"` for React typing. Preserve the intended high-priority hero loading when converting to Astro; the suppression itself will no longer be needed.
- Untracked `.anima/`: leave untouched.

### Progress record for subsequent chats

| Phase | Status | Implementation notes and verification |
| --- | --- | --- |
| 1 — Static Astro foundation | Not started | Record selected versions, baseline artifacts, changed files, checks, and any transitional dependencies. |
| 2 — Search and external services | Not started | Record filter tests, no-JavaScript behavior, map/GA checks, and remaining cleanup. |
| 3 — Images, gallery, and delivery | Not started | Record browser matrix, image/performance comparison, final checks, and deployment readiness. |
| Production cutover | Not performed | Record actual deployment and smoke-check results only after they occur. |

## Next step and cross-chat workflow

Start Phase 1 in the current checkout or a suitable isolated branch. Read this handoff, inspect current instructions and diffs, capture the baseline, then implement the static Astro foundation. Do not overwrite the hero change or `.anima/` work.

At each phase boundary, update the progress record with what changed, commands run and their results, unresolved issues, intentional temporary behavior, and the exact next step. Include a commit identifier if one was created; do not imply a commit or deployment occurred when it did not. Later chats should inspect the actual repository and completed work rather than restarting the migration.

Suggested request for the next chat: “Implement Phase 1 from `docs/MODERNIZATION_HANDOFF.md`. Preserve existing work, validate the phase, and update the handoff for Phase 2. Do not deploy.”

## References checked during planning

- [Astro image documentation](https://docs.astro.build/en/guides/images/) — build-time processing, responsive `Image`/`Picture`, dimensions and sizes.
- [Astro installation requirements](https://docs.astro.build/en/install-and-setup/) — current documented minimum was Node 22.12; the plan selects Node 24 LTS.
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/) — static hosting and site/base configuration.
- [UnoCSS Wind4](https://unocss.dev/presets/wind4) — theme migrations and built-in reset.
- [UnoCSS Astro integration](https://unocss.dev/integrations/astro) — integration and extraction configuration.
- [Tailwind 4 browser compatibility](https://tailwindcss.com/docs/compatibility) — Wind4 refers to this compatibility baseline.
- [Safari 26.4 features](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/) and [Grid Lanes field guide](https://gridlanes.webkit.org/) — native masonry uses `display: grid-lanes`; Safari 26.4 support was verified. Do not assume universal support; use `@supports` and the agreed fallback.
- [OpenStreetMap export and embedding](https://wiki.openstreetmap.org/wiki/Export) — iframe sharing is sufficient for this single-marker map.

Recheck version-sensitive integration details when implementing. These references explain the decisions; they do not require repeating product-choice questions already settled above.
