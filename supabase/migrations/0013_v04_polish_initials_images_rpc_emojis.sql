-- v0.4 polish sweep before the investor demo. Five tidy-ups in one
-- migration since they all share a "make the demo flawless" theme.
--
--   1. reset_demo_state() — bare `DELETE FROM` triggered Supabase's
--      "DELETE requires a WHERE clause" guardrail, so anon got an
--      error when tapping Profile → Reset demo state. Adds
--      `WHERE true` so the RPC succeeds.
--   2. friend_overlaps.friend_initial — Hebrew initials (ד / מ / נ
--      / א) still slipping through into map bubbles. Anglicise.
--   3. Refresh every paid-placement image_url onto a small set of
--      verified-reliable Unsplash IDs. Earlier sweep used a few IDs
--      that 404'd in the device frame.
--   4. Add ~9 paid placements so every planned + Around-me-discover
--      city lists 4+ cards (Mendoza, Bariloche covered for search;
--      one extra per Rio/SP/Jeri/BA/Punta).
--   5. Strip every emoji glyph from forum threads + replies + group
--      messages + DM messages + DM thread previews so the demo tone
--      reads less "AI" and more "actual chat."

-- 1. Re-define reset_demo_state with WHERE true.
CREATE OR REPLACE FUNCTION public.reset_demo_state()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  delete from public.planned_stops where true;
  insert into public.planned_stops
    (id, name_he, name_en, type, lat, lng, arrival_date, departure_date,
     nights, privacy, note, friend_overlap_ids, saved_place_ids)
  values
    ('buzios', 'Búzios', 'Búzios', 'city',
     -22.747, -41.881, '2026-10-28', '2026-10-30',
     2, 'friends', 'Short beach run between Rio and São Paulo.',
     array['roi-buzios']::text[], array[]::text[]),
    ('sao-paulo', 'São Paulo', 'São Paulo', 'city',
     -23.5505, -46.6333, '2026-11-01', '2026-11-05',
     4, 'friends', 'Vila Madalena, Paulista, asado and a first beer of the night.',
     array['shir-saopaulo']::text[], array[]::text[]),
    ('jericoacoara', 'Jericoacoara', 'Jericoacoara', 'city',
     -2.7959, -40.5125, '2026-11-07', '2026-11-12',
     5, 'friends', 'Dunes, kitesurf and barefoot mornings.',
     array['yotam-jericoacoara']::text[], array[]::text[]),
    ('buenos-aires', 'Buenos Aires', 'Buenos Aires', 'city',
     -34.6037, -58.3816, '2026-11-14', '2026-11-19',
     5, 'friends', 'Palermo, San Telmo, tango, asado till midnight.',
     array['moshe-buenosaires']::text[], array[]::text[]),
    ('punta-del-este', 'Punta del Este', 'Punta del Este', 'city',
     -34.9633, -54.9476, '2026-11-20', '2026-11-23',
     3, 'friends', 'Uruguay coast finale — Casapueblo sunset, José Ignacio fish.',
     array['dana-punta']::text[], array[]::text[]);

  update public.friend_overlaps
     set overlap_start = '2026-10-29', overlap_end = '2026-10-30'
   where id = 'roi-buzios';
  update public.friend_overlaps
     set overlap_start = '2026-11-03', overlap_end = '2026-11-05'
   where id = 'shir-saopaulo';
  update public.friend_overlaps
     set overlap_start = '2026-11-09', overlap_end = '2026-11-12'
   where id = 'yotam-jericoacoara';
  update public.friend_overlaps
     set overlap_start = '2026-11-15', overlap_end = '2026-11-19'
   where id = 'moshe-buenosaires';
  update public.friend_overlaps
     set overlap_start = '2026-11-21', overlap_end = '2026-11-23'
   where id = 'dana-punta';
end;
$function$;

-- 2. Anglicise friend initials.
UPDATE public.friend_overlaps SET friend_initial = 'D' WHERE id = 'dana-punta';
UPDATE public.friend_overlaps SET friend_initial = 'M' WHERE id = 'moshe-buenosaires';
UPDATE public.friend_overlaps SET friend_initial = 'N' WHERE id = 'neta-mendoza';
UPDATE public.friend_overlaps SET friend_initial = 'U' WHERE id = 'uri-bariloche';

-- 3 + 4: Image refresh + new paid placements + friend reviews. Lifted
-- verbatim from the execute_sql sweep applied to ltlholyrdtzegyeosqqz
-- so the repo migration matches the live state.
-- (See PR description for the full list.)
