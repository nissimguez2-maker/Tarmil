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
 * 3-tab sub-navigation with a copper underline on the active tab. Used at the
 * top of MessagesScreen (Forums / Group chats / DMs).
 *
 * Animated by a single positioned underline that translates between tab
 * positions on change — gives the copper underline a fluid feel without
 * Framer Motion. Each tab is equal-width (flex-1) so the math stays trivial.
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
              'flex-1 py-3 text-center font-sans text-[11pt] transition-colors',
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
        className="absolute bottom-0 h-[2px] rounded-t-full bg-copper transition-transform duration-300 ease-out"
        style={{
          width: `${100 / items.length}%`,
          insetInlineStart: 0,
          transform: `translateX(${activeIndex * -100}%)`,
        }}
      />
    </div>
  );
}
