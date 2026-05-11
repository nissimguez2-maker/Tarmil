import type { Reaction } from '../../data/reactions';

export type GroupedReaction = {
  emoji: string;
  count: number;
  /** Whether the current user is among the actors. */
  selfActive: boolean;
};

/**
 * Group a flat list of reactions by emoji. Used by activity card variants +
 * forum thread reactions to render a compact "🔥 3 · 🥂 2 · …" row.
 *
 * `actor_friend_id: null` indicates the current user; we surface that as
 * `selfActive` so the chip can render the active state.
 */
export function groupReactions(reactions: Reaction[]): GroupedReaction[] {
  const map = new Map<string, { count: number; selfActive: boolean }>();
  for (const r of reactions) {
    const entry = map.get(r.emoji) ?? { count: 0, selfActive: false };
    entry.count += 1;
    if (r.actorFriendId === null) entry.selfActive = true;
    map.set(r.emoji, entry);
  }
  return Array.from(map.entries())
    .map(([emoji, v]) => ({ emoji, ...v }))
    .sort((a, b) => b.count - a.count);
}
