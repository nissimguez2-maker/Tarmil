import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  PartyPopper,
  Mountain,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Forum } from '../../data/forums';
import type { ForumSubject } from '../../data/forumThreads';
import { SUBJECT_LABEL } from '../../data/forums';
import { Button } from '../Button';

const SUBJECT_ICON: Record<ForumSubject, LucideIcon> = {
  kosher_chabad: Sparkles,
  parties: PartyPopper,
  treks_activities: Mountain,
  restaurants: UtensilsCrossed,
  meetups: Users,
};

type CityForumGroupProps = {
  cityLabel: string;
  /** All forums for this city, one per subject, in seed order. */
  forums: Forum[];
  /** Preview title — last-thread title per forum id. */
  previewByForumId: Map<string, string>;
};

/**
 * Joined-city group. Header is the city name; body is a sand card with
 * stacked subject pills. Each pill is a (city × subject) focused forum
 * per brief §04 — "city → subject: each city has a forum with 5–6
 * subjects".
 */
export function CityForumGroup({
  cityLabel,
  forums,
  previewByForumId,
}: CityForumGroupProps) {
  return (
    <section className="flex flex-col gap-xs">
      <h3 className="font-serif text-lede italic leading-tight text-cocoa">
        {cityLabel}
      </h3>
      <ul className="flex flex-col gap-xs rounded-2xl bg-sand p-2 shadow-card">
        {forums.map((f) => (
          <li key={f.id}>
            <SubjectPill
              forum={f}
              previewTitle={previewByForumId.get(f.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

type SubjectPillProps = {
  forum: Forum;
  previewTitle?: string;
};

function SubjectPill({ forum, previewTitle }: SubjectPillProps) {
  const Icon = forum.subject ? SUBJECT_ICON[forum.subject] : Users;
  const label = forum.subject ? SUBJECT_LABEL[forum.subject] : forum.nameEn;
  return (
    <Link
      to={`/forums/${forum.id}`}
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
