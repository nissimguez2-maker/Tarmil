# Tarmil — Notes for Claude (and other AI assistants)

This is the Tarmil mobile-mockup repo. Read this BEFORE writing any code.

## What this is

A Hebrew-RTL click-through mockup of the Tarmil mobile app, served as a static SPA. On phones it goes full-bleed and feels native; on desktop ≥768px it renders inside an iPhone frame. Pure visual demo — no real backend, no real maps API, no real translation. Foundation only in PR1; feature screens land one PR at a time on top.

## Stack

- Vite 5 + React 18 + TypeScript (strict).
- Tailwind CSS **3.4+** (required for native logical-property utilities).
- React Router 6 with a single `AppLayout` route.
- `clsx` for class composition. `lucide-react` for icons.
- Supabase via `@supabase/supabase-js` — client singleton at `src/lib/supabase.ts`. Reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` from `.env.local` (see `.env.example`). Project lives in the PolyGuez org, region `eu-central-1`.
- No state management library. No animation library. No i18n framework. No tests yet.

## Hard rules — do not violate without asking

### RTL: logical properties only

The app runs `<html dir="rtl" lang="he">`. Directional Tailwind utilities (`pl-*`, `pr-*`, `left-*`, `right-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`) **always** resolve to physical left/right and **break in RTL**.

Use logical equivalents: `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.

For Latin text inside Hebrew sentences, wrap in `<bdi>` or apply `.ltr`.

### Brand tokens only — no hex literals

The DA v0.2 is locked. CSS variables in `src/brand/tokens.css`, mapped to Tailwind theme in `tailwind.config.ts`.

- Colors: `ivory`, `sand`, `rope`, `stone`, `cocoa` (+ `cocoa-70/55/30/15/8`), `copper` (+ `copper-85/70` only — never below 70%).
- Type sizes: `text-meta` (8pt) · `text-small` (10pt) · `text-body` (11pt) · `text-lede` (14pt) · `text-sub` (22pt) · `text-display` (44pt) · `text-hero` (92pt). Nothing else.
- Spacing: `xs` (2mm) · `sm` (4mm) · `md` (8mm) · `lg` (14mm) · `xl` (22mm) · `xxl` (36mm). Plus `0` and `px`.
- Fonts: `font-serif` (Fraunces + Frank Ruhl Libre) for headlines; `font-sans` (Heebo + Google Sans Text) for body.

If you need a value not in this list, **stop and ask** — don't invent one.

### Heights: never `100vh`

Use `h-dvh`, `h-full`, or `min-h-dvh`. Plain `100vh` is wrong on mobile Safari (collapsing-toolbar bug).

### One screen = one folder = one file

`src/screens/<tab>/<Name>Screen.tsx`. Drill-downs nest under their parent tab. **No barrel `index.ts` files.**

### Wrap every screen in `<Screen>`

`<Screen>` handles safe-area-top, ivory background, and scroll. Don't bypass it.

## Common tasks

### Add a new screen

1. Create `src/screens/<tab>/<Name>Screen.tsx`.
2. Use `<Screen>` + `<TopBar>` + base components.
3. Add a route in `src/routes.tsx` under the layout route.
4. For drill-downs, set `back` on `<TopBar>`.

### Style a new component

- Default surface: `bg-ivory`.
- Elevated surface (cards, panels): `bg-sand` with `border border-rope` or `border-cocoa-15`.
- Headlines: `font-serif text-lede` (or larger) with default `text-cocoa`.
- Body copy: default sans, `text-body text-cocoa`. Lower-emphasis: `text-cocoa-70` or `text-cocoa-55`. Never `text-stone` for primary type (DA forbids).
- Primary CTA: `<Button variant="primary">`.
- Vibrant CTA: `<Button variant="accent">`.
- Section headers: `<SectionLabel number="01" label="..." />`.

### Add an icon

- Pick from `lucide-react` and use the same `strokeWidth` (1.5 for inactive, 2 for active states).
- For the Hebrew letter ט mark, see `public/icons/icon.svg` — keep that as the placeholder until the brand designer ships a proper PNG.

## DA open items — flag before solving

These are listed in DA v0.2 §Open and should not be solved without brand input:

- App icon (PNG variants for iOS/Android/maskable).
- Photography rule — colour treatment, captions.
- Custom tab bar / place marker iconography.
- Motion vocabulary (durations + easing).
- Loading / empty / error states.

If a task touches any of these, point it out and ask the founder to escalate to the brand pass.

## Deferred until later PRs

- Real authentication. Supabase client is wired (see Stack) but no schema or DB-backed screens yet — all data still lives in `src/data/`.
- Real translation / OCR / Google Maps / Mapbox.
- `react-i18next` — Hebrew-only mockup, hardcode strings.
- Animation libraries.
- Tests.
- Dark mode (DA is single-palette warm).

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
