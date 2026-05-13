-- v0.3 trip dates: clean 5-stop sequence with transit gaps, no overlaps.
-- Mirrors the reset_demo_state() body applied to ltlholyrdtzegyeosqqz.
--
--   Búzios          Oct 28 – Oct 30   2 nights
--   São Paulo       Nov 01 – Nov 05   4 nights, 1 day transit
--   Jericoacoara    Nov 07 – Nov 12   5 nights, 1 day transit
--   Buenos Aires    Nov 14 – Nov 19   5 nights, 1 day transit
--   Punta del Este  Nov 20 – Nov 23   3 nights, adjacent border
--
-- Friend overlap windows are slid so each lands inside the matching stay.

CREATE OR REPLACE FUNCTION public.reset_demo_state()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  delete from public.planned_stops;
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
