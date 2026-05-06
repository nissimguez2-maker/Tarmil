---
name: Tarmil
description: Hebrew-first travel companion for Israeli backpackers, editorial warmth desert quiet
colors:
  ivory: "#f4ebd5"
  sand: "#ead8c0"
  rope: "#d1bb9e"
  stone: "#a79277"
  cocoa: "#352818"
  cocoa-70: "#352818b3"
  cocoa-55: "#3528188c"
  cocoa-30: "#3528184d"
  cocoa-15: "#35281826"
  cocoa-08: "#35281814"
  copper: "#c75d24"
  copper-85: "#c75d24d9"
  copper-70: "#c75d24b3"
typography:
  meta:
    fontFamily: "Heebo, Google Sans Text, Roboto Flex, Inter, system-ui, sans-serif"
    fontSize: "8pt"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.18em"
  small:
    fontFamily: "Heebo, Google Sans Text, Roboto Flex, Inter, system-ui, sans-serif"
    fontSize: "10pt"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Heebo, Google Sans Text, Roboto Flex, Inter, system-ui, sans-serif"
    fontSize: "11pt"
    fontWeight: 400
    lineHeight: 1.55
  lede:
    fontFamily: "Fraunces, Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "14pt"
    fontWeight: 700
    lineHeight: 1.4
  sub:
    fontFamily: "Fraunces, Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "22pt"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.018em"
  display:
    fontFamily: "Fraunces, Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "44pt"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  hero:
    fontFamily: "Fraunces, Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "92pt"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.04em"
rounded:
  sm: "2px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "2mm"
  sm: "4mm"
  md: "8mm"
  lg: "14mm"
  xl: "22mm"
  xxl: "36mm"
components:
  button-primary:
    backgroundColor: "{colors.cocoa}"
    textColor: "{colors.ivory}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "14mm"
    padding: "0 8mm"
  button-accent:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.ivory}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "14mm"
    padding: "0 8mm"
  button-ghost:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "14mm"
    padding: "0 8mm"
  place-card:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.cocoa}"
    rounded: "{rounded.sm}"
    padding: "8mm"
  bottom-sheet:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.cocoa}"
    rounded: "{rounded.md}"
    padding: "8mm"
  chip-active:
    backgroundColor: "{colors.cocoa}"
    textColor: "{colors.ivory}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "9mm"
    padding: "0 4mm"
  chip-inactive:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "9mm"
    padding: "0 4mm"
  input-field:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.cocoa}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "10mm"
    padding: "0 8mm"
  section-label:
    textColor: "{colors.copper}"
    typography: "{typography.meta}"
  pull-figure:
    textColor: "{colors.cocoa}"
    typography: "{typography.sub}"
---

# Design System: Tarmil

## 1. Overview

**Creative North Star: "Editorial warmth, desert quiet."**

A printed-journal sensibility applied to a digital-era brand. The work feels read, not scrolled — paced like a small-press travel book, not a startup deck. Premium through restraint. Confident, soft-spoken, unhurried. References that anchor the register: Aesop, Cereal Magazine, early Kinfolk, vintage Penguin Classics, Levantine and Mediterranean hospitality brands (riads, boutique guesthouses, natural-wine importers).

**App adaptation note.** The DA v0.2 was authored for print and slides. This DESIGN.md translates the same artistic approach to the app: print margins (22mm) become content padding (8mm = `md`), the print "page header copper rule + footer page indicator" become the in-app TopBar (with copper eyebrow above the title) and TabBar; pull figures become the Currency-screen amount display and Balance-screen totals; the dunes motif is an end-of-flow brand mark on closing surfaces (Profile, About, onboarding finish), never inside an active tool. Spacing scale, type scale, color tokens, copper rules, app states, and writing conventions transfer one-to-one.

The system holds five tensions simultaneously, and breaks the moment one side wins:

- Warm but disciplined.
- Romantic but precise.
- Nostalgic but contemporary.
- Israeli in soul, universal in form.
- Crafted but not crafty.

The system explicitly rejects: Booking.com / TripAdvisor density, Google-Maps cold UI, generic travel-app blue + orange, SaaS landing-page clichés (gradient hero, hero-metric template, identical icon-plus-heading-plus-text card grids, glassmorphism), modal-first UX, anything that reads as AI-generated, and hand-drawn marks where the algorithm should run.

**Key Characteristics:**

- Light, single-theme, warm desert-paper neutrals.
- Editorial serif (Fraunces) for headlines + sans (Google Sans Text Latin / Heebo Hebrew) for body. No third typeface.
- Copper as a rare, vibrant accent — never below 70% opacity, max ~10% of any screen.
- Logical RTL utilities only; the entire app runs in `<html dir="rtl">`.
- Brand tokens only; hex literals never leak into components.
- Restrained color strategy. Cocoa text on ivory or sand surfaces does the typographic work; copper signals action and brand moments.
- Asymmetric layout. One idea per page. Centred type only on full-page hero compositions.

## 2. Colors: The Desert-Paper Palette

A four-step neutral surface scale, a six-step cocoa text scale, and one vibrant copper accent. Cocoa carries the typographic weight; copper signals action and structure.

### Primary
- **Cocoa** (`#352818`): Default text color. Primary CTA fill. Headlines, body, structural elements (rules, dividers, table grids), dunes front layer.
- **Cocoa 70 / 55 / 30 / 15 / 08** (`#352818` at 70 / 55 / 30 / 15 / 8% opacity): Body emphasis tiers, hairline rules, dividers, hover micro-fills, low-emphasis text, table separators.

### Secondary (vibrant accent)
- **Copper** (`#c75d24`): Vibrant accent. Structural marks (section numbers, header rules, divider accents, chart accent line, seasonality bands), rare type emphasis, focus rings, primary actions in app (Tarmil Picks badge, present pin, "הוסף יעד" FAB, accent CTAs).
- **Copper 85** (`#c75d24` at 85% opacity): Hover state for accent buttons.
- **Copper 70** (`#c75d24` at 70% opacity): Focus rings, friend-bubble haloes, halo glow on the active planned-stop ring, chart annotation bands.

### Neutral (surface scale)
- **Ivory** (`#f4ebd5`): Default surface. The "paper". Background of every Screen wrapper, BottomSheet, TopBar.
- **Sand** (`#ead8c0`): Elevated surface. Cards (PlaceCard, friend balance cards, summary card), inputs, hero summaries, Selected app state.
- **Rope** (`#d1bb9e`): Mid-tone. Hairline borders on elevated surfaces, low-emphasis fills, dunes mid-layer.
- **Stone** (`#a79277`): Darkest neutral. Captions in low-emphasis contexts only, dunes back layer accent. **Never primary type.**

### Tinting
- **Cocoa** allows 8 / 15 / 30 / 55 / 70 / 100% opacity tints.
- **Copper** allows only 70 / 85 / 100% — never below 70%.
- **Sand, rope, stone, ivory** are always 100%. Tinting forbidden — muddies the warm scale.

### Named Rules

**The Copper Usage Rule.** Copper is permitted on: structural marks (section numbers, header rules, divider accents, chart accent line, seasonality bands), type emphasis (max two words per page, italic, in display or lede sizes only), interactive (focus ring, primary-action buttons in app). Copper is forbidden on: body text any size, table data cells, background fills wider than ~30% of a composition, the logo / wordmark.

**The Restrained Copper Rule.** Copper carries less than 10% of any visible surface. If a screen reads "copper-heavy", it is wrong.

**The Cocoa Primary Rule.** All primary text is cocoa or cocoa with reduced opacity. `text-stone` is forbidden for primary type.

**The No-Hex Rule.** Components reference brand tokens only. Hex literals appear once: in `src/utils/mapColors.ts`, where third-party APIs (TomTom) demand string values.

### App States (locked)

| State | Treatment |
|---|---|
| Default | Per component spec. |
| Hover | `cocoa` 8% background tint over the element. |
| Pressed | `cocoa` 15% background tint. |
| Focused (keyboard) | 1.5pt `copper` outline, 2px offset (in CSS: `outline: 1.5px solid var(--copper); outline-offset: 2px`). |
| Disabled | 30% opacity on the whole element. |
| Selected | `sand` background fill. |
| Error | `copper` 100%, paired with explicit text. **No red.** Red breaks the warm desert palette and signals a register the brand doesn't share. |

## 3. Typography

**Display Font:** Fraunces 700 with `SOFT` axis at 100, `opsz` matched (Frank Ruhl Libre fallback for Hebrew display, Times New Roman as last resort).
**Body Font (Latin):** Google Sans Text 400 with `GRAD` axis at -20 (Roboto Flex, Inter, system-ui as fallbacks).
**Body Font (Hebrew):** Heebo, weights 400 / 500 / 700 to mirror Google Sans Text. Pending Hebrew typographer validation per DA §Open.
**Label / Eyebrow:** Google Sans Text 500 / Heebo 500 at 8pt, 0.18em tracking, uppercase, exposed via the `.meta-caps` utility in `src/index.css`.

**Character:** Fraunces is editorial-warm with the SOFT axis maxed (rounded terminals, the warmest editorial feel). It pairs with Google Sans Text (Latin) and Heebo (Hebrew) — workhorses that disappear so the serif can speak. No third typeface.

### Hierarchy
- **Hero** (700, 92pt, 0.92 lh, -0.04em tracking): Governing principle hero ("WARMER."). Reserved; not used in any current screen.
- **Display** (700, 44pt, 0.94 lh, -0.035em tracking): Page titles ("Plan & finances."), Currency-screen amount input, similar amount-as-statement contexts.
- **Sub** (700, 22pt, 1.15 lh, -0.018em tracking): Subheadings, in-section heads, PlannedStopSheet header, ProfileScreen username.
- **Lede** (700, 14pt, 1.4 lh): Mid-titles, intro paragraphs, taglines, pull quotes, place names, friend names, summary card titles.
- **Body** (400, 11pt, 1.55 lh): Default copy. Cap line length at 65 to 75 characters via `max-w-body` (= 130mm).
- **Small** (400, 10pt, 1.45 lh): Notes, table cells, secondary text, dates, "X חברים מכירים" counts.
- **Meta** (500, 8pt, 1.5 lh, 0.18em tracking, uppercase via `.meta-caps`): Section eyebrows, captions, axis labels, section numbers, "TARMIL" wordmark on TopBar, "בחירת תרמיל", "איתך כאן".

### Italic Rules
- **Mid-titles** ("01 Concept" lab pattern): Fraunces italic 500, sentence case. The number "01" stays upright in Google Sans Text 700, copper.
- **Pull quotes, taglines, rare emphasis:** Fraunces italic 400.
- **Body italic:** Google Sans Text italic 400 / Heebo italic 400. Used inline for emphasis, technical terms, foreign words.
- **Never** mix Fraunces italic into body paragraphs. Keeps the serif italic precious for editorial moments.

### Numbers
- **Astonishment mode** — abbreviated, for editorial figures and hero stats. EN: `9.4M`, `600K`, `100–150K`, `+549K`. FR uses a thin space before the unit.
- **Ledger mode** — full numbers with locale-correct thousand separators, for tables and financial detail. EN: `77,416 $`, `1,902,000`. FR: `77 416 $`, `1 902 000` with thin space (U+202F).
- All number cells in tables and chart axis labels require `font-feature-settings: "tnum" 1`. The `.tnum` utility in `src/index.css` exposes it.
- Negative values use a real minus sign `−` (U+2212), never a hyphen (`-`).

### Named Rules

**The Two-Family Rule.** Fraunces for headlines, Google Sans Text (Latin) / Heebo (Hebrew) for body. No third typeface enters the system without DA approval.

**The Locked Scale Rule.** Type sizes are exactly the seven steps above. No `text-[12pt]` shortcuts. If the value is not on the scale, stop and ask.

**The Precious Italic Rule.** Body italic is always Google Sans Text / Heebo italic 400. Fraunces italic is reserved for mid-titles (500), pull quotes / taglines (400), and rare display-size emphasis. Do not pollute body paragraphs with Fraunces italic.

## 4. Elevation

Mostly flat. Surfaces gain depth from `border-rope` hairlines plus a `bg-sand` step up from the ivory baseline, not from shadows. Three places use real shadows: the BottomSheet (subtle upward cast for slide-in), the AddDestinationFab (copper-tinted ground shadow), and the iPhone DeviceFrame on desktop (`shadow-device`, large ambient).

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 -10px 30px -10px rgba(53, 40, 24, 0.25)`): BottomSheet upward cast. Signals the sheet sits above the map.
- **Card lift** (`box-shadow: 0 -10px 30px -10px rgba(53, 40, 24, 0.20)`): Travel-moment card. A lighter version of sheet lift.
- **FAB ground** (`box-shadow: 0 6px 20px -6px rgba(199, 93, 36, 0.50)`): Copper-tinted shadow under the floating "הוסף יעד" action.
- **Filter rail rim** (`box-shadow: 0 2px 10px -4px rgba(53, 40, 24, 0.15)`): Soft cocoa cast under the chip rail at the top of the map.
- **Device frame** (`shadow-device` = `0 30px 80px -20px rgba(53, 40, 24, 0.4)`): Desktop iPhone shell only. Never used inside the app shell itself.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Elevation appears only on slide-up sheets, the FAB, the floating chip rail, and the desktop device shell.

## 5. Components

### Buttons
The `<Button>` primitive in `src/components/Button.tsx` is the canonical CTA. Three variants. Height 14mm (`h-lg`), `rounded-full`, body type weight 500.

- **Shape:** Pill (`rounded-full`), height 14mm, horizontal padding 8mm (`px-md`).
- **Primary** (`variant="primary"`): Cocoa background, ivory text. Default CTA.
- **Accent** (`variant="accent"`): Copper background, ivory text. Vibrant CTA, used sparingly: "הוסף למסע", "אישור" on pick bar, "שמור" on destination confirmation, "הוסף הוצאה".
- **Ghost** (`variant="ghost"`): Transparent background, `border-cocoa-15` hairline, cocoa text. Secondary actions ("ביטול", "סגור חוב", "ערוך תאריכים", "אפס סימונים").
- **States** (locked, app-state table above): Hover = cocoa-08 tint. Pressed = cocoa-15. Focused = 1.5pt copper outline + 2px offset. Disabled = 30% opacity. Selected = sand fill. Error = copper, no red.

### Section Labels
The `<SectionLabel number="01" label="Concept" />` primitive in `src/components/SectionLabel.tsx` is the canonical editorial pattern, lifted from the DA's "01 Concept" lab spec.

- **Number** (`01`): Google Sans Text / Heebo 700, 8pt, copper, uppercase, 0.18em tracking. Stays upright; not italic.
- **Label** (`Concept`): Fraunces italic 500, 14pt, cocoa, sentence case. **Never all-caps.**
- **Gap** between number and label: 8mm.
- **Padding-bottom** above the rule: 2mm.
- **Rule below:** 0.4pt solid `cocoa-15`, full content width.
- **Margin-bottom** below the rule: 8mm before content begins.

### Cards
`PlaceCard` (`src/components/PlaceCard.tsx`) is the canonical pattern. Friend balance cards and the travel-moment card extend it.

- **Corner Style:** `rounded-sm` (2px). Restrained.
- **Background:** Sand (`bg-sand`).
- **Border:** Rope hairline (`border border-rope`). Defines the card without a shadow.
- **Internal Padding:** 8mm (`p-md`).
- **Title:** Fraunces lede in cocoa.
- **Meta:** Heebo / Google Sans Text small in cocoa-55.

### Bottom Sheet
- **Shape:** `rounded-md` (6px), full-width with 8mm side margin, anchored to the bottom of the trip area.
- **Background:** Ivory.
- **Border:** Rope hairline.
- **Slide:** `translate-y` from `120%` to `0`, opacity 0 to 100 over 300ms. CSS transition on the wrapper. Layout properties are not animated; the wrapper height stays content-driven.
- **Tall variant** (`height="tall"`): switches to `inset-y-md` with internal `overflow-y-auto`, max-height ~85% of the trip area. Used for `PlannedStopSheet`.

### Chip Rail (filters)
- **Shape:** Each chip `rounded-full`, height 9mm, padding 4mm horizontal.
- **Active state:** Cocoa background, ivory text, cocoa border.
- **Inactive state:** Ivory background, cocoa-15 border, cocoa text.
- **AND modifiers** (Tarmil Picks, Friends know): Same chip shape. Effect enforced in logic, not visuals.
- **Rail container:** `bg-ivory/85 backdrop-blur-sm` band over the map, with the filter-rail rim shadow.

### Inputs / Fields
- **Shape:** `rounded-full`, height 10mm, sand background, `border-cocoa-15` at rest.
- **Focus:** `border-copper` (the border shift IS the focus indicator) plus the locked 1.5pt copper outline + 2px offset on keyboard focus.
- **Hebrew direction:** `dir="rtl"` for text; `dir="ltr"` only for digit-only fields (number, date) where left-to-right reading is correct.
- **Native form controls** (checkbox, radio, select): `accent-copper` so the OS-painted indicator inherits brand color.

### Tables
Lifted directly from the DA's print spec. Apply when rendering data lists in Tools (Balance expense list, Currency rate panel, future tables).

- **Header row:** Google Sans Text / Heebo 500, 8pt, uppercase, `cocoa-55`, 0.18em tracking.
- **Cell body:** Google Sans Text / Heebo 400, 10pt, `cocoa`, `tnum` mandatory.
- **Row separator:** 0.3pt solid `cocoa-15`.
- **Header underline:** 0.5pt solid `cocoa-30`.
- **Total row:** 0.5pt solid `cocoa` above, 700 weight, no separator below.
- **Padding:** 2.2mm vertical, 4mm horizontal between columns.
- **Fills / striping:** none.

### Lists
- **Bulleted:** hanging indent, 2pt `cocoa-30` dot, never icons.
- **Numbered (editorial / channel lists):** leading-zero `01.` in `copper`, Google Sans Text / Heebo 500, 8pt, in a 12mm hanging-indent column. Body of item in 11pt `cocoa`.
- **Dashed lists:** forbidden.

### Dividers
- **Default:** 0.4pt solid `cocoa-15`, full content width.
- **Strong:** 0.5pt solid `cocoa-30`.
- **Editorial copper rule** (above pull figures, beneath page header): 0.5pt solid `copper`, lengths **14–18mm only**. Full-width copper rules are **forbidden**.

### Charts
Apply when adding data viz (currency history, expense breakdown, upcoming).

- **Bars:** solid `cocoa`, no stroke.
- **Line overlay** (cumulative metric): 1.4pt `copper`, round caps and joins.
- **Milestone markers:** 2.6pt open circles, `ivory` fill, 1.2pt `copper` stroke.
- **Gridlines:** 0.4pt `cocoa-15`, dashed `1.5,2.5` for non-zero, solid for the baseline.
- **Background:** sandy dot pattern (see Motifs).
- **Axis labels:** `meta` token (8pt, `cocoa-55`, 0.18em, uppercase).
- **Annotation bands:** `cocoa` tints (22 / 10 / 5%) for neutral periods, `copper` 70% for "vibrant" periods only (e.g. season highlights).

### Pull Figures
Editorial big numbers. In-app placement: Currency-screen result, Balance hero summary, BalanceScreen friend-card net.

- **Number:** Fraunces 700, `sub` token (22pt) or larger, `cocoa`, `white-space: nowrap`.
- **Label below:** `meta` token (8pt, `cocoa-55`, uppercase, 0.18em).
- **Top rule:** 0.5pt solid `copper`, 14–18mm wide (not full content width).
- **Bottom rule:** 0.4pt solid `cocoa-15`, full content width.

### TopBar
- **Layout:** 14mm tall, ivory background, `cocoa-15` hairline at the bottom edge.
- **Content:** Centered serif `text-lede` title with optional copper `meta-caps` eyebrow above. Optional back chevron at the start side; in RTL, `start = right`, so Lucide `ChevronRight` is correct (points back-toward-start).
- **End slot:** Optional element (Settings gear on ProfileScreen).

### Tab Bar
- **Layout:** 4-column grid at the bottom of the device frame, ivory background, `cocoa-15` hairline at the top edge.
- **Active state:** Copper text, heavier icon stroke (2 vs 1.5), 2px copper bar at the top edge of the active tab.
- **RTL ordering:** Source order Trip, Tools, Friends, Profile renders visually right-to-left; the user reads it correctly in Hebrew.

### Trip Map (signature surface)
The most distinctive component in the system. Fed by the TomTom Maps SDK v6.

- **Tiles:** TomTom default vector style with a CSS filter `sepia(0.18) saturate(0.85) hue-rotate(-10deg) brightness(1.03)` on `.mapboxgl-canvas` only. HTML markers keep their full-saturation brand colors over a warm-tinted basemap.
- **Past trip line:** Solid cocoa polyline, weight 2, opacity 0.6, with 4px filled cocoa dots at each waypoint.
- **Planned-stop markers:** Hollow copper rings (14px) on a dashed cocoa connector. Active stop gets a copper halo via `.is-active`.
- **Present pin:** Pulsing copper dot (16px) with an animated copper ring scaling 1 to 2.0 over 2.4s. Reduced-motion media query disables the animation.
- **Friend bubbles:** Centroid-only, never street-level. Soft halo signals "approximately in this area"; present friends are filled copper, future friends are dashed-copper-on-ivory.

### Motifs

#### Dunes — brand signature
Algorithmic three-layer Bezier curves. Hand-drawing forbidden.

- **Layer count:** exactly three. Back, mid, front.
- **Layer 1 (back):** `copper` 22%, crest 100% of motif height.
- **Layer 2 (mid):** `rope` 70–85%, crest 60%.
- **Layer 3 (front):** `cocoa` 75%, crest 30%.
- **Print height:** 56–62mm. **App adaptation:** ~80–120px tall, full-bleed left to right.
- **Placement:** always at the foot of a closing surface (last screen of an onboarding flow, ProfileScreen footer, end-of-flow confirmation). Never mid-document, never inside an active tool screen.
- **Curve seed:** published once, reused identically across every asset. Same dunes everywhere.

#### Flat geometry
For diagrams, illustrations, info graphics inside the app.

- **Stroke weight:** 0.6pt for editorial / docs, 1.2pt for in-app diagrams.
- **Stroke color:** `cocoa` at 100%.
- **Allowed primitives:** circle, line, rectangle. **No triangles, no polygons, no curves except dunes.**

#### Sandy dot fill
For maps and density visualisations.

- **Spec:** 0.55px radius dots on a 9px grid, `cocoa` at 10%.
- **Constraint:** never on backgrounds wider than 200mm (visual noise above that scale).
- **In-app use:** chart backgrounds, signature surfaces. The trip map's warm-tint filter substitutes for this on the geographic basemap.

## 6. Do's and Don'ts

### Do:

- **Do** use logical RTL utilities exclusively: `ps`, `pe`, `start`, `end`, `ms`, `me`, `border-s`, `border-e`, `rounded-s`, `rounded-e`.
- **Do** pull every color from brand tokens (`bg-cocoa`, `text-copper-70`, etc.). The only allowed hex literals live in `src/utils/mapColors.ts` for third-party APIs.
- **Do** use the seven type-size steps from the locked scale: `text-meta`, `text-small`, `text-body`, `text-lede`, `text-sub`, `text-display`, `text-hero`.
- **Do** use Fraunces italic 500 sentence case for mid-titles. Number "01" stays upright in Google Sans Text 700 copper.
- **Do** use `tnum` (`font-feature-settings: "tnum" 1`) on every number cell in tables and on every chart axis label.
- **Do** use a real minus sign (U+2212) for negative values, not a hyphen.
- **Do** use smart quotes ("" '' in EN, « » with non-breaking spaces in FR).
- **Do** use em dash (—) for parenthetical clauses, en dash (–) for ranges (`14–18mm`, `Nov–May`), hyphen only in compound words.
- **Do** keep copper rare. Reserve it for present pin, Tarmil Picks, FAB, accent button, focus rings, structural marks (section numbers, header rule, divider accents).
- **Do** wrap every screen in `<Screen>`. It owns safe-area-top, ivory background, and scroll behavior.
- **Do** use `h-dvh`, `h-full`, or `min-h-dvh` for full-viewport heights.
- **Do** wrap Latin runs inside Hebrew with `<bdi>` or the `.ltr` utility.
- **Do** keep Hebrew copy under 14 words per sentence on average, 28 max. Active voice. Always.
- **Do** apply the locked app states: Hover = cocoa-08, Pressed = cocoa-15, Focused = 1.5pt copper outline + 2px offset, Disabled = 30% opacity, Selected = sand fill, Error = copper.

### Don't:

- **Don't** use directional Tailwind utilities: `pl-*`, `pr-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`, `left-*`, `right-*`. They break in RTL.
- **Don't** introduce hex literals in components. Tokens only.
- **Don't** use `100vh`. Mobile Safari's collapsing toolbar makes that wrong.
- **Don't** use `text-stone` for primary type. Stone is decorative-reserve.
- **Don't** drop copper below 70% opacity. The `copper-55` token does not exist on purpose.
- **Don't** use copper on body text any size, table data cells, background fills wider than ~30% of a composition, or the logo / wordmark.
- **Don't** use copper as a full-width rule. Editorial copper rules are 14–18mm only.
- **Don't** use red anywhere. Errors use copper, paired with explicit text.
- **Don't** mix Fraunces italic into body paragraphs. Body italic is Google Sans Text italic 400 / Heebo italic 400.
- **Don't** use Fraunces italic in all-caps for mid-titles. Sentence case only.
- **Don't** use ASCII straight quotes (`"`, `'`). Smart quotes only.
- **Don't** use a hyphen (`-`) for negative values. Use the real minus sign (U+2212).
- **Don't** reach for a modal as the first solution. Inline plus progressive sheets first.
- **Don't** ship identical icon-plus-heading-plus-text card grids. Each row leads with concrete metadata, not a generic illustration.
- **Don't** introduce gradient text or glassmorphism as decoration. The chip-rail's `backdrop-blur-sm` is functional (legibility over the map) and is the only allowed instance.
- **Don't** use side-stripe borders (`border-l` or `border-r` greater than 1px as a colored accent). Use full borders, background tints, or leading numbers / icons.
- **Don't** translate buzzwords into Hebrew. No "synergy", no "leverage" (verb), no "ecosystem", no "play" (noun), no "moat-y". Active Hebrew or rewrite.
- **Don't** use dashed lists. Bulleted (cocoa-30 dot) or numbered (`01.` copper hanging indent) only.
- **Don't** hand-draw the dunes. Algorithmic three-layer Bezier, same seed everywhere.
- **Don't** use triangles, polygons, or curves (other than dunes) in flat geometry. Circles, lines, rectangles only.
- **Don't** place dunes mid-document or inside an active tool screen. Closing surfaces only.
- **Don't** add a third typeface, a fourth radius, an extra spacing step, or a new color without DA approval.
