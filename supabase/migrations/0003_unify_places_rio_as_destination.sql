-- Unify places under one model: every place has a destination_id (a city/region).
-- Rio places previously used region='rio' with destination_id NULL. Now Rio is
-- just another destination called 'rio-de-janeiro'. The region column carried
-- no information that destination_id can't carry — drop it.

update public.places
   set destination_id = 'rio-de-janeiro'
 where region = 'rio';

alter table public.places
  alter column destination_id set not null;

drop index if exists places_region_idx;

alter table public.places
  drop column region;
