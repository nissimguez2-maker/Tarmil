-- v0.8 Trip ↔ Plan pivot — Around dissolves, Plan absorbs the saved-places spine.
--
-- New `place_saves` table holds every save (the user's and friends'). Single
-- list with three statuses (wishlist | reserved | visited). Public to direct
-- friends by default, opt-out per save. Optional trip association.
--
-- Migration also pulls existing planned_stops.saved_place_ids[] entries into
-- place_saves rows so nothing is lost.

create table if not exists public.place_saves (
  id text primary key default (gen_random_uuid())::text,
  -- null = the demo "self" user; non-null = a friend (FK to friend_overlaps)
  friend_id text references public.friend_overlaps(id) on delete cascade,
  place_id text not null references public.places(id) on delete cascade,
  status text not null check (status in ('wishlist', 'reserved', 'visited')) default 'wishlist',
  -- Attached to a specific trip, or null = Saved (unsorted bucket)
  planned_stop_id text references public.planned_stops(id) on delete set null,
  private boolean not null default false,
  created_at timestamptz not null default now()
);

-- Friend rows must be unique per (friend, place). Self rows handled in app
-- code (Postgres treats NULLs as distinct in unique constraints, so a partial
-- index is the cleanest way to enforce this).
create unique index if not exists place_saves_friend_unique
  on public.place_saves (friend_id, place_id)
  where friend_id is not null;

-- Common access patterns.
create index if not exists place_saves_place_idx on public.place_saves (place_id);
create index if not exists place_saves_stop_idx on public.place_saves (planned_stop_id);
create index if not exists place_saves_status_idx on public.place_saves (status);

alter table public.place_saves enable row level security;
drop policy if exists "place_saves_read_all" on public.place_saves;
drop policy if exists "place_saves_insert_all" on public.place_saves;
drop policy if exists "place_saves_update_all" on public.place_saves;
drop policy if exists "place_saves_delete_all" on public.place_saves;
create policy "place_saves_read_all" on public.place_saves for select using (true);
create policy "place_saves_insert_all" on public.place_saves for insert with check (true);
create policy "place_saves_update_all" on public.place_saves for update using (true) with check (true);
create policy "place_saves_delete_all" on public.place_saves for delete using (true);

-- Realtime
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime'
      and schemaname='public' and tablename='place_saves'
  ) then
    execute 'alter publication supabase_realtime add table public.place_saves';
  end if;
end $$;

-- ============================================================================
-- Migrate existing planned_stops.saved_place_ids[] entries → self wishlist
-- ============================================================================

insert into public.place_saves (friend_id, place_id, status, planned_stop_id, private)
select null,
       place_id,
       'wishlist',
       stops.id,
       false
  from public.planned_stops stops,
       unnest(stops.saved_place_ids) as place_id
 where exists (select 1 from public.places p where p.id = place_id)
on conflict do nothing;

-- ============================================================================
-- reset_demo_state() — also clear place_saves so demos start clean
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
end;
$function$;
