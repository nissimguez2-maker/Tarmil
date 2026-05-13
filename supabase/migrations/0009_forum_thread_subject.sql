-- 0009: standardize each city forum to a fixed set of 5 subject categories.
-- Threads carry the subject so the existing one-row-per-city forum shape stays.

CREATE TYPE forum_subject AS ENUM (
  'kosher_chabad',
  'parties',
  'treks_activities',
  'restaurants',
  'meetups'
);

ALTER TABLE forum_threads
  ADD COLUMN subject forum_subject NOT NULL DEFAULT 'meetups';

CREATE INDEX forum_threads_forum_id_subject_idx
  ON forum_threads (forum_id, subject);
