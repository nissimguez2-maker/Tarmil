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
