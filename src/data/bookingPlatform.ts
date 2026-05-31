import {
  siBookingdotcom,
  siExpedia,
  siGooglemaps,
  siTripdotcom,
  type SimpleIcon,
} from 'simple-icons';
import type { TransportOffer } from './mockTransport';

/**
 * The booking platform an offer routes to — the "where do I book this"
 * answer, à la Polarsteps' Booking.com / Airbnb / Hostelworld rows. The
 * operator (airline / rail brand) is who *carries* you; the platform is
 * the site you *book* on. Each offer is assigned a platform deterministically
 * from its id so the choice is stable across renders.
 *
 * Brand hexes are data (not Tailwind tokens) and only ever flow into an
 * inline `<svg fill>` — same carve-out the Mapbox heatmap colours use.
 */

export type BookingPlatform = {
  /** Display name, e.g. "Booking.com". */
  name: string;
  /** Hex with leading `#`, ready for an inline `fill`. */
  hex: string;
  /** simple-icons SVG path `d`. */
  path: string;
  /** Verb shown on the CTA — "Book on" for sellers, "Open in" for maps. */
  verb: string;
};

function toPlatform(icon: SimpleIcon, name: string, verb = 'Book on'): BookingPlatform {
  return { name, hex: `#${icon.hex}`, path: icon.path, verb };
}

const EXPEDIA = toPlatform(siExpedia, 'Expedia');
const TRIP = toPlatform(siTripdotcom, 'Trip.com');
const BOOKING = toPlatform(siBookingdotcom, 'Booking.com');
const GOOGLE_MAPS = toPlatform(siGooglemaps, 'Google Maps', 'Open in');

/** Per-mode platform pools. Flights spread across the three OTAs; rail and
 * ground default to the sellers that actually list them; self-drive points
 * at Maps for directions rather than a booking. */
const POOLS: Record<TransportOffer['mode'], BookingPlatform[]> = {
  flight: [EXPEDIA, TRIP, BOOKING],
  train: [TRIP, EXPEDIA],
  bus: [BOOKING, EXPEDIA],
  ferry: [BOOKING, EXPEDIA],
  transfer: [BOOKING, EXPEDIA],
  drive: [GOOGLE_MAPS],
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

export function bookingPlatformForOffer(offer: TransportOffer): BookingPlatform {
  const pool = POOLS[offer.mode] ?? POOLS.flight;
  return pool[hashString(offer.id) % pool.length];
}
