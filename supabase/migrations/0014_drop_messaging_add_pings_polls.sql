-- v0.5 alignment to Product Brief (May 14, 2026).
--
--   1. Drop direct messages and group chats — brief §06 makes DMs and
--      group chats permanently out-of-scope ("Tarmil is not competing
--      with WhatsApp"). The Ping signal in §04 replaces every previous
--      one-to-one path.
--   2. Add a first-class `poll` jsonb column on activity_posts so the
--      Activity wall can attach 2–4 option polls per brief §05.
--   3. New `pings` table — one row per direction per co-presence event.
--      A unique (friend_id, direction) constraint enforces brief §04's
--      "one ping per direction per co-presence event" rule without app
--      code having to be careful.
--   4. Rebuild reset_demo_state() to also clear pings and any poll
--      attachments so the canonical demo state is restored cleanly.

-- ============================================================================
-- 1. DROP MESSAGING TABLES
-- ============================================================================

drop table if exists public.dm_messages cascade;
drop table if exists public.dm_threads cascade;
drop table if exists public.group_messages cascade;
drop table if exists public.group_chat_members cascade;
drop table if exists public.group_chats cascade;

-- ============================================================================
-- 2. POLLS ON ACTIVITY POSTS
-- ============================================================================
--
-- Shape:
--   {
--     "question": text,
--     "options": [{"text": text, "voteCount": int}],
--     "multipleChoice": bool,
--     "votes": { "<friendId|self>": [option_index, ...] }
--   }
--
-- Vote tallying lives inline in the jsonb for the demo so we don't need
-- a poll_votes table. When real auth lands the votes column promotes to
-- a proper join table.

alter table public.activity_posts add column if not exists poll jsonb;
create index if not exists activity_posts_poll_idx
  on public.activity_posts ((poll is not null));

-- ============================================================================
-- 3. PINGS
-- ============================================================================

create table if not exists public.pings (
  id text primary key default (gen_random_uuid())::text,
  friend_id text not null references public.friend_overlaps(id) on delete cascade,
  direction text not null check (direction in ('sent','received')),
  zone_label text not null,
  created_at timestamptz not null default now(),
  unique (friend_id, direction)
);

create index if not exists pings_friend_idx on public.pings (friend_id);

alter table public.pings enable row level security;
drop policy if exists "pings_read_all"   on public.pings;
drop policy if exists "pings_insert_all" on public.pings;
drop policy if exists "pings_delete_all" on public.pings;
create policy "pings_read_all"   on public.pings for select using (true);
create policy "pings_insert_all" on public.pings for insert with check (true);
create policy "pings_delete_all" on public.pings for delete using (true);

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime'
      and schemaname='public' and tablename='pings'
  ) then
    execute 'alter publication supabase_realtime add table public.pings';
  end if;
end $$;

-- ============================================================================
-- 4. RESET_DEMO_STATE — also clears pings and poll attachments
-- ============================================================================

create or replace function public.reset_demo_state()
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  -- Brief §04: pings clear with the demo so every investor walk-through
  -- starts from "no pings sent yet."
  delete from public.pings where true;

  -- Strip user-attached poll vote tallies (seed posts may carry a
  -- canonical poll, which we leave intact; resetting just wipes any
  -- demo voter activity that accumulated).
  update public.activity_posts
     set poll = jsonb_set(poll, '{votes}', '{}'::jsonb)
   where poll is not null;

  -- Planned stops + friend overlap windows — canonical 5-stop seed.
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
