# Tarmil — Product Context

**Register: product** (mobile app UI; design serves the product, not vice versa).

## What this is

A click-through mockup of the Tarmil mobile app for international investors. On phones it goes full-bleed and feels native; on desktop ≥768px it renders inside an iPhone frame. Pure visual demo — no real backend behavior beyond Supabase reads/writes for trip state.

Five bottom tabs (one mental model per tab), in order:

| Tab | Surface |
|---|---|
| Trip | Continent-scale map with bubbles and pins; friend pins; next-trip card |
| Plan | Saved places organised by trip (the list view of the map) + a Discover modal for curated places — Now / My trip / Search |
| Activity | Social feed — "Right now" overlap strip + wall of trip declarations / who's-down / polls / questions; compose FAB; ping bell |
| Forums | City × 8 subjects (Accommodation · Transits · Scams & danger · Food · Activities & treks · Nightlife & parties · Money & visas · Meetups); per-post identity choice |
| Tools | 7 utility tiles — Currency, Pre-trip checklist, Voice translator, Menu translator, Sign scanner, Friend balances, eSIM |

Profile is **not** a tab. Top-right avatar icon on every tab → drills to `/profile`. There's also a desktop planner at `/web` (a calmer, larger-screen planning surface) reached from the `/` mode toggle.

Curated places lean into **kosher & Jewish-friendly** venues (restaurants, bakeries, synagogues, mikvaot, Chabad) alongside the general travel set, surfaced through a disclosed two-tier merchant model (Sponsored · earned Tarmil Selection).

## Users

- **Mid-twenties traveler** (post-army Israeli, 3–6 month trip to South America or SE Asia). Daily-opens for: map, Around (where to eat tonight), Activity (who's down), Forums (city intel), Ping (one-shot signal to friends).
- **Short-trip traveler** (long weekend in Berlin, week in Greece). Pre-trip: Forums + Activity. In-trip: Around + Map.
- **The planner** (mapping a future trip). Activity ("who's down Vietnam in November?") + Map (see friends' declarations) + Forums.

This mock is shown to international investors. **English-only rendered UI today** (schema is bilingual — Hebrew columns stay in place for the real Hebrew-first launch later). The brief mandates Hebrew RTL for the production app; this mockup deliberately sets that aside.

## Anti-references

- WhatsApp / Telegram — Tarmil deliberately ships **no DMs and no group chats**. Ping is the only one-to-one signal and carries no message body.
- Facebook destination groups — the surface Tarmil replaces. Forums + Activity wall must feel cleaner, faster, more trustworthy.
- Generic SaaS dashboards, "hero metric" templates, side-stripe borders, gradient text, glossy product-tech sheen. The brand is editorial, warm, and quiet — not corporate, not loud.
- Maps apps that show street-level friend location. **City-level resolution only**, always. The architecture cannot store anything finer.
- Doomscroll-style feeds — no images, no video, no link previews on Activity posts. Text + emoji + optional city pin + optional 2–4 option poll.

## Tone

Editorial, warm, deliberate. Sentence cap ~28 words, prefer ~14. Active voice. Plain language. Avoid "synergy", "leverage" (verb), "ecosystem", "play" (noun), "moat-y". The DA voice section is the source.

## Strategic principles

1. **Privacy is non-negotiable.** Resolution is capped at the city, always. Off-grid mode is a one-tap switch on Profile root. No street-level data ever leaves the device.
2. **One mental model per tab.** Trip = the map (location), Plan = saved places + discovery, Activity = social feed, Forums = stranger Q&A, Tools = utilities.
3. **Quality over quantity.** Curated data, considered design, no feature bloat. Every surface earns its place.
4. **Paid placement is disclosed, not hidden.** Qualified businesses buy a labelled **Sponsored** placement; sustained Israeli-traveler ratings earn the **Tarmil Selection** badge on top. Both are labelled at the point of decision, ranking within tiers uses Tarmil ratings (Google only screens at intake), and non-paying places are shown — never suppressed.
5. **Kosher & Jewish-friendly, the practical way.** Kosher spots, synagogues, mikvaot, and Chabad sit in the catalogue as traveler-relevant places — and they're where the disclosed merchant model lives. The forum subject set stays general (no religious subject). Tarmil is a travel companion for Israelis abroad that's genuinely useful for Jewish-friendly travel, not a religious app.
6. **Logical Tailwind utilities only.** The Hebrew RTL launch flips `dir="rtl"` and physical utilities break then. Use `ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`, `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`.
