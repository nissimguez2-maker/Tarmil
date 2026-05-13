import { NavLink } from 'react-router-dom';
import { Map, Newspaper, MessageSquare, Wrench, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Tab = {
  to: string;
  label: string;
  Icon: LucideIcon;
};

/**
 * Tab order in source = Trip → Activity → Messages → Tools → Profile.
 * Because <html dir="rtl">, this renders visually right-to-left:
 * Trip is rightmost (Hebrew "first"), Profile leftmost.
 *
 * Friends moved under /profile/friends as a Profile drill-down.
 */
const TABS: Tab[] = [
  { to: '/trip', label: 'טיול', Icon: Map },
  { to: '/activity', label: 'פעילות', Icon: Newspaper },
  { to: '/messages', label: 'הודעות', Icon: MessageSquare },
  { to: '/tools', label: 'כלים', Icon: Wrench },
  { to: '/profile', label: 'פרופיל', Icon: User },
];

export function TabBar() {
  return (
    <nav
      aria-label="ניווט ראשי"
      className={clsx(
        'relative z-10 grid grid-cols-5 border-t border-cocoa-08 bg-ivory/95 backdrop-blur',
      )}
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'relative flex flex-col items-center justify-center gap-1 py-3',
              'transition-colors duration-instant ease-out-quart',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory focus-visible:rounded-md',
              isActive ? 'text-copper' : 'text-cocoa-55 hover:text-cocoa-70',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={clsx(
                  'h-[22px] w-[22px] transition-transform duration-instant ease-out-quart',
                  isActive && 'scale-105',
                )}
                strokeWidth={isActive ? 2.2 : 1.6}
                aria-hidden
              />
              <span
                className={clsx(
                  'text-small leading-none',
                  isActive ? 'font-semibold' : 'font-medium',
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-0 h-[3px] w-8 rounded-b-full bg-copper"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
