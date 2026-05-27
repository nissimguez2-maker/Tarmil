/**
 * Dev-only offline data path. When `VITE_USE_LOCAL_SEED=true`, the provider
 * builds TripData from the in-repo seed arrays instead of fetching Supabase —
 * used for local screenshot/iteration when the Supabase host is unreachable
 * (e.g. sandboxed CI). Never bundled in prod: it's dynamically imported only
 * under the flag, which is unset in real builds.
 */
import { rioPlaces } from '../data/rioPlaces';
import { globalPlaces } from '../data/globalPlaces';
import { friendOverlaps, myTrip } from '../data/myTrip';
import { plannedStops } from '../data/plannedStops';
import { forums } from '../data/forums';
import { forumThreads } from '../data/forumThreads';
import { forumThreadReplies } from '../data/forumThreadReplies';
import { activityPosts } from '../data/activityPosts';
import { reactions } from '../data/reactions';
import { pings } from '../data/pings';
import type { PlaceSave } from '../data/placeSaves';
import type { TripData } from './SupabaseDataProvider';

// Synthesized self-saves (real rows live in `place_saves`) so the Plan tab has
// content offline. References only place ids known to exist in the seed.
const placeSaves: PlaceSave[] = [
  { id: 'seed-save-1', friendId: null, placeId: 'copa-beach', status: 'visited', plannedStopId: null, private: false, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'seed-save-2', friendId: null, placeId: 'ipanema-beach', status: 'wishlist', plannedStopId: null, private: false, createdAt: '2026-01-02T00:00:00Z' },
  { id: 'seed-save-3', friendId: null, placeId: 'rio-kosher-grill', status: 'reserved', plannedStopId: null, private: false, createdAt: '2026-01-03T00:00:00Z' },
  { id: 'seed-save-4', friendId: null, placeId: 'rio-shtetl-bakery', status: 'wishlist', plannedStopId: null, private: false, createdAt: '2026-01-04T00:00:00Z' },
  { id: 'seed-save-5', friendId: null, placeId: 'ba-once-parrilla', status: 'wishlist', plannedStopId: null, private: false, createdAt: '2026-01-05T00:00:00Z' },

  // Attached to upcoming stops so the Plan tab reads as a lived-in trip (not a
  // wall of "nothing planned yet") in the offline demo.
  { id: 'seed-bz-1', friendId: null, placeId: 'buzios-geriba-hostel', status: 'reserved', plannedStopId: 'buzios', private: false, createdAt: '2026-01-06T00:00:00Z' },
  { id: 'seed-bz-2', friendId: null, placeId: 'buzios-geriba-beach', status: 'wishlist', plannedStopId: 'buzios', private: false, createdAt: '2026-01-07T00:00:00Z' },
  { id: 'seed-bz-3', friendId: null, placeId: 'buzios-ferradura', status: 'wishlist', plannedStopId: 'buzios', private: false, createdAt: '2026-01-08T00:00:00Z' },
  { id: 'seed-sp-1', friendId: null, placeId: 'soul-hostel', status: 'reserved', plannedStopId: 'sao-paulo', private: false, createdAt: '2026-01-09T00:00:00Z' },
  { id: 'seed-sp-2', friendId: null, placeId: 'sova-rest', status: 'wishlist', plannedStopId: 'sao-paulo', private: false, createdAt: '2026-01-10T00:00:00Z' },
  { id: 'seed-sp-3', friendId: null, placeId: 'beit-cafe', status: 'wishlist', plannedStopId: 'sao-paulo', private: false, createdAt: '2026-01-11T00:00:00Z' },
  { id: 'seed-sp-4', friendId: null, placeId: 'emporium-brasil-israel', status: 'wishlist', plannedStopId: 'sao-paulo', private: false, createdAt: '2026-01-12T00:00:00Z' },
  { id: 'seed-jeri-1', friendId: null, placeId: 'jeri-hostel', status: 'reserved', plannedStopId: 'jericoacoara', private: false, createdAt: '2026-01-13T00:00:00Z' },
  { id: 'seed-jeri-2', friendId: null, placeId: 'jeri-main-beach', status: 'wishlist', plannedStopId: 'jericoacoara', private: false, createdAt: '2026-01-14T00:00:00Z' },
  { id: 'seed-jeri-3', friendId: null, placeId: 'duna-por-do-sol', status: 'wishlist', plannedStopId: 'jericoacoara', private: false, createdAt: '2026-01-15T00:00:00Z' },
  { id: 'seed-jeri-4', friendId: null, placeId: 'pedra-furada', status: 'wishlist', plannedStopId: 'jericoacoara', private: false, createdAt: '2026-01-16T00:00:00Z' },
  { id: 'seed-ba-1', friendId: null, placeId: 'iaacob-house', status: 'reserved', plannedStopId: 'buenos-aires', private: false, createdAt: '2026-01-17T00:00:00Z' },
  { id: 'seed-ba-2', friendId: null, placeId: 'obelisco-ba', status: 'wishlist', plannedStopId: 'buenos-aires', private: false, createdAt: '2026-01-18T00:00:00Z' },
  { id: 'seed-ba-3', friendId: null, placeId: 'san-telmo-market', status: 'wishlist', plannedStopId: 'buenos-aires', private: false, createdAt: '2026-01-19T00:00:00Z' },
  { id: 'seed-ba-4', friendId: null, placeId: 'puerto-madero', status: 'wishlist', plannedStopId: 'buenos-aires', private: false, createdAt: '2026-01-20T00:00:00Z' },
];

export function buildLocalSeed(): TripData {
  return {
    places: [...rioPlaces, ...globalPlaces],
    friendOverlaps,
    myTrip,
    plannedStops,
    forums,
    forumThreads,
    forumThreadReplies,
    activityPosts,
    reactions,
    placeReviews: [],
    pings,
    placeSaves,
  };
}
