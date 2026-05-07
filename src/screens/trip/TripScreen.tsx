import { lazy, Suspense, useReducer, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import type { TripMapHandle } from '../../components/tripMap/TripMap';

// Lazy-load the TomTom map so non-Trip tabs (Tools, Friends, Profile) don't
// fetch the ~400KB-gzip Mapbox-GL fork. The Suspense fallback below renders
// while the chunk is in flight on first /trip mount.
const TripMap = lazy(() =>
  import('../../components/tripMap/TripMap').then((m) => ({
    default: m.TripMap,
  })),
);
import { FilterPanel } from '../../components/tripMap/ui/FilterPanel';
import { TravelMomentCard } from '../../components/tripMap/ui/TravelMomentCard';
import { AddDestinationFab } from '../../components/tripMap/ui/AddDestinationFab';
import { PickReticle } from '../../components/tripMap/ui/PickReticle';
import { PickOnMapBar } from '../../components/tripMap/ui/PickOnMapBar';
import { BottomSheet } from '../../components/tripMap/sheets/BottomSheet';
import { PlaceSheet } from '../../components/tripMap/sheets/PlaceSheet';
import { FriendSheet } from '../../components/tripMap/sheets/FriendSheet';
import { SearchDestinationSheet } from '../../components/tripMap/sheets/SearchDestinationSheet';
import { ConfirmDestinationSheet } from '../../components/tripMap/sheets/ConfirmDestinationSheet';
import { PlannedRouteSheet } from '../../components/tripMap/sheets/PlannedRouteSheet';
import { PlannedStopSheet } from '../../components/tripMap/sheets/PlannedStopSheet';
import { SavePlaceToStopSheet } from '../../components/tripMap/sheets/SavePlaceToStopSheet';
import { ArrivalConfirmSheet } from '../../components/tripMap/sheets/ArrivalConfirmSheet';
import {
  tripReducer,
  makeInitialTripState,
} from '../../components/tripMap/tripReducer';
import {
  plannedStops as seedStops,
  type PlannedStop,
} from '../../data/plannedStops';
import { useSupabaseState } from '../../hooks/useSupabaseState';
import { useStaticData } from '../../lib/SupabaseStaticData';

const PLANNED_STOPS_KEY = 'tarmil:planned_stops:v1';
const CURRENT_DESTINATION_ID = 'rio-de-janeiro';

/**
 * Trip tab — the app's hero.
 *
 * Reads static data (places, friend overlaps, trip waypoints) from Supabase
 * via useStaticData(); planned stops are mutable user state via
 * useSupabaseState(app_state) and broadcast over Realtime. All add/edit/
 * remove flows write through the network so investor demos survive reload
 * and sync live across devices.
 *
 * Live demo flow: pick a curated suggestion (Mendoza/Bariloche/Punta) ->
 * the saved planned-stop's id matches `places.destination_id` rows already
 * in Supabase, so the trip line, copper marker, ~12 places, and a friend
 * bubble all materialise in the same render tick. Removing the stop
 * reverses every one of those.
 */
export function TripScreen() {
  const { data: staticData, loading, error } = useStaticData();
  const [state, dispatch] = useReducer(tripReducer, undefined, () =>
    makeInitialTripState(),
  );
  const [plannedStops, setPlannedStops] = useSupabaseState<PlannedStop[]>(
    PLANNED_STOPS_KEY,
    seedStops,
  );
  const navigate = useNavigate();
  const tripMapRef = useRef<TripMapHandle>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const presentFriendCount = useMemo(
    () =>
      staticData?.friendOverlaps.filter((f) => f.status === 'present').length ??
      0,
    [staticData],
  );
  const picksNearbyCount = useMemo(
    () =>
      staticData?.places.filter(
        (p) => p.destinationId === CURRENT_DESTINATION_ID && p.tarmilPick,
      ).length ?? 0,
    [staticData],
  );

  const sheet = state.sheet;
  const nextStop = plannedStops[0];
  const floatersVisible = sheet === null && state.mode === 'default';
  const isTallSheet = sheet?.kind === 'plannedStop';

  const handleConfirmPick = () => {
    const center = tripMapRef.current?.getCenter();
    if (!center) return;
    dispatch({ type: 'CONFIRM_PICK', latlng: center });
  };

  const openPlannedRoute = () =>
    dispatch({ type: 'OPEN_SHEET', sheet: { kind: 'plannedRoute' } });

  const openPlannedStop = (stopId: string) =>
    dispatch({ type: 'OPEN_SHEET', sheet: { kind: 'plannedStop', stopId } });

  const openEditStop = (stop: PlannedStop) =>
    dispatch({
      type: 'OPEN_SHEET',
      sheet: {
        kind: 'confirmDest',
        candidate: { nameHe: stop.nameHe, latlng: [stop.lat, stop.lng] },
        editingStopId: stop.id,
      },
    });

  const openSearch = () =>
    dispatch({ type: 'OPEN_SHEET', sheet: { kind: 'searchDest' } });

  const resolveStop = (id: string): PlannedStop | undefined =>
    plannedStops.find((s) => s.id === id);

  const saveStop = (stop: PlannedStop) => {
    setPlannedStops((prev) => {
      const idx = prev.findIndex((s) => s.id === stop.id);
      const next = [...prev];
      if (idx >= 0) next[idx] = stop;
      else next.push(stop);
      next.sort((a, b) => a.arrivalDate.localeCompare(b.arrivalDate));
      return next;
    });
    dispatch({ type: 'CLOSE_SHEET' });
  };

  const removeStop = (stopId: string) => {
    setPlannedStops((prev) => prev.filter((s) => s.id !== stopId));
    dispatch({ type: 'CLOSE_SHEET' });
  };

  const savePlaceToStop = (placeId: string, stopId: string) => {
    setPlannedStops((prev) =>
      prev.map((s) => {
        if (s.id !== stopId) return s;
        const existing = s.savedPlaceIds ?? [];
        if (existing.includes(placeId)) return s;
        return { ...s, savedPlaceIds: [...existing, placeId] };
      }),
    );
    dispatch({ type: 'CLOSE_SHEET' });
  };

  if (loading) {
    return (
      <Screen>
        <div className="flex h-full items-center justify-center p-md">
          <span className="text-small text-cocoa-55">טוען נתונים…</span>
        </div>
      </Screen>
    );
  }
  if (error || !staticData) {
    return (
      <Screen>
        <div className="flex h-full flex-col items-center justify-center gap-md p-md">
          <p className="font-serif text-lede text-cocoa">לא הצלחנו להתחבר.</p>
          {error?.message && (
            <p className="max-w-body text-small text-cocoa-55">{error.message}</p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="meta-caps text-cocoa-70 active:text-cocoa"
          >
            נסה שוב
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen noScroll>
      <div className="flex h-full flex-col">
        <TopBar eyebrow="Tarmil" title="המסע שלך" />
        <div className="relative flex-1 overflow-hidden">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-ivory">
                <span className="text-small text-cocoa-55">טוען מפה…</span>
              </div>
            }
          >
            <TripMap
              ref={tripMapRef}
              mode={state.mode}
              activeFilters={state.activeFilters}
              places={staticData.places}
              friendOverlaps={staticData.friendOverlaps}
              pastTrip={staticData.myTrip.past}
              presentLocation={staticData.myTrip.present}
              plannedStops={plannedStops}
              activeStopId={
                sheet?.kind === 'plannedStop' ? sheet.stopId : undefined
              }
              onOpenSheet={(s) => dispatch({ type: 'OPEN_SHEET', sheet: s })}
              onCloseSheet={() => dispatch({ type: 'CLOSE_SHEET' })}
            />
          </Suspense>

          {floatersVisible && (
            <>
              <FilterPanel
                active={state.activeFilters}
                onToggle={(id) => dispatch({ type: 'TOGGLE_FILTER', id })}
                onOpenChange={setFilterOpen}
              />
              {!filterOpen && (
                <div className="absolute inset-x-md bottom-md z-[800] flex flex-col items-stretch gap-sm">
                  <div className="self-end">
                    <AddDestinationFab onClick={openSearch} />
                  </div>
                  <TravelMomentCard
                    hereLabel="אתה בריו"
                    next={nextStop}
                    friendCount={presentFriendCount}
                    picksCount={picksNearbyCount}
                    onTap={openPlannedRoute}
                  />
                </div>
              )}
            </>
          )}

          {state.mode === 'pick' && (
            <>
              <PickReticle />
              <PickOnMapBar
                onCancel={() => dispatch({ type: 'CANCEL_PICK' })}
                onConfirm={handleConfirmPick}
              />
            </>
          )}

          <BottomSheet
            open={sheet !== null}
            height={isTallSheet ? 'tall' : 'auto'}
          >
            {sheet?.kind === 'place' && (
              <PlaceSheet
                place={sheet.place}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
                onOpen={() => navigate(`/place/${sheet.place.id}`)}
                onSaveToStop={
                  plannedStops.length > 0
                    ? () =>
                        dispatch({
                          type: 'OPEN_SHEET',
                          sheet: { kind: 'savePlaceToStop', place: sheet.place },
                        })
                    : undefined
                }
              />
            )}
            {sheet?.kind === 'friend' && (
              <FriendSheet
                friend={sheet.friend}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'searchDest' && (
              <SearchDestinationSheet
                onPickSuggestion={(s) =>
                  dispatch({
                    type: 'OPEN_SHEET',
                    sheet: { kind: 'confirmDest', candidate: s },
                  })
                }
                onPickOnMap={() => dispatch({ type: 'START_PICK' })}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'confirmDest' && (
              <ConfirmDestinationSheet
                candidate={sheet.candidate}
                editingStop={
                  sheet.editingStopId
                    ? resolveStop(sheet.editingStopId)
                    : undefined
                }
                onSave={saveStop}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedRoute' && (
              <PlannedRouteSheet
                stops={plannedStops}
                onPickStop={openPlannedStop}
                onAdd={openSearch}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedStop' &&
              (() => {
                const stop = resolveStop(sheet.stopId);
                if (!stop) return null;
                const stopPlaces = staticData.places.filter(
                  (p) => p.destinationId === stop.id,
                );
                const overlapIds = new Set(stop.friendOverlapIds ?? []);
                const matchedById = staticData.friendOverlaps.filter((f) =>
                  overlapIds.has(f.id),
                );
                const matchedByDest = staticData.friendOverlaps.filter(
                  (f) => f.destinationId === stop.id,
                );
                // Use friendOverlapIds when set; otherwise fall back to
                // destinationId-matched friends (the seed for new candidate
                // cities sets destinationId but not the back-reference on
                // the stop).
                const stopOverlaps =
                  matchedById.length > 0 ? matchedById : matchedByDest;
                return (
                  <PlannedStopSheet
                    stop={stop}
                    places={stopPlaces}
                    overlaps={stopOverlaps}
                    onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
                    onBack={openPlannedRoute}
                    onEdit={() => openEditStop(stop)}
                    onRemove={() => removeStop(stop.id)}
                    onOpenPlace={(placeId) => navigate(`/place/${placeId}`)}
                    onMarkArrived={
                      state.arrivalDismissed
                        ? undefined
                        : () =>
                            dispatch({
                              type: 'OPEN_SHEET',
                              sheet: {
                                kind: 'arrivalConfirm',
                                stopId: stop.id,
                              },
                            })
                    }
                  />
                );
              })()}
            {sheet?.kind === 'savePlaceToStop' && (
              <SavePlaceToStopSheet
                place={sheet.place}
                stops={plannedStops}
                onSave={(stopId) => savePlaceToStop(sheet.place.id, stopId)}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'arrivalConfirm' &&
              (() => {
                const stop = resolveStop(sheet.stopId);
                if (!stop) return null;
                return (
                  <ArrivalConfirmSheet
                    stop={stop}
                    onConfirm={() => dispatch({ type: 'DISMISS_ARRIVAL' })}
                    onDismiss={() => dispatch({ type: 'DISMISS_ARRIVAL' })}
                  />
                );
              })()}
          </BottomSheet>
        </div>
      </div>
    </Screen>
  );
}
