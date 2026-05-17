/**
 * Polymorphic reactions — emoji reactions across every reaction surface.
 *
 * SEED ONLY. Runtime data lives in `reactions`.
 *
 * `target_type` + `target_id` together identify what's being reacted to.
 * `actor_friend_id: null` = the current user (self) reacted; otherwise FK
 * to friend_overlaps.
 *
 * Emoji palette stays warm to match the DA: 🔥 (excitement), 🌊 (water/beach),
 * ⛺ (camping/outdoors), ☕ (cafe/chill), 🍳 (food), 🌅 (sunset), ❤️ (love),
 * 🥂 (cheers / celebration), ✈️ (travel). Avoid emoji that read as cold or
 * corporate (👍, 💼, etc.).
 *
 * IDs are deterministic ({target_type}-{target_id}-{emoji}-{actor}) so
 * re-running the seed is idempotent. The unique constraint at the DB level
 * matches.
 */

export type ReactionTargetType =
  | 'forum_thread'
  | 'forum_reply'
  | 'activity_post';

export type Reaction = {
  id: string;
  targetType: ReactionTargetType;
  targetId: string;
  emoji: string;
  /** null = self. FK to friend_overlaps otherwise. */
  actorFriendId: string | null;
};

export const reactions: Reaction[] = [
  // Reactions on activity posts (the most-seen reaction surface)
  { id: 'r-act-overlap-roi-buzios-fire-self', targetType: 'activity_post', targetId: 'act-overlap-roi-buzios', emoji: '🔥', actorFriendId: null },
  { id: 'r-act-overlap-roi-buzios-fire-maya', targetType: 'activity_post', targetId: 'act-overlap-roi-buzios', emoji: '🔥', actorFriendId: 'maya-ipanema' },
  { id: 'r-act-overlap-shir-saopaulo-fire-self', targetType: 'activity_post', targetId: 'act-overlap-shir-saopaulo', emoji: '🔥', actorFriendId: null },
  { id: 'r-act-overlap-shir-saopaulo-cheers-yael', targetType: 'activity_post', targetId: 'act-overlap-shir-saopaulo', emoji: '🥂', actorFriendId: 'yael-botafogo' },
  { id: 'r-act-overlap-yotam-jeri-wave-self', targetType: 'activity_post', targetId: 'act-overlap-yotam-jeri', emoji: '🌊', actorFriendId: null },
  { id: 'r-act-overlap-yotam-jeri-fire-roi', targetType: 'activity_post', targetId: 'act-overlap-yotam-jeri', emoji: '🔥', actorFriendId: 'roi-buzios' },

  { id: 'r-act-decl-roi-buzios-wave-yael', targetType: 'activity_post', targetId: 'act-decl-roi-buzios', emoji: '🌊', actorFriendId: 'yael-botafogo' },
  { id: 'r-act-decl-roi-buzios-fire-shir', targetType: 'activity_post', targetId: 'act-decl-roi-buzios', emoji: '🔥', actorFriendId: 'shir-saopaulo' },
  { id: 'r-act-decl-shir-saopaulo-egg-tom', targetType: 'activity_post', targetId: 'act-decl-shir-saopaulo', emoji: '🍳', actorFriendId: 'moshe-buenosaires' },
  { id: 'r-act-decl-shir-saopaulo-cheers-self', targetType: 'activity_post', targetId: 'act-decl-shir-saopaulo', emoji: '🥂', actorFriendId: null },

  { id: 'r-act-whosdown-asado-egg-self', targetType: 'activity_post', targetId: 'act-whosdown-asado', emoji: '🍳', actorFriendId: null },
  { id: 'r-act-whosdown-asado-cheers-yael', targetType: 'activity_post', targetId: 'act-whosdown-asado', emoji: '🥂', actorFriendId: 'yael-botafogo' },
  { id: 'r-act-whosdown-asado-fire-maya', targetType: 'activity_post', targetId: 'act-whosdown-asado', emoji: '🔥', actorFriendId: 'maya-ipanema' },
  { id: 'r-act-whosdown-jeri-kite-wave-self', targetType: 'activity_post', targetId: 'act-whosdown-jeri-kite', emoji: '🌊', actorFriendId: null },
  { id: 'r-act-whosdown-jeri-kite-fire-roi', targetType: 'activity_post', targetId: 'act-whosdown-jeri-kite', emoji: '🔥', actorFriendId: 'roi-buzios' },
  { id: 'r-act-whosdown-patagonia-tent-self', targetType: 'activity_post', targetId: 'act-whosdown-patagonia', emoji: '⛺', actorFriendId: null },
  { id: 'r-act-whosdown-patagonia-fire-yotam', targetType: 'activity_post', targetId: 'act-whosdown-patagonia', emoji: '🔥', actorFriendId: 'yotam-jericoacoara' },

  // Reactions on forum threads
  { id: 'r-thread-rio-001-fire-roi', targetType: 'forum_thread', targetId: 'thread-rio-001', emoji: '🔥', actorFriendId: 'roi-buzios' },
  { id: 'r-thread-rio-001-wave-self', targetType: 'forum_thread', targetId: 'thread-rio-001', emoji: '🌊', actorFriendId: null },
  { id: 'r-thread-sao-paulo-001-egg-tom', targetType: 'forum_thread', targetId: 'thread-sao-paulo-001', emoji: '🍳', actorFriendId: 'moshe-buenosaires' },
  { id: 'r-thread-jeri-001-wave-self', targetType: 'forum_thread', targetId: 'thread-jericoacoara-001', emoji: '🌊', actorFriendId: null },
  { id: 'r-thread-jeri-003-sunset-shir', targetType: 'forum_thread', targetId: 'thread-jericoacoara-003', emoji: '🌅', actorFriendId: 'shir-saopaulo' },
  { id: 'r-thread-jeri-003-sunset-self', targetType: 'forum_thread', targetId: 'thread-jericoacoara-003', emoji: '🌅', actorFriendId: null },

  // Reactions on forum replies (a smaller set — replies get sparser reactions)
  { id: 'r-reply-buzios-001-r3-fire-self', targetType: 'forum_reply', targetId: 'thread-buzios-001-r3', emoji: '🔥', actorFriendId: null },
  { id: 'r-reply-sao-paulo-001-r1-egg-self', targetType: 'forum_reply', targetId: 'thread-sao-paulo-001-r1', emoji: '🍳', actorFriendId: null },
];
