/**
 * Centered crosshair shown when the trip map is in pick mode. The reticle is
 * a static absolute overlay — the map's center IS the picked location, so
 * the user pans rather than drags a pin.
 */
export function PickReticle() {
  return <div className="tarmil-pick-reticle" aria-hidden />;
}
