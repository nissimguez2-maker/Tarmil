import type { PlannedStop } from '../../data/plannedStops';
import type { HomeCity } from './homeCity';
import { generateLeg } from './transportGenerator';
import { legsForTrip, tripReadiness } from './readiness';
import { addStay, addTransit } from './wishlist';
import { showToast } from './WebToast';

/**
 * Cosmetic AI fill: closes every open gap (stays + transport) with the
 * recommended option, staggered ~110ms each so it reads as the assistant
 * doing the work in real time.
 *
 * The real AI layer plugs in here — replace the per-gap loop body with
 * model output. The staggered timing and the final toast stay.
 */
export function planRemainingGaps(
  stops: PlannedStop[],
  home: HomeCity,
): void {
  if (stops.length === 0) return;
  const hs = homeAsStop(home, stops[0].arrivalDate);
  const readiness = tripReadiness(stops, legsForTrip(stops));
  const stopFor = (id: string): PlannedStop | undefined =>
    id === 'home' ? hs : stops.find((s) => s.id === id);
  const total = readiness.openStays.length + readiness.openLegs.length;
  if (total === 0) return;
  let step = 0;
  readiness.openStays.forEach((stopId) => {
    setTimeout(() => addStay({ stopId }), step * 110);
    step++;
  });
  readiness.openLegs.forEach((leg) => {
    setTimeout(() => {
      const from = stopFor(leg.fromId);
      const to = stopFor(leg.toId);
      if (!from || !to) return;
      const generated = generateLeg(from, to, from.departureDate);
      const offer =
        generated.offers.find((o) => o.badge === 'recommended') ??
        generated.offers[0];
      if (offer) {
        addTransit({
          fromStopId: leg.fromId,
          toStopId: leg.toId,
          offer,
        });
      }
    }, step * 110);
    step++;
  });
  setTimeout(
    () => showToast(`Trip planned · ${total} gaps closed`),
    step * 110 + 220,
  );
}

function homeAsStop(home: HomeCity, dateIso: string): PlannedStop {
  return {
    id: 'home',
    nameEn: home.nameEn,
    nameHe: home.nameEn,
    type: 'city',
    lat: home.lat,
    lng: home.lng,
    arrivalDate: dateIso,
    departureDate: dateIso,
    nights: 0,
    privacy: 'private',
  };
}
