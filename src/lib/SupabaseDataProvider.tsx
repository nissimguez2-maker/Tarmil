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
import type { FriendVisit, Place, PlaceCategory, Season } from '../data/places';
import type { FriendOverlap, FriendPastTrip, LatLng } from '../data/myTrip';
import type { PlannedStop, PlannedStopPrivacy } from '../data/plannedStops';
import type { Thread, ThreadKind, ThreadReply } from '../data/threads';

export type TripData = {
  places: Place[];
  friendOverlaps: FriendOverlap[];
  myTrip: { past: LatLng[]; present: LatLng };
  plannedStops: PlannedStop[];
  threads: Thread[];
  threadReplies: ThreadReply[];
};

type Mutators = {
  saveStop: (stop: PlannedStop) => Promise<void>;
  removeStop: (stopId: string) => Promise<void>;
  savePlaceToStop: (placeId: string, stopId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
  postReply: (input: {
    threadId: string;
    body: string;
    authorInitial: string;
    authorName: string;
  }) => Promise<void>;
};

type ContextValue = {
  data: TripData | null;
  loading: boolean;
  error: Error | null;
} & Mutators;

const Context = createContext<ContextValue | null>(null);

const SEASONS: ReadonlySet<Season> = new Set([
  'spring',
  'summer',
  'autumn',
  'winter',
]);

const parseFriendVisits = (raw: unknown): FriendVisit[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const visits: FriendVisit[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const v = item as Record<string, unknown>;
    if (
      typeof v.friendInitial !== 'string' ||
      typeof v.friendName !== 'string' ||
      typeof v.season !== 'string' ||
      !SEASONS.has(v.season as Season) ||
      typeof v.year !== 'number' ||
      typeof v.durationLabel !== 'string'
    ) {
      continue;
    }
    visits.push({
      friendInitial: v.friendInitial,
      friendName: v.friendName,
      season: v.season as Season,
      year: v.year,
      durationLabel: v.durationLabel,
    });
  }
  return visits.length ? visits : undefined;
};

const placeRowToPlace = (r: Tables<'places'>): Place => ({
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
  friendVisits: parseFriendVisits(r.friend_visits),
});

const parsePastTrips = (raw: unknown): FriendPastTrip[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const trips: FriendPastTrip[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const v = item as Record<string, unknown>;
    if (
      typeof v.id !== 'string' ||
      typeof v.destinationLabel !== 'string' ||
      typeof v.season !== 'string' ||
      !SEASONS.has(v.season as Season) ||
      typeof v.year !== 'number' ||
      typeof v.durationLabel !== 'string' ||
      !Array.isArray(v.waypoints)
    ) {
      continue;
    }
    const waypoints: LatLng[] = [];
    for (const point of v.waypoints) {
      if (
        Array.isArray(point) &&
        point.length === 2 &&
        typeof point[0] === 'number' &&
        typeof point[1] === 'number'
      ) {
        waypoints.push([point[0], point[1]]);
      }
    }
    if (waypoints.length === 0) continue;
    trips.push({
      id: v.id,
      destinationLabel: v.destinationLabel,
      season: v.season as Season,
      year: v.year,
      durationLabel: v.durationLabel,
      waypoints,
    });
  }
  return trips.length ? trips : undefined;
};

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
  pastTrips: parsePastTrips(r.past_trips),
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

const THREAD_KINDS: ReadonlySet<ThreadKind> = new Set([
  'friend_trip',
  'city',
  'destination',
]);

const threadRowToThread = (r: Tables<'threads'>): Thread => ({
  id: r.id,
  kind: THREAD_KINDS.has(r.kind as ThreadKind)
    ? (r.kind as ThreadKind)
    : 'destination',
  title: r.title,
  body: r.body,
  authorInitial: r.author_initial,
  authorName: r.author_name,
  destinationId: r.destination_id ?? undefined,
  cityLabel: r.city_label ?? undefined,
  friendId: r.friend_id ?? undefined,
  tripSeason:
    r.trip_season && SEASONS.has(r.trip_season as Season)
      ? (r.trip_season as Season)
      : undefined,
  tripYear: r.trip_year ?? undefined,
  replyCount: r.reply_count,
  followCount: r.follow_count,
  createdAt: r.created_at,
});

const replyRowToReply = (r: Tables<'thread_replies'>): ThreadReply => ({
  id: r.id,
  threadId: r.thread_id,
  authorInitial: r.author_initial,
  authorName: r.author_name,
  body: r.body,
  createdAt: r.created_at,
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

  // Initial fetch — all six tables in parallel.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [
          placesRes,
          friendsRes,
          waypointsRes,
          stopsRes,
          threadsRes,
          repliesRes,
        ] = await Promise.all([
          supabase.from('places').select('*'),
          supabase.from('friend_overlaps').select('*'),
          supabase.from('trip_waypoints').select('*').order('order_index'),
          supabase.from('planned_stops').select('*').order('arrival_date'),
          supabase
            .from('threads')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('thread_replies')
            .select('*')
            .order('created_at', { ascending: true }),
        ]);
        if (placesRes.error) throw placesRes.error;
        if (friendsRes.error) throw friendsRes.error;
        if (waypointsRes.error) throw waypointsRes.error;
        if (stopsRes.error) throw stopsRes.error;
        if (threadsRes.error) throw threadsRes.error;
        if (repliesRes.error) throw repliesRes.error;

        const places = placesRes.data.map(placeRowToPlace);
        const friendOverlaps = friendsRes.data.map(friendRowToOverlap);
        const past: LatLng[] = waypointsRes.data
          .filter((w) => w.kind === 'past')
          .sort((a, b) => a.order_index - b.order_index)
          .map((w) => [w.lat, w.lng]);
        const presentRow = waypointsRes.data.find((w) => w.kind === 'present');
        if (!presentRow) throw new Error('Missing present trip waypoint');
        const present: LatLng = [presentRow.lat, presentRow.lng];
        const plannedStops = stopsRes.data.map(stopRowToPlanned);
        const threads = threadsRes.data.map(threadRowToThread);
        const threadReplies = repliesRes.data.map(replyRowToReply);

        if (!cancelled) {
          setData({
            places,
            friendOverlaps,
            myTrip: { past, present },
            plannedStops,
            threads,
            threadReplies,
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

  const refetchThreadsAndReplies = useCallback(async () => {
    const [threadsRes, repliesRes] = await Promise.all([
      supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('thread_replies')
        .select('*')
        .order('created_at', { ascending: true }),
    ]);
    if (threadsRes.error) {
      console.error('Failed to refetch threads:', threadsRes.error);
      return;
    }
    if (repliesRes.error) {
      console.error('Failed to refetch thread_replies:', repliesRes.error);
      return;
    }
    setData((prev) =>
      prev
        ? {
            ...prev,
            threads: threadsRes.data.map(threadRowToThread),
            threadReplies: repliesRes.data.map(replyRowToReply),
          }
        : prev,
    );
  }, []);

  // Realtime: thread_replies broadcasts so demos see new replies appear live.
  // The trigger maintains threads.reply_count; refetching both keeps the
  // feed counters and the detail list in sync.
  useEffect(() => {
    const channel = supabase
      .channel('thread_replies_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'thread_replies' },
        () => {
          refetchThreadsAndReplies();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchThreadsAndReplies]);

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

  const postReply = useCallback(
    async ({
      threadId,
      body,
      authorInitial,
      authorName,
    }: {
      threadId: string;
      body: string;
      authorInitial: string;
      authorName: string;
    }) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase
        .from('thread_replies')
        .insert({
          thread_id: threadId,
          author_initial: authorInitial,
          author_name: authorName,
          body: trimmed,
        });
      if (insertErr) throw insertErr;
      // Realtime will refetch; refetch here too so the local user sees the
      // post immediately even if the channel is slow to wake.
      await refetchThreadsAndReplies();
    },
    [refetchThreadsAndReplies],
  );

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
        postReply,
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
