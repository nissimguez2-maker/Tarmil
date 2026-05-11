import clsx from 'clsx';
import { X } from 'lucide-react';
import {
  ALL_FILTERS,
  DEFAULT_ACTIVE_FILTERS,
  filterLabel,
  type FilterId,
} from '../utils/categoryLabel';
import { isAllFiltersActive } from '../tripReducer';
import type { FriendsView } from '../tripReducer';

type Props = {
  friendsView: FriendsView;
  onSetFriendsView: (view: FriendsView) => void;
  activeFilters: Set<FilterId>;
  onToggleFilter: (id: FilterId) => void;
  onSetFilters: (filters: Set<FilterId>) => void;
  onClose: () => void;
};

const FRIENDS_OPTIONS: Array<{ value: FriendsView; label: string }> = [
  { value: 'all', label: 'כולם' },
  { value: 'overlaps', label: 'חפיפות' },
  { value: 'none', label: 'כבוי' },
];

const FRIENDS_HINT: Record<FriendsView, string> = {
  all: 'מציג את כל החברים שהמסע שלהם נוגע במסע שלך.',
  overlaps: 'רק חברים שמקושרים ליעד בתכנון שלך.',
  none: 'אין סיכות של חברים על המפה.',
};

export function FiltersSheet({
  friendsView,
  onSetFriendsView,
  activeFilters,
  onToggleFilter,
  onSetFilters,
  onClose,
}: Props) {
  const allOn = isAllFiltersActive(activeFilters);
  const noneOn = activeFilters.size === 0;
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-sm px-md pb-sm pt-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-copper">מפת המסע</span>
          <h2 className="font-serif text-lede leading-tight text-cocoa">
            סינון
          </h2>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-md pb-lg pt-sm">
        <section className="flex flex-col gap-sm">
          <h3 className="text-body font-medium text-cocoa">חברים על המפה</h3>
          <SegmentedControl
            value={friendsView}
            onChange={onSetFriendsView}
            options={FRIENDS_OPTIONS}
          />
          <p className="text-small leading-snug text-cocoa-70">
            {FRIENDS_HINT[friendsView]}
          </p>
        </section>

        <hr className="my-md border-t border-cocoa-15" />

        <section className="flex flex-col gap-sm">
          <div className="flex items-baseline justify-between">
            <h3 className="text-body font-medium text-cocoa">מקומות על המפה</h3>
            <button
              type="button"
              onClick={() =>
                onSetFilters(
                  allOn ? new Set() : new Set(DEFAULT_ACTIVE_FILTERS),
                )
              }
              className="text-small text-copper transition-colors duration-instant ease-out-quart active:text-copper-70"
            >
              {allOn ? 'בטל הכל' : 'ברירת מחדל'}
            </button>
          </div>

          <ul className="flex flex-col">
            {ALL_FILTERS.map((id, i) => (
              <li
                key={id}
                className={clsx(
                  'flex items-center justify-between gap-md py-sm',
                  i > 0 && 'border-t border-cocoa-15',
                )}
              >
                <span className="text-body text-cocoa">{filterLabel(id)}</span>
                <IOSToggle
                  checked={activeFilters.has(id)}
                  onChange={() => onToggleFilter(id)}
                  ariaLabel={filterLabel(id)}
                />
              </li>
            ))}
          </ul>

          {noneOn && (
            <p className="text-small leading-snug text-cocoa-70">
              כל הסיכות כבויות — לא יוצגו מקומות על המפה.
            </p>
          )}
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
              'flex-1 rounded-full px-sm py-1.5 text-body leading-none',
              'transition-colors duration-instant ease-out-quart',
              active
                ? 'bg-cocoa text-ivory'
                : 'text-cocoa-70 active:text-cocoa',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function IOSToggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={clsx(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full',
        'transition-colors duration-instant ease-out-quart',
        checked ? 'bg-copper' : 'bg-cocoa-30',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 start-0.5 h-6 w-6 rounded-full border border-cocoa-15 bg-ivory',
          'transition-transform duration-instant ease-out-quart',
          // In RTL, the knob sits at logical-start (physical right) when off;
          // translating physically left (negative X) moves it to the
          // logical-end "on" position.
          checked && '-translate-x-5',
        )}
      />
    </button>
  );
}
