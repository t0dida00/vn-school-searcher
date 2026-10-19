# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FinUnies is a search app for Finnish universities, UAS and vocational schools (live at finunies.vercel.app, deployed on Vercel). The repo directory and some leftovers (`public/vn.json`, `public/dummy-list.geojson`, Vietnamese comments and UI strings such as tooltips) come from an earlier Vietnamese-school version. The current data is Finnish.

Stack: Next.js 15 App Router + React 19, TypeScript, MongoDB Atlas, Mapbox GL JS, Zustand, Tailwind v4 + shadcn/ui (new-york style), and SCSS modules for some components.

## Commands

```bash
npm run dev     # next dev --turbopack
npm run build
npm run start
npm run lint    # next lint (ESLint 9, next/core-web-vitals + next/typescript)
```

There is no test suite.

## Environment (`.env.local`)

- `MONGO_URI`: required. `app/lib/mongodb.ts` throws at import time if it is missing, so the build fails too.
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Mapbox token.
- `NEXT_PUBLIC_MAP_MIN_ZOOM/MAX_ZOOM`: zoom limits (defaults in `app/map/mapboxConfig.ts`). The initial view is not configurable: `app/map/viewport.ts` fits `FINLAND_BOUNDS` on load (padded clear of the search panel), then sets min zoom and max bounds to exactly that fitted view, so Finland can't be zoomed out past or panned off screen. It re-fits on resize while the user is at the overview zoom. `NEXT_PUBLIC_MAP_LONGITUDE/LATITUDE/ZOOM` are no longer read.
- `NEXT_PUBLIC_MAP_HIGHLIGHT_COUNTRY`: no longer read. The map is hard-wired to Finland via `app/map/finland.json`.
- `NEXT_INTERNAL_BASE_URL`: base URL that the `/map` server component uses to fetch its own API. Falls back to `http://localhost:3000`.

## Architecture

**Countries.** Every page lives under `/<country>/...` (`app/[country]/`). The countries are listed in `app/lib/countries.ts` (code, name, MongoDB collection). Today only `fi` exists, backed by `fin_universities`. `app/[country]/layout.tsx` sets `dynamicParams = false`, so unknown codes return a 404. Build in-app links with `useCountryPath()` (client) or `countryPath()` (server), never as bare `/map`. `useDataStore.country` records which country `data` belongs to, and `/university-list` refetches when it doesn't match the URL. The Mapbox layer (`finland.json`, `FINLAND_BOUNDS`) is still Finland-only.

**Data source.** There is one API route, `app/api/universities/route.ts`. `?country=<code>` picks that country's collection (it defaults to `fi`, and unknown codes return 404). It returns every document in that collection, with CORS set to `*`. Each document is already a GeoJSON `Feature` (`{ _id, type, geometry: Point, properties: { name, city, type, fieldOptions, logo, overview, tuition, scholarship, website, ... } }`). The client uses these documents directly as Mapbox features, with no transformation. `properties.fieldOptions` can be an array or a JSON-encoded string, so always read it through `app/utils/stringToArray.ts`. `properties.ranking` is the uniRank 2026 national rank as a string (`""` for TAMK, National Defence University and Police University College, which uniRank doesn't list). Read it through `rankOf()`/`byRanking()` in `app/utils/ranking.ts`, and show it with `app/components/RankTag.tsx`.

**Routing.** `next.config.ts` redirects `/` to `/fi/university-list` (temporary, 307). The old `/school-list`, `/university-list`, `/map` and `/school/:id` URLs, and `/<country>/school-list`, redirect permanently (308) to their `/fi/` or `/<country>/university-list` versions. `app/page.tsx` and `app/home/` are placeholders. The two real views are:

- `/[country]/university-list` (`app/[country]/university-list/page.tsx`, client component): the list view. It calls `fetchData()` on the client and filters **client-side** by city, field and type. The options for those filters come from `public/filter-options.json`, and the values are lowercased for comparison. Text search and filters run together through a single `matches()` predicate, with `useDeferredValue` keeping typing responsive. Results scroll in pages of 10 via `react-intersection-observer`, and the page count resets whenever a filter changes. Cards live in `app/[country]/university-list/components/SchoolCard.tsx`.
- `/[country]/map` (`app/[country]/map/page.tsx`, server component with `revalidate = 86400`): fetches `/api/universities?country=<code>` on the server. It passes the result to `app/HOC/MapWrapper.tsx`, which seeds the Zustand store and loads `app/components/Map.tsx` dynamically with `ssr: false`, because mapbox-gl needs `window`. Because the page fetches its own API over HTTP, the fetch fails during `next build` unless a server is reachable at `NEXT_INTERNAL_BASE_URL`. The error is caught, and the page renders with `data = null` until revalidation.
- `/[country]/school/[id]` (`app/[country]/school/[id]/page.tsx`, SSG with `revalidate = 86400`, prerendered for every country): one page per school, keyed by the `properties.id` slug (`schoolId()` in `app/utils/schoolId.ts`). It reads MongoDB directly through `app/lib/schools.ts` (not over HTTP), so it prerenders during `next build`. It reuses the `SchoolDetailContent` pieces and links to `/<country>/map?school=<id>`, which `Map.tsx` opens on load. `app/sitemap.ts` lists these pages.

**State (Zustand, `app/zustand/`).**

- `useDataStore` holds `data` (all schools), `filteredData` (`null` means no filter is active, so use `data`), `loading`, `error` and `fetchData`. `data`, `country` and `fetchedAt` persist to localStorage (`finunies-schools`, with `skipHydration`). `fetchData(country)` rehydrates first and skips the request while the cache is under 7 days old and belongs to that country. `{ force: true }` bypasses it. The data changes about twice a year: **after updating MongoDB, bump `SCHOOL_DATA_VERSION`** in `useDataStore.ts` to drop every visitor's cache. On the server, `/api/universities` sends `s-maxage=86400` and the map and school pages revalidate daily. Only the `/map` view writes `filteredData` (from `MapSearch`, which resets it to `null` on unmount). `/university-list` filters locally and keeps its filters in the URL query (`q`, `city`, `field`, `type`).
- `usePointStore` holds `points` (all features visible in the current map bounds), `selectedPoint` and `isOpen` (the detail dialog or drawer).
- `useSavedStore` holds the shortlist (saved school ids), persisted to localStorage with `skipHydration`. Read it via `useSavedIds()`, which rehydrates after mount so server HTML matches. `SaveButton` toggles it. `/university-list` filters to saved schools with `?saved=1`.
- Imperative map code reads and writes these stores through `useStore.getState()`, not hooks.

**Map layer (`app/map/`).**

- `layerConfig.ts` adds the Finland-only layers from `finland.json` (a simplified geoBoundaries/OSM outline, ODbL): an opaque `outside-finland` mask (the world with Finland as holes) covers the whole basemap, labels included, and a grey `finland-silhouette` fades out between zoom 5 and 8 so streets appear when zoomed in. The map uses a flat `mercator` projection so the outline doesn't bend. The file also adds the clustered `universities` GeoJSON source, which has only the `clusters` and `cluster-count` layers. Single schools are not a layer.
- `markers.ts` draws each unclustered school as an HTML logo marker, because circle layers can't show remote logos. `syncSchoolMarkers` runs on every `render` and adds or removes markers to match `querySourceFeatures`. Markers are keyed by `properties.id`. `selectSchool()` is the single entry point for opening a school: it sets `selectedPoint` and `isOpen`, then flies to the school. Marker CSS lives in `markers.module.scss`. Never give `.marker` a `position`, because that overrides `.mapboxgl-marker`'s absolute positioning.
- `events.ts` wires up map events: it recomputes visible points on move and zoom, syncs markers, expands a cluster on click, and toggles marker selected and highlight classes when `usePointStore` changes.
- `Map.tsx` creates the map once and then calls `setData` on the existing `universities` source whenever `filteredData` or `data` changes. It does not recreate layers.

**Map search (`app/components/MapSearch.tsx`).** A floating panel with instant search and type pills, both using `matchSchool()` from `app/utils/matchSchool.ts`, which `/university-list` shares. With no query, the panel lists the schools in view. With a query, it writes `filteredData` and fits the map to the matches, padded around the panel. It supports arrow, Enter and Escape keys, and hovering a result highlights its marker.

**Responsive split.** The breakpoint is `window.innerWidth >= 576` (`min-[576px]:` in Tailwind). Desktop opens details in `SchoolDetailDialog` and keeps the result list open. Mobile uses `SchoolDrawer` (vaul) and only expands the list while searching. Both detail views are thin wrappers: their content (header, body and the website and directions actions) lives in `app/components/SchoolDetails/SchoolDetailContent.tsx`, so change it there.

**UI components.** shadcn primitives live in the root `components/ui/` and are imported via the `@/*` alias, which maps to the repo root. App-specific components live in `app/components/`, and their styles are in `app/components/styles/*.module.scss`. Use `cn()` from `lib/utils.ts` to merge class names. Text inputs, selects and textareas must be at least 16px so iOS doesn't zoom in on focus: don't give them `text-sm`/`text-xs` (an unlayered rule in `globals.css` enforces this as a safety net). Check layouts down to 280px wide (Galaxy Fold) and on landscape phones (about 740×360).
