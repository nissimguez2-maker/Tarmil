# Tarmil — Design System (DA v0.2)

Locked. Use these tokens better; don't invent new ones. CSS variables in `src/brand/tokens.css`, Tailwind mapping in `tailwind.config.ts`.

## Theme

**Light, warm, editorial.** The user opens the app in any ambient light — beach, café, hostel dorm, plane window. The palette is ivory paper, sand cards, cocoa ink, copper signal. Never neutral grey; every neutral is tinted toward the brand brown. No dark mode in v1.

## Colors

| Token | Hex | Role |
|---|---|---|
| `ivory` | `#fdfbf7` | Default surface — "the paper" |
| `sand` | `#ead8c0` | Elevated cards, panels, accordion bodies |
| `rope` | `#d1bb9e` | Mid-tone, active-state backdrops |
| `stone` | `#a79277` | Darkest neutral — **never primary type** |
| `cocoa` | `#352818` | Headlines, body, structure |
| `cocoa-70` | `#352818b3` | Secondary body, readable contextual text |
| `cocoa-55` | `#3528188c` | Metadata, captions, minor labels |
| `cocoa-30` | `#3528184d` | Decorative dividers, faint accents |
| `cocoa-15` | `#35281826` | Hairline borders |
| `cocoa-08` | `#35281814` | Subtle dividers inside light surfaces |
| `copper` | `#c75d24` | Vibrant accent — primary actions, copper signal |
| `copper-85` | `#c75d24d9` | Hover state on copper surfaces |
| `copper-70` | `#c75d24b3` | The lowest copper opacity allowed. **Never below 70%.** |

Pre-blended `cocoa-N` and `copper-N` are baked alpha — used without the `/X` modifier.

## Typography

**Serif:** Fraunces + Frank Ruhl Libre (Hebrew). SOFT axis maxed. Italic for headlines and editorial labels.

**Sans:** Heebo + Google Sans Text. The body workhorse.

| Token | Size | Role |
|---|---|---|
| `text-meta` | 8pt | Eyebrows (uppercase 0.18em via `.meta-caps`), captions in corners |
| `text-small` | 10pt | Metadata, secondary labels, microcopy |
| `text-body` | 11pt | Default body, button labels |
| `text-lede` | 14pt | Card titles, section headlines, friend names |
| `text-sub` | 22pt | Profile/place hero names |
| `text-display` | 44pt | Editorial display headlines |
| `text-hero` | 92pt | Marketing-tier display (rare in product UI) |

Line-heights baked into the Tailwind token. No arbitrary `text-[Xpt]`.

## Spacing

| Token | mm | Role |
|---|---|---|
| `xs` | 2mm | Tight inline gaps |
| `sm` | 4mm | Compact list rows, button gutters |
| `md` | 8mm | Default card / section padding |
| `lg` | 14mm | Section gaps |
| `xl` | 22mm | Hero / top padding |
| `xxl` | 36mm | Marketing-tier rare |

Plus `0`, `px`, `hair` (0.5mm), and the Tailwind default numeric scale survives (`gap-2`, `h-10`, etc.) for **dimensional** uses — never for editorial spacing. Logical utilities only.

## Corner radii

| Class | Surface |
|---|---|
| `rounded-2xl` | Cards, sheets, sand surfaces |
| `rounded-xl` | Smaller elevated tiles, inner pills, segmented-control containers |
| `rounded-full` | Chips, pills, avatars, FABs, toggles, buttons |
| `rounded-device` | iPhone frame (54px) |
| `rounded-notch` | Notch shape (20px) |

## Elevation (shadows)

| Class | Use |
|---|---|
| `shadow-card` | Elevated surfaces on ivory or sand — every card, list item, modal interior |
| `shadow-sheet` | Bottom sheets rising into ivory |
| `shadow-fab` | Floating action button, the dark tab-bar capsule |
| `shadow-panel` | Tools tray panel |
| `shadow-device` | iPhone frame on desktop |

Shadows are tinted cocoa or copper — **never neutral grey**.

## Motion

Two durations, one curve. Editorial, restrained, warm.

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 140ms | Taps, color swaps, segmented controls |
| `duration-considered` | 280ms | Sheets, panels, accordions |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Everything. No bounce, no elastic. |

Tactile feedback: `active:scale-[0.97]` on primary controls, `active:scale-[0.96]` on FABs. Always pair with `motion-reduce:transition-none`.

## Affordance grammar

- **Buttons** (`<Button>` component): three variants — `primary` (cocoa fill, ivory text), `accent` (copper fill, ivory text), `ghost` (cocoa-15 border, cocoa text).
- **Tap targets**: minimum 40px height for primary controls; 44px preferred. Inline secondary actions (text links, chips) can be 32–36px.
- **Hover**: subtle bg shift (`bg-sand → bg-sand/70`, `hover:bg-cocoa-8`).
- **Active**: `active:scale-[0.97]` + slight bg darkening.
- **Focus-visible**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory`.

## Iconography

Lucide. `strokeWidth`: 1.5 (default inactive), 1.7 (medium emphasis), 2 / 2.2 (active state).

Icon size proportional to text: `h-3.5 w-3.5` for `text-small` contexts, `h-4 w-4` for `text-body`, `h-5 w-5` for `text-lede`.

## Forms

- Inputs: `rounded-full` or `rounded-xl` depending on context. `bg-sand` or `bg-ivory`. `border-cocoa-15`. Focus border `copper`. Placeholder `text-cocoa-55`.
- Textareas: `rounded-xl`, `p-md`, focus matches inputs.
- Toggles: `copper` when on, `cocoa-15` when off. Knob is `bg-ivory` with `shadow-card`.
- Segmented controls: `bg-cocoa-08` container; `bg-cocoa text-ivory` for active segment.

## Empty / loading / error states

- `LoadingPanel` and `ErrorPanel` in `src/components/DataState.tsx` are the standard. Every screen uses them.
- In-screen empty states (no overlaps, no threads, no pings): `rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70`.

## RTL safety

`index.html` is `lang="en" dir="ltr"` for the international investor mock today. The Hebrew launch will flip both. **Always use logical Tailwind utilities** so the Hebrew flip inherits free: `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.

## Open items (DA v0.2, flagged before solving)

- App icon (PNG variants for iOS / Android / maskable)
- Photography rule (colour treatment, captions)
- Custom tab bar / place marker iconography
- Final motion vocabulary (the two durations above are proposals)

If a task touches any of these, escalate to the brand pass — don't invent.
