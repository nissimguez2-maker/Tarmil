# Tarmil — Investor Mockup

Investor-facing click-through demo of Tarmil, the travel app for Israelis abroad. The repo ships **two surfaces** side by side:

- **`/trip` and the other mobile routes** — full mobile mockup, served as a PWA. On a phone it goes 100% full-bleed and feels native. On desktop ≥ 768 px it renders inside an iPhone shell.
- **`/web` — the desktop trip planner**. A 3-column workspace (sidebar · map · contextual bubble) that uses the same Supabase data as the mobile mockup and adds live APIs (weather, geocoding, Wikipedia, OSM places, OSRM routing, LLM rewrites) on top.

A root **mode toggle** at `/` lets an investor pick which surface to demo. Production at `https://tarmil-mockup.netlify.app`.

---

## Quick start

```bash
npm install
cp .env.example .env.local       # fill the env vars below
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serves dist/ at http://localhost:4173
npm run typecheck
```

### Environment variables

| Var | Required | Used by | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Yes | mobile + web | From **Project Settings → API** in the Supabase dashboard. |
| `VITE_SUPABASE_ANON_KEY` | Yes | mobile + web | Same place. Safe in the browser when RLS is on. |
| `VITE_TOMTOM_KEY` | Optional | web map | Free TomTom key for the planner's base tiles. Falls back to OpenStreetMap if absent. |
| `VITE_GROQ_API_KEY` | Optional | web city bubble | Free Groq key. When present, dynamically-added cities (via Nominatim search) get their Wikipedia extract rewritten as a travel intro instead of the raw encyclopedia paragraph. Falls back to raw Wikipedia. |

For Netlify, paste the same vars under **Site settings → Environment variables**. `.env.local` is gitignored.

### Open in two browser shapes

- A **desktop window** ≥ 768 px wide → the mobile mockup renders inside an iPhone frame; `/web` shows the desktop planner.
- **DevTools → device preset → iPhone 15 Pro** → full-bleed mobile view (the `/web` surface remains desktop-only and shows an "open on desktop" message below 1024 px).

---

## Surface 1 — Mobile mockup (5 tabs + Profile)

Five bottom tabs, one mental model per tab. Profile is a top-right avatar on every tab.

| Tab | Surface |
|---|---|
| **Trip** | Continent-scale map with bubbles and pins (past, present, declared future). Curated places, friend pins, next-trip card. Tap a friend → one-tap **Ping**. |
| **Activity** | Social feed. "Right now" overlap strip with inline Ping. Wall of trip declarations, who's-down posts (with optional 2–4 option polls), questions, party invites. Reactions + flat one-level replies. Compose FAB. Top-right bell → Ping history. |
| **Plan** | Saved-places spine (formerly Around). Three modes — **Now** (within 50 km), **My trip** (filter by planned stop), **Search** (global). Curated places carry a disclosed **Sponsored** / earned **Tarmil Selection** badge; ranking is Selection → Sponsored → public coverage. |
| **Forums** | City × 8 subjects (Accommodation · Transits · Scams & danger · Food · Activities & treks · Nightlife & parties · Money & visas · Meetups). Anyone verified can post; identity per post is the user's choice (real name or anonymous). |
| **Tools** | 7 utility tiles — Currency converter · Pre-trip checklist · Voice translator · Menu translator · Sign scanner · Friend balances · eSIM & data. |

Profile lives at `/profile`, friends list at `/profile/friends`, single-friend drill-down at `/profile/friend/:id`, settings at `/profile/settings`. Trip stop drill-down at `/trip/stop/:plannedStopId`. Cross-tab place drill-down at `/place/:id`.

---

## Surface 2 — `/web` desktop planner

A 3-column workspace that pushes the same trip data harder. Below 1024 px it shows an "open on desktop" message; the rest of this section assumes ≥ 1024 px.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER · Tarmil · "Planned trip · Brazil & Argentina · Oct–Nov 2026"   │
├──────────────────────────────────┬──────────────────────────────────────┤
│ SIDEBAR (384 px)                 │ MAP                                  │
│  Trip overview card              │  · TomTom basic tiles (or OSM)       │
│  Departure · Tel Aviv [✎]        │  · Amber numbered pins per stop      │
│  Transport · ~Xh drive           │  · Home pin (charcoal, house icon)   │
│  1 Búzios     [3 saved] ▼        │  · Dashed polylines between stops    │
│    🍴 Casa Bistro      Reserved  │  · Pin labels appear past zoom 6     │
│    🏨 Hotel Praia       Saved    │                                      │
│  Transport · ~6h drive           │  Click a pin → city bubble           │
│    ✈ LATAM · 06:00→14:00 · $145  │  Click a line → transit bubble       │
│  2 São Paulo  [1 saved] ▼        │  Click empty map → dismiss bubble    │
│  …                               │                                      │
│  Return · Tel Aviv [✎]           │                                      │
│  [+ Add stop]                    │                                      │
└──────────────────────────────────┴──────────────────────────────────────┘
```

### Editable trip

- **Drag to reorder** stops in the sidebar. The amber number badge is the drag handle (a grip icon swaps in on hover). On drop, the dates auto-shift chronologically so the trip stays in order: each stop keeps its nights count, the first arrival anchors, the rest chain forward with a one-day transit gap.
- **Edit dates** via the pencil icon on each stop card. Inline form with two native date inputs, live "X nights" readout, Save / Cancel. Validates that departure is after arrival.
- **Remove a stop** with the trash icon. If the stop has saved items or adjacent transit bookings, a confirm modal lists the cascade.
- **Add a stop** opens a Nominatim-powered search modal: type any city, pick a result, it lands at the end of the trip with three nights by default. Three pre-cooked suggested cities (Rio de Janeiro, Foz do Iguaçu, Mendoza) appear when the search is empty.
- **Departure / Return** rows bookend the itinerary. Default is Tel Aviv. Click the pencil to swap to any other city via Nominatim. Choice persists in `localStorage`.

All trip mutations live in local React state (initialized from Supabase once on load); they do not write back to Supabase, so different investors poking around won't step on each other. Refresh restores the canonical seed.

### City bubble

Click a stop → a floating 440-px bubble appears dead-center of the map area. The map flies to the city (zoom 9, 1.4 s ease-out). Six tabs:

| Tab | Content |
|---|---|
| **Overview** | 3-up photo grid (real Unsplash photos for the 8 known cities; Wikipedia hero for dynamically-added cities). A 4-sentence travel intro (hardcoded in `cityCopy.ts` for known cities; Wikipedia → Groq rewrite for new cities). A weather strip showing the trip dates ± 2 days, real data from Open-Meteo (forecast endpoint within 14 days, archive year-shifted for far-future dates). |
| **Stay** | Curated hostels + "Nearby" OSM accommodation. |
| **Eat** | Restaurants / Cafés / Kosher with sub-filter chips. Below the curated cards, "Nearby" places from Overpass. |
| **Drink** | Bars / Clubs sub-filter, plus nearby OSM. |
| **See** | Landmarks / Beaches sub-filter, plus nearby OSM. |
| **Religious** | Chabad + Kosher. |

Each place card has a thumbnail (or a clay-gradient placeholder), name, rating, friends-know cluster (micro-avatars from `friendVisits`), category badge, optional **Sponsored** / **Tarmil Selection** badge (`PlacementBadge`), a 2-line description with inline "More" toggle, and the **wishlist actions**.

Bubble header shows the city name, dates, nights, country chip (flag + currency + language + UTC offset from REST Countries).

### Transit bubble

Click a leg connector or a polyline → a different content variant of the bubble shows transport options. Five mode chips toggle in/out of the filter row:

- ✈ Flight · 🚆 Train · 🚌 Bus · 🚢 Ferry · 🚗 Drive

Offers are generated dynamically by `transportGenerator.ts` based on great-circle distance + the geographic zone of the midpoint. South America never gets trains; Europe and Asia usually do. Real carrier names per zone (LATAM / Gol / Azul / Aerolíneas in SA, Lufthansa / SNCF TGV / Renfe AVE / Trenitalia / Eurostar in Europe, JAL / Shinkansen in Asia, FlixBus / BlaBlaBus / Plataforma10 / Buser for bus, Buquebus / Stena Line for ferry). Times come from distance over mode-typical speed plus realistic overhead. Prices are deterministic per (cityPair × mode) so they stay stable across reloads.

The **Drive** offer is injected when OSRM returns a route between the two cities. It carries the real driving distance, ETA, and a $0.12/km fuel estimate. Ocean crossings (Tel Aviv → Búzios, Paris → Los Angeles) get no Drive option.

The sidebar leg shows the dominant mode icon + `Transport · ~Xh drive` (or no drive suffix if the route is unreachable by road).

### Wishlist

The signature v2 mechanic. Every Save / Reserve / Book lands in the sidebar under the relevant city or leg.

- **Place cards** have a `Save` button (always) and `Reserve` button (only on reservable categories: hostel, restaurant, cafe, kosher, bar, club). Both are dead-click mock actions — the wishlist row carries the right status pill ("Saved" charcoal, "Reserved" amber). Real OpenTable / Booking partners come later.
- **Transit offers** have a `Book` button. Click → offer flips to a "Booked ✓ · Remove" state and the leg's sidebar row shows the booking inline (provider on top, time + price below). Multiple per leg.
- **Sidebar stops** show a `N saved` count chip when items exist; clicking the chevron expands the wishlist below the date line. When the user saves something from the bubble, the matching stop auto-expands and the chip pulses.
- **Cascade delete**: removing a stop with saved items triggers a confirm modal listing the count. Confirm wipes the stop + its wishlist + transit bookings on adjacent legs.
- **Persistence**: everything lives in `localStorage` under `tarmil:wishlist`. Reload keeps it; different browsers / incognito start fresh.

### Misc polish

- **Photo lightbox**: click any Overview photo → centered full-screen carousel with arrow keys + Escape.
- **Toast confirmations** on every wishlist action, reorder, date edit, share. Bottom-end stack, 5-second auto-dismiss, Undo affordance when the action is reversible.
- **Map pin labels** appear in a cream pill below each numbered pin once zoom ≥ 6.
- **Trip overview subtitle**: "From Tel Aviv → back to Tel Aviv".
- **Empty Places filters** show a `bg-sand border-charcoal-15` card ("Tarmil curators are working on this one") instead of a thin line.
- **Loading skeleton** specific to the desktop planner (greyed sidebar + animated pulse map).

---

## Live APIs wired in

All free, all client-side, all cached in-memory by request shape. Failures fall back gracefully.

| API | Endpoint | Used for | Key required |
|---|---|---|---|
| **Open-Meteo** | `api.open-meteo.com/v1/forecast`, `archive-api.open-meteo.com/v1/archive` | Weather strip per stop (forecast within 14 days; archive year-shifted for far-future dates) | No |
| **Wikipedia REST** | `en.wikipedia.org/api/rest_v1/page/summary/<title>` | City description + hero image for dynamically-added cities | No |
| **Nominatim (OSM)** | `nominatim.openstreetmap.org/search` | Global city search in Add Stop + Home editor | No, but rate-limited to 1 req/sec (debounced 400 ms) |
| **REST Countries** | `restcountries.com/v3.1/alpha/<2-letter>` | Country flag + currency + language + UTC offset chip in the city bubble header | No |
| **Overpass (OSM)** | `overpass-api.de/api/interpreter` | "Nearby" sections in Eat / Drink / See / Stay tabs | No |
| **OSRM** | `router.project-osrm.org/route/v1/driving/...` | Driving distance + ETA + Drive offer | No |
| **TomTom Maps** | `api.tomtom.com/map/1/tile/basic/main/...` | Base map tiles for the planner | Optional (`VITE_TOMTOM_KEY`); falls back to OSM tiles |
| **Groq (LLM)** | `api.groq.com/openai/v1/chat/completions` (model `llama-3.3-70b-versatile`) | Rewrites Wikipedia extracts into 4-sentence travel intros, cached in localStorage | Optional (`VITE_GROQ_API_KEY`); falls back to raw Wikipedia |

---

## Vibecoder rules — read before adding screens

Easy to break, painful to debug later. Stick to them.

### 1. Use logical Tailwind utilities — RTL is on the roadmap

`index.html` is `lang="en" dir="ltr"` today. The Hebrew launch will flip `dir="rtl"`, at which point physical utilities (`pl-*`, `pr-*`, `left-*`, `right-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`) all break.

**Always write:** `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.

### 2. Brand tokens only — no hex literals in components

**Don't write:** `bg-[#faf5ec]`, `text-[#2e2417]`, `style={{ color: '#c6803d' }}`.

**Always write:** `bg-cream`, `text-charcoal`, `text-amber`.

When a hex must appear (e.g. inside a Leaflet `divIcon` HTML string where Tailwind doesn't apply), use the CSS variable: `var(--amber)`.

### 3. Type scale — 7 sizes, no others

**Don't write:** `text-[15pt]`, `text-base`, `text-xl`.

**Always write:** one of `text-meta` `text-small` `text-body` `text-lede` `text-sub` `text-display` `text-hero`.

### 4. Spacing — 6 named values for editorial spacing

**Don't write:** `p-4`, `gap-2`, `mt-6` for layout-grammar spacing.

**Always write:** one of `p-xs` `p-sm` `p-md` `p-lg` `p-xl` `p-xxl` (and `gap-*`, `m-*`, etc.). Tailwind's numeric scale (`h-10`, `w-12`, etc.) is fine for **dimensional** use on icons / avatars / FABs.

### 5. One screen = one folder = one file

Every new screen lives at `src/screens/<tab>/<Name>Screen.tsx`. Drill-downs nest under their parent tab folder. Don't create barrel `index.ts` files.

### 6. Wrap every mobile screen in `<Screen>`

`<Screen>` handles safe-area-top, cream background, and scroll for the mobile mockup. The `/web` desktop planner has its own shell (`WebPlannerScreen`) — don't wrap it in `<Screen>`.

### 7. No `100vh`

Use `h-dvh`, `h-full`, or `min-h-dvh`. Plain `vh` is wrong on mobile Safari.

---

## Brand token reference

CSS variables in `src/brand/tokens.css`; Tailwind theme references them in `tailwind.config.ts`.

### Colors

| Tailwind class | CSS variable | Hex | Use |
|---|---|---|---|
| `cream` | `--cream` | `#FAF5EC` | Soft Cream — the page, default surface |
| `sand` | `--sand` | `#E7DAC6` | Warm Stone — elevated cards, panels |
| `linen` | `--linen` | `#F1E8D8` | Pale Sand — subtle grouped fills, filters |
| `clay` | `--clay` | `#C29B82` | Muted Clay — tags, pressed / active fills |
| `blush` | `--blush` | `#EAD3C8` | Dusty Blush — atmospheric, very light |
| `charcoal` (+ `-70 / -55 / -30 / -15 / -8`) | `--charcoal` | `#2E2417` | Text, structure, **primary CTA** |
| `umber` | `--umber` | `#4A3422` | Deep Umber — strong action fill, hover |
| `amber` (+ `-85 / -70`) | `--amber` | `#C6803D` | Amber Glass — **sparing** premium/selected accent (never a button fill) |

Hexes are *derived* from the DA's named colours — see `DESIGN.md`.

### Type sizes (Tailwind classes)

`text-meta` (8 pt) · `text-small` (10 pt) · `text-body` (11 pt) · `text-lede` (14 pt) · `text-sub` (22 pt) · `text-display` (44 pt) · `text-hero` (92 pt)

### Fonts

- `font-serif` → Fraunces (Latin) + Frank Ruhl Libre (Hebrew). Headlines.
- `font-sans` → Heebo (Hebrew) + Google Sans Text (Latin). Body workhorse.

### Spacing (Tailwind classes)

`xs` (2 mm) · `sm` (4 mm) · `md` (8 mm) · `lg` (14 mm) · `xl` (22 mm) · `xxl` (36 mm). Plus `0` and `px`. `hair` (0.5 mm) for very thin borders.

### Utility classes (`src/index.css`)

- `.mid-title` — Fraunces italic 500, for "01 Concept"-style mid-titles.
- `.meta-caps` — Heebo 500 uppercase 0.18 em tracking.
- `.tnum` — tabular numerals (use on numbers in tables / ledgers / dates).
- `.ltr` — force LTR on a Latin span inside RTL text (no-op today, kept for the Hebrew flip).
- `.allow-select` — opt-in text selection (default is disabled for app-feel).

---

## Project structure

```
src/
  brand/
    tokens.css                 # CSS variables — single source of truth
  components/                  # shared between mobile + web
    Screen.tsx                 # mobile screen wrapper
    TopBar.tsx
    TabBar.tsx                 # 5-tab bottom capsule (mobile)
    DeviceFrame.tsx            # iPhone shell (mobile on desktop)
    Button.tsx                 # primary / accent / ghost
    SectionLabel.tsx           # "01 — Concept" pattern
    PlacementBadge.tsx         # Sponsored / Tarmil Selection disclosure chip
    DataState.tsx              # LoadingPanel + ErrorPanel
    Avatar.tsx · SearchBar.tsx · Modal.tsx · etc.
    activity/ · friends/ · forums/ · profile/ · tools/ · tripMap/
  layouts/
    AppLayout.tsx              # DeviceFrame + Outlet + persistent TabBar (mobile only)
  lib/
    SupabaseDataProvider.tsx   # the only sanctioned data path; wraps the whole router
    supabase.ts                # typed singleton
    database.types.ts          # generated by Supabase MCP
  screens/
    trip/ · activity/ · plan/ · forums/ · tools/ · profile/ · place/   # mobile screens
    web/                       # desktop planner (Surface 2)
      ModeToggleScreen.tsx     # at `/`, lets the visitor pick mobile vs desktop
      WebPlannerScreen.tsx     # `/web` entry — manages local stops, wishlist, modals
      WebHeader.tsx
      WebStopList.tsx          # sortable sidebar, wishlist rendering, cascade delete
      WebMapCanvas.tsx         # Leaflet map, TomTom tiles, pins + polylines
      WebBubble.tsx            # floating bubble shell
      WebCityPanel.tsx         # 6-tab city content (Overview + Stay/Eat/Drink/See/Religious)
      WebTransportPanel.tsx    # multi-mode filter + Save/Book offer cards
      WebAddStopModal.tsx      # Nominatim search + suggested cards
      WebHomeEditor.tsx        # Nominatim search to set departure/return city
      WebRemoveStopConfirm.tsx # cascade-delete confirmation
      WebBookingModal.tsx      # dormant — kept for reference
      WebPhotoLightbox.tsx     # full-screen carousel
      WebToast.tsx             # bottom-end toast layer + showToast store
      WebPlannerSkeleton.tsx   # desktop loading state
      wishlist.ts              # wishlist state + localStorage mirror
      tripMutations.ts         # add / remove / reorder / edit-dates / recalc chronology
      transportGenerator.ts    # dynamic transport offers per city pair
      homeCity.ts              # departure / return city type + persistence
      cityCopy.ts              # hardcoded travel descriptions for 8 known cities
      cityPhotos.ts            # 3 curated Unsplash URLs per known city
      cityCountries.ts         # stopId → ISO-2 country code
      cityWikiTitles.ts        # stopId → disambiguated Wikipedia title
      cityWeather.ts           # fallback weather generator + types
      addableCities.ts         # suggested cities for Add Stop
      wikiApi.ts · nominatimApi.ts · countryApi.ts · overpassApi.ts · osrmApi.ts · weatherApi.ts · groqApi.ts
      dateUtils.ts · types.ts
  routes.tsx                   # `/` ModeToggle · `/web` planner · AppLayout group for mobile
  main.tsx                     # root + BrowserRouter + SupabaseDataProvider
  index.css                    # Tailwind directives + global resets
public/
  manifest.webmanifest         # PWA manifest
  _redirects                   # Netlify SPA fallback
  icons/
index.html                     # html lang="en" dir="ltr"
tailwind.config.ts
netlify.toml
supabase/
  migrations/                  # 0001–0018; 0014 dropped DMs/chats + added pings/polls; 0016–0018 place_saves + Plan seed
```

---

## Demo flow

A 90-second walk-through for an investor.

1. **Land on `/`** — Mode toggle. Pick "Desktop Planner".
2. **`/web` planner** — Tel Aviv pin at start, 5 cities in South America, dashed lines closing the loop back to Tel Aviv. Click São Paulo → city bubble opens with photos, description, and the live weather strip. Click the **Eat** tab → Save a restaurant ("Saved" pill in charcoal, toast bottom-end). Reserve another ("Reserved" pill in amber). Close the bubble → São Paulo's count chip shows "2 saved" and the wishlist expands inline.
3. **Drag** Buenos Aires above Jericoacoara → dates auto-shift chronologically. Toast confirms.
4. **Click Add stop** → search "Cairo" → Nominatim returns results → pick Cairo → it lands at the end of the trip with a Tel Aviv → Cairo intercontinental leg. Click Cairo → bubble Overview shows the Wikipedia/Groq travel intro + a Wikipedia hero photo + live Open-Meteo weather + REST Countries chip (🇪🇬 EGP · Arabic · UTC+02:00).
5. **Click the São Paulo → Jericoacoara leg** → transit bubble with realistic flight + bus + train (Europe-only normally; here flight + bus only) + Drive offer (real distance/ETA from OSRM). Book one → the leg's sidebar row gains the booking inline.
6. **Switch to App** → navigate to `/trip` → the mobile mockup is the same product from a different angle: continent map, Activity feed, Forums, Tools.

Investors usually want to see the desktop planner first because it shows the data depth; the mobile mockup tells the consumer story.

---

## Run locally with full feature parity

```bash
# 1. Install
npm install

# 2. Env
cp .env.example .env.local
# Required:   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
# Recommended for /web: VITE_TOMTOM_KEY, VITE_GROQ_API_KEY

# 3. Dev server
npm run dev
# Open http://localhost:5173/web for the planner
# Open http://localhost:5173/trip for the mobile mockup (use DevTools mobile preset)
```

### Supabase

`tarmil-mockup` project on Supabase (eu-central-1). Anon key is safe in the browser when RLS is on. Schema in `supabase/migrations/`. Core tables: `places`, `friend_overlaps`, `trip_waypoints`, `planned_stops`, `forums`, `forum_threads`, `forum_thread_replies`, `activity_posts` (with first-class `poll` jsonb), `reactions`, `place_reviews`, `pings`, `place_saves`.

**Seed**: edit `src/data/*.ts`, then re-run `npx tsx --env-file=.env.local scripts/seed-supabase.ts`. Idempotent.

**Reset demo state**: between investor demos, hit **Profile → Settings → Reset demo state** in the mobile mockup, or call the `reset_demo_state` RPC. Clears pings, resets poll votes, restores the seed. The `/web` planner's local mutations (sortable trip, wishlist, home city) are independent and reset by clearing the user's `localStorage` (or just using a fresh browser / incognito).

---

## Deploy

Wired for Netlify. `netlify.toml` declares the build command, publish dir, SPA redirect, and manifest MIME-type header. Connect this GitHub repo, paste the env vars under **Site settings → Environment variables**, and the auto-detected build (`npm run build` → `dist/`) ships.

---

## Roadmap aligned to the Product Brief

| Milestone | Date | Highlights |
|---|---|---|
| **MVP — M1** | August 2026 | 5 tabs live, worldwide curated places, phone + email verification, Hebrew-only, native iOS + Android |
| **V1 — M4** | November 2026 | Diaspora launch (English / French / Spanish), GDPR + CCPA, desktop companion (the `/web` surface here is the first sketch), Smart Route Engine, Destination Intelligence, first partner-channel deals |
| **V2 — M6** | January 2027 | Detailed itineraries, structured live events, expenses beyond pairwise, Chabad partnership, loyalty progression |
| **V3 — M9** | April 2027 | TarmilCard (banking-as-a-service), older-segment expansion |

This repo is the **investor-facing mockup**. Real implementation lives in the native iOS + Android codebases the CTO will own; the desktop surface here previews the V1 companion view.

---

## Known follow-ups

- Phone + email identity verification onboarding screen (brief §04).
- Per-trip privacy persistence on `planned_stops` (UI today is local state).
- Real authentication + per-user data (Supabase model is shared global demo state).
- Real booking partners (OpenTable, Booking.com, Expedia) — the planner's Save / Reserve / Book buttons are dead mocks today.
- Merchant model is disclosed but light: `placementTier` is derived from the existing `paid_placement` / `tarmil_pick` columns (no schema change). A dedicated kashrut-`certification` column and a routed "How Tarmil Works" page are future work.
- Hebrew/RTL toggle — every utility is already logical so the flip is free, but no UI toggle ships yet.
- Photography rule, app icon PNGs, custom iconography — brand pass open items.

---

## Project documents

- [`PRODUCT.md`](PRODUCT.md) — product context for the impeccable design skill (users, anti-references, tone, strategic principles)
- [`DESIGN.md`](DESIGN.md) — full design system reference (DA v0.3)
- [`CLAUDE.md`](CLAUDE.md) — handover notes for AI assistants working on the codebase
