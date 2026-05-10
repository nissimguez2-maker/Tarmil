import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Star, Navigation, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { Dunes } from '../../components/Dunes';
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
  const { data, loading, error } = useSupabaseData();
  const navigate = useNavigate();
  const [mapsOpen, setMapsOpen] = useState(false);
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const place = id ? data.places.find((p) => p.id === id) : undefined;

  if (!place) {
    return <Navigate to="/trip" replace />;
  }

  const visits = place.friendVisits ?? [];

  return (
    <Screen>
      <TopBar
        back
        title={place.hebrewName}
        eyebrow={categoryLabel(place.category)}
      />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
          <div className="flex items-baseline justify-between gap-sm">
            <h1 className="font-serif text-sub leading-tight">{place.hebrewName}</h1>
            {place.tarmilPick && (
              <span className="meta-caps text-copper">בחירת תרמיל</span>
            )}
          </div>

          <span className="text-[10pt] text-cocoa-55 ltr">
            {place.englishName}
          </span>

          <div className="mt-xs flex items-center gap-md">
            <span className="inline-flex items-center gap-1 text-body text-cocoa">
              <Star
                className="h-4 w-4 fill-copper text-copper"
                strokeWidth={0}
                aria-hidden
              />
              <span className="tnum font-medium">{place.rating.toFixed(1)}</span>
              <span className="text-cocoa-55">· תרמיל</span>
            </span>
            <span className="inline-flex items-center gap-1 text-body text-cocoa-70">
              <Star
                className="h-4 w-4 fill-cocoa-30 text-cocoa-30"
                strokeWidth={0}
                aria-hidden
              />
              <span className="tnum">4.5</span>
              <span className="text-cocoa-55">· גוגל</span>
            </span>
          </div>
        </div>

        <SectionLabel number="01" label="What this place is." />
        <p className="max-w-body text-body text-cocoa">
          {place.hebrewDescription}
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
              חברים שלך היו כאן
            </span>
          </div>
        ) : (
          <p className="text-body text-cocoa-55">
            עדיין אף חבר שלך לא היה כאן.
          </p>
        )}
        {visits.length > 0 && (
          <p className="text-[9pt] text-cocoa-55">
            תרמיל מציג ביקורי חברים ברמת עונה ושנה בלבד — לא תאריכים מדויקים.
          </p>
        )}

        <SectionLabel number="03" label="Reviews from Israeli travelers." />
        <div className="flex flex-col gap-sm">
          <ReviewCard
            reviewer="יוני א."
            stars={5}
            text="היינו כאן בשקיעה, פגשנו ישראלים אחרים, הכי טוב שיש."
          />
          <ReviewCard
            reviewer="שירה ב."
            stars={4}
            text="שווה את ההגעה. תכננו זמן, קל לרכז כמה דברים באותו יום."
          />
        </div>

        <Button
          variant="accent"
          fullWidth
          aria-expanded={mapsOpen}
          onClick={() => setMapsOpen((o) => !o)}
        >
          <Navigation className="h-4 w-4" aria-hidden />
          קבל הוראות הגעה
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
          חזרה למפה
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
  spring: 'אביב',
  summer: 'קיץ',
  autumn: 'סתיו',
  winter: 'חורף',
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
              <span className="text-[10pt] text-cocoa-55">
                {SEASON_HE[v.season]}{' '}
                <span className="tnum">{v.year}</span> · {v.durationLabel}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {additional > 0 && (
        <span className="text-[10pt] text-cocoa-55">
          ועוד <span className="tnum">{additional}</span> חברים שלך היו כאן.
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
    <article className="flex flex-col gap-1.5 rounded-sm border border-cocoa-15 bg-sand p-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10pt] font-medium text-cocoa">{reviewer}</span>
        <span aria-label={`${stars} כוכבים`} className="flex gap-0.5">
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
      <p className="text-[11pt] leading-relaxed text-cocoa-70 allow-select">
        {text}
      </p>
    </article>
  );
}

function categoryLabel(c: PlaceCategory): string {
  switch (c) {
    case 'beach':
      return 'חוף';
    case 'hostel':
      return 'הוסטל';
    case 'cafe':
      return 'קפה';
    case 'restaurant':
      return 'מסעדה';
    case 'bar':
      return 'בר';
    case 'club':
      return 'מועדון';
    case 'chabad':
      return 'חב״ד';
    case 'kosher':
      return 'כשר';
    case 'landmark':
      return 'נקודת ציון';
    default:
      return '';
  }
}
