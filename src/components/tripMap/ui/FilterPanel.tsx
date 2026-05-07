import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import {
  ALL_FILTERS,
  filterLabel,
  type FilterId,
} from '../utils/categoryLabel';

type Props = {
  active: Set<FilterId>;
  onToggle: (id: FilterId) => void;
};

/** Filters grouped for the drop-down. Order is the same as the legacy chip
 * rail; "extra" lifts modifiers (picks, friends-know-this-place); "layers"
 * lifts the friend-bubble visibility toggle to the bottom so it reads as a
 * map-overlay control rather than a place filter. Total length must equal
 * ALL_FILTERS.length — when adding a new FilterId, route it into one of the
 * three groups below. */
const PLACES: FilterId[] = ['hostels', 'food', 'beaches', 'nightlife'];
const EXTRA: FilterId[] = ['kosher', 'chabad', 'picks', 'friends'];
const LAYERS: FilterId[] = ['friendBubbles'];

/**
 * Centered "מסננים" button atop the map. Tapping drops a panel of iOS-style
 * I/O switches in Tarmil colors. Replaces the previous chip rail — which
 * scrolled horizontally and hid the rightmost chips on narrow viewports.
 *
 * Z-index: button + panel both sit at z-[400] so they layer above the map
 * but below floaters (z-[800]) and bottom sheets (z-[1000]).
 */
export function FilterPanel({ active, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tap-outside to close. Mousedown so the close fires before any focus
  // shift on a downstream control.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const activeCount = ALL_FILTERS.reduce(
    (n, id) => n + (active.has(id) ? 1 : 0),
    0,
  );

  return (
    <div
      ref={containerRef}
      className="absolute start-1/2 top-md z-[400] flex -translate-x-1/2 flex-col items-center"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={clsx(
          'inline-flex h-11 items-center gap-2 rounded-full border bg-ivory/95 px-md text-body backdrop-blur-sm transition-colors duration-200 ease-out-quart',
          open
            ? 'border-cocoa bg-cocoa text-ivory'
            : 'border-cocoa-15 text-cocoa active:bg-cocoa-8',
        )}
        style={{ boxShadow: '0 2px 10px -4px rgba(53, 40, 24, 0.15)' }}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} aria-hidden />
        <span>מסננים</span>
        {activeCount > 0 && (
          <span
            className={clsx(
              'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-meta',
              open ? 'bg-ivory text-cocoa' : 'bg-cocoa text-ivory',
            )}
          >
            <span className="tnum">{activeCount}</span>
          </span>
        )}
        <ChevronDown
          className={clsx(
            'h-4 w-4 transition-transform duration-200 ease-out-quart',
            open && 'rotate-180',
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="mt-2 w-72 max-w-[88vw] rounded-md border border-rope bg-ivory p-md"
          style={{
            boxShadow: '0 16px 40px -12px rgba(53, 40, 24, 0.30)',
          }}
        >
          <Group label="מקומות">
            {PLACES.map((id) => (
              <ToggleRow
                key={id}
                label={filterLabel(id)}
                checked={active.has(id)}
                onToggle={() => onToggle(id)}
              />
            ))}
          </Group>
          <div className="my-sm h-px bg-cocoa-08" aria-hidden />
          <Group label="סינון נוסף">
            {EXTRA.map((id) => (
              <ToggleRow
                key={id}
                label={filterLabel(id)}
                checked={active.has(id)}
                onToggle={() => onToggle(id)}
              />
            ))}
          </Group>
          <div className="my-sm h-px bg-cocoa-08" aria-hidden />
          <Group label="שכבות מפה">
            {LAYERS.map((id) => (
              <ToggleRow
                key={id}
                label={filterLabel(id)}
                checked={active.has(id)}
                onToggle={() => onToggle(id)}
              />
            ))}
          </Group>
        </div>
      )}
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1">
      <span className="meta-caps mb-1 text-cocoa-55">{label}</span>
      {children}
    </section>
  );
}

/**
 * iOS-style I/O switch with Tarmil branding. 44×24 track (so the row's tap
 * target meets the locked 44pt minimum) with a 20×20 ivory thumb that
 * translates from start to end. Track copper when ON, cocoa-15 when OFF.
 *
 * The whole row is tappable — the label is part of the button so users don't
 * need to hit the small thumb directly.
 */
function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex h-11 items-center justify-between gap-sm rounded-md px-2 text-start text-body text-cocoa active:bg-cocoa-8"
    >
      <span>{label}</span>
      <span
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-out-quart',
          checked ? 'bg-copper' : 'bg-cocoa-15',
        )}
        aria-hidden
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow-sm transition-all duration-200 ease-out-quart',
            // RTL-safe positioning: when ON, thumb sits at the END side (LTR
            // visual right; RTL visual left). When OFF, thumb sits at START.
            // Using `start-*` / `end-*` keeps it correct under both writing
            // modes — `start-0.5` resolves to right in RTL, left in LTR.
            checked ? 'end-0.5' : 'start-0.5',
          )}
        />
      </span>
    </button>
  );
}
