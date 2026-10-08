# Astro modernization handoff

Prepared: 2026-10-06. Status: Phases 1–3 implemented and validated locally; production cutover awaits explicit authorization. No production cutover has occurred.

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

The original plan below is retained for migration history. The user-approved talk and article collection follow-ups recorded below supersede the TypeScript content-storage decisions. Talks use timestamp ordering; articles retain explicit curated ordering.

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
| 3 — Images, gallery, and delivery | Complete locally | Responsive AVIF/WebP/JPEG images, typed gallery, Grid Lanes, PR CI; Chrome/Firefox checks and native Safari gallery checks pass.                      |
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

## Phase 3 implementation record — 2026-10-06

- Started from clean checkout `91e5417`. Preserved all talks/articles, section order, public anchors, shared talk subgrid, high-priority hero, and existing image order/alternatives. `.anima/` was untouched. No commit, push, merge, or deployment was performed.
- Hero and gallery now use Astro `Picture` with five responsive width candidates per format, AVIF/WebP sources, JPEG fallback, intrinsic dimensions, and explicit `sizes`. Hero sizing accounts for its full-height cover crop; gallery sizing follows section padding/gaps and the main's 80rem maximum. Hero remains eager/high priority; gallery remains lazy/async. Gallery derivatives are cropped at build time to the existing landscape/portrait ratios; SVG logos remain SVG. Social-preview metadata now uses a processed 1200×630 JPEG.
- Added `src/gallery/gallery.ts`, a typed manifest with imported images, meaningful alternatives, order, aspect ratio, and featured status. Grid placement is applied to the `picture` wrappers. The one/two/four-column ordinary Grid preserves featured and portrait spans; `@supports (display: grid-lanes)` enhances the layout and resets row spans to `auto` while retaining the featured two-column span. No layout JavaScript was added.
- The initial optimized build exposed missing Sharp; added direct, exactly pinned **Sharp 0.35.5** and updated `pnpm-lock.yaml` using the existing offline store. Removed the obsolete MapLibre build-script exception from `pnpm-workspace.yaml`; esbuild/Sharp remain allowed. All other obsolete runtime/plugin packages had already been removed in Phases 1–2, so no further dependency replacements were needed.
- CI now validates pull requests as well as main pushes, uses checkout **7.0.1**, setup-node **7.0.0** with `.nvmrc`, and Pages action **4.1.0**. PR checks have read-only contents permission. A separate main-push-only deployment job downloads the validated `dist` artifact and has contents-write permission; the custom domain remains configured as `devrel.codyfactory.eu`. Astro's existing static/site/root-base configuration is retained. These workflow changes have been inspected locally; hosted GitHub Actions execution awaits a future push/PR.
- README now documents gallery additions, formats/loading, responsive layout maintenance, and PR validation/deployment. The generated-output test verifies every responsive candidate exists and has the actual AVIF/WebP/JPEG file signature, plus loading priorities and Grid Lanes/span CSS. This catches missing or mislabeled optimized outputs instead of merely accepting a successful build.

### Phase 3 validation and delivery measurements

- Node **24.16.0**, pnpm **10.23.0**. Offline frozen-lockfile install, `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **nine** tests pass. Type checking reports zero errors, warnings, or hints. The build generates **136 optimized image transforms** (45 AVIF, 45 WebP, 46 JPEG, including the social preview); no separate local browser JS bundle is emitted. The remaining untransformed JPEG is an unused imported original emitted by Astro, not requested by the page.
- **Chrome 154.0.8037.98** and **Firefox Nightly 151.0** passed production checks at **390×900**, **768×900**, and **1440×900**. Both exercised ordinary Grid (one/two/four columns), all eight loaded gallery images, AVIF source selection, no overflow, search normalization, reset, keyboard Space toggling, and hidden rows with no layout rectangles. JavaScript-disabled contexts verified all 44 talks and 12 articles, hidden filter controls, native anchors, and keyboard skip-link navigation. Reduced-motion contexts and hero/gallery screenshots were inspected. There were no page/console errors or HTTP error responses during these runs.
- **Actual Safari 26.6.2** was inspected through its native UI at a desktop window and Responsive Design Mode **390×844** and **1440×844** (desktop `innerWidth` measured 1439). Inspector measurements confirmed `display: grid-lanes`, four 278px desktop columns, featured `grid-column: span 2`, all eight row placements `auto`, all images loaded as AVIF, and no horizontal overflow. Inspected the desktop masonry and mobile single-column gallery crops/order. Safari's console showed no errors. Safari WebDriver remote automation is disabled; no security setting was changed. Safari checks were manual/native UI checks, not the automated no-JavaScript/filter suite run in Chrome/Firefox.
- The cached standalone WebKit engine stalled and was stopped; it is not recorded as a passing browser. Actual Safari supplies the enhanced-layout verification. The initial Chrome decode check attempted to decode lazy images before scrolling them into view; correcting the verification procedure to scroll each image produced passing checks without an application change.
- Development on port **4321** passed Chrome **1440×900** localhost and **390×844** network-URL checks: image decoding, reloads, no overlay/overflow/errors/failed requests/HTTP errors, no GA scripts, and a reversible component edit/restoration confirming hot updates. The initial sandboxed dev launch failed before readiness; approved execution started the prescribed server successfully. The pre-existing healthy production preview on **4322** was reused.
- Captured the Phase 2 output and screenshots immediately before implementation in `/private/tmp/devrel-phase3/before-dist/` and `before-*.png`. Fresh Chrome contexts at DPR 1, after loading hero plus all eight gallery photographs, measured image encoded/transferred bytes **11161119/11163819** before; **100000/102700** after at 1440px, and **143236/145936** after at 390px. The mobile hero deliberately selects a wider source to cover its tall viewport. These are local preview image-transfer measurements, excluding HTML, CSS, fonts, analytics, and map services; they do not establish production LCP or loading-time improvement. The older React baseline remains in `/private/tmp/devrel-phase1-baseline/` for historical comparison.
- Final generated HTML raw/gzip bytes: **89976/12374**; CSS: **33572/6809**. Browser evidence/scripts and before/after transfer logs are under `/private/tmp/devrel-phase3/`. Native Safari observations are in this chat's tool results. GA ingestion remains unverified on localhost as recorded in Phase 2; perform a live check after an explicitly authorized cutover.

### Filename-driven gallery follow-up — 2026-10-06

- At the user's request, replaced the manually curated photo imports/metadata with automatic build-time discovery of JPG/JPEG/PNG files directly in `src/gallery/`. `gallery.ts` still exports typed image records for the existing `Picture` rendering, but the records are derived entirely from filenames. No content collection or additional dependency was introduced.
- Filenames follow `number_lowercase-description[_big|_portrait].jpg` (also `.jpeg` and `.png`). Numeric order is positive and unique; leading zeros are optional. Description words use lowercase ASCII letters/digits separated by single hyphens. Hyphens become spaces and only the initial character is uppercased. Optional `_big` and `_portrait` preserve the existing featured/portrait treatment; the default remains landscape. Proper names/acronyms remain lowercase after the first character, an explicit user-accepted limitation.
- Renamed all eight original photos to meaningful descriptions in this format, retaining their bytes, source order, and modifiers. Filename parsing rejects malformed descriptions, casing, unknown modifiers, invalid order numbers, and duplicate numeric orders. Discovery includes case variants of supported extensions so invalid extension casing does not silently exclude a photo.
- Added parser coverage for numeric sorting, every supported extension, capitalization, optional modifiers, and invalid/duplicate names. Generated-output assertions now derive photo counts and expected alt-text order from source filenames, allowing additional photos without manually updating a fixed count. All **11** tests pass along with `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, and `pnpm build`.
- Reused healthy development **4321** and production preview **4322** servers. Chrome **154.0.8037.98** at **390×900** and **1440×900**, with JavaScript disabled, confirmed all eight photographs decoded, derived alt text matched numeric order, no horizontal overflow, and no console/page errors. A temporary ninth JPG added to the gallery appeared automatically through development hot updates with the expected alt text/portrait class and decoded successfully; removing it restored eight photos. The temporary fixture was removed. Browser evidence is `/private/tmp/devrel-phase3/filename-gallery.json` and `filename-gallery-*.png`. This follow-up did not repeat Firefox/Safari checks because layout/image generation behavior is unchanged; their Phase 3 results remain recorded above.

### Two-row gallery alignment — 2026-10-06

- At the user's request, portraits in the two/four-column gallery now match the height of two ordinary 4:3 photographs plus the intervening gap. Scoped CSS uses the gallery's inline-size container and the Wind4 spacing token to derive the responsive height. The featured two-column photograph uses the same height so ordinary Grid rows align consistently. Grid Lanes retains this sizing while resetting row spans; single-column image proportions remain unchanged. No layout JavaScript was added.
- `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, and all 13 tests passed. Reused development **4321** and preview **4322**. Chrome **154.0.8037.98** production checks with JavaScript disabled at **390**, **640**, **768**, **1024**, and **1440px** confirmed the two-photo height within one pixel, mobile proportions, eight decoded photographs, no overflow, and no console/page errors. Inspected mobile/tablet/desktop screenshots. The development server also returned the expected desktop heights. Evidence is `/private/tmp/gallery-height-results.json` and `/private/tmp/gallery-height-Chrome-*.png`.
- Actual Safari's desktop gallery was visually checked through its native UI; portrait and featured edges align with the ordinary photographs. Safari mobile was not repeated. Firefox launch stalled, so no new Firefox verification is claimed. No push or deployment was performed.
- README documents the drop-and-go convention and validation. No commit, push, merge, or deployment occurred.

### Talk content collection follow-up — 2026-10-06

- At the user's request, moved all 44 talks from `src/talks/talks.ts` to individual Markdown files in `src/content/talks/`. Entries contain YAML frontmatter with empty bodies. All metadata, timestamps, URLs, regions, and recording states were compared against a pre-migration snapshot and match exactly. Articles remain unchanged in TypeScript.
- Registered the build-time collection in `src/content.config.ts` using Astro's built-in `glob()` loader. `src/talks/talk-schema.ts` validates required fields, explicit-time-zone timestamps (minute or second precision), regions, resource URLs, and flag class shape, and rejects unknown fields. URL/`none`/omitted video meanings are preserved. The redundant manual Talk type and array were removed; collection types derive from the schema.
- The user explicitly chose descending full-timestamp ordering, including future talks, with entry ID ascending for identical timestamps. `src/talks/sort-talks.ts` supplies that ordering without mutating the input. This changes the position of 13 existing records compared with the previous source order. Filenames provide stable entry IDs; no manual order field is required.
- `TalkList.astro` queries the collection at build time and retains the existing semantic rows, shared subgrid, search attributes, and progressive filtering script. Markdown bodies are not displayed and no individual talk routes were added. UnoCSS now scans Markdown for content-owned flag classes; generated-output tests verify every flag remains in production CSS.
- Adapted filter/output tests to read and validate Markdown entries, and added meaningful schema and timestamp-ordering coverage. Pinned `js-yaml` **4.3.2** as a direct dev dependency for the test reader (already present transitively through Astro), with the lockfile updated. README documents authoring and ordering; AGENTS.md records the new durable convention.
- Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **13** tests pass. `git diff --check` passes. The production output still contains every talk and article without JavaScript.
- **Chrome 154.0.8037.98** passed development **4321** and production preview **4322** checks at **390×900** and **1440×900**: newest-first timestamps, desktop column alignment, accent-normalized search, keyboard Space toggling, intersecting resource filters, reset, hidden rows with zero layout rectangles, no horizontal overflow, and no console/page errors. JavaScript-disabled contexts confirmed 44 readable talks, 12 articles, hidden filter controls, native anchors, and keyboard skip-link navigation. Desktop/mobile talk screenshots were inspected. Firefox/Safari were not rerun for this data-storage change.
- Introducing the collection into the already running development process initially returned an empty collection, including after a configuration-file refresh. Restarting this repository's development server on the prescribed **4321** resolved it. A temporary future-talk Markdown file then appeared automatically as the first of 45 entries through hot updates; removing it restored 44. The fixture was removed. The existing production preview on **4322** was reused. Browser evidence and scripts are under `/private/tmp/devrel-talk-collection/`; the original metadata snapshot is `/private/tmp/devrel-talks-before.json`.
- No commit, push, merge, or deployment occurred in this follow-up. Production cutover remains a separate explicitly authorized step.

## Content and presentation follow-up plan — 2026-10-06

The user requested that the following recommendations become a plan to tackle one at a time. Items 1–4, 6, and 9 are complete; items 5, 7, and 8 remain pending. These follow-ups build on the completed Astro migration and preserve the existing visual identity, section order, static rendering, accessibility, and public anchors. They do not reopen Phases 1–3 or authorize production deployment.

Suggested starting order: **1, 2, 3, 6**, followed by the remaining items as priorities allow. Use the stable item numbers below when requesting work in another chat. Item 9 should follow the final bio positioning; item 5 should reuse that bio. A separate speaking page remains an option, not a settled architecture decision.

- [x] **1. Refresh the bio around the current Xen role.**
  - Update `src/About.astro` to lead with Xen Project community leadership, contributor engagement, and open-source virtualization. Present software engineering, developer relations, and teaching as supporting experience.
  - Confirm whether consulting and FINOS ambassador remain active roles before retaining them as current titles. Verify the teaching affiliations before publishing the draft below.
  - Done when the role headings and bio agree, current affiliations are accurate, and the copy explains what Cody does rather than only listing titles.
- [x] **2. Add a clear introduction and actions to the hero.**
  - Update `src/Hero.astro` with a concise role line, initially proposed as “Open-source community builder · Xen Project Community Manager · Speaker & educator.”
  - Add “Explore my talks” and “Get in touch” links using native anchors to `#talks` and `#socials` initially. Preserve high-priority image loading and reduced-motion behavior.
  - Done when the introduction and actions are readable and keyboard accessible on mobile and desktop, including without JavaScript.
- [x] **3. Bring recent writing into the article list.**
  - Review the [Xen Project author archive](https://xenproject.org/blog/author/cody/) for relevant newer articles, including release, FOSDEM, and automotive coverage. The current local list ends in October 2022.
  - Verify each selected article's title, publication date, authorship, and canonical URL before adding it to `src/articles.ts`. Preserve existing entries and their relative source order; curate new entries explicitly rather than adding automatic sorting.
  - Done when selected current writing is visible alongside the existing archive with verified links and UTC-formatted dates.
- [x] **4. Feature representative talks within the speaking section.**
  - Select two or three highlights, with the Xen weather report, virtualization architecture, and functional safety as initial candidates. Add a short description explaining each talk's subject and available resources.
  - Reuse the talk collection as the source of existing metadata. Keep the complete archive, its timestamp ordering, filters, and shared column layout intact.
  - Follow the placement, presentation, and content model in “Item 4 preparation” below. Item 4 is implemented; see its implementation record below.
  - Done when visitors can quickly find representative work before browsing the full archive and highlights remain readable without JavaScript.
- [ ] **5. Make speaking inquiries easier.**
  - Provide a clear contact route and a compact speaker kit containing short and long bios, an approved downloadable headshot, speaking topics, and a representative recording.
  - Choose an existing contact destination or obtain the user's preferred public contact details. Decide whether the kit fits the homepage or warrants an optional `/speaking` page using the shared document layout.
  - Done when an organizer can find contact details and reusable speaker materials without assembling them from the talk archive.
- [x] **6. Refresh social destinations and labels.**
  - In `src/Socials.astro`, relabel the existing generic “Blog” link as “Nearform articles” and add “Xen Project articles.” Review which other profiles Cody actively uses before changing their prominence or removing them.
  - Done when labels accurately describe their destinations, the existing archive links are preserved, and the current writing destination is easy to find.
- [ ] **7. Polish readability and section navigation.**
  - Add simple native section navigation, left-align the currently justified bio, and tighten labels: “Based in” instead of “Based from” and “Talks & recordings” instead of “Speaking engagements and videos.”
  - Preserve colors, photography, section order, semantic headings, skip-link behavior, and public anchors. Coordinate navigation with the hero actions from item 2.
  - Done when mobile and desktop navigation works with keyboard and without JavaScript, with no overflow or obscured anchor targets.
- [ ] **8. Make recording and upcoming status explicit.**
  - Replace the blanket “Coming soon” label for missing video URLs with an explicit, validated recording status. Audit existing entries before promising future recordings; distinguish unavailable, not recorded, and expected recordings as appropriate.
  - Update the talk schema, rendering, and meaningful tests together. Keep video-resource filters restricted to actual recordings. Use “Upcoming” only for future engagements; account for static build timing so date labels do not silently become stale.
  - Done when historical talks no longer imply an unverified forthcoming recording, future-event labels are accurate, and filters and no-JavaScript reading still work.
- [x] **9. Align search and sharing presentation with the bio.**
  - After item 1, update the title, description, and Open Graph/Twitter metadata in `src/layouts/Document.astro` to reflect the same positioning.
  - Create a dedicated social-sharing image with Cody's name and current role, using approved imagery and readable typography. Preserve canonical URLs and meaningful image alternatives.
  - Done when generated metadata and the sharing image consistently describe the current role and use valid absolute production URLs.

### Item 4 preparation — 2026-10-08

Preparation saved before implementation. The implementation and verification record below now completes this item.

#### Placement and presentation

- Place three representative talk cards inside the existing `#talks` section in `src/talks/TalkList.astro`, immediately after its introduction and before the search and filters. Preserve the homepage section order and current section title; the broader heading rename belongs to item 7.
- Introduce the cards with “Selected talks to start with.” Follow them with “All speaking engagements,” then the existing filters and complete chronological archive. Adjust the section subtitle so its description of the full archive appears with that archive rather than introducing only the highlights.
- Use three equal-width cards on desktop and a single stacked column on mobile. Keep the existing black background, white titles, gray supporting text, and green links. Use a subtle border and comfortable padding, with no thumbnails initially. Reuse the shared section, heading, and link components where applicable, with semantic heading levels for the groups and talk titles.
- Each card contains the full talk title as its main heading, conference and year as quieter context, a roughly 25–40-word description explaining the subject and what someone will learn, and links to available resources. Format dates through the existing English/UTC helper when displaying dates.
- Highlights remain visible when visitors filter the archive. The selected entries also remain in the complete archive at their normal timestamp positions. Display descriptions only in the cards so the archive stays compact; preserve its semantic wrappers and shared column subgrid.
- Render all highlight content at build time, readable without JavaScript. Use ordinary links to the existing resources and show only available resource links in the cards. Do not add a speculative recording promise for the functional-safety talk; the archive's broader recording-status audit remains item 8.

#### Selected candidates and provisional copy

The following descriptions were drafted from the existing titles, not verified against the presentations. Check the linked slides, recordings, or official abstracts before publishing, and revise the descriptions to match the actual content. Resource availability below reflects the local collection at preparation time; verify destinations during implementation.

| Talk                                                                                                                       | Provisional description                                                                                                                                   | Existing resources   |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Xen 2026 Weather Report — Xen Summit 2026                                                                                  | An overview of the Xen Project’s direction, recent progress, and community priorities. A starting point for people who want the broader project picture.  | Recording and slides |
| Hypervisor Hierarchy: Why Architecture Matters for Performance, Security, and Flexibility — Open Source Summit Europe 2025 | How hypervisor architecture shapes performance, security, and flexibility—and why those tradeoffs matter when choosing a virtualization approach.         | Recording and slides |
| Preparing Xen for Functional Safety: Lessons From a Mature Open Source Project — AGL All Member Meeting Europe 2026        | Lessons from preparing an established open-source project for functional safety, connecting Xen’s development practices with safety-related requirements. | Slides               |

#### Content model and implementation checks

- Store the description and selection alongside each talk in its existing Markdown entry under `src/content/talks/`. Add optional `highlightOrder` and `description` frontmatter fields to `src/talks/talk-schema.ts`; require a nonblank description for highlighted entries and validate highlight order as a positive integer. Markdown bodies are not currently rendered and need not become the description source.
- Curate highlight order independently of the archive: Weather Report, Hypervisor Hierarchy, then Functional Safety. Sort highlights by `highlightOrder` ascending with entry ID ascending for ties. Continue sorting the complete archive by full timestamp descending with entry ID ascending for ties.
- Reuse each selected collection entry's existing title (`name`), conference, date, and resource URLs. Do not duplicate those values in a separate highlight dataset. A small Astro card component may be extracted from `TalkList.astro` if useful; no browser runtime or dependency is needed.
- Update README authoring guidance and relevant schema/generated-output tests. Verify highlight selection and ordering, required descriptions, resource links, unchanged archive ordering/count, and filtering that affects only archive rows.
- Run `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm test`. Check development and production previews at mobile and desktop widths, including no-JavaScript reading, native `#talks` navigation, keyboard focus, long-title wrapping, archive column alignment, hidden rows occupying no space, and console errors. Record which browsers were actually checked.
- After implementation, add the implementation and verification record here and mark item 4 complete only when its acceptance criteria pass. This preparation does not authorize deployment or mark the feature implemented.

### Original working bio draft for item 1

This historical draft was superseded by the user-approved copy recorded below. It retained the teaching affiliations from the existing site, subject to verification.

> I’m Cody Zuschlag, Community Manager for the Xen Project, an international speaker, and a university instructor based in Annecy, France. I help developers, contributors, and organizations connect and collaborate around open-source virtualization.
>
> My background spans software engineering, developer relations, and teaching. Today, my work focuses on supporting the Xen community, welcoming contributors, and making complex technology approachable. I speak about open-source communities and virtualization, including Xen’s role in cloud, embedded, and automotive systems, and teach web development at IUT Annecy and Tetras.

Role context was checked during planning against the [Xen author profile](https://xenproject.org/blog/author/cody/) and [community-manager introduction](https://xenproject.org/blog/lets-grow-xen-together/). Recheck current affiliations when implementing; these sources do not establish that consulting or FINOS roles have ended.

### Follow-up validation and progress records

For each implemented item, mark its checkbox complete and append an implementation record with changed files, decisions, validation results, remaining limitations, and the next item. Run `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm test` for application changes. For layout or interaction changes, verify mobile and desktop browser behavior, no-JavaScript reading, native anchors, keyboard access, and console errors as relevant; report the browsers actually checked. Documentation-only updates require formatting validation.

Planning record: added all nine recommendations, suggested order, completion criteria, source references, and the working bio draft. No application code, content, or deployment state changed.

### Item 1 implementation — 2026-10-06

- Updated `src/About.astro` with the two-paragraph first-person bio approved by the user. It leads with the Xen role, names software engineering, developer relations, developer advocacy, and teaching experience, and demonstrates dedication to open source through events, contributor/partner collaboration, and technical communication. No long dashes appear in the bio.
- Reordered the role lines to Community Manager at Xen Project, International Speaker, and Educator. Omitted unconfirmed current consulting, FINOS, and named teaching affiliations rather than carrying those titles forward. This does not establish that those affiliations have ended; they can be restored after confirmation. The Xen links, logo, section structure, justified text alignment, and visual identity remain; broader readability changes belong to item 7.
- Responsibilities were informed by the accessible chats `Xen Accomplishment Log`, `Bosch Meeting Notes`, and `Prepare Safety Talk`, then distilled into the approved copy. AI-generated accomplishment summaries were used for broad themes, without importing their metrics or individual achievement claims.
- Validation passed with Node **24.16.0** and pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and `pnpm test` (**13/13**). No new tests were added for this copy change.
- Chrome **154.0.8037.98**, at **390×900** and **1440×900**, verified both development **4321** and production preview **4322** with JavaScript disabled. The bio renders as two readable paragraphs, the Xen logo decodes, there is no horizontal overflow, skip-link/main keyboard focus and the Xen link work, and `#talks`, `#articles`, and `#socials` resolve. No console/page errors were observed. Production screenshots were visually inspected; evidence is `/private/tmp/devrel-bio/results.json` and `about-*.png`. Firefox and Safari were not rechecked for this content change. Started the development server on 4321 because none was running and reused the existing preview server on 4322.
- Updated this handoff to mark item 1 complete. No commit, push, merge, or deployment occurred. Next suggested content step: item 2, the hero introduction and native actions; item 9 remains a separate metadata/sharing task.

### Item 2 implementation — 2026-10-06

- Updated `src/Hero.astro` with the proposed role line: “Open-source community builder · Xen Project Community Manager · Speaker & educator.” Added “Explore my talks” and “Get in touch” through the shared `Link.astro` component, using native `#talks` and `#socials` anchors in a labelled navigation landmark. No JavaScript was added.
- Kept the photograph, responsive image sources, eager/high-priority hero loading, name animation, and reduced-motion rules. Darkened the image overlay for text contrast and used a bounded, padded content group with balanced text wrapping and wrapping actions. A 32rem minimum hero height keeps the introduction and actions inside the photograph on short landscape screens.
- Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **13** tests passed. No new repository tests were added for this small presentation change.
- Reused the healthy development **4321** and production preview **4322** servers. Chrome **154.0.8037.98** checked both at **390×900**, **1440×900**, **320×568**, and **844×390** with JavaScript disabled and reduced motion enabled. Verified readable hero content, decoded imagery, loading priority, visible keyboard focus, keyboard activation of both native actions, resolved section anchors, contained links, no horizontal overflow, and no console/page errors. Standard motion still uses the existing name animation. Production mobile/desktop screenshots were visually inspected. Firefox and Safari were not checked for this follow-up. Browser evidence is `/private/tmp/devrel-hero/results.json` and `hero-*.png`.
- Marked item 2 complete. No commit, push, merge, or deployment occurred. Next suggested step: item 3, recent writing; item 7 remains the separate broader navigation/readability task.

### Role wording refinement — 2026-10-06

- At the user's request, made the spaces on both sides of `@` explicit in the About role line and replaced “Educator” with “University instructor.” Updated the first bio paragraph and hero introduction to use the same wording. No named teaching affiliations were added.
- `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **13** tests passed. Chrome **154.0.8037.98** checked development **4321** and production preview **4322**, without JavaScript, at **390×900**, **1440×900**, **320×568**, and **844×390**. Confirmed rendered role spacing and wording, hero containment, keyboard actions, reduced motion, no overflow, and no console/page errors. Firefox and Safari were not rechecked. Evidence remains under `/private/tmp/devrel-hero/`. No commit or deployment occurred; item 3 remains next.

### Item 3 implementation — 2026-10-06

- Prepended seven Xen Project posts to `src/articles.ts`, explicitly curated in newest-first order: Xen 4.22, FOSDEM 2026, OSS Japan 2025 automotive coverage, Open CI, Xen Summit 2025, the community-manager introduction, and Xen 4.20. All 12 existing entries, dates, URLs, and relative source order remain unchanged. The list now contains 19 articles; no automatic sorting, fetching, component changes, or additional runtime was introduced.
- Checked the [Cody author archive](https://xenproject.org/blog/author/cody/) and each article page. Every destination returned HTTP 200, its canonical URL matched the selected URL, and its structured data identified Cody Zuschlag as author. Used visible article headings, preserving punctuation and the two existing tool emojis; the release pages have different SEO headlines. Stored exact `datePublished` UTC timestamps, rendered through the existing English/UTC `formatDate` helper.

| Selected source                                                                                                                     | Published (UTC)  |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| [Xen 4.22](https://xenproject.org/blog/xen-4-22-release/)                                                                           | 5 August 2026    |
| [FOSDEM](https://xenproject.org/blog/xen-at-fosdem-real-world-conversations-about-xen-and-kvm/)                                     | 4 February 2026  |
| [OSS Japan automotive coverage](https://xenproject.org/blog/oss-japan-2025-a-breakthrough-year-for-open-automotive-innovation/)     | 16 December 2025 |
| [Engineering Trust / Open CI](https://xenproject.org/blog/engineering-trust-how-xens-open-ci-powers-global-hardware-level-testing/) | 10 July 2025     |
| [Xen Summit](https://xenproject.org/blog/xen-summit-2025-find-your-place-in-the-future-of-virtualization/)                          | 27 June 2025     |
| [Let’s Grow Xen Together!](https://xenproject.org/blog/lets-grow-xen-together/)                                                     | 18 March 2025    |
| [Xen 4.20](https://xenproject.org/blog/xen-project-4-20-oss-virtualization/)                                                        | 11 March 2025    |

- Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **13** existing tests passed. Existing generated-output coverage checks every article's title, URL, and formatted date; no new repository tests were needed for this content addition. `git diff --check` passed.
- Reused healthy development **4321** and production preview **4322** servers. Chrome **154.0.8037.98** checked both at **390×900** and **1440×900** with JavaScript disabled: all 19 rows remain readable and in source order, exact links and UTC dates match, `#articles` resolves, keyboard Tab reaches article links with visible focus, no horizontal overflow, and no console/page errors. Production screenshots were visually inspected. Firefox and Safari were not rechecked for this content addition. Source metadata, browser results, scripts, and screenshots are under `/private/tmp/devrel-articles/`.
- Marked item 3 complete. No commit, push, merge, or deployment occurred. Next suggested step: item 6, accurate social destination labels and the Xen writing link; item 4 remains available for representative talk highlights.

### Article content collection follow-up — 2026-10-06

- At the user's request, moved all 19 articles, including the seven item 3 additions, from `src/articles.ts` into individual Markdown entries in `src/content/articles/`. YAML frontmatter stores `title`, `url`, the original quoted `date`, and a positive integer `order`; bodies are empty and not rendered. Compared every title, URL, timestamp, and position against `/private/tmp/devrel-articles/before-collection.json`: all match exactly.
- Registered the build-time `articles` collection with Astro's existing `glob()` loader. `src/articles/article-schema.ts` validates nonblank titles, HTTP(S) URLs, timestamps with explicit time zones (minute/second/fraction precision), and positive integer ordering, rejecting unknown fields. `src/articles/sort-articles.ts` orders by `order` ascending with entry ID ascending for ties, without mutating inputs or using publication date. Initial orders are 10–190 in increments of ten to allow insertions.
- `ArticleList.astro` now reads the collection at build time and passes schema-derived metadata to the existing `Article.astro` component. Removed the obsolete article array and manual type. External destinations, English/UTC date formatting, semantic list markup, section anchor, presentation, and JavaScript-free reading remain unchanged. No article routes, runtime fetching, or dependencies were added.
- Added schema and curated-order tests, adapted generated-output tests to validate Markdown metadata and article sequence, and updated README and AGENTS.md authoring guidance. This storage follow-up supersedes the historical instructions to edit `src/articles.ts`; item 3 remains complete.
- Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **15** tests passed. `git diff --check` passed.
- Reused development **4321** and production preview **4322**. Chrome **154.0.8037.98** verified both at **390×900** and **1440×900** with JavaScript disabled: 19 readable articles in the preserved order, matching links and UTC dates, native `#articles`, visible keyboard focus, no overflow, and no console/page errors. Production screenshots were visually inspected. A temporary older article with `order: 5` appeared first via development hot updates; removing it restored 19 entries. The fixture was removed. Firefox and Safari were not rechecked. Browser evidence and migration snapshot are under `/private/tmp/devrel-articles/`.
- No commit, push, merge, or deployment occurred. Next suggested content step remains item 6; item 4 is available for representative talk highlights.

### Item 6 implementation — 2026-10-07

- Updated `src/Socials.astro` to label the existing Nearform author archive “Nearform articles” and add “Xen Project articles,” pointing to the [Cody author archive](https://xenproject.org/blog/author/cody/). Reused the shared link component and existing newspaper icon. All five existing destinations remain. At the user’s request, placed Xen Project articles before Medium and Nearform articles, then moved GitHub before X because Cody rarely posts on X now. That iteration ordered the links as LinkedIn, GitHub, X, Xen Project articles, Medium, and Nearform articles. The destination and layout refinement below supersedes it. No runtime or dependencies were added.
- Reviewed the public destinations before considering profile changes. The Xen archive shows current writing, GitHub identifies Cody and links to the existing X and LinkedIn destinations, and Medium still exposes the author profile. Browsing could not retrieve Nearform, X, or LinkedIn directly, and the available profile snapshots do not establish current usage. No profiles were removed based on that incomplete evidence; the Nearform archive URL is preserved as instructed.
- Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **15** tests passed. No new repository tests were added for this small link and label change.
- Reused healthy development **4321** and production preview **4322** servers. Chrome **154.0.8037.98** checked both at **390×900** and **1440×900** with JavaScript disabled: all six labels and exact URLs match, links remain contained, `#socials` resolves, keyboard Tab reaches the next social link with visible focus, and there is no horizontal overflow or console/page error. Production screenshots were visually inspected. Firefox and Safari were not rechecked. Browser evidence is `/private/tmp/devrel-socials/results.json` and `socials-*.png`.
- At the user’s request, replaced width-driven flex wrapping with an intentional UnoCSS grid: one column below 640px, two from 640px, and three from 1024px. The desktop rows separate profiles from writing destinations. Added consistent vertical spacing, smaller typography below 1280px, and semantic list markup with `role="list"` to preserve list semantics with the reset. Existing link components, icons, colors, labels, URLs, and approved order remain.
- Revalidated the grid with all five required commands and **15/15** tests. Chrome **154.0.8037.98** checked development and production preview at **320**, **390**, **640**, **1024**, and **1440px** widths (900px height), without JavaScript. Confirmed one/two/three aligned columns, all link labels and URLs, native anchor access, sequential keyboard focus through every link, no horizontal overflow, and no console/page errors. Visually inspected production mobile, tablet, and desktop screenshots. Firefox and Safari were not rechecked. Evidence remains under `/private/tmp/devrel-socials/`.
- Marked item 6 complete. No commit, push, merge, or deployment occurred. Next suggested content step: item 4, representative talk highlights; item 7 remains available for broader readability and native section navigation.

### Social destination refinement — 2026-10-07

- The user reported that the Nearform author archive no longer works. Checked its redirect chain: `www.nearform.com/author/cody-zuschlag/` redirects through the bare domain to the general `/insights/` listing, returning HTTP 200 but no longer identifying Cody’s articles. A representative individual Nearform article still redirects to its own `/insights/` article. The earlier lookup limitation did not establish destination correctness.
- Reworked `src/Socials.astro` into two labelled groups under the existing Socials heading and anchor: “Connect” (LinkedIn, GitHub, X) and “Read my work” (Xen Project articles, Medium, Article archive). Replaced the misleading Nearform author destination with native `#articles`, retaining every individual Nearform article in the curated article collection. Rechecked the Xen author archive and Medium profile. Short platform labels clarify the former handle-only links; GitHub remains before X.
- Chrome **154.0.8037.98** verified development **4321** and preview **4322** at **320**, **390**, **640**, **1024**, and **1440px** widths with JavaScript disabled: group alignment, labels and URLs, all keyboard focus stops, keyboard activation of `#articles`, native `#socials`, no overflow, and no console/page errors passed. Production mobile and desktop screenshots were visually inspected. Firefox and Safari were not checked. Evidence is under `/private/tmp/devrel-socials/`.
- Groups sit side by side from 768px and stack on smaller screens. Each uses a semantic list with consistent spacing, existing shared links, colors, and icons. No client JavaScript or dependencies were added.
- `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **15** tests passed with Node **24.16.0** and pnpm **10.23.0**. No deployment or commit occurred.

### Item 9 implementation — 2026-10-07

- Updated `src/layouts/Document.astro` to lead the title with Cody's Xen Project Community Manager role. The shared search/Open Graph/Twitter description names the international speaker and university instructor roles and explains the open-source virtualization focus from the approved bio. Canonical and Open Graph page URLs remain `https://devrel.codyfactory.eu/`.
- Created `public/social-sharing.jpg`, a dedicated **1200×630** JPEG (**57,379 bytes**) combining the existing approved React Summit hero photograph with Cody's name, current Xen role, community-building focus, supporting roles, and site address. White and green typography on black uses the site palette. Both sharing formats reference the absolute production image URL and describe the photograph and card text through meaningful image alternatives. Open Graph also includes MIME type and intrinsic dimensions.
- Added `scripts/generate-social-image.mjs` and `pnpm generate:social-image` for future edits. Sharp composites the cropped existing photograph and SVG typography, taking colors from `uno.config.ts`; the committed JPEG is copied from `public/` during builds. README documents regeneration. No dependencies, browser runtime, or page layout changes were introduced.
- Added generated-output coverage for matching titles/descriptions, role positioning, absolute canonical/image URLs, matching image alternatives, and the actual JPEG's format and dimensions. Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **16** tests passed. `git diff --check` passed.
- Reused healthy development **4321** and production preview **4322** servers. Chrome **154.0.8037.98** checked both at **390×900** and **1440×900** with JavaScript disabled: matching metadata, preserved canonical URLs, image HTTP 200 with JPEG MIME type and decoded 1200×630 dimensions, all 44 talks and 19 articles, hidden inactive filter controls, keyboard skip link, native section anchors, no horizontal overflow, and no homepage console/page errors. Visually inspected the full card and mobile browser preview. Evidence is `/private/tmp/devrel-sharing/results.json` and `card-*.png`. Direct image-document navigation causes Chrome to request the absent `/favicon.ico`; the site itself declares `/favicon.svg` and the HTML card preview uses it. Firefox and Safari were not checked. Live search indexing and social-platform previews await deployment and crawler refresh; localhost validation does not establish those results.
- Marked item 9 complete. No commit, push, merge, or deployment occurred. Next suggested content step remains item 4, representative talk highlights; items 5, 7, and 8 also remain pending.

### Item 4 implementation — 2026-10-08

- Added three static cards in `src/talks/TalkList.astro`, before the existing filters and complete archive: Weather Report, Hypervisor Hierarchy, then Functional Safety. The cards use `TalkHighlight.astro`, shared links, white headings, gray supporting copy, green resources, subtle borders, and UnoCSS utilities. They form three equal columns from 1024px and stack below that width. Preserved the section title, `#talks`, homepage section order, archive subgrid, and all 44 entries in their timestamp order. Group headings introduce “Selected talks to start with” and “All speaking engagements”; the archive subtitle now accompanies the archive.
- Stored `highlightOrder` and `description` in the three existing Markdown entries. The schema requires positive integer highlight order and a nonblank description for selected entries. `sort-talk-highlights.ts` selects and sorts by curated order with entry ID ties, independently of archive chronology. Titles, conferences, dates, and resource URLs come from those same collection entries. Descriptions appear only in the cards; the existing archive script continues filtering only `.talk` rows. No browser runtime or dependencies were added.
- Read all three linked slide decks before replacing the provisional descriptions. The [Weather Report slides](https://hosted-files.sched.co/xensummit2026/8d/2026%20Xen%20Weather%20Report.pdf) support the release/support-policy, safety, automotive, onboarding, and documentation summary. The [Hypervisor Hierarchy slides](https://docs.google.com/presentation/d/1TRZcdrXjNVTtSf5tDoNeyLhcnnHH__GcVoHLljY-So0/edit?usp=sharing) support the traffic analogy, architecture tradeoffs, and dom0/dom0less workload summary. The [Functional Safety slides](https://hosted-files.sched.co/aglammeu2026/03/Preparing%20Xen%20for%20Functional%20Safety%20-%20Lessons%20Learned.pdf) support the requirements, architecture, tests, maintained evidence, and shared upstream work summary. All slide downloads succeeded; both existing recording destinations returned matching talk titles. Cards link only to available resources, with no recording promise for Functional Safety. The archive recording-status audit remains item 8.
- Updated README authoring guidance and schema/generated-output tests for selection, description requirements, independent ordering, resource links, descriptions confined to cards, and the unchanged archive count/order. Node **24.16.0**, pnpm **10.23.0**: `pnpm check` (zero diagnostics), `pnpm lint`, `pnpm format:check`, `pnpm build`, and all **19** tests passed. `git diff --check` passed.
- Chrome **154.0.8037.98** checked development **4321** and production preview **4322** at **390×900** and **1440×900**, with and without JavaScript. Verified three cards, stacked/equal-column layouts, long-title wrapping, available links, visible keyboard focus and sequential Tab navigation, native `#talks`, all 44 archive rows, desktop archive column alignment, no overflow, and no console/page errors. No-result and combined resource filters leave all cards visible and give hidden archive rows zero height; reset restores the archive. Production mobile and desktop screenshots were visually inspected. Firefox and Safari were not checked. Browser results, screenshots, source decks, and verification scripts are under `/private/tmp/devrel-highlights/`.
- Reused production preview. The existing development process served updated component markup but cached collection entries without the new schema fields; touching the entries did not refresh them. Restarted this repository’s development server on **4321** using `pnpm dev`, which restored the three cards. A reversible description edit and restoration then passed hot-update checks in Chrome; the fixture text was removed.
- Marked item 4 complete. No commit, push, merge, or deployment occurred. Items 5, 7, and 8 remain pending; the next suggested step is item 5, speaking inquiries and speaker materials. Production cutover remains separately authorized.

## Next step and cross-chat workflow

Phases 1–3 are implemented locally. Review the current diff and the Phase 3 validation limits below before production cutover. Filtering and external services are complete; do not recreate them. Preserve `.anima/` and high-priority hero loading. Deployment requires an explicit request; no push, merge, or deployment has occurred.

At each phase boundary, update the progress record with what changed, commands run and their results, unresolved issues, intentional temporary behavior, and the exact next step. Include a commit identifier if one was created; do not imply a commit or deployment occurred when it did not. Later chats should inspect the actual repository and completed work rather than restarting the migration.

Next suggested content step: tackle follow-up item 5 (speaking inquiries and speaker materials), or select pending item 7 or 8 above. Production cutover remains a separate decision: review the completed modernization and explicitly authorize it when ready. The follow-up backlog does not itself add a new cutover gate. After deployment, record live smoke checks and analytics delivery; localhost checks do not establish analytics ingestion.

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
