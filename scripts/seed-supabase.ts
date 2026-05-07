/**
 * One-shot seeder. Imports the TS data files (single source of truth) and
 * upserts them into Supabase. Idempotent — safe to re-run.
 *
 * Run:  npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in env. Must be run
 * BEFORE the RLS migration is applied (anon role can only write planned_stops
 * once RLS is on; the reference tables are seed-only after that).
 */

import { createClient } from '@supabase/supabase-js';
import { rioPlaces } from '../src/data/rioPlaces';
import { globalPlaces } from '../src/data/globalPlaces';
import { friendOverlaps, myTrip } from '../src/data/myTrip';
import { plannedStops } from '../src/data/plannedStops';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function main() {
  console.log('Seeding places...');
  const places = [
    ...rioPlaces.map((p) => ({
      id: p.id,
      region: 'rio',
      destination_id: null,
      hebrew_name: p.hebrewName,
      english_name: p.englishName,
      category: p.category,
      lat: p.lat,
      lng: p.lng,
      hebrew_description: p.hebrewDescription,
      english_description: p.englishDescription,
      rating: p.rating,
      friends_know: p.friendsKnow,
      tarmil_pick: p.tarmilPick ?? false,
    })),
    ...globalPlaces.map((p) => ({
      id: p.id,
      region: 'global',
      destination_id: p.destinationId,
      hebrew_name: p.hebrewName,
      english_name: p.englishName,
      category: p.category,
      lat: p.lat,
      lng: p.lng,
      hebrew_description: p.hebrewDescription,
      english_description: p.englishDescription,
      rating: p.rating,
      friends_know: p.friendsKnow,
      tarmil_pick: p.tarmilPick ?? false,
    })),
  ];

  const { error: placesErr } = await supabase.from('places').upsert(places);
  if (placesErr) throw placesErr;
  console.log(`  ${places.length} places upserted`);

  console.log('Seeding friend_overlaps...');
  const friends = friendOverlaps.map((f) => ({
    id: f.id,
    friend_name: f.friendName,
    friend_initial: f.friendInitial,
    lat: f.lat,
    lng: f.lng,
    zone_label: f.zoneLabel,
    status: f.status,
    detail: f.detail,
    destination_id: f.destinationId ?? null,
    overlap_start: f.overlapStart ?? null,
    overlap_end: f.overlapEnd ?? null,
  }));
  const { error: friendsErr } = await supabase
    .from('friend_overlaps')
    .upsert(friends);
  if (friendsErr) throw friendsErr;
  console.log(`  ${friends.length} friend overlaps upserted`);

  console.log('Seeding trip_waypoints...');
  const waypoints = [
    ...myTrip.past.map((coord, i) => ({
      id: `past-${i}`,
      lat: coord[0],
      lng: coord[1],
      kind: 'past',
      order_index: i,
    })),
    {
      id: 'present',
      lat: myTrip.present[0],
      lng: myTrip.present[1],
      kind: 'present',
      order_index: 0,
    },
  ];
  const { error: waypointsErr } = await supabase
    .from('trip_waypoints')
    .upsert(waypoints);
  if (waypointsErr) throw waypointsErr;
  console.log(`  ${waypoints.length} trip waypoints upserted`);

  console.log('Seeding planned_stops...');
  const stops = plannedStops.map((s) => ({
    id: s.id,
    name_he: s.nameHe,
    name_en: s.nameEn,
    type: s.type,
    lat: s.lat,
    lng: s.lng,
    arrival_date: s.arrivalDate,
    departure_date: s.departureDate,
    nights: s.nights,
    privacy: s.privacy,
    note: s.note ?? null,
    friend_overlap_ids: s.friendOverlapIds ?? [],
    saved_place_ids: s.savedPlaceIds ?? [],
  }));
  const { error: stopsErr } = await supabase
    .from('planned_stops')
    .upsert(stops);
  if (stopsErr) throw stopsErr;
  console.log(`  ${stops.length} planned stops upserted`);

  console.log('\nSeed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
