import clsx from 'clsx';
import {
  ALL_CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type ExpenseCategory,
} from '../data/expenses';

type Props = {
  value: ExpenseCategory;
  onChange: (c: ExpenseCategory) => void;
};

/**
 * Category picker — 2-column grid of pill chips, each with icon + Hebrew
 * label. Used by the Personal Expense Tracker form and the Balance
 * tool's add-expense form so the two stay visually identical and
 * categories propagate cleanly across the cross-tool sync.
 *
 * Active chip uses the copper accent (vibrant CTA color); inactive chips
 * are white pills with a cocoa-15 border so they read as "tap me" against
 * the surrounding sand card.
 */
export function CategoryPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ALL_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const active = value === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={clsx(
              'inline-flex h-11 items-center gap-2 rounded-full border px-md text-body transition-colors duration-200 ease-out-quart',
              active
                ? 'border-copper bg-copper text-ivory'
                : 'border-cocoa-15 bg-white text-cocoa active:bg-cocoa-08',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span>{CATEGORY_LABELS[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}
