# StreamTV

A production-grade **OTT streaming front-end** — think Netflix / ZEE5 / Hotstar — built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Redux Toolkit**, and **Video.js**. It ships a full catalog browsing experience, full-text search, an HLS video player with resume support, and **Smart-TV D-pad navigation**, and it runs **fully offline** out of the box using a bundled JSON catalog.

> No external accounts are required to run it. Clone, install, and `npm run dev` — the app serves a bundled catalog of **36 demo titles**. Wire up Contentful later only if you want a live CMS.

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [npm Scripts](#npm-scripts)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [1. Data Layer — CMS abstraction & the `content.json` fallback](#1-data-layer--cms-abstraction--the-contentjson-fallback)
- [2. Routing & Rendering — the App Router](#2-routing--rendering--the-app-router)
- [3. Component System — Atomic Design](#3-component-system--atomic-design)
- [4. State Management — Redux Toolkit + RTK Query](#4-state-management--redux-toolkit--rtk-query)
- [5. Video Playback — Video.js + HLS](#5-video-playback--videojs--hls)
- [6. Smart-TV Spatial Navigation](#6-smart-tv-spatial-navigation)
- [7. SEO & Metadata](#7-seo--metadata)
- [8. Styling & Design Tokens](#8-styling--design-tokens)
- [Domain Model (TypeScript)](#domain-model-typescript)
- [End-to-End Data Flows](#end-to-end-data-flows)
- [Testing](#testing)
- [Configuration & Deployment](#configuration--deployment)
- [Environment Variables](#environment-variables)

---

## Highlights

- **Offline-first CMS** — a single client abstracts **Contentful** (live) and a **bundled `public/content.json`** (fallback). The rest of the app is agnostic to where data came from.
- **Hybrid rendering** — home page is dynamic; detail, watch, and browse pages are **statically generated** (`generateStaticParams`) for all titles/categories at build time.
- **Atomic Design** component library — `atoms → molecules → organisms → templates → pages`, ~40 components, each with co-located tests and barrel exports.
- **Smart-TV mode** — full D-pad / arrow-key spatial navigation via `@noriginmedia/norigin-spatial-navigation`, auto-enabled on TV-class user agents or `?tv=1`.
- **HLS video player** — Video.js + VHS engine behind an engine-agnostic `PlayerHandle` contract, with quality selection, keyboard shortcuts, and **resume / Continue Watching** persisted to `localStorage`.
- **Dual API surface** — REST (`/api/cms/rest`) for catalog, GraphQL-shaped (`/api/cms/graphql`) for search, both backed by the same CMS client.
- **Full SEO** — per-route metadata, Open Graph / Twitter cards, dynamic `sitemap.xml`, and `robots.txt`.
- **Accessible & motion-aware** — skip links, ARIA roles, focus rings readable "from 10 feet," and `prefers-reduced-motion` support.
- **Typed end-to-end** — strict TypeScript, a barrel of domain types, and typed Redux hooks.

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js `16.2.6` (App Router, Turbopack) |
| UI | React `19.2.4`, React DOM `19.2.4` |
| Language | TypeScript `5` (strict) |
| State | Redux Toolkit `2.x`, React-Redux `9.x`, RTK Query |
| Styling | Tailwind CSS `v4` (`@tailwindcss/postcss`), CSS custom-property design tokens, `clsx` |
| Video | `video.js` `8.x` + `@videojs/http-streaming` (VHS), `hls.js` |
| TV navigation | `@noriginmedia/norigin-spatial-navigation` `3.x` |
| CMS | `contentful` SDK `11.x` (optional) + local JSON fallback |
| Testing | Vitest `4.x`, Testing Library, jsdom, `@vitest/coverage-v8` |
| Tooling | ESLint `9` (flat config), Prettier `3.x` |
| Deploy | Vercel |

---

## Quick Start

### Prerequisites
- **Node.js 20+** and npm.

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. (Optional) regenerate the bundled catalog
npm run seed          # writes public/content.json

# 3. Start the dev server
npm run dev           # http://localhost:3000
```

That's it — the app serves the bundled catalog with **no environment variables required**.

### Try Smart-TV mode
Open the app with `?tv=1` (e.g. `http://localhost:3000/?tv=1`) or click the **TV toggle** in the header. The cursor hides and the entire UI becomes navigable with arrow keys + Enter (and Backspace to go back).

### Production build

```bash
npm run build         # static-generates all title/browse pages
npm run start         # serve the production build
```

---

## npm Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Dev server with HMR |
| `build` | `next build` | Production build (static-generates pages) |
| `start` | `next start` | Serve the production build |
| `lint` | `eslint` | Lint (Next core-web-vitals + TS rules) |
| `typecheck` | `tsc --noEmit` | Type-check only |
| `test` | `vitest run` | Run all tests once (CI) |
| `test:watch` | `vitest` | Tests in watch mode |
| `test:coverage` | `vitest run --coverage` | Coverage report |
| `format` | `prettier --write .` | Auto-format |
| `format:check` | `prettier --check .` | Verify formatting |
| `verify` | `typecheck && lint && test` | Full pre-commit gate |
| `seed` | `node scripts/generate-content.mjs` | Regenerate `public/content.json` |

---

## Project Structure

```
project/
├── app/                            # Next.js App Router (routes + API)
│   ├── layout.tsx                  # Root layout: fonts, StoreProvider, Header/Footer, skip-link
│   ├── page.tsx                    # "/"  — Home (dynamic) → HomeTemplate
│   ├── loading.tsx                 # Global Suspense fallback (Spinner)
│   ├── not-found.tsx               # Branded 404
│   ├── robots.ts                   # /robots.txt
│   ├── sitemap.ts                  # /sitemap.xml (enumerates every title)
│   ├── globals.css                 # Tailwind v4 import + design tokens + custom utilities
│   ├── browse/[category]/page.tsx  # "/browse/:category" — static, 6 categories
│   ├── search/page.tsx             # "/search" — server shell mounting <SearchView/>
│   ├── title/[slug]/page.tsx       # "/title/:slug" — static, detail page
│   ├── watch/[slug]/page.tsx       # "/watch/:slug"  — static, player page
│   └── api/cms/
│       ├── rest/route.ts           # GET  catalog / ?category=… (backs RTK Query REST)
│       └── graphql/route.ts        # POST search + catalog hydration (backs RTK Query GQL)
│
├── components/                     # Atomic Design component library
│   ├── atoms/                      # Badge, Button, FocusableDiv, Icon, Image, Skeleton, Spinner, Text
│   ├── molecules/                  # NavItem, PlayerControls, PosterCard, ProgressBar, RatingPill, SearchInput
│   ├── organisms/                  # AppChrome, ContentRow, ContinueWatchingRow, DetailPanel,
│   │                               #   Footer, Header, HeroBanner, SearchView, VideoPlayer
│   └── templates/                  # HomeTemplate, BrowseTemplate, DetailTemplate, PlayerTemplate
│
├── lib/                            # Framework-agnostic domain logic
│   ├── cms/                        # client.ts (Contentful|JSON), transformers.ts, queries.ts
│   ├── player/                     # videojs.ts (factory), hlsStreams.ts (stream defs)
│   ├── seo/metadata.ts             # siteUrl(), baseMetadata(), titleMetadata()
│   ├── spatial/navigationConfig.ts # FOCUS_KEYS, initSpatialNavigation()
│   └── utils/                      # analytics.ts, cn.ts, format.ts
│
├── store/                          # Redux Toolkit
│   ├── index.ts                    # makeStore() factory, RootState/AppDispatch
│   ├── StoreProvider.tsx           # "use client" provider, hydrates from localStorage
│   ├── hooks.ts                    # typed useAppDispatch / useAppSelector / useAppStore
│   ├── api/                        # contentfulRestApi, contentfulGqlApi (RTK Query)
│   ├── middleware/                 # localStorageMiddleware (persists user + continueWatching)
│   └── slices/                     # user, player, continueWatching, search, ui
│
├── hooks/                          # useContinueWatching, useDeviceType, useHydrated, useKeyboardShortcuts
├── types/                          # content.ts, player.ts, user.ts, index.ts (barrel)
├── scripts/generate-content.mjs    # Seed generator → public/content.json
├── public/content.json             # Bundled catalog (generated artifact)
├── tests/setup.ts                  # Vitest setup (jest-dom, matchMedia/IO polyfills)
│
├── next.config.ts  tsconfig.json  vitest.config.ts  eslint.config.mjs
├── postcss.config.mjs  .prettierrc  vercel.json  .env.example
```

**Conventions**
- **`@/*` import alias** maps to the project root (`tsconfig.json`), e.g. `@/components/atoms`, `@/lib/cms/client`.
- Every component folder exposes a **barrel `index.ts`** so you import `import { Button } from "@/components/atoms"`.
- Tests are **co-located** with the code they cover (`Button.tsx` ↔ `Button.test.tsx`).

---

## Architecture Overview

The app is layered so that each concern is swappable:

```
                         ┌─────────────────────────────────────────┐
  Browser (client)       │  React components (Atomic Design)        │
                         │  Redux Toolkit + RTK Query (client cache)│
                         └──────────────┬──────────────────────────┘
                                        │  fetch (client-side)
   ┌────────────────────────────────────┼────────────────────────────────┐
   │ Next.js server                      ▼                                 │
   │  Server Components ──► lib/cms/client.ts ──► transformers ──► Title[] │
   │  Route Handlers (/api/cms/*) ───────┘                                 │
   └────────────────────────────────────┬────────────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                                ▼
                 Contentful Delivery API        public/content.json
               (when env vars are set)         (bundled offline fallback)
```

Both data sources are normalized to **one envelope** (`{ total, items: [{ sys, fields }] }`), so a single set of transformers feeds everything — Server Components, route handlers, sitemap, and search.

---

## 1. Data Layer — CMS abstraction & the `content.json` fallback

All content access funnels through [`lib/cms/client.ts`](lib/cms/client.ts) (`import "server-only"` — server-only). It resolves data in two tiers:

1. **Contentful Delivery API** — used when **both** `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are set (`isContentfulConfigured()`). The `contentful` SDK is **dynamically imported** so it isn't bundled when unused.
2. **Bundled `public/content.json`** — the offline fallback, imported statically. Used when Contentful isn't configured **or** any network call throws.

### Exported functions

| Function | Returns | Used by |
| --- | --- | --- |
| `getCatalog()` | `Catalog` (featured + grouped categories + `bySlug`) | Home, browse, REST route |
| `getTitleBySlug(slug)` | `Title \| null` | Detail & watch pages, metadata |
| `getAllSlugs()` | `string[]` | `generateStaticParams`, sitemap |
| `getRelatedTitles(title, limit=12)` | `Title[]` (shared genre, best-rated first) | Detail page "More Like This" |
| `searchTitles(query)` | `Title[]` (name/director/genres/cast) | GraphQL route, server search |
| `isContentfulConfigured()` | `boolean` | Source selection |

### Transformers
[`lib/cms/transformers.ts`](lib/cms/transformers.ts) maps raw `CmsEntry` → domain `Title`, then `toCatalog()` builds the `bySlug` lookup, groups titles by `CATEGORY_ORDER`, labels rows via `CATEGORY_LABELS`, extracts `featured` titles, and drops empty categories. Components never touch CMS-shaped fields.

```
CATEGORY_ORDER  = [trending, new-releases, action, drama, comedy, documentary]
CATEGORY_LABELS = { trending: "Trending Now", "new-releases": "New Releases", … }
```

### The seed generator (`content.json` is generated)
[`scripts/generate-content.mjs`](scripts/generate-content.mjs) holds a hardcoded `DATA` table of 36 titles, wraps each in the **Contentful-Delivery-API envelope shape** (`{ sys, fields }`), and writes `public/content.json`:

```bash
npm run seed   # → "Wrote public/content.json with 36 titles."
```

Because the seed emits the same shape Contentful returns, the local fallback and the live API share one transformer. Poster/backdrop imagery uses deterministic `picsum.photos` seeded URLs; stream URLs point at public HLS test manifests.

> **Note:** `public/content.json` is a generated artifact. If you change the catalog, edit `DATA` in the seed script and re-run `npm run seed` rather than hand-editing the JSON.

### Route handlers (client-side data)
- [`app/api/cms/rest/route.ts`](app/api/cms/rest/route.ts) — `GET /api/cms/rest` returns the full `Catalog`; `?category=<slug>` returns one `Category` (404 `{ error: "Unknown category" }` if unknown).
- [`app/api/cms/graphql/route.ts`](app/api/cms/graphql/route.ts) — `POST /api/cms/graphql`. Reads `variables.query`/`variables.limit`; with a term it calls `searchTitles()`, without one it returns the whole catalog (cache hydration). Always responds `{ data: { titleCollection: { total, items } } }`.

---

## 2. Routing & Rendering — the App Router

| URL | File | Rendering | Renders |
| --- | --- | --- | --- |
| `/` | [`app/page.tsx`](app/page.tsx) | Dynamic Server Component | `HomeTemplate` (hero + rows) |
| `/browse/:category` | [`app/browse/[category]/page.tsx`](app/browse/[category]/page.tsx) | **Static** (6 variants) | `BrowseTemplate` (grid) |
| `/title/:slug` | [`app/title/[slug]/page.tsx`](app/title/[slug]/page.tsx) | **Static** (all titles) | `DetailTemplate` |
| `/watch/:slug` | [`app/watch/[slug]/page.tsx`](app/watch/[slug]/page.tsx) | **Static** (all titles) | `PlayerTemplate` |
| `/search` | [`app/search/page.tsx`](app/search/page.tsx) | Static shell | `<SearchView/>` (client) |
| `/robots.txt` | [`app/robots.ts`](app/robots.ts) | Metadata route | crawl rules + sitemap link |
| `/sitemap.xml` | [`app/sitemap.ts`](app/sitemap.ts) | Dynamic metadata | home + categories + every title |
| `/api/cms/rest` | route handler | Dynamic | catalog / category JSON |
| `/api/cms/graphql` | route handler | Dynamic | search / hydration JSON |

**Philosophy**
- **Server Components fetch data** (`getCatalog`, `getTitleBySlug`, …) and pass it to presentational **templates**. Dynamic params are `Promise`-typed and `await`ed (Next 15+/16).
- **Static generation** for detail / watch / browse via `generateStaticParams()` → fast, cacheable, SEO-friendly. The **home page is dynamic** so featured rotation and rows stay fresh.
- `notFound()` guards invalid slugs/categories.
- The **root layout** ([`app/layout.tsx`](app/layout.tsx)) wires Geist fonts, applies `baseMetadata()`, sets a dark `viewport` theme, and wraps everything in `StoreProvider` with persistent `AppChrome`, `Header`, `Footer`, and an accessible skip-link.

---

## 3. Component System — Atomic Design

Components compose strictly upward: **atoms → molecules → organisms → templates → pages**. Pages pass fully-hydrated data into templates; organisms own local interactivity; molecules coordinate atoms; atoms are pure UI.

### Atoms ([`components/atoms`](components/atoms))
`Badge`, `Button`, `FocusableDiv`, `Icon`, `Image`, `Skeleton`, `Spinner`, `Text`.
- **`FocusableDiv`** ⭐ is the single integration point with the spatial-navigation library (`useFocusable`). Every focusable element wraps this; it reflects focus via a `data-focused` attribute and fires `onSelect` on both D-pad Enter and pointer click.
- **`Image`** wraps `next/image` with a loading `Skeleton` and a graceful gradient fallback on error.
- **`Text`** maps `variant`/`tone` to semantic HTML + Tailwind (e.g. `display → <h1>`).
- Most atoms are **Server Components**; `Image`, `FocusableDiv`, `SearchInput` are client (`"use client"`).

### Molecules ([`components/molecules`](components/molecules))
`NavItem`, `PlayerControls`, `PosterCard`, `ProgressBar`, `RatingPill`, `SearchInput`.
- **`PosterCard`** — portrait card with poster, maturity/NEW badges, hover/focus metadata overlay, optional progress bar; focus-keyed per row and auto-centers on focus.
- **`PlayerControls`** — presentational scrubber + play/pause + volume + quality menu + fullscreen; all state owned by `VideoPlayer`.

### Organisms ([`components/organisms`](components/organisms))
`AppChrome`, `ContentRow`, `ContinueWatchingRow`, `DetailPanel`, `Footer`, `Header`, `HeroBanner`, `SearchView`, `VideoPlayer`.
- **`AppChrome`** (renders nothing) — boots spatial nav once, toggles the `tv-mode` body class, seeds initial TV focus, and maps Backspace → browser-back in TV mode.
- **`HeroBanner`** — auto-rotating featured carousel (~6s, pauses on hover/focus) with a true backdrop crossfade, a slow Ken Burns zoom, staggered fade/rise of the copy, and a fill-style progress indicator. CTAs stay mounted so spatial-nav focus is stable across slides.
- **`ContentRow`** — horizontally-scrollable carousel that provides a spatial-nav row context.
- **`ContinueWatchingRow`** — hydration-gated (`useHydrated`) so the persisted row never causes SSR mismatch.
- **`SearchView`** — debounced (350ms) input → RTK Query GraphQL search, recent searches, skeleton states, spatial grid.
- **`VideoPlayer`** ⭐ — see [section 5](#5-video-playback--videojs--hls).

### Templates ([`components/templates`](components/templates))
`HomeTemplate`, `BrowseTemplate`, `DetailTemplate`, `PlayerTemplate` — pure layout that arranges organisms and receives server-fetched data as props.

---

## 4. State Management — Redux Toolkit + RTK Query

[`store/index.ts`](store/index.ts) exposes a **`makeStore(preloadedState?)` factory** (a fresh store per request → SSR-safe, no cross-request leakage). [`StoreProvider`](store/StoreProvider.tsx) (`"use client"`) creates it once via `useState(() => makeStore(loadPersistedState()))` and hydrates from `localStorage`. Always use the typed hooks in [`store/hooks.ts`](store/hooks.ts): `useAppDispatch`, `useAppSelector`, `useAppStore`.

### Slices ([`store/slices`](store/slices))

| Slice | Shape (key fields) | Persisted? | Powers |
| --- | --- | --- | --- |
| `user` | `profile`, `preferences` | ✅ localStorage | Profile chip, quality/autoplay/captions prefs |
| `continueWatching` | `items: ContinueWatchingItem[]` | ✅ localStorage | Continue Watching row, resume position |
| `player` | `activeSlug, status, currentTime, duration, volume, muted, quality, fullscreen` | ❌ session | Playback UI state |
| `search` | `query`, `recent[]` | ❌ session | Search input + recent terms |
| `ui` | `tvMode, mobileNavOpen, activeModal, focusedRow` | ❌ session | TV mode, nav, modals, row focus |

**`continueWatching` business rules:** dedupes by slug (most-recent first), caps at `MAX_ITEMS = 12`, drops finished titles at `≥ 95%`, and the `selectContinueWatching` selector hides items below `2%` watched. **`player` rules:** volume clamps to `[0,1]` and auto-unmutes when raised; `resetPlayer()` clears state on unmount. **`search` rules:** `recent` is an LRU capped at 6, trimmed and deduped.

### RTK Query APIs ([`store/api`](store/api))
Both use `fetchBaseQuery({ baseUrl: "/api/cms/" })` and hit the local route handlers (which in turn use the same CMS client → Contentful or JSON).

- **`contentfulRestApi`** — `getCatalog` (`GET rest`) and `getCategory(slug)` (`GET rest?category=`), tagged `"Catalog"`. Hooks: `useGetCatalogQuery`, `useGetCategoryQuery`.
- **`contentfulGqlApi`** — `searchTitles({ query, limit })` (`POST graphql`) using `SEARCH_TITLES_QUERY`, `transformResponse` → `Title[]`. Hooks: `useSearchTitlesQuery`, `useLazySearchTitlesQuery`.

### Persistence ([`store/middleware/localStorageMiddleware.ts`](store/middleware/localStorageMiddleware.ts))
After any action whose type starts with `user/` or `continueWatching/`, the middleware writes those slices to `localStorage` (`streamtv:user`, `streamtv:continueWatching`). `loadPersistedState()` reads them back on client boot. Everything is `typeof window` guarded for SSR and wrapped in try/catch for quota/parse errors.

> **Division of labor:** Server = source of truth (CMS). RTK Query = client cache for catalog/search. Redux slices = transient UI (`player`/`search`/`ui`) + persisted cross-session data (`user`/`continueWatching`).

---

## 5. Video Playback — Video.js + HLS

[`lib/player/videojs.ts`](lib/player/videojs.ts) exposes `createPlayer({ element, src, autoplay, events })`, which configures Video.js with custom controls off, `fluid`/`responsive`, `playsinline`, and the **VHS** HLS engine (`overrideNative: true`). It returns the raw player **plus** an engine-agnostic **`PlayerHandle`** (`play/pause/seek/setVolume/toggleMute/setQuality/requestFullscreen/dispose`) — so the engine could be swapped for hls.js/Shaka without touching components.

- **Quality control** filters VHS renditions by max height (`1080p/720p/480p`, or all for `auto`).
- [`lib/player/hlsStreams.ts`](lib/player/hlsStreams.ts) defines demo HLS manifests and `resolveStreamUrl()` (falls back to the Mux test stream when a title has no `streamUrl`).

The [`VideoPlayer`](components/organisms/VideoPlayer/VideoPlayer.tsx) organism (client) **dynamically imports** the factory (keeps Video.js out of the initial bundle), drives a play/pause/ended/error state machine, **auto-resumes** past 5s, auto-hides controls after ~3.2s, and persists progress to `continueWatching` every ~10s and on unmount. Keyboard shortcuts (via [`useKeyboardShortcuts`](hooks/useKeyboardShortcuts.ts)): **Space** play/pause, **←/→** ±10s, **↑/↓** ±10% volume, **F** fullscreen, **M** mute.

---

## 6. Smart-TV Spatial Navigation

[`lib/spatial/navigationConfig.ts`](lib/spatial/navigationConfig.ts) centralizes TV behavior:
- **`FOCUS_KEYS`** — a stable namespace (`HEADER`, `NAV_ITEM(id)`, `ROW(slug)`, `CARD(rowSlug, slug)`, `HERO_PLAY`, `PLAYER_CONTROL(id)`) so the focus tree is deterministic.
- **`initSpatialNavigation()`** — idempotently boots `@noriginmedia/norigin-spatial-navigation` with `throttle: 100`, `throttleKeypresses`, and `shouldFocusDOMNode`.

How it ties together: `AppChrome` calls `init` and (via [`useDeviceType`](hooks/useDeviceType.ts)) detects TV-class devices or `?tv=1`, then toggles the `tv-mode` body class (hides cursor). Every interactive element wraps `FocusableDiv`; rows/grids set `provideContext` so ←/→ moves within a row and ↑/↓ moves between rows; focus drives the `.focus-ring` style; Enter/click share one `onSelect`.

---

## 7. SEO & Metadata

[`lib/seo/metadata.ts`](lib/seo/metadata.ts):
- **`siteUrl()`** — resolves the base URL from `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`.
- **`baseMetadata()`** — applied in the root layout: title template `%s · StreamTV`, description, keywords, Open Graph (`website`), Twitter `summary_large_image`, icons.
- **`titleMetadata(title)`** — per-title OG (`video.other`) with the backdrop as a 1600×900 image; used by detail (`title.name`) and watch (`Watch <name>`) routes.

Plus `sitemap.xml` (home/categories/every title with priorities) and a permissive `robots.txt` pointing at the sitemap.

---

## 8. Styling & Design Tokens

Tailwind **v4** via `@import "tailwindcss"` in [`app/globals.css`](app/globals.css) (PostCSS plugin `@tailwindcss/postcss`). Design tokens are CSS custom properties in an `@theme` block — a **cinematic dark OTT palette**:

```
--color-canvas:#07090f  --color-surface:#111521  --color-line:#2a3142
--color-brand:#7c5cff   --color-brand-soft:#a78bff --color-accent:#ff4d8d
--color-ink:#f4f6fb     --color-ink-muted:#aab2c5  --color-rating:#ffc83d
--ease-out-cine: cubic-bezier(0.22, 1, 0.36, 1)    --header-height: 4.5rem
```

Custom utilities: **`.focus-ring`** (10-foot-readable TV focus), **`.no-scrollbar`** + **`.edge-fade-x`** (carousel rails), **`.player-range`** (scrubber/volume sliders), **`.tv-mode`** (`cursor: none`), an ambient radial brand glow, and a `prefers-reduced-motion` block. Classes are merged with the **`cn()`** helper ([`lib/utils/cn.ts`](lib/utils/cn.ts), thin wrapper over `clsx`). Fonts are **Geist Sans / Geist Mono** via `next/font`.

---

## Domain Model (TypeScript)

Defined in [`types/`](types) and re-exported from [`types/index.ts`](types/index.ts) (`import type { Title, Catalog } from "@/types"`).

```ts
type CategorySlug = "trending" | "new-releases" | "action" | "drama" | "comedy" | "documentary";
type MaturityRating = "U" | "U/A 7+" | "U/A 13+" | "U/A 16+" | "A";
type TitleKind = "movie" | "series";

interface Title {
  id: string; slug: string; name: string; tagline: string; synopsis: string;
  kind: TitleKind; year: number; runtimeMinutes: number; maturity: MaturityRating;
  rating: number; genres: string[]; categories: CategorySlug[];
  posterUrl: string; backdropUrl: string; streamUrl: string;
  cast: string[]; director: string; featured: boolean;
}

interface Category { slug: CategorySlug; label: string; titles: Title[]; }
interface Catalog  { featured: Title[]; categories: Category[]; bySlug: Record<string, Title>; }
```

```ts
// player.ts
type Quality = "auto" | "1080p" | "720p" | "480p";
type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";
interface PlayerHandle { play; pause; seek; setVolume; toggleMute; setQuality; requestFullscreen; dispose; }

// user.ts
interface Profile { id; name; avatarColor; initials; }
interface Preferences { preferredQuality: Quality; autoplay: boolean; captions: boolean; }
interface ContinueWatchingItem { slug; positionSeconds; durationSeconds; updatedAt; }
```

The raw CMS envelope (`CmsEntry`, `CmsResponse`) lives in `content.ts` and is what both Contentful and `content.json` conform to.

---

## End-to-End Data Flows

**Home render (server):** `app/page.tsx` → `getCatalog()` → `loadCmsResponse()` (Contentful or `content.json`) → `toCatalog()` → `<HomeTemplate>` renders `HeroBanner` + `ContinueWatchingRow` + `ContentRow[]`.

**Search (client):** keystroke → `setQuery` (debounced 350ms) → `useSearchTitlesQuery` → `POST /api/cms/graphql` → route calls `searchTitles()` → results cached by RTK Query and rendered in a spatial grid; Enter dispatches `addRecent`.

**Continue Watching (persisted):** `VideoPlayer` dispatches `upsertProgress` every ~10s → `localStorageMiddleware` writes `streamtv:continueWatching` → on next visit `loadPersistedState()` rehydrates → `ContinueWatchingRow` (after `useHydrated`) resolves slugs against `catalog.bySlug` and renders cards with progress; `DetailPanel`/player read `selectResumePosition(slug)` to resume.

**Playback:** navigate to `/watch/:slug` → server fetches the `Title` → `PlayerTemplate` → `VideoPlayer` dynamically imports `createPlayer()` → HLS via VHS → resume seek → progress persisted.

---

## Testing

- **Runner:** Vitest (`vitest.config.ts`) with the **jsdom** environment, `globals: true`, the `@/*` alias mirrored, and `tests/setup.ts` as a setup file.
- **Setup ([`tests/setup.ts`](tests/setup.ts)):** registers `@testing-library/jest-dom` matchers, runs `cleanup()` after each test, and polyfills `matchMedia` + `IntersectionObserver` (absent in jsdom).
- **Coverage:** `@vitest/coverage-v8` via `npm run test:coverage`.
- **What's tested (12 files):** atoms (`Badge`, `Button`, `Skeleton`, `Text`), molecules (`ProgressBar`, `RatingPill`, `SearchInput`), CMS transformers, formatting utils, and the `continueWatching` / `player` / `search` Redux slices.

```bash
npm run test            # one-shot
npm run test:watch      # watch mode
npm run verify          # typecheck + lint + test
```

---

## Configuration & Deployment

- **[`next.config.ts`](next.config.ts):** `reactStrictMode`, Turbopack `root` pinned, and `images.remotePatterns` allowlisting `picsum.photos`, `fastly.picsum.photos`, and `image.tmdb.org`.
- **[`tsconfig.json`](tsconfig.json):** strict, `target ES2017`, `module esnext`, `moduleResolution bundler`, `jsx react-jsx`, `@/*` → root, `noEmit`.
- **[`eslint.config.mjs`](eslint.config.mjs):** flat config extending `next/core-web-vitals` + `next/typescript`; ignores build output.
- **[`.prettierrc`](.prettierrc):** semicolons, double quotes, trailing commas `all`, `printWidth 90`, 2-space tabs.
- **[`vercel.json`](vercel.json):** `framework: nextjs` + security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`).

Deploy to **Vercel** (zero-config Next.js). Set `NEXT_PUBLIC_SITE_URL` for correct canonical/OG links, and the Contentful vars if you want the live CMS; otherwise the bundled catalog ships with the build.

---

## Environment Variables

Copy `.env.example` → `.env.local`. **None are required** for local development (the app runs on the bundled catalog).

| Variable | Default | Effect |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | — | With the token, switches the CMS client to the live Contentful API |
| `CONTENTFUL_ACCESS_TOKEN` | — | Delivery API token (required alongside the space ID) |
| `CONTENTFUL_ENVIRONMENT` | `master` | Contentful environment name |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical / Open Graph base URL (inferred from `VERCEL_URL` on Vercel) |

> If **both** `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are present, content comes from Contentful; on any failure it transparently falls back to `public/content.json`.