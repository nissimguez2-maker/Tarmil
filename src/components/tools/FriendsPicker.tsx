import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, Search } from 'lucide-react';

export type FriendOption = {
  id: string;
  label: string;
};

type SingleProps = {
  multi?: false;
  value: string;
  onChange: (id: string) => void;
};

type MultiProps = {
  multi: true;
  value: string[];
  onChange: (ids: string[]) => void;
};

type CommonProps = {
  options: FriendOption[];
  placeholder?: string;
  className?: string;
};

type Props = CommonProps & (SingleProps | MultiProps);

/**
 * List-style friend picker — a button that opens an inline panel with
 * a search input and a scrollable, checkbox / radio-style list. Built
 * for the case where the user might have hundreds of friends, so a
 * row of pill chips would not scale.
 *
 * `multi=false` returns a single id (radio-style); `multi=true` returns
 * an array of ids (checkbox-style).
 */
export function FriendsPicker(props: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when tapping outside.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? props.options.filter((o) => o.label.toLowerCase().includes(q))
    : props.options;

  const selectedSummary = (() => {
    if (props.multi) {
      const labels = props.options
        .filter((o) => props.value.includes(o.id))
        .map((o) => o.label);
      if (labels.length === 0) return props.placeholder ?? 'בחר…';
      if (labels.length <= 2) return labels.join(' · ');
      return `${labels.slice(0, 2).join(' · ')} +${labels.length - 2}`;
    }
    const label = props.options.find((o) => o.id === props.value)?.label;
    return label ?? props.placeholder ?? 'בחר…';
  })();

  const onSelect = (id: string) => {
    if (props.multi) {
      const next = props.value.includes(id)
        ? props.value.filter((x) => x !== id)
        : [...props.value, id];
      props.onChange(next);
    } else {
      props.onChange(id);
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx('relative flex flex-col', props.className)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex h-10 items-center justify-between gap-sm rounded-full',
          'border border-cocoa-15 bg-ivory px-md text-body text-cocoa',
          'focus:border-copper focus:outline-none active:bg-cocoa-8',
        )}
      >
        <span className="truncate text-start">{selectedSummary}</span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 text-cocoa-55 transition-transform duration-200 ease-out-quart',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-[calc(100%+4px)] z-30 flex max-h-72 flex-col gap-1 overflow-hidden rounded-md border border-rope bg-ivory p-sm"
          style={{ boxShadow: '0 10px 30px -10px rgba(53, 40, 24, 0.30)' }}
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute end-sm top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-55"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש חבר…"
              autoComplete="off"
              dir="rtl"
              className="h-11 w-full rounded-full border border-cocoa-15 bg-sand pe-lg ps-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
            />
          </div>
          <div className="flex flex-col overflow-y-auto">
            {filtered.length === 0 && (
              <span className="px-sm py-2 text-small text-cocoa-55">
                אין חברים תואמים
              </span>
            )}
            {filtered.map((opt) => {
              const checked = props.multi
                ? props.value.includes(opt.id)
                : props.value === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelect(opt.id)}
                  className={clsx(
                    'flex items-center justify-between gap-sm rounded-md px-sm py-2 text-start',
                    'active:bg-cocoa-08',
                    checked && 'bg-cocoa-08',
                  )}
                >
                  <span className="text-body text-cocoa">{opt.label}</span>
                  <span
                    className={clsx(
                      'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      checked
                        ? 'border-copper bg-copper'
                        : 'border-cocoa-30 bg-ivory',
                    )}
                    aria-hidden
                  >
                    {checked && (
                      <span
                        className="h-2 w-2 rounded-full bg-ivory"
                        aria-hidden
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {props.multi && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-cocoa text-body font-medium text-ivory active:bg-cocoa-70"
            >
              סיום
            </button>
          )}
        </div>
      )}
    </div>
  );
}
