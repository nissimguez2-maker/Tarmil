-- The remote DB already has friend_overlaps.photo_url as NOT NULL; 0006 left
-- it nullable because the seed didn't carry photos yet. The seed now supplies
-- a photoUrl for every friend, so make the constraint match remote.
-- Idempotent: no-op when the column is already NOT NULL.

alter table public.friend_overlaps
  alter column photo_url set not null;
