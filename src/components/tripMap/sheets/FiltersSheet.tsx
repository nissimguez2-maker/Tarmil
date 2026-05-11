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
      <div className="flex justify-center pt-2 pb-1" aria-hidden>
        <div className="h-1 w-9 rounded-full bg-cocoa-30" />
      </div>

      <div className="flex items-center justify-between border-b border-cocoa-15 px-md pb-sm pt-1">
        <h2 className="font-serif text-lede text-cocoa">סינון</h2>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="-me-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cocoa-08 text-cocoa active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-md py-md">
        <section className="flex flex-col gap-sm">
          <h3 className="text-body font-medium text-cocoa">חברים על המפה</h3>
          <SegmentedControl
            value={friendsView}
            onChange={onSetFriendsView}
            options={FRIENDS_OPTIONS}
          />
          <p className="text-[10pt] leading-snug text-cocoa-70">
            {FRIENDS_HINT[friendsView]}
          </p>
        </section>

        <section className="mt-lg flex flex-col gap-sm">
          <div className="flex items-baseline justify-between">
            <h3 className="text-body font-medium text-cocoa">מקומות על המפה</h3>
            <button
              type="button"
              onClick={() =>
                onSetFilters(
                  allOn ? new Set() : new Set(DEFAULT_ACTIVE_FILTERS),
                )
              }
              className="text-[10pt] text-copper active:text-copper-70"
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
            <p className="text-[10pt] leading-snug text-cocoa-70">
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
    <div className="flex rounded-full bg-cocoa-15 p-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={clsx(
              'flex-1 rounded-full px-sm py-1.5 text-[11pt] leading-none transition-colors',
              active
                ? 'bg-cocoa text-ivory shadow-sm'
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
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-copper' : 'bg-cocoa-30',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 start-0.5 h-6 w-6 rounded-full border border-cocoa-15 bg-ivory shadow-sm transition-transform duration-200',
          // In RTL, the knob sits at logical-start (physical right) when off;
          // translating physically left (negative X) moves it to the
          // logical-end "on" position.
          checked && '-translate-x-5',
        )}
      />
    </button>
  );
}
