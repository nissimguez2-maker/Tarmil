# Tarmil — Figma Design Brief

> A single prompt you can paste into Figma Make (or hand to a designer) to produce screens that match the Tarmil codebase 1:1. Copy from `## Project` down — everything below that line is the prompt.

---

## Project

**Tarmil** (תרמיל — Hebrew for *backpack*) is an investor-facing mobile mockup for a Hebrew-speaking travel companion app. Users plan a trip across the world, drop stops on a map, save places to those stops, and discover when their journey overlaps with friends' trips. The app is a click-through demo — no real backend logic, no real maps API.

Audience: investors. Format: full-bleed on phone, iPhone frame on desktop ≥768px. Hebrew RTL from day one.

The voice is **editorial, warm, unhurried**. Think a printed travel journal — Fraunces serif headlines on cream paper, Heebo Hebrew body type, generous millimetre-scale spacing, copper as the only vibrant accent. Quiet confidence. Not a SaaS dashboard. Not a Material app. Not flat-bright. Closer to *Cereal Magazine* meets *Things 3* meets a worn leather notebook.

If a screen looks like a generic mobile app, it is wrong.

---

## Canvas

- Frame size: **393 × 852 px** (iPhone 15 Pro logical size).
- Safe areas: 59 px top (status bar / Dynamic Island), 34 px bottom home indicator.
- Default direction: **RTL**. Text right-aligned. Layouts mirror.
- Tab bar lives at the bottom, persistent across all four tab routes. Drill-down screens replace the tab content but keep the tab bar visible.
- Desktop frame view: same 393×852 inside an iPhone frame with `border-radius: 54px`, notch radius `20px`, shadow `0 30px 80px -20px rgba(53, 40, 24, 0.4)`. Page background behind the frame is `cocoa-15` (#35281826).

---

## Brand tokens — do not invent values outside this list

### Colour

Set these up as Figma colour variables. Names exactly as written.

| Name | Hex | Use |
|---|---|---|
| `ivory` | `#F4EBD5` | Default screen background — "the paper" |
| `sand` | `#EAD8C0` | Elevated surfaces: cards, panels, bottom sheets |
| `rope` | `#D1BB9E` | Hairline dividers, card borders |
| `stone` | `#A79277` | Darkest neutral — never use for primary type |
| `cocoa` | `#352818` | Headlines, body, primary type, structure |
| `cocoa-70` | `#352818` @ 70% | Secondary body, lower-emphasis labels |
| `cocoa-55` | `#352818` @ 55% | Captions, meta, tertiary labels |
| `cocoa-30` | `#352818` @ 30% | Iconography muted |
| `cocoa-15` | `#352818` @ 15% | Hairline borders, dividers, disabled states |
| `cocoa-08` | `#352818` @ 8% | Faint fills, hover states |
| `copper` | `#C75D24` | Vibrant accent — CTAs, active states, marks |
| `copper-85` | `#C75D24` @ 85% | Hover/pressed copper |
| `copper-70` | `#C75D24` @ 70% | The floor — **never use copper below 70%** |

**Rules:**
- No raw hex outside this list. If you need a fifth neutral, ask before inventing.
- Copper is precious. One copper element per screen is usually enough.
- `stone` is reserved for decorative or non-textual use — never set `text-stone`.

### Type scale — 7 sizes only

Use points (pt). Set up as Figma text styles. Each row is one style — pair the size with the listed line-height and letter-spacing.

| Style | Size | Line height | Letter spacing | Use |
|---|---|---|---|---|
| `meta` | 8pt | 1.5 | +0.18em (UPPERCASE) | Eyebrows, "01" markers, meta-caps labels |
| `small` | 10pt | 1.45 | 0 | Captions, secondary meta |
| `body` | 11pt | 1.55 | 0 | Default Hebrew body text |
| `lede` | 14pt | 1.4 | 0 | Card titles, prominent body |
| `sub` | 22pt | 1.15 | −0.018em | Section sub-headlines |
| `display` | 44pt | 0.94 | −0.035em | Screen headlines |
| `hero` | 92pt | 0.92 | −0.04em | Once-per-app hero moments only |

**No `text-lg`, no `text-xl`, no 12pt, no 13pt, no 18pt. Seven sizes only.**

### Fonts

- **Serif (`font-serif`)**: Fraunces (Latin) + Frank Ruhl Libre (Hebrew). Use for: headlines, place names, section titles, anything quoted as voice. Weight 400-500 default, 700 for hero.
- **Sans (`font-sans`)**: Heebo (Hebrew) + Google Sans Text (Latin). Use for: body, UI labels, buttons, captions. Weight 400 default, 500 medium, 700 only for tab labels.

Hebrew text uses the same scale as Latin — but in Frank Ruhl Libre / Heebo respectively.

### Spacing — 9 values only

The spacing scale is in **millimetres** because the brand language is print-influenced. In Figma, treat 1mm ≈ 3.78px (96 DPI).

| Token | mm | ≈ px | Use |
|---|---|---|---|
| `0` | 0 | 0 | Reset |
| `px` | — | 1px | Hairlines |
| `hair` | 0.5mm | ~2px | Tightest gap |
| `xs` | 2mm | ~8px | Within a tight cluster (icon + label) |
| `sm` | 4mm | ~15px | Inside a card |
| `md` | 8mm | ~30px | Standard padding, section gaps |
| `lg` | 14mm | ~53px | Button height; major section spacing |
| `xl` | 22mm | ~83px | Hero margins |
| `xxl` | 36mm | ~136px | Hero-only verticals |

**Rule:** every padding/margin/gap snaps to this scale. No 12px, no 24px, no 20px. Set up Figma spacing variables — make it impossible to drift.

### Max widths (for readable text columns inside cards or detail screens)

| Token | mm | ≈ px |
|---|---|---|
| `body` | 130mm | ~492px |
| `lede` | 110mm | ~416px |
| `caption` | 90mm | ~340px |
| `quote` | 100mm | ~378px |

---

## RTL handling — non-negotiable

Every layout direction in Figma must mirror correctly for Hebrew:

- **Text alignment**: right by default. Left-align only Latin numerics in tables.
- **Auto-layout direction**: think in `start` / `end`, never `left` / `right`. In RTL: start = right edge, end = left edge.
- **Icons that imply direction**: back chevron points **right** (▶), not left. Forward arrows point left. Mirror any chevron, arrow, or progress indicator.
- **Tab order**: source order Trip → Activity → Friends → Profile renders **right → left**. Trip is the rightmost tab (Hebrew "first").
- **Numerics in Hebrew sentences**: stay LTR inline. Wrap them with a Figma sub-frame that uses left alignment within an otherwise right-aligned parent. Treat `<bdi>` mentally.
- **Bottom sheet drag handle**: centred, no directional meaning.

---

## Component library — build these as Figma components with variants

### 1. `Screen` (wrapper, not a component — set as a frame template)
- 393×852, ivory fill, top safe-area padding of 59px, scroll behaviour vertical.

### 2. `TopBar`
- Height: ~lg (14mm / ~53px).
- Layout (RTL, reading right to left): **back chevron (optional, right side)** · spacer · **title (centred)** · spacer · **end slot (tools wrench / settings / etc.)**.
- Eyebrow (optional, above title): meta caps, copper, e.g. `"TARMIL"`.
- Title: serif, lede or sub, cocoa.
- Border-bottom: 1px cocoa-15.
- Variants: with back / without back; with eyebrow / without; with end slot / without.

### 3. `TabBar`
- 4 tabs across the bottom: **טיול** (Trip, Map icon) · **פעילות** (Activity, Newspaper icon) · **חברים** (Friends, Users icon) · **פרופיל** (Profile, User icon).
- Visual order in RTL: Trip rightmost, Profile leftmost.
- Each tab: icon (20×20, stroke 1.5 inactive / 2 active) above label (9pt medium).
- Active tab: copper colour + 2px copper underline (40px wide) attached to the **top** edge of the tab.
- Inactive: `cocoa-55`.
- Background: ivory. Border-top: 1px cocoa-15. Bottom padding: `max(safe-area-bottom, 8px)`.

### 4. `Button` — three variants, one shape
- Shape: pill (fully rounded), height **lg** (14mm / ~53px), horizontal padding **md** (~30px).
- Type: sans, 11pt, medium weight.
- Variants:
  - **Primary**: `cocoa` fill, `ivory` text. Default for most CTAs.
  - **Accent**: `copper` fill, `ivory` text. The "vibrant" CTA. Use sparingly — one per screen max.
  - **Ghost**: transparent fill, `cocoa` text, 1px `cocoa-15` border.
- Disabled: 30% opacity, no pointer.
- Focus ring: 2px copper, 2px offset.

### 5. `PlaceCard`
- Background: `sand`. Border: 1px `rope`. Radius: **sm** (rounded-sm in Tailwind = 2px).
- Padding: **md** (~30px).
- Stack (RTL): place name in **serif lede** (cocoa), tarmil-pick badge in meta-caps copper at the end-edge of the title row (`"בחירת תרמיל"`).
- Meta line below: 10pt, `cocoa-55`, e.g. `"בית קפה · תל אביב"`.
- Optional bottom row: copper-filled star + rating (tabular nums) + `"3 חברים מכירים"` (3 friends know this).

### 6. `SectionLabel`
- A horizontal cluster: monospace-ish number in serif italic + label in meta-caps cocoa-70.
- Example: `01 · המסע שלך` (01 · Your journey).
- Used to introduce major sections of long-form screens.

### 7. `Bottom Sheet`
- Surface: `ivory` (yes, ivory not sand — sheets are first-class, not "elevated panels").
- Top corners: rounded-lg (~16px).
- Drag handle: 32×4px pill, `cocoa-15`, centred, 8px from top.
- Drop shadow: subtle, `0 -8px 24px -8px rgba(53, 40, 24, 0.15)` upward only.
- Heights: **auto** (content-driven, max ~60% screen) or **tall** (~85% screen, for filters and planned-stop detail).
- Backdrop: `cocoa-30` overlay behind sheet when open.
- Variants below (each is its own sheet component).

### 8. `FAB` (Floating Action Button)
- Circular, 56×56, `cocoa` fill, `ivory` icon (24×24, stroke 2).
- Position: absolute, **end-md bottom-md** (i.e. left+30px, bottom+30px in RTL).
- Variants: `AddDestinationFab` (Plus icon), `FilterFab` (SlidersHorizontal icon, copper dot when filters dirty).

### 9. `Dunes` (signature decorative motif)
- Three soft horizontal SVG dune layers in `rope` / `sand` / `cocoa-08` opacity.
- Anchored to screen bottom. Used as ambient texture on empty/loading/profile screens — never behind dense content.

### 10. `DeviceFrame` (desktop only — for presentation frames, not the in-app design)
- iPhone outline, `cocoa` matte, 54px corner radius, 20px notch.
- Inner 393×852 viewport.
- Drop shadow as defined above.

---

## The four tabs — what each shows

### TRIP (`/trip`) — the hero screen
The map of the world (stylised SVG continents, not Google/Mapbox). Past route drawn as a solid `cocoa` line; present location as a pulsing copper dot; planned stops as numbered copper pins; friend-overlap bubbles where journeys intersect.

Top: `TopBar` with eyebrow `"TARMIL"` + title `"המסע שלך"` (Your journey).
Below TopBar: `NextTripCard` — a 1-line sand card showing the next planned stop city + countdown ("בעוד 12 ימים — קיוטו" / "In 12 days — Kyoto").
Map fills the rest.
Two FABs anchored bottom-end: filter (top), add destination (bottom).
Tap a place pin → opens `PlaceSheet`. Tap a friend bubble → `FriendSheet`. Tap a planned stop pin → `PlannedStopSheet`.

### ACTIVITY (`/activity`)
A vertical feed of friend movements: "דנה הוסיפה את 'Café Sirena' למסע שלה" (Dana added 'Café Sirena' to her trip), with timestamps. Use `PlaceCard`-style chrome but list-form.

### FRIENDS (`/friends`)
List of fellow travellers whose trips overlap with yours. Each row: avatar + name + small "overlap meta" — "תל אביב, 14-21 ביוני" (Tel Aviv, 14-21 June) — in `cocoa-55`. Tap → drill-down to `/friends/:id`.

### PROFILE (`/profile`)
Your own trip overview + demo controls. Sections:
- Hero with your name + trip dates in display serif.
- "המסע שלי" (My journey) — past + planned stop count.
- Demo controls (visible in demo mode only): a `Button accent` labelled `"איפוס מצב הדגמה"` (Reset demo state).

---

## Screens to design (priority order)

Design these as Figma frames. Each gets ONE frame unless I note variants.

### Tier 1 — the demo path
1. **Trip — default state**, with NextTripCard, all map pins visible, two FABs.
2. **Trip — search destination sheet open** (`SearchDestinationSheet`): input field at top, recent-search list below, `"בחר על המפה"` (Pick on map) as a ghost button.
3. **Trip — pick-on-map mode**: reticle centred on map, bottom bar with `"בטל"` (Cancel, ghost) + `"אישור"` (Confirm, primary) buttons.
4. **Trip — confirm destination sheet** (`ConfirmDestinationSheet`): proposed city name editable, date range picker, privacy radio (public / friends-only), `"שמור"` (Save, accent) button.
5. **Trip — planned route sheet** (`PlannedRouteSheet`, tall): scrollable list of planned stops with order numbers, drag-handles, add-new button at end.
6. **Trip — planned stop detail** (`PlannedStopSheet`, tall): stop name as display headline, date range, friends overlapping at that stop (avatar row), saved places (vertical `PlaceCard` list), `"סמן שהגעתי"` (Mark arrived) primary button + `"ערוך"` (Edit) ghost.
7. **Place detail (`/place/:id`)**: serif display name, sand hero photo block (placeholder rectangle for now), meta row (category · city · rating), long-form description in serif body (max-width `lede`), `"שמור לעצירה"` (Save to stop) accent button.
8. **Activity feed** with 6-8 activity rows.
9. **Friends list** with 5-7 friend rows.
10. **Profile** with demo controls section.

### Tier 2 — empty / error / loading states
11. **Trip — empty plan** (no stops yet): centred `Dunes` motif, serif display copy `"אין עדיין יעדים"` (No destinations yet), accent button to add first stop.
12. **Loading panel**: centred subtle spinner + meta-caps `"טוען"` (Loading).
13. **Error panel**: serif lede error message, ghost retry button.

### Tier 3 — drill-downs and edges
14. **Friend detail (`/friends/:id`)**: friend hero, their overlap with you visualised on mini-map.
15. **Filters sheet** (tall): friend visibility (none / overlaps / all), category chips, reset button.
16. **Save place to stop sheet**: list of planned stops, tap to attach the place to one.
17. **Arrival confirm sheet**: `"הגעת ל-{city}?"` (Did you arrive at {city}?), confirm + dismiss.

---

## Hebrew copy — sample strings to use literally

| English | Hebrew |
|---|---|
| Your journey | המסע שלך |
| My journey | המסע שלי |
| Tarmil's pick | בחירת תרמיל |
| Friends know this | חברים מכירים |
| Save to stop | שמור לעצירה |
| Pick on map | בחר על המפה |
| Cancel | בטל |
| Confirm | אישור |
| Save | שמור |
| Edit | ערוך |
| Remove | הסר |
| Mark arrived | סמן שהגעתי |
| Reset demo state | איפוס מצב הדגמה |
| No destinations yet | אין עדיין יעדים |
| Loading | טוען |
| Trip | טיול |
| Activity | פעילות |
| Friends | חברים |
| Profile | פרופיל |
| In 12 days · Kyoto | בעוד 12 ימים · קיוטו |

---

## Voice & tone

- Sentence cap: **28 words**, aim for 14. If a Hebrew line wraps past two lines on mobile, rewrite.
- Active voice. No marketing words: skip *synergy*, *leverage*, *ecosystem*, *play* (as noun).
- Editorial cadence. The app is a quiet companion, not a salesperson.

---

## Anti-patterns — do NOT do any of these

1. **No hex values outside the token list above.** If you find yourself typing `#`, stop.
2. **No type sizes outside the 7.** No 12pt, no 13pt, no 18pt.
3. **No spacing outside the 9.** No 12px, no 24px paddings. Everything snaps to mm tokens.
4. **No left/right thinking.** Use start/end mentally. Mirror chevrons. Right-align text.
5. **No heavy drop shadows.** Quiet elevation only — borders + 8% cocoa hairlines do the work. The only dramatic shadow is the device frame on desktop.
6. **No solid black or white.** `cocoa` and `ivory` only.
7. **No emoji.** Lucide line icons only (stroke 1.5 inactive, 2 active).
8. **No flat-bright colour blocks.** The palette is warm and matte.
9. **No "card-on-card-on-card" depth.** Maximum 2 elevation levels: ivory page → sand card / ivory sheet.
10. **No Material-style ripples, no iOS-style segmented controls.** Pill buttons + radio rows + bottom sheets.
11. **No tab bar floating.** It's anchored to the bottom edge, ivory, border-topped.
12. **No `100vh` mental model.** The mobile viewport collapses with the toolbar on Safari — design as if the safe-area-bottom can shrink.

---

## Deliverables

Produce in Figma:

1. **One file** named `Tarmil — Mobile`, page `Mobile Screens`.
2. **Variables**: every colour, every type size, every spacing token defined and used. No raw values left in styles.
3. **Text styles**: 7 styles named exactly `meta`, `small`, `body`, `lede`, `sub`, `display`, `hero`. Plus 2 named variants: `meta-caps` (meta + uppercase + tracking), `mid-title` (serif italic 500, sentence case).
4. **Component library**: every component above as a Figma component with documented variants.
5. **Frames**: every screen in the priority list above, each at 393×852, RTL.
6. **A "Tokens" page** documenting the brand: colour swatches, type ladder, spacing scale, do/don't examples.

Once the Figma file exists, share the URL. I'll pull each frame via `get_design_context` from the Figma MCP and translate it 1:1 into the existing codebase — Fraunces stays Fraunces, mm spacing maps to the existing Tailwind scale, RTL classes get logical properties, and copper stays at ≥70% opacity.

---

## Reference — the existing codebase

For ground truth on what already exists in code (so you don't redesign what's locked):

- `src/brand/tokens.css` — colour CSS variables.
- `tailwind.config.ts` — type, spacing, max-widths, fonts, device frame.
- `src/components/` — `Screen`, `TopBar`, `TabBar`, `Button`, `PlaceCard`, `SectionLabel`, `Dunes`, `DeviceFrame`, bottom-sheet variants in `src/components/tripMap/sheets/`.
- `src/screens/` — current screens: `trip/TripScreen.tsx`, `activity/ActivityScreen.tsx`, `friends/FriendsScreen.tsx`, `profile/ProfileScreen.tsx`, `place/PlaceScreen.tsx`.
- `README.md` and `CLAUDE.md` — the locked direction artistique (DA v0.2).

Design with these as the floor, not the ceiling.
