import { NavLink } from 'react-router-dom';
import { Map, BookmarkCheck, Newspaper, MessagesSquare, Wrench } from 'lucide-react';
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
 * Tab order: Trip → Plan → Activity → Forums → Tools (left to right).
 *
 * v0.8 IA: Around dissolves; its discovery surface lives inside Plan as
 * a "+ Discover" modal. Each tab owns one mental model:
 *   Trip     — visual / macro: where you are, were, will be (the map)
 *   Plan     — micro / list: saved places organised by trip
 *   Activity — social feed (friends posting)
 *   Forums   — stranger Q&A by city × subject
 *   Tools    — open-use-close utilities
 *
 * The Trip and Plan tabs are two views of the same trip data — one
 * spatial, one organisational. They share an underlying set of saves +
 * planned stops, and only differ in how they present them.
 */
const TABS: Tab[] = [
  { to: '/trip', label: 'Trip', Icon: Map },
  { to: '/plan', label: 'Plan', Icon: BookmarkCheck },
  { to: '/activity', label: 'Activity', Icon: Newspaper },
  { to: '/forums', label: 'Forums', Icon: MessagesSquare },
  { to: '/tools', label: 'Tools', Icon: Wrench },
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
          'rounded-full bg-charcoal shadow-fab',
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
                'transition-[transform,color] duration-instant ease-out-quart motion-reduce:transition-none',
                'active:scale-[0.94]',
                'focus-visible:outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal',
                isActive
                  ? 'text-cream'
                  : 'text-cream/45 hover:text-cream/75',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 inset-y-1.5 -z-10 rounded-full bg-amber"
                  />
                )}
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.2 : 1.7}
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
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
