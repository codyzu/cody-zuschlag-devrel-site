# Cody Zuschlag’s developer relations site

A prerendered Astro site using UnoCSS Wind4. The homepage, talks, articles, and gallery are available without JavaScript.

Use Node 24 LTS (`nvm use`) and pnpm **10.23.0**, pinned in `package.json` and CI.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The dev server uses port **4321** and exposes a network URL for testing on other devices. It fails if that port is occupied instead of silently moving to another port. `pnpm preview` uses port **4322**.

Validate changes before review:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm build
pnpm test
pnpm preview
```

The tests inspect the generated `dist` output, so build before running them. `pnpm lint` uses XO with the Astro plugin. Prettier owns formatting through `.prettierrc.json`; XO uses compatibility mode to avoid conflicting style rules. `pnpm format` formats the source, including Astro components.

Add speaking engagements as individual `.md` files in `src/content/talks/`; copy an existing entry and edit its YAML frontmatter. Use a unique descriptive filename, such as `2026-09-15-xen-summit.md`. An empty Markdown body is fine; bodies are not currently displayed. The collection schema validates required fields, regions, resource URLs, and timestamps with explicit time zones (quote dates, for example `date: '2026-09-15T07:00Z'`). Talks sort by full timestamp, newest first, including future engagements; identical timestamps sort by entry ID ascending. Dates render in English using UTC. Recording URLs mean “Watch now”; `none` means “Not recorded”; an absent recording means “Coming soon”. Set each talk’s `region` to USA, Europe, Asia, or Virtual. Search matches every word across conference, title, location, and year, ignoring case and accents. Resource filters require all selections; location filters accept any selection. The small browser script filters existing rows; without JavaScript all talks remain visible. Section anchors include `#talks`, `#articles`, and `#socials`.

Add articles as individual `.md` files in `src/content/articles/` with `title`, `url`, a quoted timestamp with an explicit time zone in `date`, and a positive integer `order`. The schema validates metadata and rejects unknown fields. Lower `order` values appear first; ties use entry ID ascending, regardless of publication date. Existing orders use increments of ten to leave room for additions. Preserve curated order when editing; renumber entries when more space is needed. Use a unique descriptive filename and an empty Markdown body; bodies are not displayed and articles link to their external canonical URLs.

Hero and gallery photographs use Astro’s `Picture` component and Sharp to generate responsive AVIF/WebP sources with JPEG fallbacks during the build. The hero loads eagerly with high priority; gallery images load lazily. SVG logos stay as SVG. Drop gallery photographs directly into `src/gallery/`; they are discovered automatically at build time. Use `number_lowercase-description[_big|_portrait].jpg` (also `.jpeg` or `.png`), for example `09_cody-speaking-on-stage_portrait.jpg`. Descriptions use lowercase ASCII letters/digits separated by single hyphens. Hyphens become spaces and only the first character is capitalized for alt text. The positive number controls numeric order (leading zeros are optional); `_big` spans two columns, `_portrait` uses a 3:4 crop, and no modifier uses 4:3. Malformed names, uppercase characters, and duplicate order numbers fail validation. No imports or metadata entries are needed. Renaming a file changes its description, order, or layout. The gallery uses one/two/four-column Grid, enhanced to native Grid Lanes where supported. Keep the responsive `sizes` in `src/Photos.astro` aligned with section padding, gaps, and the main width when changing layout. The map is a lazy OpenStreetMap iframe with an external map link. Google Analytics initializes only in production.

Search and sharing metadata live in `src/layouts/Document.astro`. The dedicated 1200×630 JPEG card is `public/social-sharing.jpg`; regenerate it with `pnpm generate:social-image` after editing `scripts/generate-social-image.mjs`. The generator uses the existing hero photograph and colors from `uno.config.ts`. Commit the resulting image with its source changes; builds copy it without adding browser runtime.

GitHub Pages publishes `dist` at `https://devrel.codyfactory.eu`. Pull requests run type, lint, formatting, build, and generated-output tests with a frozen lockfile. Pushes to `main` deploy automatically after those checks pass; the separate deployment job publishes the checked build and preserves the custom domain. Do not push or merge intermediate modernization phases to `main`.
