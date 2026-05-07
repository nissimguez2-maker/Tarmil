# Tarmil — Mobile Mockup

Investor-facing click-through mockup of the Tarmil mobile app.

- **On a phone**: opens 100% app-like — full-bleed, no browser chrome.
- **On desktop / tablet (≥768px)**: shows an iPhone frame with the app running inside it.
- **Hebrew RTL from day one.**
- Pure click-through. No real backend, no real maps API, no real translation.

This is the **foundation** — brand tokens, RTL, fonts, iPhone frame, 4 tab routes with placeholder screens, base components, deploy config. Real screens get built one PR at a time on top of this base.

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

Backed by a Supabase project in the PolyGuez org (`eu-central-1`). The client singleton lives at `src/lib/supabase.ts`. Values for `.env.local` come from **Project Settings → API** in the Supabase dashboard. The anon key is safe in the browser when RLS is on; never commit `.env.local` (it's gitignored). For Netlify, add the same two vars under **Site settings → Environment variables**.

---

## Vibecoder rules — read before adding screens

These are easy to break and painful to debug later. Stick to them.

### 1. RTL: never use directional Tailwind utilities

**Don't write:** `pl-*`, `pr-*`, `left-*`, `right-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`.

**Always write:** `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.

These are Tailwind 3.3+ "logical properties" — they auto-resolve based on `dir` (rtl in our case). Using `pl-4` will literally always pad the **left** side, regardless of direction, and break in Hebrew.

For mixed-direction text (e.g., a Latin city name inside a Hebrew sentence), wrap the Latin part in `<bdi>` or apply the `.ltr` utility class.

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
- `.ltr` — force LTR on a Latin span inside RTL text.
- `.allow-select` — opt-in text selection (default is disabled for app-feel).

---

## Add a new screen — 5-step recipe

1. Create `src/screens/<tab>/<Name>Screen.tsx`.
2. Wrap content in `<Screen>` and (optionally) `<TopBar>`.
3. Use base components: `<SectionLabel>`, `<Button>`, `<PlaceCard>`, `<Dunes>`.
4. Add route in `src/routes.tsx` under the layout route.
5. If the screen is a drill-down, set `back` on `<TopBar>` so the back chevron appears.

---

## Project structure

```
src/
  brand/
    tokens.css           # CSS variables — single source of truth
  components/
    Screen.tsx           # safe-area wrapper + ivory bg + scroll
    TopBar.tsx           # title + back chevron + end slot
    TabBar.tsx           # 4 tabs, RTL order, active route detection
    DeviceFrame.tsx      # iPhone shell, desktop-only via CSS
    Button.tsx           # primary / accent / ghost
    SectionLabel.tsx     # "01 — Concept" pattern
    PlaceCard.tsx        # sand bg, rope border, place metadata
    Dunes.tsx            # 3-layer SVG signature
  layouts/
    AppLayout.tsx        # DeviceFrame + Outlet + persistent TabBar
  screens/
    trip/TripScreen.tsx
    tools/ToolsScreen.tsx
    friends/FriendsScreen.tsx
    profile/ProfileScreen.tsx
  routes.tsx             # route table
  main.tsx               # root + BrowserRouter
  index.css              # Tailwind directives + global resets
public/
  manifest.webmanifest   # PWA manifest (lang: he, dir: rtl)
  _redirects             # Netlify SPA fallback
  icons/
    icon.svg             # placeholder — replace when DA "App icon" lands
    icon-maskable.svg
index.html               # html dir="rtl" lang="he", PWA meta, font links
tailwind.config.ts
netlify.toml
```

---

## Deploy

Wired for Netlify. `netlify.toml` declares the build command, publish dir, SPA redirect, and manifest MIME-type header.

Connect this GitHub repo to a Netlify site. Netlify auto-detects the build (`npm run build` → `dist/`). Add a custom domain (e.g. `mockup.tarmil.app`) when an investor meeting is scheduled — until then, the assigned `*.netlify.app` subdomain is fine.

---

## Open from DA v0.2 — TODO before launch (not blocking foundation)

Per DA §Open / deferred — flagged for awareness:

1. **Hebrew typography** — Frank Ruhl Libre + Heebo proposed. Validate with a Hebrew typographer.
2. **Photography** — undefined. Travel app cannot ship without this rule.
3. **Logo / wordmark** — currently the word "Tarmil" set in Fraunces 700.
4. **Hebrew wordmark** — טרמיל, needed for App Store listing.
5. **App icon** — placeholder SVG in `public/icons/`. Real PNG icons (180/192/512, maskable) needed for "Add to Home Screen" and store.
6. **Iconography** — primitive Lucide icons used. Custom tab/place markers needed.
7. **Motion vocabulary** — tab switch, modal in/out, scroll. Currently no animation.
8. **Loading / empty / error states** — undefined.

---

## What's next (PR roadmap)

- **PR2** — Trip screen built out: stylized SVG continent map, trip line (past/present/future), friend overlap bubbles, place card drill-down at `/place/:id`.
- **PR3** — Tools list active: Currency Converter sub-screen at `/tools/currency`.
- **PR4** — Friends with overlap detail at `/friends/:id`.
- **PR5** — Profile own-trip detail.
- **PR6** — Polish: tab-switch transition, status-bar mock refinements, loading states.
