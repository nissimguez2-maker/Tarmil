import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { Poll } from '../../data/activityPosts';

type Props = {
  poll: Poll;
  /** Index(es) the current user has voted for. */
  selfVotes: number[];
  onVote: (optionIndex: number) => void;
};

/**
 * Poll attached to an Activity post — 2–4 options, with vote counts as
 * progress bars. Tapping an option (un)votes. Multiple-choice polls let
 * the user select more than one; single-choice replaces.
 */
export function PollCard({ poll, selfVotes, onVote }: Props) {
  const total = poll.options.reduce((acc, o) => acc + o.voteCount, 0);
  return (
    <section className="flex flex-col gap-xs rounded-2xl bg-sand/60 p-md">
      <span className="meta-caps text-copper">Poll</span>
      <p className="text-body text-cocoa">{poll.question}</p>
      <ul className="flex flex-col gap-1">
        {poll.options.map((option, i) => {
          const picked = selfVotes.includes(i);
          const pct = total === 0 ? 0 : Math.round((option.voteCount / total) * 100);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onVote(i)}
                className={clsx(
                  'relative w-full overflow-hidden rounded-xl border bg-ivory text-start',
                  'transition-colors duration-instant ease-out-quart',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                  picked
                    ? 'border-copper'
                    : 'border-cocoa-15 hover:border-cocoa-30',
                )}
              >
                <span
                  aria-hidden
                  className={clsx(
                    'absolute inset-y-0 start-0 bg-sand',
                    'transition-[width] duration-considered ease-out-quart',
                  )}
                  style={{ width: `${pct}%` }}
                />
                <span className="relative flex items-center justify-between gap-sm px-md py-2.5 text-body text-cocoa">
                  <span className="inline-flex items-center gap-2">
                    {picked && (
                      <Check
                        className="h-4 w-4 text-copper"
                        strokeWidth={2.2}
                        aria-hidden
                      />
                    )}
                    {option.text}
                  </span>
                  <span className="text-small tabular-nums text-cocoa-55">
                    {option.voteCount}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-meta text-cocoa-55">
        {total} {total === 1 ? 'vote' : 'votes'}
        {poll.multipleChoice && ' · multiple choice'}
      </p>
    </section>
  );
}
