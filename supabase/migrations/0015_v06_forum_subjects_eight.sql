-- v0.6 forum subjects — replace the 5-subject Israel-flavored set with an
-- 8-subject international set matched to how travelers actually talk.
--
-- Mapping:
--   kosher_chabad     → DROP (forums + threads deleted; the only
--                       Israel-specific value, dropped for the
--                       international investor mock)
--   parties           → nightlife_parties (rename)
--   treks_activities  → activities_treks  (rename, label "Activities & treks")
--   restaurants       → food              (rename, broader scope)
--   meetups           → meetups           (unchanged)
--
-- New subjects:
--   accommodation, transits, scams_danger, money_visas
--
-- Resulting enum has exactly 8 values.

begin;

-- 1. Drop kosher_chabad forums (cascades to threads + replies via FK).
delete from public.forums where subject = 'kosher_chabad';

-- 2. New enum with the 8 values.
create type forum_subject_new as enum (
  'accommodation',
  'transits',
  'scams_danger',
  'food',
  'activities_treks',
  'nightlife_parties',
  'money_visas',
  'meetups'
);

-- 3. Migrate forums.subject column to new enum with rename mapping.
alter table public.forums alter column subject drop default;
alter table public.forums
  alter column subject type forum_subject_new using case subject::text
    when 'parties' then 'nightlife_parties'::forum_subject_new
    when 'treks_activities' then 'activities_treks'::forum_subject_new
    when 'restaurants' then 'food'::forum_subject_new
    when 'meetups' then 'meetups'::forum_subject_new
    else null
  end;

-- 4. Migrate forum_threads.subject column to new enum.
alter table public.forum_threads alter column subject drop default;
alter table public.forum_threads
  alter column subject type forum_subject_new using case subject::text
    when 'parties' then 'nightlife_parties'::forum_subject_new
    when 'treks_activities' then 'activities_treks'::forum_subject_new
    when 'restaurants' then 'food'::forum_subject_new
    when 'meetups' then 'meetups'::forum_subject_new
    else null
  end;

-- 5. Drop the old enum and rename the new one in its place.
drop type forum_subject;
alter type forum_subject_new rename to forum_subject;

-- 6. Restore NOT NULL on forum_threads.subject (default not strictly needed).
alter table public.forum_threads alter column subject set not null;

commit;
