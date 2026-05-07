-- Switch to a single jsonb-store model: app_state(key, value).
-- Drop the previous trip-data tables — this branch keeps places /
-- friend_overlaps / trip_waypoints in TS files, and persists every mutable
-- piece of state (planned stops, expenses, balance, checklist, currency
-- prefs) as a single jsonb row keyed by the same string the React code
-- uses for usePersistentState. One row per key.

-- Tear down old schema (drops auto-remove from realtime publication).
drop function if exists public.reset_demo_state();
drop table if exists public.planned_stops;
drop table if exists public.trip_waypoints;
drop table if exists public.friend_overlaps;
drop table if exists public.places;

-- New: single jsonb store.
create table public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.app_state_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger app_state_set_updated_at
  before update on public.app_state
  for each row execute function public.app_state_touch_updated_at();

-- RLS: shared global demo state. anon can read + write everything.
alter table public.app_state enable row level security;
create policy "app_state_read_all" on public.app_state for select using (true);
create policy "app_state_insert_all" on public.app_state for insert with check (true);
create policy "app_state_update_all" on public.app_state for update using (true) with check (true);
create policy "app_state_delete_all" on public.app_state for delete using (true);

-- Reset RPC: wipe every row. Next page load uses each hook's seed initial.
create or replace function public.reset_demo_state()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.app_state;
end;
$$;
grant execute on function public.reset_demo_state() to anon, authenticated;

-- Realtime so multiple viewers see edits live.
alter publication supabase_realtime add table public.app_state;
