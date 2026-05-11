import type { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  /** True = sent by the current user (self). Affects color + alignment. */
  self: boolean;
  /** Optional small leading element (avatar) shown next to others' bubbles. */
  leading?: ReactNode;
  children: ReactNode;
  /** Optional author name shown above the bubble (group chats only). */
  authorName?: string;
};

/**
 * Single message bubble. Self bubbles use copper-70 with ivory text and
 * anchor to the end (left in RTL since the user types on the right keyboard
 * but the bubble visually sits opposite). Friend bubbles use sand with
 * cocoa text and anchor to the start.
 *
 * Logical alignment via flex direction + self-end / self-start.
 */
export function MessageBubble({ self, leading, children, authorName }: Props) {
  return (
    <div className={clsx('flex gap-2', self ? 'justify-end' : 'justify-start')}>
      {!self && leading && <span className="self-end pb-1">{leading}</span>}
      <div
        className={clsx(
          'flex max-w-[78%] flex-col gap-px rounded-2xl px-md py-sm',
          self
            ? 'rounded-ee-sm bg-copper-70 text-ivory'
            : 'rounded-es-sm bg-sand text-cocoa',
        )}
      >
        {authorName && !self && (
          <span className="font-serif text-small italic text-cocoa-70">
            {authorName}
          </span>
        )}
        <span className="text-body leading-snug">{children}</span>
      </div>
    </div>
  );
}
