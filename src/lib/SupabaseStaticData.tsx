import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from './supabase';
import type { Database } from './database.types';
import type {
  FriendOverlap,
  LatLng,
  Place,
  PlaceCategory,
} from '../data/types';

type PlaceRow = Database['public']['Tables']['places']['Row'];
type FriendRow = Database['public']['Tables']['friend_overlaps']['Row'];
type WaypointRow = Database['public']['Tables']['trip_waypoints']['Row'];

export type StaticData = {
  places: Place[];
  friendOverlaps: FriendOverlap[];
  myTrip: { past: LatLng[]; present: LatLng };
};

type ContextValue = {
  data: StaticData | null;
  loading: boolean;
  error: Error | null;
};

const Context = createContext<ContextValue | null>(null);

const placeRowToPlace = (r: PlaceRow): Place => ({
  id: r.id,
  destinationId: r.destination_id,
  hebrewName: r.hebrew_name,
  englishName: r.english_name,
  category: r.category as PlaceCategory,
  lat: r.lat,
  lng: r.lng,
  hebrewDescription: r.hebrew_description,
  englishDescription: r.english_description,
  rating: r.rating,
  friendsKnow: r.friends_know,
  tarmilPick: r.tarmil_pick || undefined,
});

const friendRowToOverlap = (r: FriendRow): FriendOverlap => ({
  id: r.id,
  friendName: r.friend_name,
  friendInitial: r.friend_initial,
  photoUrl: r.photo_url,
  lat: r.lat,
  lng: r.lng,
  zoneLabel: r.zone_label,
  status: r.status as 'present' | 'future',
  detail: r.detail,
  destinationId: r.destination_id ?? undefined,
  overlapStart: r.overlap_start ?? undefined,
  overlapEnd: r.overlap_end ?? undefined,
});

/**
 * Fetches the static, curator-managed data (places / friend_overlaps /
 * trip_waypoints) once on mount and provides it to the whole app via
 * `useStaticData()`. Data lives in Supabase as the single source of truth;
 * the curator edits via the dashboard. Mutable user state (planned stops,
 * expenses, etc.) is handled separately by `useSupabaseState`.
 */
export function SupabaseStaticDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StaticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [placesRes, friendsRes, waypointsRes] = await Promise.all([
          supabase.from('places').select('*'),
          supabase.from('friend_overlaps').select('*'),
          supabase.from('trip_waypoints').select('*').order('order_index'),
        ]);
        if (placesRes.error) throw placesRes.error;
        if (friendsRes.error) throw friendsRes.error;
        if (waypointsRes.error) throw waypointsRes.error;

        const places = placesRes.data.map(placeRowToPlace);
        const friendOverlaps = friendsRes.data.map(friendRowToOverlap);
        const past: LatLng[] = (waypointsRes.data as WaypointRow[])
          .filter((w) => w.kind === 'past')
          .map((w) => [w.lat, w.lng]);
        const presentRow = (waypointsRes.data as WaypointRow[]).find(
          (w) => w.kind === 'present',
        );
        const present: LatLng = presentRow
          ? [presentRow.lat, presentRow.lng]
          : [0, 0];

        if (!cancelled) {
          setData({ places, friendOverlaps, myTrip: { past, present } });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Context.Provider value={{ data, loading, error }}>
      {children}
    </Context.Provider>
  );
}

export function useStaticData(): ContextValue {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useStaticData must be used within SupabaseStaticDataProvider');
  }
  return ctx;
}
