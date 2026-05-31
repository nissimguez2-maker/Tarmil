import type { PlannedStop } from '../../data/plannedStops';
import { findStay, placesForStop, transitForLeg } from './wishlist';

/**
 * Trip-readiness model — the spine that aligns the two north-stars:
 * the user's goal (a complete itinerary) and the business goal (bookings).
 *
 * A trip is "ready" when every stop has a sorted stay and every leg has
 * transport. Saved places (things to do) are surfaced but not required —
 * they're discovery, not a monetizer gap. Each open item is a gap the user
 * can close (and, later, the AI layer can fill).
 *
 * Reads live wishlist state, so callers must subscribe via `useWishlist()`
 * to re-render on change.
 */

export type StopReadiness = {
  stopId: string;
  hasStay: boolean;
  savedCount: number;
};

/** A leg, identified by its endpoints (home is the literal id "home"). */
export type LegRef = { fromId: string; toId: string };

export type LegReadiness = LegRef & {
  hasTransport: boolean;
};

export type TripReadiness = {
  stopsTotal: number;
  staysSorted: number;
  legsTotal: number;
  legsBooked: number;
  /** Sorted items over total gap slots (stays + legs), 0–100, rounded. */
  pct: number;
  /** Stops still missing a stay. */
  openStays: string[];
  /** Legs still missing transport. */
  openLegs: LegRef[];
};

export function stopReadiness(stopId: string): StopReadiness {
  return {
    stopId,
    hasStay: !!findStay(stopId),
    savedCount: placesForStop(stopId).length,
  };
}

export function legReadiness(fromId: string, toId: string): LegReadiness {
  return {
    fromId,
    toId,
    hasTransport: transitForLeg(fromId, toId).length > 0,
  };
}

/**
 * Whole-trip readiness. `legs` is the ordered list of endpoint pairs the rail
 * draws: home → stop1 → … → stopN → home. Passed in so this stays agnostic to
 * how the caller models home.
 */
export function tripReadiness(
  stops: PlannedStop[],
  legs: LegRef[],
): TripReadiness {
  const openStays = stops
    .filter((s) => !findStay(s.id))
    .map((s) => s.id);
  const openLegs = legs.filter(
    (l) => transitForLeg(l.fromId, l.toId).length === 0,
  );

  const stopsTotal = stops.length;
  const legsTotal = legs.length;
  const staysSorted = stopsTotal - openStays.length;
  const legsBooked = legsTotal - openLegs.length;

  const slots = stopsTotal + legsTotal;
  const done = staysSorted + legsBooked;
  const pct = slots === 0 ? 0 : Math.round((done / slots) * 100);

  return {
    stopsTotal,
    staysSorted,
    legsTotal,
    legsBooked,
    pct,
    openStays,
    openLegs,
  };
}

/** Ordered endpoint pairs for a trip: home → stops → home. */
export function legsForTrip(stops: PlannedStop[]): LegRef[] {
  if (stops.length === 0) return [];
  const legs: LegRef[] = [{ fromId: 'home', toId: stops[0].id }];
  for (let i = 0; i < stops.length - 1; i++) {
    legs.push({ fromId: stops[i].id, toId: stops[i + 1].id });
  }
  legs.push({ fromId: stops[stops.length - 1].id, toId: 'home' });
  return legs;
}
