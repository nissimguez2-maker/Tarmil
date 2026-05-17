import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { Place } from '../../data/places';
import type { FriendOverlap } from '../../data/myTrip';
import type { PlaceReview } from '../../data/placeReviews';
import { FriendRatingsRow } from './FriendRatingsRow';

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
  landmark: 'Landmark',
};

/**
 * Around list card for one curated venue. Hero image, name, category,
 * friend-rating row, primary CTA — Reserve / Contact / Open — inferred
 * from `reservation_url`. Tap area outside the CTA drills into the
 * existing `/place/:id` route.
 */
export function BusinessCard({
  place,
  reviews,
  friends,
  cityLabel,
}: Props) {
  const placeReviews = reviews.filter((r) => r.placeId === place.id);
  const ctaKind = inferCtaKind(place.reservationUrl);
  const category = CATEGORY_LABEL[place.category] ?? place.category;

  return (
    <article className="overflow-hidden rounded-2xl bg-sand shadow-card">
      <Link
        to={`/place/${place.id}`}
        className="block transition-colors duration-instant ease-out-quart motion-reduce:transition-none hover:bg-sand/80 active:bg-rope/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <Hero imageUrl={place.imageUrl} alt={place.englishName} />
        <div className="flex items-start gap-sm p-md">
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="meta-caps text-copper">
              {category}
              {cityLabel && (
                <>
                  <span aria-hidden className="px-1 text-cocoa-30">·</span>
                  <span className="text-cocoa-55">{cityLabel}</span>
                </>
              )}
            </span>
            <h3 className="font-serif text-lede italic leading-tight text-cocoa">
              {place.englishName}
            </h3>
            <p className="line-clamp-2 text-small text-cocoa-70">
              {place.englishDescription}
            </p>
            <FriendRatingsRow
              reviews={placeReviews}
              friends={friends}
              className="mt-1"
            />
          </div>
          <ChevronRight
            className="mt-1 h-5 w-5 shrink-0 text-cocoa-55"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </Link>
      {place.reservationUrl && (
        <div className="border-t border-cocoa-08 p-sm pt-2">
          <a
            href={place.reservationUrl}
            target={ctaKind === 'external' ? '_blank' : undefined}
            rel={ctaKind === 'external' ? 'noopener noreferrer' : undefined}
            className={clsx(
              'inline-flex w-full items-center justify-center gap-2 rounded-full bg-copper px-md py-2 text-body font-medium text-ivory shadow-card',
              'transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
              'hover:bg-copper-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-sand',
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

function Hero({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className="h-32 w-full object-cover"
        loading="lazy"
      />
    );
  }
  // Sand-to-rope gradient fallback so seeded entries without an image still
  // feel intentional rather than blank.
  return (
    <div
      aria-hidden
      className="h-32 w-full"
      style={{
        background:
          'linear-gradient(135deg, var(--sand) 0%, var(--rope) 100%)',
      }}
    />
  );
}
