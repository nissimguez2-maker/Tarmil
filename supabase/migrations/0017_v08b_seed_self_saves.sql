-- v0.8b — Pre-load Plan tab with self-saves so the investor demo isn't an
-- empty inbox on cold boot. Ten saves across four upcoming stops, mixing
-- the three statuses (Reserved · Wishlist · Visited), plus two Bariloche
-- saves with no planned-stop attachment so the "Saved (unsorted)" bucket
-- has signal.

insert into public.place_saves
  (friend_id, place_id, status, planned_stop_id, private)
values
  -- Búzios — locked accommodation + a beach to chase
  (null, 'buzios-geriba-hostel', 'reserved', 'buzios',       false),
  (null, 'buzios-ferradura',     'wishlist', 'buzios',       false),
  -- São Paulo — hostel + a market to wander
  (null, 'o-de-casa-hostel',     'reserved', 'sao-paulo',    false),
  (null, 'municipal-market',     'wishlist', 'sao-paulo',    false),
  -- Jericoacoara — only wishlist for now (the kitesurf city)
  (null, 'duna-por-do-sol',      'wishlist', 'jericoacoara', false),
  -- Buenos Aires — Don Julio reservation, Niceto on the wishlist
  (null, 'biz-ba-don-julio',     'reserved', 'buenos-aires', false),
  (null, 'biz-ba-niceto-club',   'wishlist', 'buenos-aires', false),
  -- Punta del Este — Casapueblo sunset
  (null, 'biz-punta-casapueblo', 'wishlist', 'punta-del-este', false),
  -- Saved (unsorted) — Bariloche is a future-trip idea, not on the
  -- planned route yet
  (null, 'bariloche-cerro-catedral', 'wishlist', null, false),
  (null, 'bariloche-circuito-chico', 'wishlist', null, false)
on conflict do nothing;

-- ============================================================================
-- reset_demo_state() — repopulate the self-save seed after a reset so the
-- demo always boots into the same pre-loaded Plan tab.
-- ============================================================================

create or replace function public.reset_demo_state()
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  delete from public.pings where true;

  update public.activity_posts
     set poll = jsonb_set(poll, '{votes}', '{}'::jsonb)
   where poll is not null;

  -- Clear demo "self" saves (friend_id is null); friend-authored saves stay
  -- as seed data so the overlays have signal.
  delete from public.place_saves where friend_id is null;

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

  -- Re-seed the self-save pre-load so the Plan tab is full on demo boot.
  insert into public.place_saves
    (friend_id, place_id, status, planned_stop_id, private)
  values
    (null, 'buzios-geriba-hostel',  'reserved', 'buzios',          false),
    (null, 'buzios-ferradura',      'wishlist', 'buzios',          false),
    (null, 'o-de-casa-hostel',      'reserved', 'sao-paulo',       false),
    (null, 'municipal-market',      'wishlist', 'sao-paulo',       false),
    (null, 'duna-por-do-sol',       'wishlist', 'jericoacoara',    false),
    (null, 'biz-ba-don-julio',      'reserved', 'buenos-aires',    false),
    (null, 'biz-ba-niceto-club',    'wishlist', 'buenos-aires',    false),
    (null, 'biz-punta-casapueblo',  'wishlist', 'punta-del-este',  false),
    (null, 'bariloche-cerro-catedral', 'wishlist', null, false),
    (null, 'bariloche-circuito-chico', 'wishlist', null, false)
  on conflict do nothing;
end;
$function$;
