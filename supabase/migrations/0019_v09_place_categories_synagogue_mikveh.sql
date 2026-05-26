-- v0.9 — Widen the places.category check to admit two kosher/Jewish-friendly
-- categories the merchant model leans on: `synagogue` and `mikveh`. The
-- venues themselves live in the TS seed (src/data/rioPlaces.ts,
-- globalPlaces.ts) and arrive via the seed script; this migration only opens
-- the constraint so they're accepted. Additive — existing rows are unaffected.

alter table public.places drop constraint if exists places_category_check;

alter table public.places add constraint places_category_check check (
  category = any (array[
    'beach','hostel','cafe','restaurant','bar','club',
    'chabad','kosher','synagogue','mikveh','landmark'
  ])
);
