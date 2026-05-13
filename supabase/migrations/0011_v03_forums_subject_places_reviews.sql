-- v0.3 shift: subject-per-forum, places extensions, place_reviews.
-- Mirrors the implementation plan at sections 2 + 3 of
-- /root/.claude/plans/i-want-this-part-parsed-wren.md (kept out of repo
-- because Claude scratch).
--
-- Forums move from city-level + subject-on-thread to one forum per
-- (city, subject) — see scripts/seed-supabase.ts for the new fan-out.
-- Threads keep their `subject` column for compatibility but the UI
-- now reads it from the forum.
--
-- Places gain business-directory fields used by the new Around me tab
-- (paid placements, contact / reservation URLs, hero image). New
-- place_reviews table stores 1–5 star ratings, one per (place, reviewer)
-- where `reviewer_friend_id = null` is the demo user.

-- 1. forums gets a subject column.
alter table public.forums
  add column if not exists subject forum_subject;

-- 2. places gets business directory fields.
alter table public.places
  add column if not exists phone text,
  add column if not exists reservation_url text,
  add column if not exists image_url text,
  add column if not exists paid_placement boolean not null default false;

-- 3. place_reviews — friend 1-5 star ratings, no text.
create table if not exists public.place_reviews (
  id bigint generated always as identity primary key,
  place_id text not null references public.places(id) on delete cascade,
  reviewer_friend_id text references public.friend_overlaps(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists place_reviews_place_id_idx
  on public.place_reviews (place_id);
create index if not exists place_reviews_reviewer_idx
  on public.place_reviews (reviewer_friend_id);

-- 4. RLS — public anon CRUD, same pattern as planned_stops.
alter table public.place_reviews enable row level security;
create policy "place_reviews_read_all"   on public.place_reviews for select using (true);
create policy "place_reviews_insert_all" on public.place_reviews for insert with check (true);
create policy "place_reviews_update_all" on public.place_reviews for update using (true) with check (true);
create policy "place_reviews_delete_all" on public.place_reviews for delete using (true);
