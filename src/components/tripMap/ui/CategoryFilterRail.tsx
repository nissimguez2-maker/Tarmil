import clsx from 'clsx';
import {
  ALL_FILTERS,
  filterLabel,
  type FilterId,
} from '../utils/categoryLabel';
import { isAllFiltersActive } from '../tripReducer';

type Props = {
  active: Set<FilterId>;
  onToggle: (id: FilterId) => void;
  onSetAll: () => void;
};

/**
 * Top horizontal chip rail over the map. Tapping a chip toggles the filter;
 * tapping "הכל" sets the universe. Kosher and Chabad are off by default —
 * not because they're hidden, but because not every traveler wants them.
 */
export function CategoryFilterRail({ active, onToggle, onSetAll }: Props) {
  const all = isAllFiltersActive(active);
  return (
    <div
      className="tarmil-chip-rail absolute inset-x-md top-md z-[400] flex gap-2 overflow-x-auto rounded-full bg-ivory/85 px-sm py-xs backdrop-blur-sm"
      style={{ boxShadow: '0 2px 10px -4px rgba(53, 40, 24, 0.15)' }}
    >
      <Chip label="הכל" active={all} onClick={onSetAll} />
      {ALL_FILTERS.map((id) => (
        <Chip
          key={id}
          label={filterLabel(id)}
          active={active.has(id)}
          onClick={() => onToggle(id)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex h-9 shrink-0 items-center rounded-full border px-sm text-[11pt] leading-none transition-colors',
        active
          ? 'border-cocoa bg-cocoa text-ivory'
          : 'border-cocoa-15 bg-ivory text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15',
      )}
    >
      {label}
    </button>
  );
}
