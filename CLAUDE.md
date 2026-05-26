# Tarmil — Notes for Claude (and other AI assistants)

This is the Tarmil mobile-mockup repo. Read this BEFORE writing any code.

## What this is

An English-first click-through mockup of Tarmil, served as a static SPA. It ships two surfaces: the **mobile app** (full-bleed on phones; inside an iPhone frame on desktop ≥768px) and a **desktop planner at `/web`** (a 3-column workspace with live map/weather/wiki APIs). A `/` mode toggle picks which to demo. Visual demo — Supabase-backed trip state, but no real auth or translation.

Five bottom tabs (one mental model per tab), in order:

| Tab | Purpose |
|---|---|
| Trip | Continent-scale map (pins and bubbles, no line) + curated places + friend pins + next-trip card. Friend pins → Ping. |
| Plan | Saved places organised by trip — the list view of the map. A "+ Discover" modal surfaces curated places (Now / My trip / Search). |
| Activity | The social feed. "Right now" overlap strip + wall of trip declarations / who's-down / polls / questions. Compose FAB. Ping history bell. |
| Forums | City × 8 subjects: Accommodation · Transits · Scams & danger · Food · Activities & treks · Nightlife & parties · Money & visas · Meetups. Per-post identity choice. |
| Tools | Grid of 7 utility tiles (currency, checklist, voice, menu, signs, balances, eSIM). |

Curated places lean into kosher & Jewish-friendly venues (synagogues, mikvaot, kosher food, Chabad) alongside the general set, with a **disclosed** two-tier merchant model: **Sponsored** (paid, labelled) and earned **Tarmil Selection**. See `PlacementBadge` + the place-detail disclosure.

**Profile is not a tab.** Top-right avatar icon on every tab → drills to `/profile`. Friends list at `/profile/friends`; single-friend drill-down at `/profile/friend/:id`.

The brief mandates Hebrew-first for the real product. The mock is **English-only for international investors**. The schema and brand are bilingual-ready (Hebrew columns and Frank Ruhl Libre stay in place); the rendered UI today is English.

## Stack

- Vite 5 + React 18 + TypeScript (strict).
- Tailwind CSS **3.4+** (required for native logical-property utilities).
- React Router 6 with a single `AppLayout` route.
- `clsx` for class composition. `lucide-react` for icons.
- Supabase backend via `@supabase/supabase-js` — typed singleton at `src/lib/supabase.ts`. Schema in `supabase/migrations/`. App-wide `SupabaseDataProvider` (in `src/lib/`) wraps the router and exposes `useSupabaseData()` — the only sanctioned way to read or mutate trip data at runtime. Realtime is on for `planned_stops`, `forum_thread_replies`, `activity_posts`, `reactions`, and `pings`.
- Seed source-of-truth: `src/data/*.ts` arrays. `scripts/seed-supabase.ts` (run with `npx tsx --env-file=.env.local scripts/seed-supabase.ts`) imports them and upserts via supabase-js. Edit a TS file → re-run the seed → DB matches.
- No state management library. No animation library. No tests yet. i18n is hardcoded English — Hebrew launch flips `<html lang dir>` and swaps copy.

## Hard rules — do not violate without asking

### Token discipline (DA v0.3)

The codebase enforces zero drift on the DA token set. **Don't reintroduce drift.** Specifically:

- No arbitrary `text-[Xpt]` values — pick from the 7-size scale.
- No arbitrary spacing like `p-3` / `gap-2` for editorial spacing — use `xs/sm/md/lg/xl/xxl`. (Tailwind's numeric scale `h-10`, `w-12`, etc. is fine for *dimensional* use on icons / avatars / FABs.)
- No physical Tailwind utilities (`pl-*`, `pr-*`, `ml-*`, etc.) — use logical equivalents.
- No side-stripe borders > 1px as a colored accent on cards. Full ring, full border, or nothing.
- No `100vh`. Use `h-dvh` / `h-full` / `min-h-dvh`.
- No bare hex literals in `className` or `style`.
- Every interactive element has `focus-visible:ring-2 ring-amber` (or `focus-visible:underline` for inline text links).
- Universal `prefers-reduced-motion` is honored via `index.css` — you don't need to sprinkle `motion-reduce:transition-none` on every element, but adding it on shared primitives makes intent explicit.

### RTL safety: logical properties only

`index.html` is `lang="en" dir="ltr"` today. The Hebrew launch flips both, at which point physical Tailwind utilities (`pl-*`, `pr-*`, `left-*`, `right-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`) all break.

Always use logical equivalents: `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`. Zero cost today, free Hebrew launch later.

For mixed-direction text down the road, wrap Latin spans in `<bdi>` or apply `.ltr`.

### Brand tokens only — no hex literals

The DA v0.3 palette lives in `src/brand/tokens.css`, mapped to Tailwind in `tailwind.config.ts`. (Hexes are *derived* from the DA's named colours — see DESIGN.md.)

- Colors — 8 named tokens: `cream` (page), `sand` (Warm Stone cards), `linen` (Pale Sand fills), `clay` (Muted Clay tags / pressed fills), `blush` (atmospheric), `charcoal` (text + primary CTA, + `-70/-55/-30/-15/-8`), `umber` (strong action + hover), `amber` (sparing premium/selected accent, + `-85/-70`). Primary CTAs are charcoal, the accent button is umber, and **amber is never a button fill** — reserve it for selected states, focus rings, and warmth.
- Type sizes: `text-meta` (8pt) · `text-small` (10pt) · `text-body` (11pt) · `text-lede` (14pt) · `text-sub` (22pt) · `text-display` (44pt) · `text-hero` (92pt). Nothing else.
- Spacing: `xs` (2mm) · `sm` (4mm) · `md` (8mm) · `lg` (14mm) · `xl` (22mm) · `xxl` (36mm). Plus `0` and `px`.
- Fonts: `font-serif` (Fraunces + Frank Ruhl Libre) for headlines; `font-sans` (Heebo + Google Sans Text) for body.

If you need a value not in this list, **stop and ask** — don't invent one.

### Heights: never `100vh`

Use `h-dvh`, `h-full`, or `min-h-dvh`. Plain `100vh` is wrong on mobile Safari (collapsing-toolbar bug).

### One screen = one folder = one file

`src/screens/<tab>/<Name>Screen.tsx`. Drill-downs nest under their parent tab. **No barrel `index.ts` files.**

Today the five tab folders are `trip/`, `plan/`, `activity/`, `forums/`, `tools/`, plus `web/` (the desktop planner surface). The `profile/` folder holds Profile + its drill-downs (`FriendsListScreen`, `FriendProfileScreen`, `settings/SettingsScreen`). The `place/` folder holds the cross-tab `PlaceScreen` drill-down.

### Wrap every screen in `<Screen>`

`<Screen>` handles safe-area-top, cream background, and scroll. Don't bypass it. (The `/web` planner has its own shell — don't wrap it in `<Screen>`.)

## Brief alignment — what's in, what's out

The brief is the source of truth for product decisions. Today's mock implements the MVP scope with a couple of V1-flavoured surfaces seeded so the demo is full.

**In (matches brief MVP scope):**

- 5 tabs above.
- Pins-and-bubbles trip map with no connecting line (brief §04).
- Worldwide curated places from day one.
- Forums: anyone verified can post; identity per post is the user's choice (full name or anonymous).
- Activity wall: text + emoji + optional city-level pin + optional 2-4 option **poll**, flat one-level replies, lightweight reactions, NO media.
- Ping: one-shot signal, one per direction per co-presence event (enforced by `pings.unique (friend_id, direction)`).
- Off-grid mode: one-tap switch on Profile root.
- Per-trip privacy: visible-to-friends + visible-to-FoF toggles per planned stop.
- Tools tiles: 7 from brief §05. Curated-place discovery lives in the Plan tab's Discover modal (the former Around tab dissolved into Plan).
- Disclosed merchant model: curated places carry a labelled **Sponsored** tier and an earned **Tarmil Selection** tier (`placementTier`, derived from `paid_placement` / `tarmil_pick`); ranking is Selection → Sponsored → public, and non-payers are never suppressed.

**Out (brief §06):**

- Direct messages — never. Ping is the only one-to-one signal and carries no body.
- Group chats — never.
- Media inside Activity posts — never.
- Public profiles / public discoverability — never.
- Re-pinging the same overlap — blocked by the unique constraint.

**Deliberately not in this mockup (later PRs):**

- Real authentication + per-user data — Supabase is shared global demo state today.
- Phone + email identity verification onboarding screen — brief §04 mandates; mocked screen comes later.
- Per-trip privacy persistence — UI today is local state; schema column comes later.
- Real translation / OCR / Google Maps / Mapbox.
- `react-i18next` — English hardcoded; Hebrew + French + Spanish copies arrive at V1.
- Animation libraries.
- Tests.
- Dark mode (DA is single-palette warm).

## Common tasks

### Add a new screen

1. Create `src/screens/<tab>/<Name>Screen.tsx`.
2. Use `<Screen>` + `<TopBar>` + base components.
3. Add a route in `src/routes.tsx` under the layout route.
4. For drill-downs, set `back` on `<TopBar>`.
5. If the screen reads or mutates trip data, call `useSupabaseData()` and gate render on `loading` / `error` with `<LoadingPanel />` / `<ErrorPanel />` (in `src/components/DataState.tsx`). Don't import from `src/data/` at runtime — those arrays are seed-only.

### Add a new mutation

1. Add the SQL change in a new migration file under `supabase/migrations/` (numbered after the latest, currently `0018`).
2. Apply it (locally via Supabase CLI or via the Supabase MCP `apply_migration`).
3. Regenerate types: re-run `generate_typescript_types` and overwrite `src/lib/database.types.ts`.
4. Add a mutator method on `SupabaseDataProvider` (camelCase, async, refetches on success).
5. Surface the mutator from `useSupabaseData()` and call it from the relevant screen.

### Style a new component

- Default surface: `bg-cream`.
- Elevated surface (cards, panels): `bg-sand` with `border border-charcoal-15` (prefer a tone shift over a coloured rule).
- Headlines: `font-serif text-lede` (or larger) with default `text-charcoal`.
- Body copy: default sans, `text-body text-charcoal`. Lower-emphasis: `text-charcoal-70` or `text-charcoal-55`. Never `text-clay` for primary type.
- Primary CTA: `<Button variant="primary">` (charcoal). Strong/accent action: `<Button variant="accent">` (umber). Amber is for selected states/badges, not buttons.
- Merchant badge: `<PlacementBadge tier={place.placementTier} />`.
- Section headers: `<SectionLabel number="01" label="..." />`.

### Add an icon

- Pick from `lucide-react` and use the same `strokeWidth` (1.5 for inactive, 2 for active states).
- For the Hebrew letter ט mark, see `public/icons/icon.svg` — keep that as the placeholder until the brand designer ships a proper PNG.

## DA open items — flag before solving

These are open in the DA and should not be solved without brand input:

- Exact brand hexes (the current 8-token set is derived) + mood-board calibration.
- App icon (PNG variants for iOS/Android/maskable).
- Photography rule — colour treatment, captions.
- Custom tab bar / place marker iconography.
- Motion vocabulary (durations + easing).

If a task touches any of these, point it out and ask the founder to escalate to the brand pass.

## Tone

The DA voice section: sentence cap ~28 words, prefer ~14. Avoid "synergy", "leverage" (verb), "ecosystem", "play" (noun), "moat-y". Active voice. This applies to copy in screens too.

## Useful commands

```bash
npm run dev        # dev server, http://localhost:5173
npm run build      # production build → dist/
npm run typecheck  # tsc --noEmit
npm run preview    # serve dist/
```

The Netlify config (`netlify.toml`) wires deploy. Don't change it without flagging.
