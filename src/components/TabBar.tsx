import { NavLink } from 'react-router-dom';
import { Map, Users, MessagesSquare, Wrench, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Tab = {
  to: string;
  label: string;
  Icon: LucideIcon;
};

/**
 * Floating dark tab capsule — the signature premium-app move.
 *
 * Tab order: Trip → Friends → Forums → Tools → Profile (left to right).
 * The capsule floats above the page (8mm above the safe-area bottom), sits
 * on the cocoa fill with ivory icons, and lifts the active tab into a
 * copper-filled inner pill. No edge-to-edge bar, no hard top border.
 */
const TABS: Tab[] = [
  { to: '/trip', label: 'Trip', Icon: Map },
  { to: '/friends', label: 'Friends', Icon: Users },
  { to: '/forums', label: 'Forums', Icon: MessagesSquare },
  { to: '/tools', label: 'Tools', Icon: Wrench },
  { to: '/profile', label: 'Profile', Icon: User },
];

export function TabBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[900] flex justify-center px-md"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)' }}
    >
      <nav
        aria-label="Main navigation"
        className={clsx(
          'pointer-events-auto relative isolate grid w-full max-w-[360px] grid-cols-5',
          'rounded-full bg-cocoa shadow-fab',
        )}
      >
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              clsx(
                'group relative flex h-14 flex-col items-center justify-center gap-0.5',
                'transition-[transform,color] duration-instant ease-out-quart',
                'active:scale-[0.94]',
                'focus-visible:outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa',
                isActive
                  ? 'text-ivory'
                  : 'text-ivory/45 hover:text-ivory/75',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 inset-y-1.5 -z-10 rounded-full bg-copper"
                  />
                )}
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.2 : 1.7}
                  aria-hidden
                />
                <span
                  className={clsx(
                    'text-[9pt] leading-none',
                    isActive ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
