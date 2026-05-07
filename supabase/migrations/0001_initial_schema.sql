-- Tarmil mockup schema.
-- Tables for places, friend overlaps, trip waypoints (past + present), and the
-- mutable planned_stops list. RLS + realtime + reset function applied in a
-- follow-up migration.

create table public.places (
  id text primary key,
  region text not null check (region in ('rio', 'global')),
  destination_id text,
  hebrew_name text not null,
  english_name text not null,
  category text not null check (category in ('beach','hostel','cafe','restaurant','bar','club','chabad','kosher','landmark')),
  lat double precision not null,
  lng double precision not null,
  hebrew_description text not null,
  english_description text not null,
  rating numeric(3,1) not null,
  friends_know int not null default 0,
  tarmil_pick boolean not null default false
);

create index places_region_idx on public.places (region);
create index places_destination_id_idx on public.places (destination_id);

create table public.friend_overlaps (
  id text primary key,
  friend_name text not null,
  friend_initial text not null,
  lat double precision not null,
  lng double precision not null,
  zone_label text not null,
  status text not null check (status in ('present', 'future')),
  detail text not null,
  destination_id text,
  overlap_start date,
  overlap_end date
);

create index friend_overlaps_status_idx on public.friend_overlaps (status);

create table public.trip_waypoints (
  id text primary key,
  lat double precision not null,
  lng double precision not null,
  kind text not null check (kind in ('past', 'present')),
  order_index int not null
);

create index trip_waypoints_kind_order_idx on public.trip_waypoints (kind, order_index);

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
