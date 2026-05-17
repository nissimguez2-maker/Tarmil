import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Star, Navigation, MapPin, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { Dunes } from '../../components/Dunes';
import { Avatar } from '../../components/shared/Avatar';
import { StarRow } from '../../components/tools/StarRow';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import type { FriendVisit, PlaceCategory, Season } from '../../data/places';
import { MapsActionSheet } from './MapsActionSheet';

/**
 * Place detail — the drill-down view for a single place from the Trip map.
 * Looks up across both Rio and global places by id.
 */
export function PlaceScreen() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, submitPlaceReview, togglePlaceSave } =
    useSupabaseData();
  const navigate = useNavigate();
  const [mapsOpen, setMapsOpen] = useState(false);
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const place = id ? data.places.find((p) => p.id === id) : undefined;

  if (!place) {
    return <Navigate to="/trip" replace />;
  }

  const visits = place.friendVisits ?? [];
  const placeReviews = data.placeReviews.filter((r) => r.placeId === place.id);
  const friendReviews = placeReviews.filter(
    (r) => r.reviewerFriendId !== null,
  );
  const selfReview = placeReviews.find((r) => r.reviewerFriendId === null);
  const saved = data.placeSaves.some(
    (s) => s.placeId === place.id && s.friendId === null,
  );

  return (
    <Screen>
      <TopBar
        back
        title={place.englishName}
        eyebrow={categoryLabel(place.category)}
        end={
          <button
            type="button"
            aria-pressed={saved}
            aria-label={
              saved
                ? `Remove ${place.englishName} from your Plan`
                : `Save ${place.englishName} to your Plan`
            }
            onClick={() =>
              togglePlaceSave(place.id).catch((e) =>
                console.error('Failed to toggle save:', e),
              )
            }
            className={clsx(
              'inline-flex h-9 w-9 items-center justify-center rounded-full',
              'transition-[transform,background-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
              'active:scale-[0.94]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
              saved
                ? 'bg-copper text-ivory shadow-card hover:bg-copper-85'
                : 'text-cocoa-55 hover:bg-cocoa-8 hover:text-cocoa active:bg-cocoa-15',
            )}
          >
            <Bookmark
              className={clsx('h-4 w-4', saved && 'fill-current')}
              strokeWidth={saved ? 0 : 1.8}
              aria-hidden
            />
          </button>
        }
      />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <div className="flex flex-col gap-sm rounded-2xl bg-sand shadow-card p-md">
          <div className="flex items-baseline justify-between gap-sm">
            <h1 className="font-serif text-sub leading-tight text-cocoa">
              {place.englishName}
            </h1>
            {place.tarmilPick && (
              <span className="meta-caps shrink-0 text-copper">Tarmil pick</span>
            )}
          </div>

          <div className="mt-xs flex items-center gap-md">
            <span className="inline-flex items-center gap-1 text-body text-cocoa">
              <Star
                className="h-4 w-4 fill-copper text-copper"
                strokeWidth={0}
                aria-hidden
              />
              <span className="tnum font-medium">{place.rating.toFixed(1)}</span>
              <span className="text-cocoa-55">· Tarmil</span>
            </span>
            <span className="inline-flex items-center gap-1 text-body text-cocoa-70">
              <Star
                className="h-4 w-4 fill-cocoa-30 text-cocoa-30"
                strokeWidth={0}
                aria-hidden
              />
              <span className="tnum">4.5</span>
              <span className="text-cocoa-55">· Google</span>
            </span>
          </div>
        </div>

        <SectionLabel number="01" label="What this place is." />
        <p className="max-w-body text-body text-cocoa">
          {place.englishDescription}
        </p>

        <SectionLabel number="02" label="Friends who know this place." />
        {visits.length > 0 ? (
          <FriendVisitsList visits={visits} totalKnown={place.friendsKnow} />
        ) : place.friendsKnow > 0 ? (
          <div className="flex items-center gap-sm">
            <FriendDots count={Math.min(place.friendsKnow, 5)} />
            <span className="text-body text-cocoa-70">
              <span className="tnum font-medium text-cocoa">
                {place.friendsKnow}
              </span>{' '}
              of your friends have been here
            </span>
          </div>
        ) : (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
            None of your friends have been here yet.
          </p>
        )}
        {visits.length > 0 && (
          <p className="text-small text-cocoa-55">
            Tarmil shows friend visits at season + year resolution only — never
            exact dates.
          </p>
        )}

        <SectionLabel number="03" label="Friend ratings." />
        <FriendRatings
          friendReviews={friendReviews}
          friends={data.friendOverlaps}
        />

        <SectionLabel number="04" label="Your rating." />
        <div className="flex items-center justify-between gap-sm rounded-2xl bg-sand shadow-card px-md py-sm">
          <span className="text-body text-cocoa">
            {selfReview
              ? 'You rated this place. Tap a star to change it.'
              : 'Tap a star to rate.'}
          </span>
          <StarRow
            rating={selfReview?.rating ?? 0}
            size={20}
            interactive
            onPick={(r) => {
              submitPlaceReview(place.id, r).catch((e) =>
                console.error('Failed to submit review:', e),
              );
            }}
          />
        </div>

        <SectionLabel number="05" label="Reviews from Israeli travelers." />
        <div className="flex flex-col gap-sm">
          <ReviewCard
            reviewer="Yoni A."
            stars={5}
            text="Came here at sunset, ran into other Israelis, can't beat it."
          />
          <ReviewCard
            reviewer="Shira B."
            stars={4}
            text="Worth the trip. Block out time, easy to combine a few things in one day."
          />
        </div>

        <Button
          variant="accent"
          fullWidth
          aria-expanded={mapsOpen}
          onClick={() => setMapsOpen((o) => !o)}
        >
          <Navigation className="h-4 w-4" aria-hidden />
          Get directions
        </Button>

        <MapsActionSheet
          open={mapsOpen}
          place={place}
          onClose={() => setMapsOpen(false)}
        />

        <Button
          variant="ghost"
          fullWidth
          onClick={() => navigate('/trip')}
        >
          <MapPin className="h-4 w-4" aria-hidden />
          Back to map
        </Button>
      </div>

      <div className="mt-xl h-[64px] w-full">
        <Dunes />
      </div>
    </Screen>
  );
}

function FriendDots({ count }: { count: number }) {
  return (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="-me-2 inline-block h-7 w-7 rounded-full border-2 border-ivory bg-cocoa"
          style={{ zIndex: count - i }}
          aria-hidden
        />
      ))}
    </div>
  );
}

const SEASON_HE: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

function FriendVisitsList({
  visits,
  totalKnown,
}: {
  visits: FriendVisit[];
  totalKnown: number;
}) {
  const additional = Math.max(totalKnown - visits.length, 0);
  return (
    <div className="flex flex-col gap-sm">
      <ul className="flex flex-col">
        {visits.map((v, i) => (
          <li
            key={`${v.friendName}-${v.year}-${v.season}-${i}`}
            className={clsx(
              'flex items-center gap-md py-2',
              i < visits.length - 1 && 'border-b border-cocoa-15',
            )}
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cocoa font-serif text-body text-ivory"
              aria-hidden
            >
              {v.friendInitial}
            </span>
            <span className="flex flex-col">
              <span className="text-body text-cocoa">{v.friendName}</span>
              <span className="text-small text-cocoa-55">
                {SEASON_HE[v.season]}{' '}
                <span className="tnum">{v.year}</span> · {v.durationLabel}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {additional > 0 && (
        <span className="text-small text-cocoa-55">
          And <span className="tnum">{additional}</span> more friends have been here.
        </span>
      )}
    </div>
  );
}

function ReviewCard({
  reviewer,
  stars,
  text,
}: {
  reviewer: string;
  stars: number;
  text: string;
}) {
  return (
    <article className="flex flex-col gap-xs rounded-2xl bg-sand shadow-card p-md">
      <div className="flex items-center justify-between gap-sm">
        <span className="text-small font-medium text-cocoa">{reviewer}</span>
        <span aria-label={`${stars} stars`} className="flex shrink-0 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < stars
                  ? 'h-3 w-3 fill-copper text-copper'
                  : 'h-3 w-3 fill-cocoa-15 text-cocoa-15'
              }
              strokeWidth={0}
              aria-hidden
            />
          ))}
        </span>
      </div>
      <p className="text-body leading-relaxed text-cocoa-70 allow-select">
        {text}
      </p>
    </article>
  );
}

function FriendRatings({
  friendReviews,
  friends,
}: {
  friendReviews: import('../../data/placeReviews').PlaceReview[];
  friends: import('../../data/myTrip').FriendOverlap[];
}) {
  if (friendReviews.length === 0) {
    return (
      <p className="text-body text-cocoa-55">
        None of your friends have rated this place yet.
      </p>
    );
  }
  return (
    <ul className="flex flex-col">
      {friendReviews.map((r, i) => {
        const friend = friends.find((f) => f.id === r.reviewerFriendId);
        return (
          <li
            key={`${r.placeId}-${r.reviewerFriendId}-${i}`}
            className={clsx(
              'flex items-center justify-between gap-md py-2',
              i < friendReviews.length - 1 && 'border-b border-cocoa-15',
            )}
          >
            <span className="flex items-center gap-sm">
              <Avatar
                photoUrl={friend?.photoUrl}
                initial={friend?.friendInitial ?? '·'}
                name={friend?.friendName ?? 'Friend'}
                size="sm"
              />
              <span className="text-body text-cocoa">
                {friend?.friendName ?? 'Friend'}
              </span>
            </span>
            <StarRow rating={r.rating} size={14} />
          </li>
        );
      })}
    </ul>
  );
}

function categoryLabel(c: PlaceCategory): string {
  switch (c) {
    case 'beach':
      return 'Beach';
    case 'hostel':
      return 'Hostel';
    case 'cafe':
      return 'Café';
    case 'restaurant':
      return 'Restaurant';
    case 'bar':
      return 'Bar';
    case 'club':
      return 'Club';
    case 'chabad':
      return 'Chabad';
    case 'kosher':
      return 'Kosher';
    case 'landmark':
      return 'Landmark';
    default:
      return '';
  }
}
