-- Restore planned_stops after the app_state experiment.
-- A prior remote-only migration (app_state_drop_old_schema) dropped this table
-- and moved the stops into a single jsonb row in public.app_state. The app
-- code never followed — it still queries planned_stops, so every Trip / Friends
-- load 404s. This migration recreates the table with the original schema,
-- re-applies RLS + realtime + the reset RPC, and hydrates from the existing
-- app_state blob so any in-flight edits survive.

create table public.planned_stops (
  id text primary key,
  name_he text not null,
  name_en text not null,
  type text not null check (type in ('city', 'region')),
  lat double precision not null,
  lng double precision not null,
  arrival_date date not null,
  departure_date date not null,
  nights int not null,
  privacy text not null check (privacy in ('private', 'friends', 'hidden')),
  note text,
  friend_overlap_ids text[] not null default '{}',
  saved_place_ids text[] not null default '{}'
);

create index planned_stops_arrival_idx on public.planned_stops (arrival_date);

alter table public.planned_stops enable row level security;

create policy "planned_stops_read_all" on public.planned_stops for select using (true);
create policy "planned_stops_insert_all" on public.planned_stops for insert with check (true);
create policy "planned_stops_update_all" on public.planned_stops for update using (true) with check (true);
create policy "planned_stops_delete_all" on public.planned_stops for delete using (true);

-- Hydrate from app_state['tarmil:planned_stops:v1'] if it exists. coalesce on
-- the optional jsonb arrays so stops that omit friendOverlapIds / savedPlaceIds
-- (like punta-del-este) still insert cleanly.
insert into public.planned_stops
  (id, name_he, name_en, type, lat, lng, arrival_date, departure_date,
   nights, privacy, note, friend_overlap_ids, saved_place_ids)
select
  s->>'id',
  s->>'nameHe',
  s->>'nameEn',
  s->>'type',
  (s->>'lat')::double precision,
  (s->>'lng')::double precision,
  (s->>'arrivalDate')::date,
  (s->>'departureDate')::date,
  (s->>'nights')::int,
  s->>'privacy',
  s->>'note',
  array(select jsonb_array_elements_text(coalesce(s->'friendOverlapIds', '[]'::jsonb))),
  array(select jsonb_array_elements_text(coalesce(s->'savedPlaceIds', '[]'::jsonb)))
from public.app_state, jsonb_array_elements(value) s
where key = 'tarmil:planned_stops:v1';

-- Restore reset_demo_state to its canonical 4-stop seed. The remote copy was
-- rewritten to truncate app_state, which would now do nothing useful.
create or replace function public.reset_demo_state()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.planned_stops;
  insert into public.planned_stops
    (id, name_he, name_en, type, lat, lng, arrival_date, departure_date,
     nights, privacy, note, friend_overlap_ids, saved_place_ids)
  values
    ('buzios', 'בוזיוס', 'Búzios', 'city',
     -22.747, -41.881, '2026-10-28', '2026-10-31',
     3, 'friends', 'שלושה ימי ים אחרי ריו, לפני סאו פאולו.',
     array['roi-buzios']::text[], array[]::text[]),
    ('sao-paulo', 'סאו פאולו', 'São Paulo', 'city',
     -23.5505, -46.6333, '2026-11-01', '2026-11-06',
     5, 'friends', 'וילה מדלנה, פאוליסטה, אסאדו ובאר ראשון בלילה.',
     array['shir-saopaulo']::text[], array[]::text[]),
    ('jericoacoara', 'ז׳ריקואקוארה', 'Jericoacoara', 'city',
     -2.7959, -40.5125, '2026-11-08', '2026-11-14',
     6, 'friends', 'דיונות, קייטסרף ובוקרים יחפים.',
     array['yotam-jericoacoara']::text[], array[]::text[]),
    ('buenos-aires', 'בואנוס איירס', 'Buenos Aires', 'city',
     -34.6037, -58.3816, '2026-11-16', '2026-11-25',
     9, 'friends', 'פאלרמו, סן תלמו, טנגו ואסאדו עד חצות.',
     array['tom-buenosaires']::text[], array[]::text[]);
end;
$$;

-- Re-add to the realtime publication so multi-viewer demos stay in sync.
alter publication supabase_realtime add table public.planned_stops;
