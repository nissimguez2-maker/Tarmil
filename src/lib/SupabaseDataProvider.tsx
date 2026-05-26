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
import type { Json, Tables, TablesInsert } from './database.types';
import type { FriendVisit, Place, PlaceCategory, Season } from '../data/places';
import type { FriendOverlap, LatLng } from '../data/myTrip';
import type { PlannedStop, PlannedStopPrivacy } from '../data/plannedStops';
import type { Forum, ForumKind } from '../data/forums';
import type { ForumThread } from '../data/forumThreads';
import type { ForumThreadReply } from '../data/forumThreadReplies';
import type {
  ActivityPost,
  ActivityPostKind,
  Poll,
} from '../data/activityPosts';
import type { Reaction, ReactionTargetType } from '../data/reactions';
import type { PlaceReview } from '../data/placeReviews';
import type { Ping } from '../data/pings';
import type { PlaceSave, PlaceSaveStatus } from '../data/placeSaves';

export type TripData = {
  places: Place[];
  friendOverlaps: FriendOverlap[];
  myTrip: { past: LatLng[]; present: LatLng };
  plannedStops: PlannedStop[];
  forums: Forum[];
  forumThreads: ForumThread[];
  forumThreadReplies: ForumThreadReply[];
  activityPosts: ActivityPost[];
  reactions: Reaction[];
  placeReviews: PlaceReview[];
  pings: Ping[];
  placeSaves: PlaceSave[];
};

type Mutators = {
  saveStop: (stop: PlannedStop) => Promise<void>;
  removeStop: (stopId: string) => Promise<void>;
  savePlaceToStop: (placeId: string, stopId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
  joinForum: (forumId: string) => Promise<void>;
  postForumReply: (threadId: string, body: string) => Promise<void>;
  toggleReaction: (
    targetType: ReactionTargetType,
    targetId: string,
    emoji: string,
  ) => Promise<void>;
  postActivity: (
    kind: ActivityPostKind,
    bodyHe: string,
    destinationId?: string,
    payload?: Record<string, unknown>,
    poll?: Poll | null,
  ) => Promise<void>;
  /**
   * Upsert the demo user's 1–5 star rating for a place. There's exactly one
   * "self" review per place (`reviewer_friend_id = null`); existing rows are
   * updated in place.
   */
  submitPlaceReview: (placeId: string, rating: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  /**
   * Fire a one-shot Ping. Idempotent: re-pinging the same friend in the
   * same direction collapses (unique constraint enforces "one per
   * co-presence event" per brief §04). Returns silently when already pinged.
   */
  sendPing: (friendId: string) => Promise<void>;
  /**
   * Toggle the user's vote on an Activity post's attached poll. For a
   * single-choice poll the new index replaces any existing self-vote.
   * For multiple-choice, the index is added or removed from the set.
   */
  submitPollVote: (postId: string, optionIndex: number) => Promise<void>;
  /**
   * Star (or un-star) a place. Toggles a single self-row in `place_saves`
   * for `placeId`. If already saved, removes it. Default status is
   * `wishlist`; the place can be moved to `reserved` / `visited` later
   * via {@link updatePlaceSave}.
   */
  togglePlaceSave: (placeId: string) => Promise<void>;
  /**
   * Update an existing self-save — attach to a planned stop, change
   * status (wishlist → reserved → visited), or toggle private.
   */
  updatePlaceSave: (
    placeId: string,
    patch: { status?: PlaceSaveStatus; plannedStopId?: string | null; private?: boolean },
  ) => Promise<void>;
};

type ContextValue = {
  data: TripData | null;
  loading: boolean;
  error: Error | null;
} & Mutators;

const Context = createContext<ContextValue | null>(null);

// Dev-only offline mode: load TripData from in-repo seed arrays instead of
// Supabase (for local screenshots when the Supabase host is blocked). Unset
// in real builds, so this is always false in prod.
const USE_LOCAL_SEED = import.meta.env.VITE_USE_LOCAL_SEED === 'true';

// Supabase throws PostgrestError-shaped objects that aren't `instanceof Error`,
// so the obvious `new Error(String(e))` stringifies them as "[object Object]"
// and the screen swallows the real cause. Keep the original Error when we have
// one, otherwise fold message + code + hint into a readable line.
const toError = (e: unknown): Error => {
  if (e instanceof Error) return e;
  if (e && typeof e === 'object') {
    const o = e as Record<string, unknown>;
    const msg = typeof o.message === 'string' ? o.message : null;
    if (msg) {
      const tail = [o.code, o.hint, o.details]
        .filter((x): x is string => typeof x === 'string' && x.length > 0)
        .join(' · ');
      return new Error(tail ? `${msg} (${tail})` : msg);
    }
  }
  return new Error(String(e));
};

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
  phone: r.phone ?? undefined,
  reservationUrl: r.reservation_url ?? undefined,
  imageUrl: r.image_url ?? undefined,
  paidPlacement: r.paid_placement || undefined,
  // Earned Selection outranks plain Sponsored; both are disclosed.
  placementTier: r.tarmil_pick
    ? 'selection'
    : r.paid_placement
      ? 'sponsored'
      : undefined,
});

const placeReviewRowToReview = (
  r: Tables<'place_reviews'>,
): PlaceReview => ({
  placeId: r.place_id,
  reviewerFriendId: r.reviewer_friend_id,
  rating: r.rating,
});

const friendRowToOverlap = (r: Tables<'friend_overlaps'>): FriendOverlap => ({
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

const forumRowToForum = (r: Tables<'forums'>): Forum => ({
  id: r.id,
  slug: r.slug,
  nameHe: r.name_he,
  nameEn: r.name_en,
  cityLabel: r.city_label ?? undefined,
  destinationId: r.destination_id ?? undefined,
  kind: r.kind as ForumKind,
  subject: r.subject ?? undefined,
  memberCount: r.member_count,
  heroBlurbHe: r.hero_blurb_he,
  isRecommended: r.is_recommended,
});

const forumThreadRowToThread = (
  r: Tables<'forum_threads'>,
): ForumThread => ({
  id: r.id,
  forumId: r.forum_id,
  authorFriendId: r.author_friend_id,
  title: r.title,
  body: r.body,
  replyCount: r.reply_count,
  followCount: r.follow_count,
  pinned: r.pinned,
  subject: r.subject,
});

const forumReplyRowToReply = (
  r: Tables<'forum_thread_replies'>,
): ForumThreadReply => ({
  id: r.id,
  threadId: r.thread_id,
  authorFriendId: r.author_friend_id,
  body: r.body,
});

const parsePoll = (raw: unknown): Poll | undefined => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const p = raw as Record<string, unknown>;
  const question = typeof p.question === 'string' ? p.question : null;
  const options = Array.isArray(p.options) ? p.options : null;
  if (!question || !options) return undefined;
  const parsedOptions = options
    .filter(
      (o): o is Record<string, unknown> =>
        !!o && typeof o === 'object' && !Array.isArray(o),
    )
    .map((o) => ({
      text: typeof o.text === 'string' ? o.text : '',
      voteCount: typeof o.voteCount === 'number' ? o.voteCount : 0,
    }))
    .filter((o) => o.text.length > 0);
  if (parsedOptions.length < 2) return undefined;
  const votes =
    p.votes && typeof p.votes === 'object' && !Array.isArray(p.votes)
      ? (p.votes as Record<string, number[]>)
      : {};
  return {
    question,
    options: parsedOptions,
    multipleChoice: !!p.multipleChoice,
    votes,
  };
};

const activityPostRowToPost = (
  r: Tables<'activity_posts'>,
): ActivityPost => {
  const payload =
    r.payload && typeof r.payload === 'object' && !Array.isArray(r.payload)
      ? { ...(r.payload as Record<string, unknown>) }
      : {};
  const poll = parsePoll(r.poll);
  if (poll) payload.poll = poll;
  return {
    id: r.id,
    kind: r.kind as ActivityPostKind,
    authorFriendId: r.author_friend_id,
    destinationId: r.destination_id ?? undefined,
    bodyHe: r.body_he,
    payload,
    replyCount: r.reply_count,
  };
};

const reactionRowToReaction = (r: Tables<'reactions'>): Reaction => ({
  id: r.id,
  targetType: r.target_type as ReactionTargetType,
  targetId: r.target_id,
  emoji: r.emoji,
  actorFriendId: r.actor_friend_id,
});

const pingRowToPing = (r: Tables<'pings'>): Ping => ({
  id: r.id,
  friendId: r.friend_id,
  direction: r.direction as 'sent' | 'received',
  zoneLabel: r.zone_label,
  createdAt: r.created_at,
});

const placeSaveRowToSave = (r: Tables<'place_saves'>): PlaceSave => ({
  id: r.id,
  friendId: r.friend_id,
  placeId: r.place_id,
  status: r.status as PlaceSaveStatus,
  plannedStopId: r.planned_stop_id,
  private: r.private,
  createdAt: r.created_at,
});

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const refetchForums = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('forums')
      .select('*');
    if (fetchErr) return;
    setData((prev) =>
      prev ? { ...prev, forums: rows.map(forumRowToForum) } : prev,
    );
  }, []);

  const refetchForumReplies = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('forum_thread_replies')
      .select('*')
      .order('created_at');
    if (fetchErr) return;
    setData((prev) =>
      prev
        ? { ...prev, forumThreadReplies: rows.map(forumReplyRowToReply) }
        : prev,
    );
  }, []);

  const refetchActivity = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('activity_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchErr) return;
    setData((prev) =>
      prev ? { ...prev, activityPosts: rows.map(activityPostRowToPost) } : prev,
    );
  }, []);

  const refetchReactions = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('reactions')
      .select('*');
    if (fetchErr) return;
    setData((prev) =>
      prev ? { ...prev, reactions: rows.map(reactionRowToReaction) } : prev,
    );
  }, []);

  const refetchPings = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('pings')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchErr) return;
    setData((prev) =>
      prev ? { ...prev, pings: rows.map(pingRowToPing) } : prev,
    );
  }, []);

  const refetchPlaceSaves = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('place_saves')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchErr) return;
    setData((prev) =>
      prev ? { ...prev, placeSaves: rows.map(placeSaveRowToSave) } : prev,
    );
  }, []);

  // Initial fetch — every table in parallel.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (USE_LOCAL_SEED) {
        const { buildLocalSeed } = await import('./localSeed');
        if (!cancelled) {
          setData(buildLocalSeed());
          setLoading(false);
        }
        return;
      }
      try {
        const [
          placesRes,
          friendsRes,
          waypointsRes,
          stopsRes,
          forumsRes,
          forumThreadsRes,
          forumRepliesRes,
          activityPostsRes,
          reactionsRes,
          placeReviewsRes,
          pingsRes,
          placeSavesRes,
        ] = await Promise.all([
          supabase.from('places').select('*'),
          supabase.from('friend_overlaps').select('*'),
          supabase.from('trip_waypoints').select('*').order('order_index'),
          supabase.from('planned_stops').select('*').order('arrival_date'),
          supabase.from('forums').select('*'),
          supabase.from('forum_threads').select('*').order('created_at', { ascending: false }),
          supabase.from('forum_thread_replies').select('*').order('created_at'),
          supabase.from('activity_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('reactions').select('*'),
          supabase.from('place_reviews').select('*'),
          supabase.from('pings').select('*').order('created_at', { ascending: false }),
          supabase.from('place_saves').select('*').order('created_at', { ascending: false }),
        ]);
        if (placesRes.error) throw placesRes.error;
        if (friendsRes.error) throw friendsRes.error;
        if (waypointsRes.error) throw waypointsRes.error;
        if (stopsRes.error) throw stopsRes.error;
        if (forumsRes.error) throw forumsRes.error;
        if (forumThreadsRes.error) throw forumThreadsRes.error;
        if (forumRepliesRes.error) throw forumRepliesRes.error;
        if (activityPostsRes.error) throw activityPostsRes.error;
        if (reactionsRes.error) throw reactionsRes.error;
        if (placeReviewsRes.error) throw placeReviewsRes.error;
        if (pingsRes.error) throw pingsRes.error;
        if (placeSavesRes.error) throw placeSavesRes.error;

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

        if (!cancelled) {
          setData({
            places,
            friendOverlaps,
            myTrip: { past, present },
            plannedStops,
            forums: forumsRes.data.map(forumRowToForum),
            forumThreads: forumThreadsRes.data.map(forumThreadRowToThread),
            forumThreadReplies: forumRepliesRes.data.map(forumReplyRowToReply),
            activityPosts: activityPostsRes.data.map(activityPostRowToPost),
            reactions: reactionsRes.data.map(reactionRowToReaction),
            placeReviews: placeReviewsRes.data.map(placeReviewRowToReview),
            pings: pingsRes.data.map(pingRowToPing),
            placeSaves: placeSavesRes.data.map(placeSaveRowToSave),
          });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(toError(e));
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime — one channel per surface so cleanup stays simple.
  useEffect(() => {
    if (USE_LOCAL_SEED) return;
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

  useEffect(() => {
    if (USE_LOCAL_SEED) return;
    const channel = supabase
      .channel('forum_thread_replies_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_thread_replies' },
        () => {
          refetchForumReplies();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchForumReplies]);

  useEffect(() => {
    if (USE_LOCAL_SEED) return;
    const channel = supabase
      .channel('activity_posts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_posts' },
        () => {
          refetchActivity();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchActivity]);

  useEffect(() => {
    if (USE_LOCAL_SEED) return;
    const channel = supabase
      .channel('reactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        () => {
          refetchReactions();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchReactions]);

  useEffect(() => {
    if (USE_LOCAL_SEED) return;
    const channel = supabase
      .channel('pings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pings' },
        () => {
          refetchPings();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchPings]);

  useEffect(() => {
    if (USE_LOCAL_SEED) return;
    const channel = supabase
      .channel('place_saves_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'place_saves' },
        () => {
          refetchPlaceSaves();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchPlaceSaves]);

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
    await Promise.all([
      refetchStops(),
      refetchPings(),
      refetchActivity(),
      refetchPlaceSaves(),
    ]);
  }, [refetchStops, refetchPings, refetchActivity, refetchPlaceSaves]);

  const joinForum = useCallback(
    async (forumId: string) => {
      const forum = dataRef.current?.forums.find((f) => f.id === forumId);
      if (!forum) return;
      const { error: updateErr } = await supabase
        .from('forums')
        .update({
          is_recommended: false,
          member_count: forum.memberCount + 1,
        })
        .eq('id', forumId);
      if (updateErr) throw updateErr;
      await refetchForums();
    },
    [refetchForums],
  );

  const postForumReply = useCallback(
    async (threadId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase
        .from('forum_thread_replies')
        .insert({ thread_id: threadId, author_friend_id: null, body: trimmed });
      if (insertErr) throw insertErr;
      const thread = dataRef.current?.forumThreads.find((t) => t.id === threadId);
      if (thread) {
        await supabase
          .from('forum_threads')
          .update({ reply_count: thread.replyCount + 1 })
          .eq('id', threadId);
      }
      await refetchForumReplies();
    },
    [refetchForumReplies],
  );

  const toggleReaction = useCallback(
    async (
      targetType: ReactionTargetType,
      targetId: string,
      emoji: string,
    ) => {
      const existing = dataRef.current?.reactions.find(
        (r) =>
          r.targetType === targetType &&
          r.targetId === targetId &&
          r.emoji === emoji &&
          r.actorFriendId === null,
      );
      if (existing) {
        const { error: deleteErr } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id);
        if (deleteErr) throw deleteErr;
      } else {
        const { error: insertErr } = await supabase.from('reactions').insert({
          target_type: targetType,
          target_id: targetId,
          emoji,
          actor_friend_id: null,
        });
        if (insertErr) throw insertErr;
      }
      await refetchReactions();
    },
    [refetchReactions],
  );

  const postActivity = useCallback(
    async (
      kind: ActivityPostKind,
      bodyHe: string,
      destinationId?: string,
      payload?: Record<string, unknown>,
      poll?: Poll | null,
    ) => {
      const trimmed = bodyHe.trim();
      if (!trimmed) return;
      const id = `act-${kind}-${Date.now()}`;
      const { error: insertErr } = await supabase.from('activity_posts').insert({
        id,
        kind,
        author_friend_id: null,
        destination_id: destinationId ?? null,
        body_he: trimmed,
        payload: (payload ?? {}) as Json,
        poll: (poll ?? null) as Json | null,
        reply_count: 0,
      });
      if (insertErr) throw insertErr;
      await refetchActivity();
    },
    [refetchActivity],
  );

  const refetchPlaceReviews = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('place_reviews')
      .select('*');
    if (fetchErr) return;
    setData((prev) =>
      prev
        ? { ...prev, placeReviews: rows.map(placeReviewRowToReview) }
        : prev,
    );
  }, []);

  const submitPlaceReview = useCallback(
    async (placeId: string, rating: 1 | 2 | 3 | 4 | 5) => {
      const existing = (dataRef.current?.placeReviews ?? []).find(
        (r) => r.placeId === placeId && r.reviewerFriendId === null,
      );
      if (existing) {
        const { error: updErr } = await supabase
          .from('place_reviews')
          .update({ rating })
          .eq('place_id', placeId)
          .is('reviewer_friend_id', null);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase
          .from('place_reviews')
          .insert({ place_id: placeId, reviewer_friend_id: null, rating });
        if (insErr) throw insErr;
      }
      await refetchPlaceReviews();
    },
    [refetchPlaceReviews],
  );

  const sendPing = useCallback(
    async (friendId: string) => {
      const friend = dataRef.current?.friendOverlaps.find(
        (f) => f.id === friendId,
      );
      if (!friend) return;
      const already = dataRef.current?.pings.some(
        (p) => p.friendId === friendId && p.direction === 'sent',
      );
      if (already) return;
      const { error: insertErr } = await supabase.from('pings').insert({
        friend_id: friendId,
        direction: 'sent',
        zone_label: friend.zoneLabel,
      });
      if (insertErr) {
        // Unique-violation = already pinged this overlap; swallow as success
        // since the brief enforces "one per co-presence event" exactly here.
        if (
          (insertErr as { code?: string }).code !== '23505'
        ) {
          throw insertErr;
        }
      }
      await refetchPings();
    },
    [refetchPings],
  );

  const submitPollVote = useCallback(
    async (postId: string, optionIndex: number) => {
      const post = dataRef.current?.activityPosts.find((p) => p.id === postId);
      if (!post) return;
      const existingPoll = (post.payload as { poll?: Poll })?.poll;
      if (!existingPoll) return;
      const selfVotes = new Set(existingPoll.votes?.self ?? []);
      const had = selfVotes.has(optionIndex);
      if (existingPoll.multipleChoice) {
        if (had) selfVotes.delete(optionIndex);
        else selfVotes.add(optionIndex);
      } else {
        selfVotes.clear();
        if (!had) selfVotes.add(optionIndex);
      }
      const nextVoteSet = Array.from(selfVotes).sort();
      const previousSelf = existingPoll.votes?.self ?? [];
      const nextOptions = existingPoll.options.map((opt, i) => {
        const wasIn = previousSelf.includes(i);
        const isIn = nextVoteSet.includes(i);
        let count = opt.voteCount;
        if (!wasIn && isIn) count += 1;
        if (wasIn && !isIn) count -= 1;
        return { ...opt, voteCount: Math.max(0, count) };
      });
      const nextPoll: Poll = {
        ...existingPoll,
        options: nextOptions,
        votes: { ...(existingPoll.votes ?? {}), self: nextVoteSet },
      };
      const { error: updateErr } = await supabase
        .from('activity_posts')
        .update({ poll: nextPoll as unknown as Json })
        .eq('id', postId);
      if (updateErr) throw updateErr;
      await refetchActivity();
    },
    [refetchActivity],
  );

  const togglePlaceSave = useCallback(
    async (placeId: string) => {
      const existing = (dataRef.current?.placeSaves ?? []).find(
        (s) => s.placeId === placeId && s.friendId === null,
      );
      if (existing) {
        const { error: deleteErr } = await supabase
          .from('place_saves')
          .delete()
          .eq('id', existing.id);
        if (deleteErr) throw deleteErr;
      } else {
        // Auto-attach to a matching planned stop in the same city if one
        // exists. Plan tab still treats null plannedStopId as "Saved
        // (unsorted)" — this just removes a sorting tap when the answer
        // is obvious.
        const place = dataRef.current?.places.find((p) => p.id === placeId);
        const matchingStop = place
          ? (dataRef.current?.plannedStops ?? []).find(
              (s) => s.id === place.destinationId,
            )
          : undefined;
        const { error: insertErr } = await supabase.from('place_saves').insert({
          friend_id: null,
          place_id: placeId,
          status: 'wishlist',
          planned_stop_id: matchingStop?.id ?? null,
          private: false,
        });
        if (insertErr) throw insertErr;
      }
      await refetchPlaceSaves();
    },
    [refetchPlaceSaves],
  );

  const updatePlaceSave = useCallback(
    async (
      placeId: string,
      patch: {
        status?: PlaceSaveStatus;
        plannedStopId?: string | null;
        private?: boolean;
      },
    ) => {
      const existing = (dataRef.current?.placeSaves ?? []).find(
        (s) => s.placeId === placeId && s.friendId === null,
      );
      if (!existing) return;
      const updates: import('./database.types').TablesUpdate<'place_saves'> = {};
      if (patch.status !== undefined) updates.status = patch.status;
      if (patch.plannedStopId !== undefined)
        updates.planned_stop_id = patch.plannedStopId;
      if (patch.private !== undefined) updates.private = patch.private;
      if (Object.keys(updates).length === 0) return;
      const { error: updateErr } = await supabase
        .from('place_saves')
        .update(updates)
        .eq('id', existing.id);
      if (updateErr) throw updateErr;
      await refetchPlaceSaves();
    },
    [refetchPlaceSaves],
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
        joinForum,
        postForumReply,
        toggleReaction,
        postActivity,
        submitPlaceReview,
        sendPing,
        submitPollVote,
        togglePlaceSave,
        updatePlaceSave,
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
