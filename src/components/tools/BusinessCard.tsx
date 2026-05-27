import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ExternalLink, ChevronRight, Star, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { Place } from '../../data/places';
import type { FriendOverlap } from '../../data/myTrip';
import type { PlaceReview } from '../../data/placeReviews';
import type { PlaceSaveStatus } from '../../data/placeSaves';
import { FriendRatingsRow } from './FriendRatingsRow';
import { cityPhotos } from '../../screens/web/cityPhotos';

type Props = {
  place: Place;
  reviews: PlaceReview[];
  friends: FriendOverlap[];
  /**
   * Optional city tag rendered next to the category — useful in search
   * results, where the user is scanning across multiple destinations.
   * Omit on the trip + now lists where the city is already obvious.
   */
  cityLabel?: string;
  /** Whether this place is already in the user's Plan. Drives the Star fill. */
  saved?: boolean;
  /** Tap → togglePlaceSave. Omit to render the card without a star. */
  onToggleSave?: () => void;
  /**
   * Save status badge — only meaningful on the Plan tab. Shows
   * "Reserved" / "Wishlist" / "Visited" next to the category. The
   * Discover modal omits this; the card is the same place at a different
   * moment in the funnel.
   */
  statusBadge?: PlaceSaveStatus;
};

const STATUS_LABEL: Record<PlaceSaveStatus, string> = {
  reserved: 'Reserved',
  wishlist: 'Wishlist',
  visited: 'Visited',
};

const CATEGORY_LABEL: Record<string, string> = {
  beach: 'Beach',
  hostel: 'Hostel',
  cafe: 'Café',
  restaurant: 'Restaurant',
  bar: 'Bar',
  club: 'Club',
  chabad: 'Chabad',
  kosher: 'Kosher',
  synagogue: 'Synagogue',
  mikveh: 'Mikveh',
  landmark: 'Landmark',
};

/**
 * Discover list card for one curated venue. Hero image, name, category,
 * friend-rating row, primary CTA — Reserve / Contact / Open — inferred
 * from `reservation_url`. A bookmark icon on the hero lets the user
 * star the place into Plan.
 *
 * Tap area outside the bookmark and the CTA drills into the existing
 * `/place/:id` route.
 */
export function BusinessCard({
  place,
  reviews,
  friends,
  cityLabel,
  saved,
  onToggleSave,
  statusBadge,
}: Props) {
  const placeReviews = reviews.filter((r) => r.placeId === place.id);
  const ctaKind = inferCtaKind(place.reservationUrl);
  const category = CATEGORY_LABEL[place.category] ?? place.category;

  return (
    <article className="relative overflow-hidden rounded-2xl bg-sand shadow-card">
      {statusBadge && <StatusPill status={statusBadge} />}
      {onToggleSave && (
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={!!saved}
          aria-label={saved ? `Remove ${place.englishName} from your Plan` : `Save ${place.englishName} to your Plan`}
          className={clsx(
            'absolute end-sm top-sm z-10 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur',
            'transition-[transform,background-color,color] duration-instant ease-out-quart',
            'active:scale-[0.92]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-sand',
            saved
              ? 'bg-amber text-cream shadow-card hover:bg-amber-85'
              : 'bg-cream/90 text-charcoal shadow-card hover:bg-cream',
          )}
        >
          <Bookmark
            className={clsx('h-4 w-4', saved && 'fill-current')}
            strokeWidth={saved ? 0 : 1.8}
            aria-hidden
          />
        </button>
      )}

      <Link
        to={`/place/${place.id}`}
        className="block transition-colors duration-instant ease-out-quart motion-reduce:transition-none hover:bg-sand/80 active:bg-clay/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <Hero place={place} />
        <div className="flex items-start gap-sm p-md">
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="meta-caps text-amber">
              {category}
              {cityLabel && (
                <>
                  <span aria-hidden className="px-1 text-charcoal-30">·</span>
                  <span className="text-charcoal-55">{cityLabel}</span>
                </>
              )}
            </span>
            <h3 className="font-serif text-lede leading-tight text-charcoal">
              {place.englishName}
            </h3>
            <p className="line-clamp-2 text-small text-charcoal-70">
              {place.englishDescription}
            </p>
            <FriendRatingsRow
              reviews={placeReviews}
              friends={friends}
              className="mt-1"
            />
          </div>
          <ChevronRight
            className="mt-1 h-5 w-5 shrink-0 text-charcoal-30"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </Link>
      {place.reservationUrl && (
        <div className="border-t border-charcoal-08 p-sm pt-2">
          <a
            href={place.reservationUrl}
            target={ctaKind === 'external' ? '_blank' : undefined}
            rel={ctaKind === 'external' ? 'noopener noreferrer' : undefined}
            className={clsx(
              'inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-md py-2 text-body font-medium text-cream shadow-card',
              'transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
              'hover:bg-charcoal-70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-sand',
            )}
          >
            {ctaKind === 'tel' && <Phone className="h-4 w-4" aria-hidden />}
            {ctaKind === 'whatsapp' && (
              <MessageCircle className="h-4 w-4" aria-hidden />
            )}
            {ctaKind === 'external' && (
              <ExternalLink className="h-4 w-4" aria-hidden />
            )}
            {ctaKind === 'tel' && 'Call'}
            {ctaKind === 'whatsapp' && 'WhatsApp'}
            {ctaKind === 'external' && 'Reserve'}
          </a>
        </div>
      )}
    </article>
  );
}

function inferCtaKind(url?: string): 'tel' | 'whatsapp' | 'external' {
  if (!url) return 'external';
  if (url.startsWith('tel:')) return 'tel';
  if (url.includes('wa.me') || url.startsWith('https://api.whatsapp.com')) {
    return 'whatsapp';
  }
  return 'external';
}

function StatusPill({ status }: { status: PlaceSaveStatus }) {
  return (
    <span
      className={clsx(
        'absolute start-sm top-sm z-10 inline-flex items-center gap-1 rounded-full px-2 py-1',
        'text-meta font-semibold uppercase tracking-[0.12em] leading-none',
        'shadow-card backdrop-blur',
        status === 'reserved' && 'bg-amber text-cream',
        status === 'wishlist' && 'bg-cream/95 text-amber',
        status === 'visited' && 'bg-charcoal/85 text-cream',
      )}
      aria-label={`Status: ${STATUS_LABEL[status]}`}
    >
      <span
        aria-hidden
        className={clsx(
          'inline-block h-1.5 w-1.5 rounded-full',
          status === 'reserved' && 'bg-cream',
          status === 'wishlist' && 'bg-amber',
          status === 'visited' && 'bg-cream',
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

function Hero({ place }: { place: Place }) {
  const [ok, setOk] = useState(true);
  const photo = place.imageUrl ?? cityPhotos(place.destinationId)[0];
  return (
    <div aria-hidden className="h-32 w-full bg-gradient-to-br from-sand to-clay">
      {photo && ok && (
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

// Star is imported but unused if the bookmark wins; keep available for callers
// who still want a star-shaped affordance.
export { Star };
