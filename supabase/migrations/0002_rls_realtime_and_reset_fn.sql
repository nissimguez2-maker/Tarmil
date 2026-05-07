-- Row level security: anon can read all reference tables, full CRUD only on
-- planned_stops (the demo entity investors will mutate). reset_demo_state()
-- restores planned_stops to the canonical 4-stop seed. Realtime is enabled on
-- planned_stops so multiple viewers see edits live during shared demos.

alter table public.places enable row level security;
alter table public.friend_overlaps enable row level security;
alter table public.trip_waypoints enable row level security;
alter table public.planned_stops enable row level security;

-- Reference tables: read-only to everyone. Writes happen via direct DB access
-- (Supabase dashboard or seed script bypassing RLS), never from the client.
create policy "places_read_all" on public.places for select using (true);
create policy "friend_overlaps_read_all" on public.friend_overlaps for select using (true);
create policy "trip_waypoints_read_all" on public.trip_waypoints for select using (true);

-- planned_stops: shared global demo state. Anon can SELECT/INSERT/UPDATE/DELETE.
-- Tradeoff: anyone with the URL can mutate. Mitigated by reset_demo_state().
create policy "planned_stops_read_all" on public.planned_stops for select using (true);
create policy "planned_stops_insert_all" on public.planned_stops for insert with check (true);
create policy "planned_stops_update_all" on public.planned_stops for update using (true) with check (true);
create policy "planned_stops_delete_all" on public.planned_stops for delete using (true);

-- Reset RPC: restores planned_stops to the canonical demo seed.
-- security definer so the function runs with elevated privileges, allowing
-- it to truncate-and-insert even if RLS would block the bulk delete.
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

grant execute on function public.reset_demo_state() to anon, authenticated;

-- Realtime: planned_stops changes broadcast to all subscribers.
alter publication supabase_realtime add table public.planned_stops;
