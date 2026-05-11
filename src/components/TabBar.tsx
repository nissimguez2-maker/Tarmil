import { NavLink } from 'react-router-dom';
import { Map, Newspaper, MessageSquare, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Tab = {
  to: string;
  label: string;
  Icon: LucideIcon;
};

/**
 * Tab order in source = Trip → Activity → Messages → Profile.
 * Because <html dir="rtl">, this renders visually right-to-left:
 * Trip is rightmost (Hebrew "first"), Profile leftmost.
 *
 * Friends moved under /profile/friends as a Profile drill-down per the Figma
 * structure. Tools live in a slide-in panel triggered by the wrench in <TopBar>.
 */
const TABS: Tab[] = [
  { to: '/trip', label: 'טיול', Icon: Map },
  { to: '/activity', label: 'פעילות', Icon: Newspaper },
  { to: '/messages', label: 'הודעות', Icon: MessageSquare },
  { to: '/profile', label: 'פרופיל', Icon: User },
];

export function TabBar() {
  return (
    <nav
      aria-label="ניווט ראשי"
      className={clsx(
        'relative z-10 grid grid-cols-4 border-t border-cocoa-15 bg-ivory',
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
              'text-cocoa-55 transition-colors',
              isActive && 'text-copper',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2 : 1.5}
                aria-hidden
              />
              <span className="text-[9pt] font-medium">{label}</span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-0 h-[2px] w-10 rounded-b-full bg-copper"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
