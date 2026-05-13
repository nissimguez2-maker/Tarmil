import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Forum } from '../../data/forums';
import { Button } from '../Button';

type Props = {
  forum: Forum;
  /** Recent thread title to show as a preview line. */
  previewTitle?: string;
  /** When true, render a "הצטרף" CTA instead of the chevron. */
  recommended?: boolean;
  onJoin?: () => void;
};

/**
 * Row in the Forums list. Tap drills into /messages/forums/:slug. When the
 * forum is recommended (not yet joined), the chevron is replaced by a copper
 * accent "Join" button that calls `onJoin` and stops navigation.
 *
 * Chevron points left visually because in RTL the "forward into a detail"
 * direction is the start side, which is right — so the chevron points away
 * from the start side. Lucide's ChevronLeft is correct here.
 */
export function ForumRow({ forum, previewTitle, recommended, onJoin }: Props) {
  const body = (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-serif text-lede italic text-cocoa">
            {forum.nameHe}
          </span>
          <span className="text-small text-cocoa-55">
            <span className="tnum">{forum.memberCount}</span> members
          </span>
        </div>
        <span className="line-clamp-1 text-small text-cocoa-70">
          {previewTitle ?? forum.heroBlurbHe}
        </span>
      </div>
      {recommended ? (
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
      ) : (
        <ChevronLeft
          className="h-5 w-5 shrink-0 text-cocoa-55"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
    </>
  );

  return (
    <Link
      to={`/messages/forums/${forum.id}`}
      className="flex items-center gap-sm rounded-2xl bg-ivory shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/40 active:bg-sand/60"
    >
      {body}
    </Link>
  );
}
