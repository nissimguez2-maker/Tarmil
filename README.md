# Tarmil — Mobile Mockup

Investor-facing click-through mockup of the Tarmil mobile app.

- **On a phone**: opens 100% app-like — full-bleed, no browser chrome.
- **On desktop / tablet (≥768px)**: shows an iPhone frame with the app running inside it.
- **English-first** for international investors. The brand and schema are bilingual-ready (Hebrew column names stay in place for the eventual launch — UI renders the English copy).
- Pure click-through. No real backend, no real maps API, no real translation.

The app ships **5 bottom tabs**, exactly as the Product Brief mandates:

| Tab | Surface |
|---|---|
| **Trip** | Continent-scale map with pins and bubbles (past, present, declared future). Curated places, friend pins, next-trip card. |
| **Friends** | Four sub-sections via a top SubNav — **Overlaps** (one-tap Ping per row) · **Activity** wall (text + emoji + optional city pin + optional 2–4 option poll, flat one-level replies, lightweight reactions) · **Ping** (one-shot signal history) · **Friends** list (search, friend requests, FoF opt-ins, density toggle). |
| **Forums** | City × subject (5 subjects per city). Per-post identity choice (post as your name, or anonymous). One level of replies — no nested threads. |
| **Tools** | Grid of tiles — Currency converter · Pre-trip checklist · Voice translator · Menu translator · Sign scanner · Friend balances · eSIM & data · Places nearby. |
| **Profile** | Off-grid one-tap switch, your trip, past trips, friends preview, per-trip privacy. Settings gear in the top bar. |

---

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serves dist/ at http://localhost:4173
npm run typecheck
```

Open in two browser shapes to see both modes:

- A **desktop window** ≥768px wide → iPhone frame appears.
- **DevTools → device preset → iPhone 15 Pro** → full-bleed mobile view.

### Supabase

Backed by a Supabase project (`tarmil-mockup`, eu-central-1). Values for `.env.local` come from **Project Settings → API** in the dashboard. The anon key is safe in the browser when RLS is on; never commit `.env.local` (it's gitignored). For Netlify, add the same two vars under **Site settings → Environment variables**.

**Schema** lives in `supabase/migrations/`. Core tables: `places`, `friend_overlaps`, `trip_waypoints`, `planned_stops`, `forums` (city × subject), `forum_threads`, `forum_thread_replies`, `activity_posts` (with first-class `poll` jsonb), `reactions`, `place_reviews`, `pings`. RLS is on everywhere: `anon` reads everything, `anon` has full CRUD on the demo-mutable tables (`planned_stops`, `pings`, `activity_posts`, etc.).

Removed in v0.5 per brief §06 ("Direct messages and group chats — never"): `dm_threads`, `dm_messages`, `group_chats`, `group_chat_members`, `group_messages`.

**Seed**: edit the arrays in `src/data/*.ts`, then re-run `npx tsx --env-file=.env.local scripts/seed-supabase.ts`. Idempotent (upsert).

**Demo model**: shared global state. Every viewer sees the same data; edits broadcast in real time via Supabase Realtime. Between investor demos, hit **Profile → Settings → Reset demo state** to restore the canonical seed (RPC: `reset_demo_state`). The RPC also clears any pings sent during the session and resets poll vote tallies.

---

## Vibecoder rules — read before adding screens

These are easy to break and painful to debug later. Stick to them.

### 1. Use logical Tailwind utilities — RTL is on the roadmap

`index.html` is currently `lang="en" dir="ltr"` for the investor mockup. The Hebrew launch will flip `dir="rtl"`, at which point physical utilities (`pl-*`, `pr-*`, `left-*`, `right-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`) all break.

**Always write:** `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`. These are Tailwind 3.3+ logical properties — they resolve correctly under both directions and cost nothing to use today.

### 2. Brand tokens only — no hex literals in components

**Don't write:** `bg-[#F4EBD5]`, `text-[#352818]`, `style={{ color: '#C75D24' }}`.

**Always write:** `bg-ivory`, `text-cocoa`, `text-copper`.

The full token map is below. If a color you want isn't here, **don't invent one** — talk to the brand. The DA is locked.

### 3. Type scale — 7 sizes, no others

**Don't write:** `text-[15pt]`, `text-base`, `text-xl`, `text-lg`.

**Always write:** one of `text-meta` `text-small` `text-body` `text-lede` `text-sub` `text-display` `text-hero`.

### 4. Spacing — 6 values, no others

**Don't write:** `p-4`, `gap-2`, `mt-6`.

**Always write:** one of `p-xs` `p-sm` `p-md` `p-lg` `p-xl` `p-xxl` (and `gap-*`, `m-*`, etc. with the same suffixes). For zero, `p-0` is fine. For 1px hairlines, `p-px` is fine.

### 5. One screen = one folder = one file

Every new screen lives at `src/screens/<tab>/<Name>Screen.tsx`. Drill-downs nest under their parent tab folder. Don't create barrel `index.ts` files — they confuse AI assistants and slow down navigation.

When you add a new screen, also add a route in `src/routes.tsx`. That's it.

### 6. Wrap every screen in `<Screen>`

`<Screen>` handles safe-area-top, ivory background, and scroll. Don't roll your own.

### 7. Don't touch heights with `100vh`

Use `h-dvh` (dynamic viewport — iOS Safari-aware), `h-full`, or `min-h-dvh`. Plain `vh` is wrong on mobile Safari.

---

## Brand token reference

Drop-in from DA v0.2. CSS variables live in `src/brand/tokens.css`; Tailwind theme references them in `tailwind.config.ts`.

### Colors

| Tailwind class | CSS variable | Hex | Use |
|---|---|---|---|
| `ivory` | `--ivory` | `#F4EBD5` | Default surface, "the paper" |
| `sand` | `--sand` | `#EAD8C0` | Elevated cards, panels |
| `rope` | `--rope` | `#D1BB9E` | Mid-tone, dividers |
| `stone` | `--stone` | `#A79277` | Darkest neutral, never primary type |
| `cocoa` (+ `cocoa-70/55/30/15/8`) | `--cocoa` | `#352818` | Headlines, body, structure |
| `copper` (+ `copper-85/70`) | `--copper` | `#C75D24` | Vibrant accent, primary actions, **never below 70% opacity** |

### Type sizes (Tailwind classes)

`text-meta` (8pt) · `text-small` (10pt) · `text-body` (11pt) · `text-lede` (14pt) · `text-sub` (22pt) · `text-display` (44pt) · `text-hero` (92pt)

### Fonts

- `font-serif` → Fraunces (Latin) + Frank Ruhl Libre (Hebrew). Use for headlines.
- `font-sans` → Heebo (Hebrew) + Google Sans Text (Latin). Default body.

### Spacing (Tailwind classes)

`xs` (2mm) · `sm` (4mm) · `md` (8mm) · `lg` (14mm) · `xl` (22mm) · `xxl` (36mm). Plus `0` and `px`.

### Utility classes (in `src/index.css`)

- `.mid-title` — Fraunces italic 500, sentence case, for "01 Concept"-style mid-titles.
- `.meta-caps` — Heebo 500 uppercase 0.18em, used inside `<SectionLabel>`.
- `.tnum` — tabular numerals (use on numbers in tables/ledgers).
- `.ltr` — force LTR on a Latin span inside RTL text (no-op today, kept for the Hebrew flip).
- `.allow-select` — opt-in text selection (default is disabled for app-feel).

---

## Add a new screen — 5-step recipe

1. Create `src/screens/<tab>/<Name>Screen.tsx`.
2. Wrap content in `<Screen>` and (optionally) `<TopBar>`.
3. Use base components: `<SectionLabel>`, `<Button>`, `<PlaceCard>`, `<SubNav>`, `<Modal>`, `<BottomSheet>`, `<Dunes>`.
4. Add route in `src/routes.tsx` under the layout route.
5. If the screen is a drill-down, set `back` on `<TopBar>` so the back chevron appears.

---

## Project structure

```
src/
  brand/
    tokens.css                # CSS variables — single source of truth
  components/
    Screen.tsx                # safe-area wrapper + ivory bg + scroll
    TopBar.tsx                # title + back chevron + end slot
    TabBar.tsx                # 5 tabs: Trip · Friends · Forums · Tools · Profile
    DeviceFrame.tsx           # iPhone shell, desktop-only via CSS
    Button.tsx                # primary / accent / ghost
    SectionLabel.tsx          # "01 — Concept" pattern
    PlaceCard.tsx             # sand bg, rope border, place metadata
    Dunes.tsx                 # 3-layer SVG signature
    activity/                 # post cards (TripDeclaration, WhosDown, OverlapNotification)
    friends/                  # PingButton, PollCard, PollComposer, PingHistoryRow, ActivityComposeModal
    forums/                   # ForumRow, IdentityToggle
    profile/                  # FriendGridItem, PastTripCard, StatsPill, ToolDetailSheet
    tools/                    # ToolsGrid, AroundMePanel (Places nearby), BusinessCard, FriendRatingsRow, StarRow
    shared/                   # Avatar, SearchBar, SubNav, Fab, Modal, BottomSheet, ToolsButton
    tripMap/                  # MapLibre canvas, sheets, layers, utils
  layouts/
    AppLayout.tsx             # DeviceFrame + Outlet + persistent TabBar
  lib/
    SupabaseDataProvider.tsx  # the only sanctioned data path
    supabase.ts               # typed singleton
    database.types.ts         # generated by Supabase MCP
  screens/
    trip/                     # TripScreen + TripDetailScreen
    friends/                  # FriendsScreen + FriendProfileScreen
    forums/                   # ForumsScreen + ForumScreen + ForumThreadScreen
    tools/                    # ToolsScreen
    profile/                  # ProfileScreen + settings/SettingsScreen
    place/                    # PlaceScreen + MapsActionSheet
  routes.tsx                  # route table (5 tabs + drill-downs + legacy redirects)
  main.tsx                    # root + BrowserRouter
  index.css                   # Tailwind directives + global resets
public/
  manifest.webmanifest        # PWA manifest
  _redirects                  # Netlify SPA fallback
  icons/
    icon.svg                  # placeholder — replace when DA "App icon" lands
    icon-maskable.svg
index.html                    # html lang="en" dir="ltr" today; Hebrew flip lands later
tailwind.config.ts
netlify.toml
supabase/
  migrations/                 # 0001-0014; 0014 dropped DMs/group-chats, added pings + polls
```

---

## Demo flow

A 60-second walk-through for an investor:

1. **Trip** — Map opens with bubbles and pins. Tap a friend pin → FriendSheet with one-tap **Ping**. Tap a place → reviews + friends-who-know.
2. **Friends → Overlaps** — Each row has its own Ping button. Tap one; the row enters a "Pinged" state (no re-pinging the same overlap — brief §04).
3. **Friends → Activity** — Tap the copper FAB to compose. Add an emoji, pin a city, optionally attach a 2-4 option **poll**. Submit; the post renders with a `<PollCard>` that lets the user vote.
4. **Friends → Ping** — See the Ping you just sent + the seeded inbound pings.
5. **Forums** — City-grouped subject forums. Drill into a thread; the reply composer has an identity selector (post as your name, or anonymous).
6. **Tools** — 8 tiles. Tap **Places nearby** to see the partner-channel paid placements as a sheet. Tap **Currency converter** for the interactive demo.
7. **Profile** — Big copper **Off-grid mode** switch. Per-trip privacy section. Settings gear at the top.

---

## Deploy

Wired for Netlify. `netlify.toml` declares the build command, publish dir, SPA redirect, and manifest MIME-type header.

Connect this GitHub repo to a Netlify site. Netlify auto-detects the build (`npm run build` → `dist/`). Add a custom domain when an investor meeting is scheduled — until then, the assigned `*.netlify.app` subdomain is fine.

---

## Roadmap aligned to the Product Brief

| Milestone | Date | Highlights |
|---|---|---|
| **MVP — M1** | August 2026 | 5 tabs live, worldwide curated places, phone + email verification, Hebrew-only, native iOS + Android |
| **V1 — M4** | November 2026 | Diaspora launch (English / French / Spanish), GDPR + CCPA, desktop companion, Smart Route Engine, Destination Intelligence, first partner-channel deals |
| **V2 — M6** | January 2027 | Detailed itineraries, structured live events, expenses beyond pairwise, Chabad partnership, loyalty progression |
| **V3 — M9** | April 2027 | TarmilCard (banking-as-a-service), older-segment expansion |

This repo is the **investor-facing mockup**. Real implementation lives in the native iOS + Android codebases the CTO will own.

---

## Known follow-ups

These are tracked but not in scope for this branch:

- Phone + email identity verification onboarding screen (brief §04).
- Per-trip privacy persistence on `planned_stops` (UI today is local state).
- Real authentication + per-user data (Supabase model is shared global demo state).
- Photography rule, app icon PNGs, custom iconography — brand pass open items.
