# Product

## Register

product

## Users

Israeli backpackers, mostly post-army, late teens to mid-twenties, Hebrew-first. Either planning a trip from Israel or already on one. The canonical case is the South America loop (Rio → Búzios → São Paulo → Jericoacoara → Buenos Aires). Mobile-first, often offline, dependent on the device for navigation, currency, expense splitting, communication. They expect Hebrew RTL typography that doesn't feel translated, and they distrust apps that share too much.

## Product Purpose

Tarmil is a Hebrew-first travel companion that pairs a curated places layer with a city-level social layer (friends-who-overlap, friends-who-know-this-place) without ever revealing street-level location. Trip planning is Polarsteps-shaped: past route, present, planned future stops with exact dates. Tools layer is utilitarian: currency converter (live rates), pre-trip checklist with full edit, multi-currency expense splitting between friends.

The investor demo lives at https://tarmil-mockup.netlify.app. No real backend yet; everything is hardcoded mock data plus localStorage persistence.

Success: an Israeli traveler installs the app pre-trip, uses the checklist, plans their route, finds a Tarmil-Picked hostel through a friend's overlap, and never feels the app shared more than they wanted.

## Brand Personality

Editorial, warm, restrained. Voice is post-army-honest: short Hebrew sentences (cap 28 words, prefer ~14), active voice, no buzzwords (no "synergy", no "leverage" as a verb, no "ecosystem", no "play" as a noun, no "moat-y"). The visual register is desert-paper warmth: ivory and sand surfaces, cocoa serif headlines, copper as the only vibrant accent (capped at ~10% of any screen, never below 70% opacity).

3-word personality: warm, editorial, restrained.

## Anti-references

- **Booking.com / TripAdvisor density.** Information vomit, identical card grids, pop-up modals on every action. Tarmil is the opposite: sparse, breathable, one decision at a time.
- **Google Maps / Maps.me UI.** Cold, generic, no personality. Tarmil's map is warm-tinted and editorial.
- **Generic travel-app blue + orange.** The default category palette. Tarmil rejects it for cocoa + copper desert-paper.
- **SaaS landing-page clichés.** Gradient hero, hero-metric template, four-column feature grid, glassmorphism cards, gradient text. None of those.
- **Anything that looks AI-generated.** AI palettes, generic Inter, dark-mode-with-purple, "modern but boring" defaults.
- **"Translated from English" Hebrew.** Awkward Hebrew, English-shaped clauses, calque buzzwords. Native-feeling Hebrew or nothing.
- **Friend-tracking density.** Apps that show a friend's exact location, real-time movement, full history. Tarmil shows only city-level overlap, only when both parties declared it.

## Design Principles

1. **City-level privacy is architectural, not UI flourish.** Friend resolution caps at neighborhood / town centroid. There is no street-level data path. The map's halos, the FriendSheet's privacy line, the Hebrew copy ("מיקום ברמת עיר בלבד") all enforce the same commitment.
2. **Hebrew RTL is first-class.** Logical Tailwind utilities only (`ps`, `pe`, `start`, `end`, `ms`, `me`, `border-s`, `border-e`, `rounded-s`, `rounded-e`). Latin inside Hebrew uses `<bdi>` or the `.ltr` utility. Directional utilities (`pl`, `pr`, `ml`, `mr`, `left`, `right`, `border-l`, `border-r`, `rounded-l`, `rounded-r`) are forbidden, full stop.
3. **Brand tokens only.** No hex literals leak into components. The DA v0.2 palette is locked. If a value isn't on the list, stop and ask, don't invent.
4. **Editorial voice in copy.** Active voice, ~14 words per sentence, no buzzwords. Hebrew reads like a 22-year-old post-army backpacker, not like a marketing department.
5. **Restrained accent.** Copper is rare; cocoa carries the typographic weight. Copper appears on Tarmil Picks, the present pin, the "הוסף יעד" FAB, "Accent" CTAs, and a few badge highlights. Anywhere copper takes more than ~10% of a screen, the design needs reworking.

## Accessibility & Inclusion

WCAG AA target. Hebrew RTL is the primary direction; the entire app runs in `<html dir="rtl" lang="he">`. Touch targets are at least 44 by 44 pixels (most CTAs are `h-lg` = 14mm). Native form controls (checkbox, radio, select) carry `accent-copper` so OS-painted indicators inherit the brand color. `<bdi>` and `.ltr` handle direction-mixed content. The reduced-motion media query disables the present-pin pulse animation. Single light theme by design: DA is single-palette warm, dark mode is explicitly out of scope.
