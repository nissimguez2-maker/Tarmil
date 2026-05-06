---
name: Tarmil
description: Hebrew-first travel companion for Israeli backpackers, warm editorial desert-paper register
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
    fontFamily: "Heebo, Google Sans Text, system-ui, sans-serif"
    fontSize: "8pt"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.18em"
  small:
    fontFamily: "Heebo, Google Sans Text, system-ui, sans-serif"
    fontSize: "10pt"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Heebo, Google Sans Text, system-ui, sans-serif"
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
---

# Design System: Tarmil

## 1. Overview

**Creative North Star: "The Desert-Paper Field Guide"**

Tarmil is shaped like an editorial field guide reprinted on warm, slightly tinted paper. Surfaces are ivory and sand; type carries the personality, not chrome. Fraunces (with Frank Ruhl Libre as the Hebrew-companion fallback) leads in headlines and place names. The Hebrew sans (Heebo, with Google Sans Text behind it) carries body copy. Copper is the only vibrant accent and earns its appearance: present pin, Tarmil Picks badge, the "הוסף יעד" FAB, accent CTAs.

The system explicitly rejects: Booking.com density, Google-Maps cold UI, generic travel-app blue + orange, SaaS landing-page clichés (gradient hero, hero-metric template, identical icon-plus-heading-plus-text card grids, glassmorphism), modal-first UX, and anything that reads as AI-generated. The opposite intuitions hold: sparseness, mid-page breathing room, Hebrew that reads like it was written in Hebrew, and a single warm palette that ships without dark mode by design.

**Key Characteristics:**
- Light, single-theme, warm desert-paper neutrals.
- Editorial serif for headlines plus Hebrew sans for body. No third typeface.
- Copper as a rare accent, never below 70% opacity.
- Logical RTL utilities only; the entire app runs in `<html dir="rtl">`.
- Brand tokens only; hex literals never leak into components.
- Restrained color strategy. Cocoa text on ivory or sand surfaces does the work; copper signals action and brand moments.

## 2. Colors: The Desert-Paper Palette

A four-step neutral surface scale, a six-step cocoa text scale, and one vibrant copper accent. Cocoa carries the typographic weight; copper signals action.

### Primary
- **Cocoa** (`#352818`): Default text color. Primary CTA fill. The ground tone of every typographic surface.
- **Cocoa 70 / 55 / 30 / 15 / 08** (`#352818` at 70 / 55 / 30 / 15 / 8% opacity): Body emphasis tiers, hairline rules, dividers, hover micro-fills.

### Secondary (vibrant accent)
- **Copper** (`#c75d24`): Tarmil Picks badge, present pin, "הוסף יעד" FAB, accent CTAs ("הוסף למסע", "אישור" in pick mode), copy emphasis ("איתך כאן", "חופף בעתיד"). Maximum ~10% surface area per screen.
- **Copper 85** (`#c75d24` at 85% opacity): Hover state for accent buttons.
- **Copper 70** (`#c75d24` at 70% opacity): Focus rings, friend-bubble haloes, halo glow on the active planned-stop ring.

### Neutral (surface scale)
- **Ivory** (`#f4ebd5`): Default surface. Background of every Screen wrapper, BottomSheet, TopBar.
- **Sand** (`#ead8c0`): Elevated surface. Cards (PlaceCard, friend balance cards, summary card), inputs, hero summaries.
- **Rope** (`#d1bb9e`): Hairline borders on elevated surfaces. The subtle definition between sand and ivory.
- **Stone** (`#a79277`): Reserved. Decorative use only when explicitly approved by brand. Never used for primary type.

### Named Rules
**The Restrained Copper Rule.** Copper carries less than 10% of any visible surface. If a screen reads "copper-heavy", it is wrong.

**The Cocoa Primary Rule.** All primary text is cocoa or cocoa with reduced opacity. `text-stone` is forbidden for primary type.

**The No-Hex Rule.** Components reference brand tokens only. Hex literals appear once: in `src/utils/mapColors.ts`, where third-party APIs (Leaflet, TomTom) demand string values.

## 3. Typography

**Display Font:** Fraunces (with Frank Ruhl Libre fallback for Hebrew, Times New Roman as last resort).
**Body Font:** Heebo (with Google Sans Text fallback, then Roboto Flex, Inter, system-ui).
**Label / Eyebrow:** Heebo at 8pt with 0.18em tracking and uppercase form, exposed via the `.meta-caps` utility in `src/index.css`.

**Character:** Fraunces is editorial-warm with the SOFT axis maxed (`font-variation-settings: 'SOFT' 100, 'opsz' 144`); it pairs with Heebo, the Hebrew workhorse, so headlines feel like a magazine and body copy feels like a chat.

### Hierarchy
- **Hero** (700, 92pt, 0.92 lh, -0.04em tracking): Reserved for future hero surfaces. Not used in any current screen.
- **Display** (700, 44pt, 0.94 lh, -0.035em tracking): Currency-screen amount input, similar amount-as-statement contexts.
- **Sub** (700, 22pt, 1.15 lh, -0.018em tracking): PlannedStopSheet header, ProfileScreen username.
- **Lede** (700, 14pt, 1.4 lh): Default headline. Place names, friend names, summary card titles.
- **Body** (400, 11pt, 1.55 lh): Default copy. Cap line length at 65 to 75 characters. The `max-w-body` utility (= 130mm) covers this.
- **Small** (400, 10pt, 1.45 lh): Meta copy, dates, "X חברים מכירים" counts, supporting context.
- **Meta** (500, 8pt, 1.5 lh, 0.18em tracking, uppercase via `.meta-caps`): Section eyebrows, "בחירת תרמיל", "איתך כאן", "TARMIL" wordmark on TopBar.

### Named Rules
**The Two-Family Rule.** Fraunces for headlines, Heebo for body. No third typeface enters the system without DA approval.

**The Locked Scale Rule.** Type sizes are exactly the seven steps above. No `text-[12pt]` shortcuts. If the value is not on the scale, stop and ask.

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
The `<Button>` primitive in `src/components/Button.tsx` is the canonical CTA. Three variants, height 14mm (`h-lg`), `rounded-full`, `text-body` weight 500.

- **Shape:** Pill (`rounded-full`), height 14mm, horizontal padding 8mm (`px-md`).
- **Primary** (`variant="primary"`): Cocoa background, ivory text. Default CTA.
- **Accent** (`variant="accent"`): Copper background, ivory text. Vibrant CTA, used sparingly: "הוסף למסע", "אישור" on the pick bar, "שמור" on the destination confirmation, "הוסף הוצאה".
- **Ghost** (`variant="ghost"`): Transparent background, `border-cocoa-15` hairline, cocoa text. Secondary actions ("ביטול", "סגור חוב", "ערוך תאריכים", "אפס סימונים").
- **Hover / Focus:** Variants shift one step (cocoa to cocoa-70, copper to copper-85). Focus visible: `ring-2 ring-copper` with `ring-offset-ivory`.

### Cards
`PlaceCard` (`src/components/PlaceCard.tsx`) is the canonical pattern. Friend balance cards and the travel-moment card extend it.

- **Corner Style:** `rounded-sm` (2px). Restrained.
- **Background:** Sand (`bg-sand`).
- **Border:** Rope hairline (`border border-rope`). Defines the card without a shadow.
- **Internal Padding:** 8mm (`p-md`).
- **Title:** Fraunces lede in cocoa.
- **Meta:** Heebo small in cocoa-55.

### Bottom Sheet
- **Shape:** `rounded-md` (6px), full-width with 8mm side margin, anchored to the bottom of the trip-area.
- **Background:** Ivory.
- **Border:** Rope hairline.
- **Slide:** `translate-y` from `120%` to `0`, opacity 0 to 100 over 300ms. CSS transition on the wrapper. Layout properties are not animated; the wrapper height stays content-driven.
- **Tall variant** (`height="tall"`): switches positioning to `inset-y-md` with internal `overflow-y-auto`, max-height ~85% of the trip area. Used for `PlannedStopSheet` (collapsibles plus place lists).

### Chip Rail (filters)
- **Shape:** Each chip `rounded-full`, height 9mm, padding 4mm horizontal.
- **Active state:** Cocoa background, ivory text, cocoa border.
- **Inactive state:** Ivory background, cocoa-15 border, cocoa text.
- **AND modifiers** (Tarmil Picks, Friends know): Same chip shape, identical to category chips. Their effect is enforced in logic, not visuals.
- **Rail container:** `bg-ivory/85 backdrop-blur-sm` band over the map, with the filter-rail rim shadow.

### Inputs / Fields
- **Shape:** `rounded-full`, height 10mm, sand background, `border-cocoa-15` at rest.
- **Focus:** `border-copper`, no extra ring (the border shift IS the focus indicator).
- **Hebrew direction:** `dir="rtl"` for text, `dir="ltr"` only for digit-only fields (number, date) where left-to-right reading is correct.
- **Native form controls** (checkbox, radio, select): `accent-copper` so the OS-painted indicator inherits brand color.

### TopBar
- **Layout:** 14mm tall, ivory background, cocoa-15 hairline at the bottom edge.
- **Content:** Centered serif `text-lede` title, optional copper `meta-caps` eyebrow above. Optional back chevron at the start side; in RTL, `start = right`, so Lucide `ChevronRight` is correct (points back-toward-start).
- **End slot:** Optional element on the end side (Settings gear on ProfileScreen).

### Tab Bar
- **Layout:** 4-column grid at the bottom of the device frame, ivory background, cocoa-15 hairline at the top edge.
- **Active state:** Copper text, heavier icon stroke (2 vs 1.5), 2px copper bar at the top edge of the active tab.
- **RTL ordering:** Source order Trip, Tools, Friends, Profile renders visually right-to-left; the user reads it correctly in Hebrew.

### Trip Map (signature surface)
The most distinctive component in the system. Fed by the TomTom Maps SDK v6.

- **Tiles:** TomTom default vector style, with a CSS filter `sepia(0.18) saturate(0.85) hue-rotate(-10deg) brightness(1.03)` on `.mapboxgl-canvas` only. HTML markers (friend bubbles, present pin, planned-stop rings) keep their full-saturation brand colors over a warm-tinted basemap.
- **Past trip line:** Solid cocoa polyline, weight 2, opacity 0.6, with 4px filled cocoa dots at each waypoint.
- **Planned-stop markers:** Hollow copper rings (14px) on a dashed cocoa connector. Active stop gets a copper halo via `.is-active`.
- **Present pin:** Pulsing copper dot (16px) with an animated copper ring scaling 1 to 2.0 over 2.4s. Reduced-motion media query disables the animation.
- **Friend bubbles:** Centroid-only, never street-level. Soft halo signals "approximately in this area"; present friends are filled copper, future friends are dashed-copper-on-ivory.

## 6. Do's and Don'ts

### Do:
- **Do** use logical RTL utilities exclusively: `ps`, `pe`, `start`, `end`, `ms`, `me`, `border-s`, `border-e`, `rounded-s`, `rounded-e`.
- **Do** pull every color from brand tokens (`bg-cocoa`, `text-copper-70`, etc.). The only allowed hex literals live in `src/utils/mapColors.ts` for third-party APIs.
- **Do** use the seven type-size steps from the locked scale: `text-meta`, `text-small`, `text-body`, `text-lede`, `text-sub`, `text-display`, `text-hero`.
- **Do** keep copper rare. Reserve it for present pin, Tarmil Picks, FAB, accent button, and a few badge highlights.
- **Do** wrap every screen in `<Screen>`. It owns safe-area-top, ivory background, and scroll behavior.
- **Do** use `h-dvh`, `h-full`, or `min-h-dvh` for full-viewport heights.
- **Do** wrap Latin runs inside Hebrew with `<bdi>` or the `.ltr` utility.
- **Do** keep Hebrew copy under 14 words per sentence on average, 28 max. Active voice. Always.

### Don't:
- **Don't** use directional Tailwind utilities: `pl-*`, `pr-*`, `ml-*`, `mr-*`, `border-l-*`, `border-r-*`, `rounded-l-*`, `rounded-r-*`, `left-*`, `right-*`. They break in RTL.
- **Don't** introduce hex literals in components. Tokens only.
- **Don't** use `100vh`. Mobile Safari's collapsing toolbar makes that wrong.
- **Don't** use `text-stone` for primary type. Stone is decorative-reserve.
- **Don't** drop copper below 70% opacity. The `copper-55` token does not exist on purpose.
- **Don't** reach for a modal as the first solution. Inline plus progressive sheets first.
- **Don't** ship identical icon-plus-heading-plus-text card grids. The Tools tab uses cards but each row leads with concrete metadata, not a generic illustration.
- **Don't** introduce gradient text. Explicit DA ban.
- **Don't** introduce glassmorphism as decoration. The chip-rail's `backdrop-blur-sm` is functional (legibility over the map) and is the only allowed instance.
- **Don't** use side-stripe borders (`border-l` or `border-r` greater than 1px as colored accent). Use full borders, background tints, or leading numbers / icons.
- **Don't** translate buzzwords into Hebrew. No "synergy", no "leverage" (verb), no "ecosystem", no "play" (noun), no "moat-y". Active Hebrew or rewrite.
- **Don't** add a third typeface, a fourth radius, an extra spacing step, or a new color without DA approval.
- **Don't** use em dashes. Use commas, colons, semicolons, periods, or parentheses.
