-- Reconcile remote-only schema drift.
-- These tables / columns / indexes were added on the deployed DB without a
-- corresponding committed migration: app_state (key/value store), threads +
-- thread_replies (activity feature), friend_overlaps.photo_url, and
-- friend_overlaps.past_trips. Everything below is idempotent so it no-ops
-- against the current remote and rebuilds correctly against a fresh DB.

create table if not exists public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "app_state_read_all" on public.app_state;
drop policy if exists "app_state_insert_all" on public.app_state;
drop policy if exists "app_state_update_all" on public.app_state;
drop policy if exists "app_state_delete_all" on public.app_state;
create policy "app_state_read_all" on public.app_state for select using (true);
create policy "app_state_insert_all" on public.app_state for insert with check (true);
create policy "app_state_update_all" on public.app_state for update using (true) with check (true);
create policy "app_state_delete_all" on public.app_state for delete using (true);

create table if not exists public.threads (
  id text primary key,
  kind text not null check (kind in ('friend_trip', 'city', 'destination')),
  title text not null,
  body text not null,
  author_initial text not null,
  author_name text not null,
  destination_id text,
  city_label text,
  friend_id text,
  trip_season text check (trip_season in ('spring', 'summer', 'autumn', 'winter')),
  trip_year int,
  reply_count int not null default 0,
  follow_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists threads_created_idx on public.threads (created_at desc);
create index if not exists threads_destination_idx on public.threads (destination_id);
create index if not exists threads_kind_idx on public.threads (kind);

alter table public.threads enable row level security;
drop policy if exists "threads_read_all" on public.threads;
create policy "threads_read_all" on public.threads for select using (true);

create table if not exists public.thread_replies (
  id text primary key default (gen_random_uuid())::text,
  thread_id text not null references public.threads(id),
  author_initial text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists thread_replies_thread_idx on public.thread_replies (thread_id, created_at);

alter table public.thread_replies enable row level security;
drop policy if exists "thread_replies_read_all" on public.thread_replies;
drop policy if exists "thread_replies_insert_all" on public.thread_replies;
drop policy if exists "thread_replies_delete_all" on public.thread_replies;
create policy "thread_replies_read_all" on public.thread_replies for select using (true);
create policy "thread_replies_insert_all" on public.thread_replies for insert with check (true);
create policy "thread_replies_delete_all" on public.thread_replies for delete using (true);

-- friend_overlaps: photo_url is nullable in this migration even though remote
-- declares it NOT NULL. A fresh rebuild + seed can tighten it once every seed
-- row carries a photo. past_trips matches remote (NOT NULL default '[]').
alter table public.friend_overlaps
  add column if not exists photo_url text,
  add column if not exists past_trips jsonb not null default '[]'::jsonb;

create index if not exists friend_overlaps_destination_id_idx
  on public.friend_overlaps (destination_id);
