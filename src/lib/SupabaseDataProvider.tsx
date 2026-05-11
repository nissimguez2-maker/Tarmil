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
import type { FriendOverlap, LatLng } from '../data/myTrip';
import type { PlannedStop, PlannedStopPrivacy } from '../data/plannedStops';
import type { Forum, ForumKind } from '../data/forums';
import type { ForumThread } from '../data/forumThreads';
import type { ForumThreadReply } from '../data/forumThreadReplies';
import type { GroupChat, GroupChatMember } from '../data/groupChats';
import type { GroupMessage } from '../data/groupMessages';
import type { DM } from '../data/dms';
import type { DMMessage } from '../data/dmMessages';
import type { ActivityPost, ActivityPostKind } from '../data/activityPosts';
import type { Reaction, ReactionTargetType } from '../data/reactions';

export type TripData = {
  places: Place[];
  friendOverlaps: FriendOverlap[];
  myTrip: { past: LatLng[]; present: LatLng };
  plannedStops: PlannedStop[];
  forums: Forum[];
  forumThreads: ForumThread[];
  forumThreadReplies: ForumThreadReply[];
  groupChats: GroupChat[];
  groupChatMembers: GroupChatMember[];
  groupMessages: GroupMessage[];
  dms: DM[];
  dmMessages: DMMessage[];
  activityPosts: ActivityPost[];
  reactions: Reaction[];
};

type Mutators = {
  saveStop: (stop: PlannedStop) => Promise<void>;
  removeStop: (stopId: string) => Promise<void>;
  savePlaceToStop: (placeId: string, stopId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
  joinForum: (forumId: string) => Promise<void>;
  postForumReply: (threadId: string, body: string) => Promise<void>;
  sendGroupMessage: (chatId: string, body: string) => Promise<void>;
  sendDM: (dmThreadId: string, body: string) => Promise<void>;
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
  ) => Promise<void>;
};

type ContextValue = {
  data: TripData | null;
  loading: boolean;
  error: Error | null;
} & Mutators;

const Context = createContext<ContextValue | null>(null);

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
});

const forumReplyRowToReply = (
  r: Tables<'forum_thread_replies'>,
): ForumThreadReply => ({
  id: r.id,
  threadId: r.thread_id,
  authorFriendId: r.author_friend_id,
  body: r.body,
});

const groupChatRowToChat = (r: Tables<'group_chats'>): GroupChat => ({
  id: r.id,
  nameHe: r.name_he,
  cityLabel: r.city_label ?? undefined,
  destinationId: r.destination_id ?? undefined,
});

const groupChatMemberRowToMember = (
  r: Tables<'group_chat_members'>,
): GroupChatMember => ({
  chatId: r.chat_id,
  friendId: r.friend_id,
});

const groupMessageRowToMessage = (
  r: Tables<'group_messages'>,
): GroupMessage => ({
  id: r.id,
  chatId: r.chat_id,
  authorFriendId: r.author_friend_id,
  body: r.body,
});

const dmRowToDm = (r: Tables<'dm_threads'>): DM => ({
  id: r.id,
  friendId: r.friend_id,
  lastMessagePreviewHe: r.last_message_preview_he,
  unreadCount: r.unread_count,
});

const dmMessageRowToMessage = (r: Tables<'dm_messages'>): DMMessage => ({
  id: r.id,
  dmThreadId: r.dm_thread_id,
  fromFriend: r.from_friend,
  body: r.body,
});

const activityPostRowToPost = (
  r: Tables<'activity_posts'>,
): ActivityPost => ({
  id: r.id,
  kind: r.kind as ActivityPostKind,
  authorFriendId: r.author_friend_id,
  destinationId: r.destination_id ?? undefined,
  bodyHe: r.body_he,
  payload:
    r.payload && typeof r.payload === 'object' && !Array.isArray(r.payload)
      ? (r.payload as Record<string, unknown>)
      : {},
  replyCount: r.reply_count,
});

const reactionRowToReaction = (r: Tables<'reactions'>): Reaction => ({
  id: r.id,
  targetType: r.target_type as ReactionTargetType,
  targetId: r.target_id,
  emoji: r.emoji,
  actorFriendId: r.actor_friend_id,
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

  const refetchGroupMessages = useCallback(async () => {
    const { data: rows, error: fetchErr } = await supabase
      .from('group_messages')
      .select('*')
      .order('created_at');
    if (fetchErr) return;
    setData((prev) =>
      prev
        ? { ...prev, groupMessages: rows.map(groupMessageRowToMessage) }
        : prev,
    );
  }, []);

  const refetchDms = useCallback(async () => {
    const [threadsRes, messagesRes] = await Promise.all([
      supabase.from('dm_threads').select('*'),
      supabase.from('dm_messages').select('*').order('created_at'),
    ]);
    if (threadsRes.error || messagesRes.error) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            dms: threadsRes.data.map(dmRowToDm),
            dmMessages: messagesRes.data.map(dmMessageRowToMessage),
          }
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

  // Initial fetch — every table in parallel.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [
          placesRes,
          friendsRes,
          waypointsRes,
          stopsRes,
          forumsRes,
          forumThreadsRes,
          forumRepliesRes,
          groupChatsRes,
          groupChatMembersRes,
          groupMessagesRes,
          dmThreadsRes,
          dmMessagesRes,
          activityPostsRes,
          reactionsRes,
        ] = await Promise.all([
          supabase.from('places').select('*'),
          supabase.from('friend_overlaps').select('*'),
          supabase.from('trip_waypoints').select('*').order('order_index'),
          supabase.from('planned_stops').select('*').order('arrival_date'),
          supabase.from('forums').select('*'),
          supabase.from('forum_threads').select('*').order('created_at', { ascending: false }),
          supabase.from('forum_thread_replies').select('*').order('created_at'),
          supabase.from('group_chats').select('*'),
          supabase.from('group_chat_members').select('*'),
          supabase.from('group_messages').select('*').order('created_at'),
          supabase.from('dm_threads').select('*'),
          supabase.from('dm_messages').select('*').order('created_at'),
          supabase.from('activity_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('reactions').select('*'),
        ]);
        if (placesRes.error) throw placesRes.error;
        if (friendsRes.error) throw friendsRes.error;
        if (waypointsRes.error) throw waypointsRes.error;
        if (stopsRes.error) throw stopsRes.error;
        if (forumsRes.error) throw forumsRes.error;
        if (forumThreadsRes.error) throw forumThreadsRes.error;
        if (forumRepliesRes.error) throw forumRepliesRes.error;
        if (groupChatsRes.error) throw groupChatsRes.error;
        if (groupChatMembersRes.error) throw groupChatMembersRes.error;
        if (groupMessagesRes.error) throw groupMessagesRes.error;
        if (dmThreadsRes.error) throw dmThreadsRes.error;
        if (dmMessagesRes.error) throw dmMessagesRes.error;
        if (activityPostsRes.error) throw activityPostsRes.error;
        if (reactionsRes.error) throw reactionsRes.error;

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
            groupChats: groupChatsRes.data.map(groupChatRowToChat),
            groupChatMembers: groupChatMembersRes.data.map(
              groupChatMemberRowToMember,
            ),
            groupMessages: groupMessagesRes.data.map(groupMessageRowToMessage),
            dms: dmThreadsRes.data.map(dmRowToDm),
            dmMessages: dmMessagesRes.data.map(dmMessageRowToMessage),
            activityPosts: activityPostsRes.data.map(activityPostRowToPost),
            reactions: reactionsRes.data.map(reactionRowToReaction),
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

  // Realtime — one channel per surface so cleanup stays simple. Each subscriber
  // refetches its own slice; cheap enough for demo scale.
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

  useEffect(() => {
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
    const channel = supabase
      .channel('group_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_messages' },
        () => {
          refetchGroupMessages();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchGroupMessages]);

  useEffect(() => {
    const channel = supabase
      .channel('dm_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dm_messages' },
        () => {
          refetchDms();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchDms]);

  useEffect(() => {
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
      // bump parent reply_count; if RLS forbids, the realtime refetch still
      // surfaces the new reply so the count is recalculable in UI.
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

  const sendGroupMessage = useCallback(
    async (chatId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase.from('group_messages').insert({
        chat_id: chatId,
        author_friend_id: null,
        body: trimmed,
      });
      if (insertErr) throw insertErr;
      await supabase
        .from('group_chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);
      await refetchGroupMessages();
    },
    [refetchGroupMessages],
  );

  const sendDM = useCallback(
    async (dmThreadId: string, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase.from('dm_messages').insert({
        dm_thread_id: dmThreadId,
        from_friend: false,
        body: trimmed,
      });
      if (insertErr) throw insertErr;
      await supabase
        .from('dm_threads')
        .update({
          last_message_preview_he: trimmed.slice(0, 80),
          last_message_at: new Date().toISOString(),
          unread_count: 0,
        })
        .eq('id', dmThreadId);
      await refetchDms();
    },
    [refetchDms],
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
        payload: payload ?? {},
        reply_count: 0,
      });
      if (insertErr) throw insertErr;
      await refetchActivity();
    },
    [refetchActivity],
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
        sendGroupMessage,
        sendDM,
        toggleReaction,
        postActivity,
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
