import clsx from 'clsx';

export type SubNavItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  items: SubNavItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

/**
 * Equal-width segmented sub-navigation with a copper underline that slides
 * between segments on change. One positioned underline element, no Framer
 * Motion needed.
 *
 * The active underline is positioned via the CSS logical `inset-inline-start`
 * property so the slide direction inherits from `dir` automatically — `+i%`
 * moves toward the end in both LTR and RTL.
 */
export function SubNav<T extends string>({
  items,
  active,
  onChange,
  className,
}: Props<T>) {
  const activeIndex = Math.max(
    0,
    items.findIndex((t) => t.id === active),
  );
  return (
    <div
      className={clsx(
        'relative flex border-b border-cocoa-15 bg-ivory',
        className,
      )}
    >
      {items.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={clsx(
              'flex-1 py-3 text-center font-sans text-body',
              'transition-colors duration-instant ease-out-quart',
              'focus-visible:outline-none focus-visible:bg-cocoa-8',
              isActive
                ? 'font-medium text-cocoa'
                : 'text-cocoa-55 hover:text-cocoa-70',
            )}
            aria-pressed={isActive}
          >
            {t.label}
          </button>
        );
      })}
      <span
        aria-hidden
        className="absolute bottom-0 h-[2px] rounded-t-full bg-copper transition-[inset-inline-start] duration-considered ease-out-quart"
        style={{
          width: `${100 / items.length}%`,
          insetInlineStart: `${activeIndex * (100 / items.length)}%`,
        }}
      />
    </div>
  );
}
