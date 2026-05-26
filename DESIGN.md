# Tarmil — Design System (DA v0.3)

Source of truth: `Branding/TARMIL DA.md` (Drive). CSS variables in
`src/brand/tokens.css`, Tailwind mapping in `tailwind.config.ts`. Use these
tokens better; don't invent new ones.

> The hex values below are **derived** from the DA's named colours and roles
> (the DA gives names, not codes). They're approved as a working set — easy to
> nudge once the brand designer ships exact values.

## Theme

**Quiet confidence.** Warm cream backgrounds, dark ink type, generous negative
space, a calm and highly controlled interface. Premium because restrained —
depth comes from composition, tone, and whitespace, not from loud colour or
heavy shadow. Reads as **cream + dark ink first**; warm tones add richness, not
noise. Amber is a sparing premium/selected accent — never a CTA, never long
copy. No dark mode.

## Colors

| Token | Hex | Role |
|---|---|---|
| `cream` | `#FAF5EC` | Soft Cream — the page; default canvas |
| `sand` | `#E7DAC6` | Warm Stone — elevated surface: cards, panels, sections |
| `linen` | `#F1E8D8` | Pale Sand — subtle grouped fills, filters, soft fields |
| `clay` | `#C29B82` | Muted Clay — tags, soft emphasis, pressed/active fills |
| `blush` | `#EAD3C8` | Dusty Blush — atmospheric support, very light usage only |
| `charcoal` | `#2E2417` | Charcoal Brown — text, structure, **primary CTA fills** |
| `charcoal-70` | `#2E2417b3` | Secondary body, readable contextual text |
| `charcoal-55` | `#2E24178c` | Metadata, captions, the "Sponsored" label |
| `charcoal-30` | `#2E24174d` | Decorative dividers, faint accents |
| `charcoal-15` | `#2E241726` | Hairline borders (prefer tone shifts over heavy rules) |
| `charcoal-8` | `#2E241714` | Subtle dividers inside light surfaces |
| `umber` | `#4A3422` | Deep Umber — hover/anchors, **strong action fills** (accent button, send, FAB) |
| `amber` | `#C6803D` | Amber Glass — **sparing** premium/selected accent, focus rings, warmth |
| `amber-85` | `#C6803Dd9` | Hover on amber surfaces |
| `amber-70` | `#C6803Db3` | Lowest amber opacity in use |

Pre-blended `charcoal-N` and `amber-N` are baked alpha — used without the `/X`
modifier. No bare hex literals in `className` / `style`; inside Leaflet/SVG
strings use the CSS variable (e.g. `var(--charcoal)`).

## Typography

Unchanged from v0.2. **Serif:** Fraunces + Frank Ruhl Libre (Hebrew), SOFT axis
maxed, italic for headlines/editorial labels. **Sans:** Heebo + Google Sans
Text, the body workhorse. Headlines sit in `charcoal`; accent colours never
carry long passages of copy.

| Token | Size | Role |
|---|---|---|
| `text-meta` | 8pt | Eyebrows (uppercase 0.18em via `.meta-caps`), corner captions |
| `text-small` | 10pt | Metadata, secondary labels, microcopy |
| `text-body` | 11pt | Default body, button labels |
| `text-lede` | 14pt | Card titles, section headlines, friend names |
| `text-sub` | 22pt | Profile / place hero names |
| `text-display` | 44pt | Editorial display headlines |
| `text-hero` | 92pt | Marketing-tier display (rare in product UI) |

No arbitrary `text-[Xpt]`. Line-heights are baked into the token.

## Spacing

`xs` 2mm · `sm` 4mm · `md` 8mm · `lg` 14mm · `xl` 22mm · `xxl` 36mm. Plus `0`,
`px`, `hair` (0.5mm). The Tailwind numeric scale (`gap-2`, `h-10`) survives for
**dimensional** use (icons, avatars, FABs) — never for editorial spacing.
Logical utilities only.

## Corner radii

`rounded-2xl` cards/sheets · `rounded-xl` inner tiles/segmented containers ·
`rounded-full` chips/pills/avatars/FABs/toggles/buttons · `rounded-device`
(54px) iPhone frame · `rounded-notch` (20px).

## Elevation (shadows)

Quiet, **charcoal-tinted, never a coloured glow** (the old copper FAB glow is
gone). `shadow-card` elevated surfaces · `shadow-sheet` bottom sheets ·
`shadow-fab` FAB + dark tab capsule · `shadow-panel` tools tray ·
`shadow-device` iPhone frame.

## Motion

Two durations, one curve. `duration-instant` 140ms (taps, colour swaps) ·
`duration-considered` 280ms (sheets, panels) · `ease-out-quart`
`cubic-bezier(0.25, 1, 0.5, 1)`. No bounce. Tactile `active:scale-[0.97]`
(0.96 on FABs). Universal `prefers-reduced-motion` is honoured in `index.css`.

## Affordance grammar

- **Buttons** (`<Button>`): `primary` (charcoal fill, cream text), `accent`
  (umber fill, cream text — the strong action, used sparingly), `ghost`
  (charcoal-15 border, charcoal text). **Amber is never a button fill.**
- **Amber belongs to**: selected states (active tab pill, segmented underline,
  selected chips), toggles when on, presence/notification dots, focus rings,
  the "Tarmil Selection" badge — i.e. warmth and selection, not actions.
- **Tap targets**: 40px min for primary controls, 44px preferred.
- **Hover**: subtle tone shift (`bg-sand → bg-sand/80`, `hover:bg-charcoal-8`).
- **Focus-visible**: `focus-visible:ring-2 ring-amber ring-offset-2 ring-offset-cream` (or `focus-visible:underline` for inline text links).

## Iconography

Lucide. `strokeWidth` 1.5 inactive · 1.7 medium · 2 / 2.2 active. Size with
text: `h-3.5` for `text-small`, `h-4` for `text-body`, `h-5` for `text-lede`.

## Forms

Inputs `rounded-full`/`rounded-xl`, `bg-sand`/`bg-cream`, `border-charcoal-15`,
focus border `amber`, placeholder `text-charcoal-55`. Toggles: `amber` when on,
`charcoal-15` when off, knob `bg-cream` with `shadow-card`. Segmented controls:
`bg-charcoal-8` container, `bg-charcoal text-cream` active segment.

## Merchant disclosure

Paid placement is disclosed (not hidden). `PlacementBadge` renders the earned
**"Tarmil Selection"** in `amber` (premium warmth) and plain **"Sponsored"** in
`charcoal-55` (quiet but legible). The place detail carries a one-line
plain-language disclosure. Ranking order: Selection → Sponsored → public
coverage; non-paying places are shown, never suppressed.

## Empty / loading / error states

`LoadingPanel` / `ErrorPanel` in `src/components/DataState.tsx` are standard.
In-screen empty states: `rounded-2xl bg-sand p-md text-small leading-snug
text-charcoal-70`.

## RTL safety

`index.html` is `lang="en" dir="ltr"` for the investor mock today; the Hebrew
launch flips both. **Logical Tailwind utilities only** (`ps-*`, `pe-*`,
`start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`,
`rounded-e-*`) so the flip inherits free.

## Open items (flag before solving)

- Exact brand hexes (current set is derived) and any mood-board calibration.
- App icon PNG variants (iOS / Android / maskable).
- Photography rule (warm, tactile, controlled — colour treatment, captions).
- Custom tab-bar / place-marker iconography.
- Final motion vocabulary (durations above are proposals).

If a task touches these, escalate to the brand pass — don't invent.
