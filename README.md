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

Edit speaking engagements in `src/talks/talks.ts` and articles in `src/articles.ts`. Keep the typed content in source order. Dates render in English using UTC. Recording URLs mean “Watch now”; `none` means “Not recorded”; an absent recording means “Coming soon”. Set each talk’s `region` to USA, Europe, Asia, or Virtual. Search matches every word across conference, title, location, and year, ignoring case and accents. Resource filters require all selections; location filters accept any selection. The small browser script filters existing rows; without JavaScript all talks remain visible. Section anchors include `#talks`, `#articles`, and `#socials`.

Hero and gallery images are imported from `src/images/` and `src/gallery/`. The map is a lazy OpenStreetMap iframe with an external map link. Google Analytics initializes only in production.

GitHub Pages publishes `dist` at `https://devrel.codyfactory.eu`. Pushes to `main` deploy automatically.
