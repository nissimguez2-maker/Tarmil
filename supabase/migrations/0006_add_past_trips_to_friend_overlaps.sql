-- PR5 — friend trip browsing.
-- past_trips: array of { id, destinationLabel, season, year, durationLabel, waypoints }
-- waypoints: array of [lat, lng] tuples — drawn as a polyline on the friend
-- profile map. Privacy posture: dates are aggregated to season+year+duration
-- before they reach the client (the data layer just doesn't carry full dates).
alter table public.friend_overlaps
  add column if not exists past_trips jsonb not null default '[]'::jsonb;
