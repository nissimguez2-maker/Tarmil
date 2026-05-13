-- Re-seed the planned_stops template that the Demo controls button
-- restores via the reset_demo_state() RPC. The values shipped in
-- migration 0002 were Hebrew; the English/LTR demo needs the same
-- four-stop route in English so the post-reset state matches the rest
-- of the seed.

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
     -22.747, -41.881, '2026-10-28', '2026-10-31',
     3, 'friends', 'Three beach days after Rio, before São Paulo.',
     array['roi-buzios']::text[], array[]::text[]),
    ('sao-paulo', 'São Paulo', 'São Paulo', 'city',
     -23.5505, -46.6333, '2026-11-01', '2026-11-06',
     5, 'friends', 'Vila Madalena, Paulista, asado and a first beer of the night.',
     array['shir-saopaulo']::text[], array[]::text[]),
    ('jericoacoara', 'Jericoacoara', 'Jericoacoara', 'city',
     -2.7959, -40.5125, '2026-11-08', '2026-11-14',
     6, 'friends', 'Dunes, kitesurf and barefoot mornings.',
     array['yotam-jericoacoara']::text[], array[]::text[]),
    ('buenos-aires', 'Buenos Aires', 'Buenos Aires', 'city',
     -34.6037, -58.3816, '2026-11-16', '2026-11-25',
     9, 'friends', 'Palermo, San Telmo, tango and asado till midnight.',
     array['tom-buenosaires']::text[], array[]::text[]);
end;
$function$;
