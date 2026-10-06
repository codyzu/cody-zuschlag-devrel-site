# Astro modernization handoff

Prepared: 2026-10-06. Status: Phases 1 and 2 implemented and validated locally; Phase 3 is next. No production cutover has occurred.

This document carries the agreed plan into separate implementation chats. Read it together with the current repository state before starting a phase. Complete the phases in order, update the progress record below after each phase, and preserve unrelated work.

## Goals and success criteria

- Migrate the React/Vite single-page site to a fully prerendered Astro site while preserving its visual identity.
- Render all site-owned content at build time, including all talks, articles, and gallery markup. Visitors should be able to read the page without JavaScript.
- Replace Lyra with a small browser script that filters existing talk elements. Remove unnecessary framework and library runtime costs.
- Improve responsive image delivery, gallery layout, accessibility, and maintainability.
- Simplify the map and third-party scripts while retaining the existing Google Analytics property.
- Keep GitHub Pages hosting and `https://devrel.codyfactory.eu`, with one production cutover after all phases pass validation.

## Agreed decisions and rationale

| Decision                                                   | Rationale                                                                                                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preserve and polish the current design                     | The user chose modernization rather than a broader redesign. Keep colors, typography, hero presentation, and remaining section order.             |
| Fully static Astro with `.astro` components                | The content is local and the interactions are small. A backend, SSR adapter, or hydrated React application adds no necessary capability.          |
| Keep UnoCSS; upgrade to Wind4                              | Existing utilities, theme shortcuts, and icon presets are used throughout the site. This minimizes rewriting while modernizing the CSS toolchain. |
| Scoped native CSS for specialized layouts and animation    | Gallery layout and hero animation are clearer as component-owned rules alongside shared theme tokens.                                             |
| Filter prerendered talks with plain TypeScript             | There are 44 talks at planning time. A search engine, client-side table model, and asynchronous index are unnecessary.                            |
| Search AND resource requirements AND any selected location | The user explicitly selected grouped filters. Search should narrow results; location choices within their group should be alternatives.           |
| Lazy OpenStreetMap iframe                                  | The user wants a simple embedded map with a marker. This removes local map libraries and the MapTiler API key.                                    |
| Astro image processing                                     | Replace handcrafted source sets and Vite image plugins with build-time responsive image generation.                                               |
| Native masonry with ordinary CSS Grid fallback             | The user accepts differing layouts across browsers and wants no JavaScript layout fallback.                                                       |
| Google Analytics only                                      | The user explicitly chose to retain GA and remove Insights, including its link tracking.                                                          |
| Remove the Twitter timeline                                | The user chose to remove the feed and widget script, retaining the profile link in Socials.                                                       |

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
- Keep XO, upgrading its configuration for Astro/TypeScript and Prettier's Astro plugin. Add `astro check`.
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

## Repository map and known issues at planning time

Paths below are relative to the repository root.

| Area             | Relevant files                                                                                                                                                                      | Notes                                                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Entry points     | `index.html`, `src/main.tsx`, `src/App.tsx`, `src/Home.tsx`                                                                                                                         | React mounts into an otherwise empty root; Home manually scrolls to the URL hash.                                                                      |
| Shared UI        | `src/Section.tsx`, `src/SectionTitle.tsx`, `src/Link.tsx`                                                                                                                           | Section/title markup uses generic divs; Link includes Insights tracking and console logging.                                                           |
| Hero             | `src/Hero.tsx`, `src/cover.module.css`, `src/images/reactsummit_closeup.jpeg`                                                                                                       | Handcrafted image sources; JPEG source incorrectly declares AVIF MIME type; hero alternative text is missing.                                          |
| Main content     | `src/About.tsx`, `src/Socials.tsx`, `src/ArticleList.tsx`, `src/Article.tsx`, `src/articles.ts`, `src/article-type.ts`                                                              | Xen logo alternative text incorrectly says NearForm. Date formatting currently depends on browser locale.                                              |
| Talks            | `src/talks/TalkList.tsx`, `src/talks/Search.tsx`, `src/talks/search-talks.ts`, `src/talks/ToggleFilter.tsx`, `src/talks/filters.ts`, `src/talks/talks.ts`, `src/talks/talk-type.ts` | Lyra plus React Table; OR composition broadens search; Europe means non-USA/non-`Virtual`, incorrectly including Japan and lowercase virtual entries.  |
| Gallery          | `src/Photos.tsx`, `src/gallery/`                                                                                                                                                    | Eight photos; filename suffixes encode big/portrait treatment; multiple glob imports and manual source-set assembly.                                   |
| Map              | `src/Location.tsx`, `src/Map.tsx`, `src/map.css`                                                                                                                                    | Lazy React wrapper, MapLibre, React Map GL, and MapTiler style URL.                                                                                    |
| Feed             | `src/Tweets.tsx`                                                                                                                                                                    | Injects Twitter's widget script.                                                                                                                       |
| Build and styles | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `.xo-config.cjs`, `.nvmrc`                                        | React 18/Vite 4-era tooling; UnoCSS configuration lives inside Vite config; Node 18 pin. Workspace config already permits esbuild/sharp build scripts. |
| Deployment       | `.github/workflows/ci-cd.yml`                                                                                                                                                       | Currently pnpm 8/Node 18; builds and publishes `dist` on pushes to main using `peaceiris/actions-gh-pages`; custom domain is configured here.          |

## Existing changes and implementation status

Planning introduced only this handoff. Phase 1 converted the application to Astro and Phase 2 replaced filtering and external services; see the implementation records below. No commit, push, merge, or deployment was performed during implementation.

Pre-existing working-tree state, rechecked when saving this document:

- Modified `src/Hero.tsx`: a `@ts-expect-error` comment was added above `fetchPriority="high"` for React typing. Preserve the intended high-priority hero loading when converting to Astro; the suppression itself will no longer be needed.
- Untracked `.anima/`: leave untouched.

### Progress record for subsequent chats

| Phase                             | Status           | Implementation notes and verification                                                                                                                 |
| --------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Static Astro foundation       | Complete locally | Astro/Wind4 foundation, 44 prerendered talks, 12 articles, eight gallery images; type/lint/format/build/static tests pass. See detailed record below. |
| 2 — Search and external services  | Complete locally | Static talk filtering, explicit regions, lazy OpenStreetMap embed, Insights/feed removal; eight tests and Chrome desktop/mobile checks pass.          |
| 3 — Images, gallery, and delivery | Not started      | Record browser matrix, image/performance comparison, final checks, and deployment readiness.                                                          |
| Production cutover                | Not performed    | Record actual deployment and smoke-check results only after they occur.                                                                               |

## Phase 1 implementation record — 2026-10-06

- The starting checkout was clean at `d7dd114`. The handoff's earlier Hero type suppression was no longer present; its high-priority intent is preserved as native `fetchpriority="high"`. `.anima/` was left untouched. No repository instructions requiring additional steps were found.
- Replaced the React/Vite entry points and section components with `.astro` components, `src/layouts/Document.astro`, and `src/pages/index.astro`. Removed hydration and manual hash scrolling. Talks and articles remain typed TypeScript data with unchanged values and order.
- Shared Section, SectionTitle, Link, and Article components now render semantic sections, headings, links, list items, and UTC `<time>` elements. Added visible focus, a keyboard skip link, responsive heading sizes, reduced-motion hero animation, corrected Xen logo text, meaningful gallery alternatives, canonical/description/social metadata, and intrinsic image dimensions.
- UnoCSS uses its Astro integration, Wind4 theme keys, one built-in reset, preserved theme colors/icon presets, explicit flag safelisting, and Bunny-hosted Roboto through a native stylesheet link. Animation and gallery rules are component-scoped.
- Selected runtime: **Node 24 LTS** (`24.16.0` used locally), **pnpm 10.23.0** pinned in package metadata and CI. Exact modern dependency versions: Astro **7.3.5**; UnoCSS and `@unocss/astro` **66.10.5**; `@astrojs/check` **0.9.10**; TypeScript **6.0.3**; XO **5.0.1**; `eslint-plugin-astro` **3.2.1**; `@typescript-eslint/parser` **8.71.1**; Prettier **3.9.9**; `prettier-plugin-astro` **1.1.0**. Icon collections resolve to circle-flags **1.2.12**, lucide **1.2.140**, mingcute **1.2.8**, and tabler **1.2.41**. The lockfile records all exact resolutions. TypeScript 7 was rejected by `astro check`; 6 is the compatible stable selection.
- The initial attempt with legacy XO crashed in `unicorn/expiring-todo-comments`. Following the user’s preference, upgraded to current XO with a flat config modeled on `mains-de-serenete/xo.config.mjs`, the Astro plugin, and Prettier compatibility instead of retaining the standalone ESLint setup. The standalone ESLint config and direct ESLint dependencies were removed. `.prettierrc.json` is the sole source of formatting settings; XO uses `prettier: 'compat'` so it does not override them. CI now runs check, lint, formatting, build, and static tests with a frozen lockfile and the selected runtime. Pull-request triggering/action-version updates remain for Phase 3; existing main-only deployment behavior and custom domain are preserved.
- Removed dependencies that no longer have consumers: React/React DOM and their types, React Table, Lyra, debounce, clsx, React icons, React Map GL, the Mapbox alias, old Uno presets/reset, Vite React/radar/image plugins and imagetools. GA initialization moved into the production-only document layout because the old Vite entry point was removed.

### Baseline and local validation

- Rebuilt the original React production output before conversion. Build passed, with a Bunny font fetch failure in the restricted sandbox and the existing large-map-chunk warning. Captured desktop (1440×900) and mobile (390×844) screenshots and a resource log in `/private/tmp/devrel-phase1-baseline/`; the preserved original output is its `dist/` subdirectory. Browser page-error logs were empty. Third-party requests prevented a network-idle wait, so capture used DOM readiness plus a bounded wait.
- Original build raw/gzip bytes measured with Python: main JS **273199/86902**, map JS **764014/205161**, main CSS **31900/6256**, map CSS **70458/9596**, HTML **747/491**. The first desktop browser resource log measured **343059 encoded** and **345459 transferred** local asset bytes, excluding the HTML document and external services. Mobile resource entries reused cache and are not a valid cold-transfer comparison.
- Phase 1 build raw/gzip bytes: HTML **71480/8824**, main CSS **32803/6689**, MapLibre JS **732546/191973**, MapLibre CSS **70312/9539**, Insights script **5437/2048**, bundler runtime **589/368**. These are file measurements, not a final loading-performance claim. Original images are temporarily larger than the old optimized output; Phase 3 must complete responsive image processing before cutover.
- `CI=true pnpm install --frozen-lockfile` passed. `pnpm check` passed with zero errors, warnings, or hints. `pnpm lint`, `pnpm format:check`, `pnpm build`, and `pnpm test` passed. The four static tests cover every talk/article and its resource links, source order and video states, metadata/anchors/gallery/hero markup, production icon CSS, and UTC date boundaries.
- Chrome desktop/mobile smoke checks with JavaScript disabled confirmed 44 talks, 12 articles, all ten page images (hero, logo, eight gallery photos), generated flags, no horizontal overflow, native hash navigation, and keyboard skip-link focus. Inspected hero and gallery screenshots. Reduced-motion rendering retains visible hero text. Browser scripts/screenshots/results are under the temporary baseline directory; they use the desktop's bundled Playwright and are not repository dependencies.

The README documents current development, content editing, and hosting. Migration phases and temporary implementation decisions belong in this handoff.

### Development-server follow-up

- Reproduced the reported compile-metadata error by requesting `/src/components/search/SearchDialog.astro?astro&type=script&index=0&lang.ts`. That component does not exist in this checkout and the current homepage never references it. A fresh browser loaded the actual page successfully; the evidence points to an old browser/module request rather than a compile failure for current components.
- Stopped the earlier agent-started production preview that occupied port 4321. Development now runs `astro dev --host`, reserving port 4321 with `vite.server.strictPort`; preview uses port 4322. This prevents an occupied port from silently directing development to a different origin and allows testing over the LAN/Tailscale address printed by Astro.
- The Twitter timeline returned HTTP 429 in the development browser. Its external widget is now production-only, preserving the profile link during development and the agreed Phase 2 removal. No exception was suppressed in the browser or server.
- Verified the exact `pnpm run dev` command in Chrome at 1440×900 via `http://localhost:4321/` and 390×844 via `http://100.116.77.100:4321/`. Both fresh loads and reloads passed with 44 talks, 12 articles, no error overlay, no horizontal overflow, zero browser/console errors, zero failed requests, and zero HTTP error responses. A reversible component edit and restoration verified hot updates. A cold request for the real `Map.astro` client script returned 200. Server logs showed successful homepage responses and no errors.
- Browser evidence: `/private/tmp/devrel-dev-verification.json`, `/private/tmp/devrel-dev-after-desktop.png`, and `/private/tmp/devrel-dev-after-mobile.png`. Type checks, XO, production build, and four static tests passed. The existing production MapLibre size warning remains for Phase 2 cleanup.

### Talk-column alignment follow-up

- The original Astro conversion gave each talk an independent grid, so intrinsic date/resource widths varied between talks. The parent `.talks` list now defines responsive column tracks; each `.talk` spans them and uses `grid-template-columns: subgrid`. Semantic list-item wrappers remain intact for Phase 2 filtering. No React/Table dependency is required.
- Chrome checks at 390, 640, 768, 1024, and 1440 pixels measured identical column starts across all visible talks, with no horizontal overflow. Repeated with half the talks hidden and only one talk visible; hidden wrappers occupied no space and alignment held. Evidence: `/private/tmp/devrel-talk-grid-verification.json` and `/private/tmp/devrel-talk-grid-*.png`. XO, production build, and four static tests passed.

- UnoCSS cleanup moved ordinary article layout, gallery columns/image sizing/rounding/aspect ratios, and talk resource flex styles into utilities. Scoped CSS retains the coordinated talk subgrid, gallery spans for future masonry enhancement, and hero animation. Browser geometry and computed styles matched the prior layout at 390, 640, 768, 1024, and 1440 pixels with no overflow; evidence is `/private/tmp/devrel-utilities-before.json` and `/private/tmp/devrel-utilities-after.json`. XO, formatting, build, and static tests passed.

### Intentional Phase 1 boundaries

- Search/filter controls are absent while all talks remain visible. Phase 2 should enhance each existing `.talk` list item with generated attributes and implement the agreed grouped filtering; no content should move back into client rendering.
- **MapLibre 2.4.0** and **Insights 1.2.11** remain necessary transitional dependencies. The map initializes from a native script with a useful no-JavaScript map link; replace `src/Map.astro` and remove `src/map.css` in Phase 2. Remove Insights initialization and delegated link tracking from `Document.astro`/`Link.astro` then. The Twitter widget remains in `Tweets.astro` until the agreed Phase 2 removal. The large MapLibre build warning remains expected for this phase.
- GA property **G-DMTB5F3X2D** now has one production-only initialization in the document layout; it requires no analytics plugin. Verify live requests and development exclusion during Phase 2.
- Hero/gallery use original imported images with accurate alternatives and dimensions, preserving current order and landscape/portrait/featured treatment. Phase 3 adds the typed manifest, optimized `Picture` output, responsive source selection, and Grid Lanes enhancement. No masonry polyfill or CMS was added.
- An additional smoke-test attempt using cached Firefox/WebKit binaries did not complete and was terminated. Those engines and actual Safari remain unverified; do not treat the attempt as a passing matrix.
- No deployment or production performance improvement is claimed. The full final Safari/Firefox/Chromium matrix, image optimization, service checks, and cutover readiness remain required by the later phases.

## Phase 2 implementation record — 2026-10-06

- Started from clean checkout `5a5cf4e`. Preserved the shared talk subgrid, all 44 talks and their ordering, 12 articles, hero loading, gallery, public anchors, and Twitter/X profile link. Only the agreed virtual-location capitalization changed existing talk content. No commit, push, merge, or deployment was performed.
- Added explicit `region` classification to every typed talk: Europe, USA, Asia, or Virtual. Japan is Asia; all ten virtual entries now display Virtual. Existing recording URL / `none` / absent meanings and historical Lyra/Orama talk titles remain intact.
- Each semantic talk list item receives build-generated normalized search text, region, and video/slides availability attributes. A small plain TypeScript script filters these existing elements with `hidden`. Search ignores case and accents, requires every whitespace-separated term, and searches conference, title, location, and UTC year. Resource selections intersect; location selections are alternatives; both groups intersect with search. There is no fetched index, client-rendered content, search library, or debounce dependency.
- Added a labelled search input, resource/location fieldsets, native toggle buttons with `aria-pressed`, a polite result count, empty state, and reset. The form remains hidden until initialization; without JavaScript every talk remains readable. The existing global `[hidden]` rule prevents grid layout from overriding hidden rows. Enter in search does not submit/navigate; Space toggles native buttons; reset clears the input and all selections.
- Replaced MapLibre with a lazy OpenStreetMap iframe centred on marker `45.916,6.133`, with a regional bounding box, descriptive title, intrinsic dimensions, reserved 315px height, visible contributor attribution, and independent external map link. Removed the MapTiler key and map-specific CSS. Verified the share/embed approach against the linked official OpenStreetMap documentation.
- Removed Insights initialization and link-tracking attributes/handlers, the Tweets component and Twitter widget, and the now-unused `insights-js` / `maplibre-gl` dependencies and their lockfile graph. GA retains its existing single production-only `G-DMTB5F3X2D` initialization. README now documents filters, region editing, and the current external services.

### Phase 2 validation and limits

- Node **24.16.0**, pnpm **10.23.0**. `pnpm check` passed with zero errors/warnings/hints; `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **eight** `pnpm test` cases passed. `CI=true pnpm install --offline --frozen-lockfile --store-dir /Users/cody/Library/pnpm/store` passed. The initial dependency-removal command encountered the sandbox’s different store configuration and unavailable registry DNS; rerunning against the existing store in offline mode removed only the obsolete graph successfully.
- Tests cover prerendered content/resources/order/video labels, production flags/metadata/anchors/hero, UTC dates, generated filter attributes, map/GA markup and old-service removal, case/accent and multi-term search across fields, blank/no-result queries, AND resources / OR locations / combined filters, coming-soon and unrecorded exclusion, Virtual normalization, Japan/Asia, and preserved Orama title search.
- **Chrome 154.0.8037.98** production checks at **1440×900** and **390×900** passed: all filters and reset, empty state, keyboard Space/Enter, selected-button state, aligned columns, hidden rows with zero layout rectangles, no horizontal overflow, and no page errors or failed requests. With JavaScript disabled, all 44 talks and 12 articles render, filter controls stay hidden, native `#talks` navigation and keyboard skip-link navigation work. Inspected desktop/mobile screenshots of controls and map; the live map showed the marker and regional framing with attribution, and reserved height measured 315px.
- Development reused the healthy existing port **4321** server. Chrome fresh loads and reloads at **1440×900** on localhost and **390×844** on the existing network URL passed, with no console/page errors, failed requests, or HTTP error responses. A reversible SectionTitle edit/restoration verified hot updates. GA scripts were absent in development. Production preview runs on **4322**.
- Production Chrome observed one GA config initialization and a 200 response for the live gtag script. No GA collect request was observed during the bounded localhost check, so analytics ingestion is not verified. The OpenStreetMap embed was not requested before scrolling; its page and tiles then returned 200 responses; no Insights, MapTiler, or Twitter-widget request occurred. Service-response details are in `/private/tmp/devrel-phase2/services.json`.
- Browser scripts, screenshots, and results are in `/private/tmp/devrel-phase2/`; development evidence remains `/private/tmp/devrel-dev-verification.json`. Sandbox browser launches initially aborted; approved local execution enabled Chrome checks. Cached Firefox/WebKit verification stalled and was stopped; **Firefox and actual Safari remain unverified**, with their final matrix still required in Phase 3.
- Reused Phase 1’s preserved visual/performance baseline in `/private/tmp/devrel-phase1-baseline/`. Phase 2 file sizes (raw/gzip bytes): HTML **76951/10736**, CSS **33359/6771**. The filter script is **1417 raw bytes**, inlined by Astro; there are no separate local JS assets or MapLibre/Insights bundles. These file measurements are not cold-transfer or loading-performance claims. Original hero/gallery image sizes remain the intentional Phase 3 limitation.

## Next step and cross-chat workflow

Start Phase 3 in the current checkout after inspecting the Phase 2 diff. Add Astro image processing, the typed gallery manifest and Grid Lanes enhancement, then complete delivery/CI documentation and the final browser/performance matrix. Filtering and the service replacements are complete; do not recreate them. Preserve `.anima/` and the high-priority hero. Do not deploy without an explicit request.

At each phase boundary, update the progress record with what changed, commands run and their results, unresolved issues, intentional temporary behavior, and the exact next step. Include a commit identifier if one was created; do not imply a commit or deployment occurred when it did not. Later chats should inspect the actual repository and completed work rather than restarting the migration.

Suggested request for the next chat: “Implement Phase 3 from `docs/MODERNIZATION_HANDOFF.md`. Preserve the static Astro foundation and Phase 2 filtering, complete image/gallery/delivery work, validate the final browser matrix, and update the handoff. Do not deploy.”

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
