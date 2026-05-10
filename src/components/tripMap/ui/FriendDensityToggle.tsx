import clsx from 'clsx';
import { Users, UsersRound } from 'lucide-react';

type Props = {
  visible: boolean;
  onToggle: () => void;
  /** Optional friend count, shown as a small numeric badge when visible. */
  count?: number;
};

/**
 * Pill-style floater that hides or shows friend pins on the map. Default:
 * visible. Lives at the start-bottom of the map area, opposite the
 * AddDestinationFab on the end-bottom. Tap to toggle.
 */
export function FriendDensityToggle({ visible, onToggle, count }: Props) {
  const Icon = visible ? UsersRound : Users;
  return (
    <button
      type="button"
      aria-pressed={visible}
      aria-label={visible ? 'הסתר חברים על המפה' : 'הצג חברים על המפה'}
      onClick={onToggle}
      className={clsx(
        'pointer-events-auto absolute start-md bottom-md z-[750]',
        'inline-flex h-10 items-center gap-2 rounded-full px-md',
        'border text-[10pt] font-medium leading-none transition-colors',
        visible
          ? 'border-cocoa-15 bg-ivory text-cocoa shadow-device active:bg-cocoa-08'
          : 'border-cocoa-15 bg-cocoa text-ivory shadow-device active:bg-cocoa-70',
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
      <span>{visible ? 'חברים' : 'חברים מוסתרים'}</span>
      {visible && typeof count === 'number' && count > 0 && (
        <span
          className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1.5 text-[9pt] text-ivory"
          aria-label={`${count} חברים`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
