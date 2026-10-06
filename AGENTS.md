# Repository guidance

## Architecture and content

- This is a static Astro site. Render site-owned content at build time and keep it readable without JavaScript.
- The homepage is `src/pages/index.astro`; the shared document layout is `src/layouts/Document.astro`. Reuse the shared section, heading, link, and article components.
- Keep talks and articles in their typed TypeScript modules (`src/talks/talks.ts` and `src/articles.ts`). Preserve source ordering, content, and URLs unless the task calls for changes. Format dates through `src/format-date.ts` using English and UTC.
- Preserve the public `#talks`, `#articles`, and `#socials` anchors, semantic headings, keyboard focus, skip link, reduced-motion support, meaningful image alternatives, and high-priority hero loading.
- Small interactions should progressively enhance existing HTML with plain TypeScript. Talk filtering should toggle `hidden` on the existing list items. Keep their semantic wrappers and shared column subgrid; do not reintroduce React or a table/search library to handle layout or filtering.

## Styling and tooling

- Use UnoCSS Wind4 utilities for ordinary layout, spacing, typography, and image styling. Use scoped CSS for coordinated layouts and behavior such as talk subgrid placement, gallery spans/masonry, and hero animation. Keep global accessibility rules in the document layout.
- Shared colors, fonts, shortcuts, and icon configuration belong in `uno.config.ts`. Use those theme tokens in scoped CSS too. Keep Wind4's built-in reset as the only reset; ensure content-driven icon classes appear in production CSS.
- Keep XO with the Astro plugin for linting. `.prettierrc.json` is the source of truth for formatting; XO uses `prettier: 'compat'`. Do not duplicate formatting preferences in the XO config or replace XO with a standalone ESLint setup.
- Follow the existing PascalCase component and kebab-case page conventions enforced by XO.
- Use the Node version in `.nvmrc` and the pnpm version in `package.json`'s `packageManager`. Use pnpm and maintain `pnpm-lock.yaml`; CI installs with `--frozen-lockfile`.

## Working and validating

- Inspect the current diff before editing and preserve unrelated work, including `.anima/`. Edit source files; `dist/` and `.astro/` are generated output.
- For application changes, run `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`, then `pnpm test`. Tests inspect generated HTML/CSS, so build first. Documentation-only changes need formatting validation.
- Verify layout and interaction changes in the browser at mobile and desktop widths. Check no-JavaScript reading, native anchors, keyboard behavior, and console errors when relevant. For talk layout/filter changes, verify column alignment and that hidden rows occupy no space. Report which browsers were actually checked.
- Use `pnpm dev` for development on port 4321; `pnpm preview` serves production output on port 4322. Reuse a healthy existing server. Do not silently change ports or stop unrelated servers. A successful production build alone does not verify development or hot updates.

## Documentation and deployment

- Keep `README.md` as concise developer documentation for the current repository. Put durable agent conventions here and migration decisions, phase boundaries, temporary dependencies, and verification records in `docs/MODERNIZATION_HANDOFF.md`.
- For modernization work, read the handoff, respect its phase boundaries, and update its implementation record. Check actual files and dependencies rather than assuming a planned replacement is already implemented.
- Preserve the current visual identity and section order unless a redesign is requested. Follow the handoff for the agreed map, analytics, feed, image, and gallery changes.
- GitHub Pages publishes `dist` at `https://devrel.codyfactory.eu`; pushes to `main` deploy automatically. Do not push to `main`, merge, or deploy unless requested. Complete and validate the modernization before its production cutover.
