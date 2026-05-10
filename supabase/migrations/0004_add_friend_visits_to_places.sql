-- PR3 — friends-who-know-this-place row at season+year+duration resolution.
-- Stored as JSONB array on the place itself: each entry is one friend's visit
-- to this place. Per the privacy posture, dates are aggregated to season+year
-- before they reach the client; durationLabel is a Hebrew string ("שבועיים")
-- rather than a precise day count.
--
-- Shape: [{ friendInitial, friendName, season, year, durationLabel }]
--   season: 'spring' | 'summer' | 'autumn' | 'winter'

alter table public.places
  add column if not exists friend_visits jsonb not null default '[]'::jsonb;
