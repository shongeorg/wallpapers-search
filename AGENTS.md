# AGENTS.md

## What this is
- Nuxt 4.6.3 PWA wallpaper catalog. `writing-block.md` is the authoritative product spec (Ukrainian); read the relevant section before changing behavior.
- Product decisions already made: the catalog defaults to the `4k wallpaper` query (prefilled in the search field and fetched automatically); every wallpaper page has a download button plus similar wallpapers merged from all providers; Ant Design was removed — UI is hand-built.
- `https://4kwallpapers.com` is a design reference only. There is no adapter for it: no official API, and spec §8 forbids scraping or bypassing its protections.

## Commands
- npm only (`package-lock.json`), Node 24.
- `npm run dev`, `npm run build`, `npm run preview`, `npm run deploy` (`vercel --prod`).
- `postinstall` runs `nuxt prepare`; rerun `npx nuxt prepare` after changing `nuxt.config.ts`.
- No test, lint, format, or typecheck scripts exist. `npm run build` is the only verification step; it currently passes.
- Nitro does not read `.env` outside dev. To run the built server locally, export `UNSPLASH_API_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` first, then `PORT=3100 node .output/server/index.mjs`.
- `npm run build` while the dev server is running writes to `node_modules/.cache/nuxt/.nuxt` and leaves the dev server usable.
- `npm run generate` is unsuitable: the app needs the `/api/*` Nitro routes.

## Layout and wiring
- `app/` is the Nuxt 4 source dir (pages, layouts, components, composables, assets). Components are registered with `pathPrefix: false`, so names are plain: `<AppHeader>`, `<AppFooter>`, `<Pagination>`, not `LayoutAppHeader`.
- API routes live in `server/api/wallpapers/` and delegate to `server/services/wallpaper/wallpaper.service.ts`, which aggregates adapters from `server/services/providers/` (`index.ts` builds only adapters whose key is configured).
- Wallpaper IDs are `provider:sourceId` (e.g. `unsplash:3l3RwQdHRHg`) and are URL-encoded in links; parse/build them with `shared/utils/wallpaper.ts`.
- `shared/` holds types, categories, the default query and shared utils; import explicitly as `#shared/...`.
- Global CSS is `app/assets/css/{layers,variables,main}.css` (dark theme by default via `@nuxtjs/color-mode`); component styles are scoped SFC styles.

## Security constraints
- Provider keys are server-only, resolved in `server/utils/providerKeys.ts` from `process.env` with private runtime config fallback. Never expose them to the client.
- `/api/wallpapers/download` is a proxy: it validates the ID, allowlists provider hosts (`images.unsplash.com`, `images.pexels.com`, `cdn.pixabay.com`), caps size at 40 MB and requires an `image/*` content type. Do not turn it into a generic URL fetcher.
- Rate limiting in `server/utils/rateLimit.ts` is in-memory per instance; on Vercel it is not shared across lambdas.
- Favorites are localStorage only (`wallpaper-studio:favorites`), no auth or database.

## Known state
- The `PEXELS_API_KEY` currently in `.env` is rejected by Pexels with 401, so the Pexels adapter is skipped and only Unsplash + Pixabay appear. This is a key problem, not a code bug.
- PWA uses an SVG icon and `navigateFallback: '/offline'`; service worker is disabled in dev.
