import { Avatar } from '../shared/Avatar';
import type { FriendOverlap } from '../../data/myTrip';

type Props = {
  direction: 'sent' | 'received';
  friend: FriendOverlap | undefined;
  zoneLabel: string;
  /** Epoch ms — formatted into a short relative string. */
  at: number;
};

/**
 * One row in the Ping history feed. No reply control: Ping is one-shot.
 * The receiver who wants to engage opens a channel they already use —
 * Tarmil is the discovery, not the conversation.
 */
export function PingHistoryRow({ direction, friend, zoneLabel, at }: Props) {
  const headline =
    direction === 'received'
      ? `${friend?.friendName ?? 'A friend'} is in your city`
      : `You pinged ${friend?.friendName ?? 'a friend'}`;
  return (
    <article className="flex items-center gap-sm rounded-2xl bg-cream shadow-card p-md">
      <Avatar
        photoUrl={friend?.photoUrl}
        initial={friend?.friendInitial ?? '·'}
        name={friend?.friendName ?? 'Friend'}
        size="md"
        statusDot={direction === 'received'}
      />
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate font-serif text-lede italic text-charcoal">
          {headline}
        </span>
        <span className="text-small text-charcoal-55">
          {zoneLabel} · {relativeTime(at)}
        </span>
      </div>
    </article>
  );
}

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
