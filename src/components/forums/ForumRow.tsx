import { useId } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  BedDouble,
  Bus,
  ShieldAlert,
  UtensilsCrossed,
  Mountain,
  PartyPopper,
  CreditCard,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import type { Forum } from '../../data/forums';
import type { ForumSubject } from '../../data/forumThreads';
import { SUBJECT_LABEL } from '../../data/forums';
import { Button } from '../Button';

const SUBJECT_ICON: Record<ForumSubject, LucideIcon> = {
  accommodation: BedDouble,
  transits: Bus,
  scams_danger: ShieldAlert,
  food: UtensilsCrossed,
  activities_treks: Mountain,
  nightlife_parties: PartyPopper,
  money_visas: CreditCard,
  meetups: Users,
};

type CityForumGroupProps = {
  cityLabel: string;
  /** All forums for this city, one per subject, in seed order. */
  forums: Forum[];
  /** Preview title — last-thread title per forum id. */
  previewByForumId: Map<string, string>;
  /** Whether the body is open. Controlled by parent. */
  expanded: boolean;
  /** Toggle handler invoked when the header bar is tapped. */
  onToggle: () => void;
};

/**
 * Joined-city accordion group. Header is always visible — city name plus
 * a summary line (subject count, total members across the city). Body
 * (8 subject pills) renders only when expanded, animated via the modern
 * grid-rows 0fr→1fr pattern so we get a smooth open without measuring
 * heights.
 *
 * v0.6 collapsed-by-default behaviour replaces the always-expanded list
 * to cut the Forums-tab scroll length from ~32 pills down to 4 city
 * headers.
 */
export function CityForumGroup({
  cityLabel,
  forums,
  previewByForumId,
  expanded,
  onToggle,
}: CityForumGroupProps) {
  const bodyId = useId();
  const totalMembers = forums.reduce((acc, f) => acc + f.memberCount, 0);
  const subjectCount = forums.length;

  return (
    <section className="overflow-hidden rounded-2xl bg-sand shadow-card">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={onToggle}
        className={clsx(
          'flex w-full items-center gap-sm px-md py-sm text-start',
          'transition-colors duration-instant ease-out-quart',
          'hover:bg-sand/70 active:bg-rope/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="font-serif text-lede italic leading-tight text-cocoa">
            {cityLabel}
          </span>
          <span className="text-small text-cocoa-55">
            <span className="tnum">{subjectCount}</span> subjects ·{' '}
            <span className="tnum">{formatMembers(totalMembers)}</span> members
          </span>
        </div>
        <ChevronDown
          className={clsx(
            'h-5 w-5 shrink-0 text-cocoa-55',
            'transition-transform duration-instant ease-out-quart',
            expanded && 'rotate-180',
          )}
          strokeWidth={1.7}
          aria-hidden
        />
      </button>

      <div
        id={bodyId}
        aria-hidden={!expanded}
        className={clsx(
          'grid overflow-hidden transition-[grid-template-rows] duration-considered ease-out-quart',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-xs p-2 pt-0">
            {forums.map((f) => (
              <li key={f.id}>
                <SubjectPill
                  forum={f}
                  previewTitle={previewByForumId.get(f.id)}
                  tabbable={expanded}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type SubjectPillProps = {
  forum: Forum;
  previewTitle?: string;
  /** When false, the link is removed from the tab order — collapsed pills are not reachable by keyboard. */
  tabbable: boolean;
};

function SubjectPill({ forum, previewTitle, tabbable }: SubjectPillProps) {
  const Icon = forum.subject ? SUBJECT_ICON[forum.subject] : Users;
  const label = forum.subject ? SUBJECT_LABEL[forum.subject] : forum.nameEn;
  return (
    <Link
      to={`/forums/${forum.id}`}
      tabIndex={tabbable ? 0 : -1}
      className="flex items-center gap-sm rounded-xl bg-ivory px-md py-sm transition-colors duration-instant ease-out-quart hover:bg-sand active:bg-rope/50"
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cocoa text-ivory">
        <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-serif text-body italic leading-tight text-cocoa">
          {label}
        </span>
        {previewTitle && (
          <span className="line-clamp-1 text-small text-cocoa-70">
            {previewTitle}
          </span>
        )}
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-cocoa-55"
        strokeWidth={1.5}
        aria-hidden
      />
    </Link>
  );
}

type RecommendedForumRowProps = {
  forum: Forum;
  onJoin?: () => void;
};

/**
 * Recommended-for-you single forum row (e.g., Buenos Aires meetups before
 * the user joins). Bigger card layout so the discover slot reads as a
 * discrete CTA.
 */
export function RecommendedForumRow({ forum, onJoin }: RecommendedForumRowProps) {
  return (
    <Link
      to={`/forums/${forum.id}`}
      className="flex items-center gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/50"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-serif text-lede italic text-cocoa">
            {forum.cityLabel ?? forum.nameEn}
          </span>
          <span className="text-small text-cocoa-55">
            <span className="tnum">{forum.memberCount}</span> members
          </span>
        </div>
        <span className="line-clamp-1 text-small text-cocoa-70">
          {forum.heroBlurbHe}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onJoin?.();
        }}
      >
        Join
      </Button>
    </Link>
  );
}

function formatMembers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toString();
}
