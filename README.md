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

Edit speaking engagements in `src/talks/talks.ts` and articles in `src/articles.ts`. Keep the typed content in source order. Dates render in English using UTC. Recording URLs mean “Watch now”; `none` means “Not recorded”; an absent recording means “Coming soon”. Section anchors include `#talks`, `#articles`, and `#socials`.

Hero and gallery images are imported from `src/images/` and `src/gallery/`. The map uses MapLibre. Google Analytics and Insights initialize only in production; the Twitter timeline loads its external widget script only in production.

GitHub Pages publishes `dist` at `https://devrel.codyfactory.eu`. Pushes to `main` deploy automatically.
