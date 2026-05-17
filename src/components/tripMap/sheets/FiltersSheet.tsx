import clsx from 'clsx';
import { X } from 'lucide-react';
import type { FriendsView } from '../tripReducer';

type Props = {
  friendsView: FriendsView;
  onSetFriendsView: (view: FriendsView) => void;
  onClose: () => void;
};

const FRIENDS_OPTIONS: Array<{ value: FriendsView; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'overlaps', label: 'Overlaps' },
  { value: 'none', label: 'Off' },
];

const FRIENDS_HINT: Record<FriendsView, string> = {
  all: 'Every friend with a place to be — overlaps in colour, traveling friends muted.',
  overlaps: 'Only friends whose plans actually touch yours.',
  none: 'No friend pins on the map.',
};

export function FiltersSheet({
  friendsView,
  onSetFriendsView,
  onClose,
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-sm px-md pb-sm pt-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-copper">Trip map</span>
          <h2 className="font-serif text-lede leading-tight text-cocoa">
            Filters
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-md pb-lg pt-sm">
        <section className="flex flex-col gap-sm">
          <h3 className="text-body font-medium text-cocoa">Friends on the map</h3>
          <SegmentedControl
            value={friendsView}
            onChange={onSetFriendsView}
            options={FRIENDS_OPTIONS}
          />
          <p className="text-small leading-snug text-cocoa-70">
            {FRIENDS_HINT[friendsView]}
          </p>
        </section>
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="flex rounded-full bg-cocoa-08 p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={clsx(
              'flex-1 rounded-full px-sm py-2 text-body font-medium leading-none',
              'transition-[transform,background-color,box-shadow,color] duration-instant ease-out-quart',
              'active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
              active
                ? 'bg-cocoa text-ivory shadow-card'
                : 'text-cocoa-70 hover:text-cocoa',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
