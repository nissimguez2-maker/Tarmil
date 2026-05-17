# Tarmil — Product Context

**Register: product** (mobile app UI; design serves the product, not vice versa).

## What this is

A click-through mockup of the Tarmil mobile app for international investors. On phones it goes full-bleed and feels native; on desktop ≥768px it renders inside an iPhone frame. Pure visual demo — no real backend behavior beyond Supabase reads/writes for trip state.

Five bottom tabs (v0.6 IA, one mental model per tab):

| Tab | Surface |
|---|---|
| Trip | Continent-scale map with bubbles and pins; friend pins; next-trip card |
| Activity | Social feed — "Right now" overlap strip + wall of trip declarations / who's-down / polls / questions; compose FAB; ping bell |
| Around | Curated places (paid placements get internal ranking boost — never a public "Partner" / "Sponsored" label); Now / My trip / Search modes |
| Forums | City × 8 subjects (Accommodation · Transits · Scams & danger · Food · Activities & treks · Nightlife & parties · Money & visas · Meetups); per-post identity choice |
| Tools | 7 utility tiles — Currency, Pre-trip checklist, Voice translator, Menu translator, Sign scanner, Friend balances, eSIM |

Profile is **not** a tab. Top-right avatar icon on every tab → drills to `/profile`.

## Users

- **Mid-twenties traveler** (post-army Israeli, 3–6 month trip to South America or SE Asia). Daily-opens for: map, Around (where to eat tonight), Activity (who's down), Forums (city intel), Ping (one-shot signal to friends).
- **Short-trip traveler** (long weekend in Berlin, week in Greece). Pre-trip: Forums + Activity. In-trip: Around + Map.
- **The planner** (mapping a future trip). Activity ("who's down Vietnam in November?") + Map (see friends' declarations) + Forums.

This mock is shown to international investors. **English-only rendered UI today** (schema is bilingual — Hebrew columns stay in place for the real Hebrew-first launch later). The brief mandates Hebrew RTL for the production app; this mockup deliberately sets that aside.

## Anti-references

- WhatsApp / Telegram — Tarmil deliberately ships **no DMs and no group chats**. Ping is the only one-to-one signal and carries no message body.
- Facebook destination groups — the surface Tarmil replaces. Forums + Activity wall must feel cleaner, faster, more trustworthy.
- Generic SaaS cream backgrounds, "hero metric" templates, side-stripe borders, gradient text. The brand is editorial and warm, not corporate.
- Maps apps that show street-level friend location. **City-level resolution only**, always. The architecture cannot store anything finer.
- Doomscroll-style feeds — no images, no video, no link previews on Activity posts. Text + emoji + optional city pin + optional 2–4 option poll.

## Tone

Editorial, warm, deliberate. Sentence cap ~28 words, prefer ~14. Active voice. Plain language. Avoid "synergy", "leverage" (verb), "ecosystem", "play" (noun), "moat-y". The DA voice section is the source.

## Strategic principles

1. **Privacy is non-negotiable.** Resolution is capped at the city, always. Off-grid mode is a one-tap switch on Profile root. No street-level data ever leaves the device.
2. **One mental model per tab.** Trip = location, Activity = social feed, Around = discovery, Forums = stranger Q&A, Tools = utilities.
3. **Quality over quantity.** Curated data, considered design, no feature bloat. Every surface earns its place.
4. **Partner placements are invisible to the user.** Ranking boost happens internally; nothing in the UI labels a place as a partner or paid.
5. **Logical Tailwind utilities only.** The Hebrew RTL launch flips `dir="rtl"` and physical utilities break then. Use `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.
