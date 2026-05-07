import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from './supabase';
import type { Tables, TablesInsert } from './database.types';
import type { RioPlace, RioPlaceCategory } from '../data/rioPlaces';
import type { GlobalPlace } from '../data/globalPlaces';
import type { FriendOverlap, LatLng } from '../data/myTrip';
import type { PlannedStop, PlannedStopPrivacy } from '../data/plannedStops';

export type TripData = {
  rioPlaces: RioPlace[];
  globalPlaces: GlobalPlace[];
  friendOverlaps: FriendOverlap[];
  myTrip: { past: LatLng[]; present: LatLng };
  plannedStops: PlannedStop[];
};

type Mutators = {
  saveStop: (stop: PlannedStop) => Promise<void>;
  removeStop: (stopId: string) => Promise<void>;
  savePlaceToStop: (placeId: string, stopId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
};

type ContextValue = {
  data: TripData | null;
  loading: boolean;
  error: Error | null;
} & Mutators;

const Context = createContext<ContextValue | null>(null);

const placeRowToRio = (r: Tables<'places'>): RioPlace => ({
  id: r.id,
  hebrewName: r.hebrew_name,
  englishName: r.english_name,
  category: r.category as RioPlaceCategory,
  lat: r.lat,
  lng: r.lng,
  hebrewDescription: r.hebrew_description,
  englishDescription: r.english_description,
  rating: r.rating,
  friendsKnow: r.friends_know,
  tarmilPick: r.tarmil_pick || undefined,
});

const placeRowToGlobal = (r: Tables<'places'>): GlobalPlace => ({
  ...placeRowToRio(r),
  destinationId: r.destination_id ?? '',
});

const friendRowToOverlap = (r: Tables<'friend_overlaps'>): FriendOverlap => ({
  id: r.id,
  friendName: r.friend_name,
  friendInitial: r.friend_initial,
  lat: r.lat,
  lng: r.lng,
  zoneLabel: r.zone_label,
  status: r.status as 'present' | 'future',
  detail: r.detail,
  destinationId: r.destination_id ?? undefined,
  overlapStart: r.overlap_start ?? undefined,
  overlapEnd: r.overlap_end ?? undefined,
});

const stopRowToPlanned = (r: Tables<'planned_stops'>): PlannedStop => ({
  id: r.id,
  nameHe: r.name_he,
  nameEn: r.name_en,
  type: r.type as 'city' | 'region',
  lat: r.lat,
  lng: r.lng,
  arrivalDate: r.arrival_date,
  departureDate: r.departure_date,
  nights: r.nights,
  privacy: r.privacy as PlannedStopPrivacy,
  note: r.note ?? undefined,
  friendOverlapIds: r.friend_overlap_ids,
  savedPlaceIds: r.saved_place_ids,
});

const plannedToStopRow = (s: PlannedStop): TablesInsert<'planned_stops'> => ({
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
});

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Ref so mutators see fresh state without re-creating their callbacks.
  const dataRef = useRef<TripData | null>(null);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const refetchStops = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('planned_stops')
      .select('*')
      .order('arrival_date');
    if (fetchErr) {
      console.error('Failed to refetch planned_stops:', fetchErr);
      return;
    }
    setData((prev) =>
      prev ? { ...prev, plannedStops: rows.map(stopRowToPlanned) } : prev,
    );
  }, []);

  // Initial fetch — all four tables in parallel.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [placesRes, friendsRes, waypointsRes, stopsRes] =
          await Promise.all([
            supabase.from('places').select('*'),
            supabase.from('friend_overlaps').select('*'),
            supabase.from('trip_waypoints').select('*').order('order_index'),
            supabase.from('planned_stops').select('*').order('arrival_date'),
          ]);
        if (placesRes.error) throw placesRes.error;
        if (friendsRes.error) throw friendsRes.error;
        if (waypointsRes.error) throw waypointsRes.error;
        if (stopsRes.error) throw stopsRes.error;

        const rioPlaces = placesRes.data
          .filter((p) => p.region === 'rio')
          .map(placeRowToRio);
        const globalPlaces = placesRes.data
          .filter((p) => p.region === 'global')
          .map(placeRowToGlobal);
        const friendOverlaps = friendsRes.data.map(friendRowToOverlap);
        const past: LatLng[] = waypointsRes.data
          .filter((w) => w.kind === 'past')
          .sort((a, b) => a.order_index - b.order_index)
          .map((w) => [w.lat, w.lng]);
        const presentRow = waypointsRes.data.find((w) => w.kind === 'present');
        if (!presentRow) throw new Error('Missing present trip waypoint');
        const present: LatLng = [presentRow.lat, presentRow.lng];
        const plannedStops = stopsRes.data.map(stopRowToPlanned);

        if (!cancelled) {
          setData({
            rioPlaces,
            globalPlaces,
            friendOverlaps,
            myTrip: { past, present },
            plannedStops,
          });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime: refetch planned_stops on any change so multiple viewers stay
  // in sync during a shared demo.
  useEffect(() => {
    const channel = supabase
      .channel('planned_stops_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'planned_stops' },
        () => {
          refetchStops();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchStops]);

  const saveStop = useCallback(
    async (stop: PlannedStop) => {
      const { error: upsertErr } = await supabase
        .from('planned_stops')
        .upsert(plannedToStopRow(stop));
      if (upsertErr) throw upsertErr;
      await refetchStops();
    },
    [refetchStops],
  );

  const removeStop = useCallback(
    async (stopId: string) => {
      const { error: deleteErr } = await supabase
        .from('planned_stops')
        .delete()
        .eq('id', stopId);
      if (deleteErr) throw deleteErr;
      await refetchStops();
    },
    [refetchStops],
  );

  const savePlaceToStop = useCallback(
    async (placeId: string, stopId: string) => {
      const stop = dataRef.current?.plannedStops.find((s) => s.id === stopId);
      if (!stop) return;
      const existing = stop.savedPlaceIds ?? [];
      if (existing.includes(placeId)) return;
      const next = [...existing, placeId];
      const { error: updateErr } = await supabase
        .from('planned_stops')
        .update({ saved_place_ids: next })
        .eq('id', stopId);
      if (updateErr) throw updateErr;
      await refetchStops();
    },
    [refetchStops],
  );

  const resetDemo = useCallback(async () => {
    const { error: rpcErr } = await supabase.rpc('reset_demo_state');
    if (rpcErr) throw rpcErr;
    await refetchStops();
  }, [refetchStops]);

  return (
    <Context.Provider
      value={{
        data,
        loading,
        error,
        saveStop,
        removeStop,
        savePlaceToStop,
        resetDemo,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSupabaseData(): ContextValue {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useSupabaseData must be used within SupabaseDataProvider');
  }
  return ctx;
}
