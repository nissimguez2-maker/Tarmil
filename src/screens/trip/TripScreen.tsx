import { useReducer, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import {
  TripMap,
  type TripMapHandle,
} from '../../components/tripMap/TripMap';
import { CategoryFilterRail } from '../../components/tripMap/ui/CategoryFilterRail';
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
  getPlannedStopById,
  type PlannedStop,
} from '../../data/plannedStops';
import { friendOverlaps } from '../../data/myTrip';
import { rioPlaces } from '../../data/rioPlaces';
import { ALL_FILTERS } from '../../components/tripMap/utils/categoryLabel';

/**
 * Trip tab — the app's hero.
 *
 * Owns map state via useReducer; the map and floaters (filter rail, travel
 * moment card, FAB, pick UI) are siblings. The bottom sheet is a single
 * overlay whose content swaps by sheet.kind. Floaters hide whenever a sheet
 * is open or the map is in pick mode.
 *
 * Place taps from inside PlannedStopSheet navigate to /place/:id; the trip
 * sheet state is lost on that navigation (mockup limitation).
 */
export function TripScreen() {
  const [state, dispatch] = useReducer(tripReducer, undefined, () =>
    makeInitialTripState(seedStops),
  );
  const navigate = useNavigate();
  const tripMapRef = useRef<TripMapHandle>(null);

  const presentFriendCount = useMemo(
    () => friendOverlaps.filter((f) => f.status === 'present').length,
    [],
  );
  const picksNearbyCount = useMemo(
    () => rioPlaces.filter((p) => p.tarmilPick).length,
    [],
  );

  const sheet = state.sheet;
  const nextStop = state.plannedStops[0];
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

  // Resolve the live stop from state.plannedStops so the planned-stop sheet
  // re-renders when the user edits dates or saves a place to it.
  const resolveStop = (id: string): PlannedStop | undefined =>
    state.plannedStops.find((s) => s.id === id) ?? getPlannedStopById(id);

  return (
    <Screen noScroll>
      <div className="flex h-full flex-col">
        <TopBar eyebrow="Tarmil" title="המסע שלך" />
        <div className="relative flex-1 overflow-hidden">
          <TripMap
            ref={tripMapRef}
            mode={state.mode}
            activeFilters={state.activeFilters}
            plannedStops={state.plannedStops}
            activeStopId={
              sheet?.kind === 'plannedStop' ? sheet.stopId : undefined
            }
            onOpenSheet={(s) => dispatch({ type: 'OPEN_SHEET', sheet: s })}
            onCloseSheet={() => dispatch({ type: 'CLOSE_SHEET' })}
          />

          {floatersVisible && (
            <>
              <CategoryFilterRail
                active={state.activeFilters}
                onToggle={(id) => dispatch({ type: 'TOGGLE_FILTER', id })}
                onSetAll={() =>
                  dispatch({
                    type: 'SET_FILTERS',
                    filters: new Set(ALL_FILTERS),
                  })
                }
              />
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
                  state.plannedStops.length > 0
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
                onSave={(stop) => dispatch({ type: 'SAVE_STOP', stop })}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedRoute' && (
              <PlannedRouteSheet
                stops={state.plannedStops}
                onPickStop={openPlannedStop}
                onAdd={openSearch}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedStop' &&
              (() => {
                const stop = resolveStop(sheet.stopId);
                if (!stop) return null;
                return (
                  <PlannedStopSheet
                    stop={stop}
                    onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
                    onBack={openPlannedRoute}
                    onEdit={() => openEditStop(stop)}
                    onRemove={() =>
                      dispatch({ type: 'REMOVE_STOP', stopId: stop.id })
                    }
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
                stops={state.plannedStops}
                onSave={(stopId) =>
                  dispatch({
                    type: 'SAVE_PLACE_TO_STOP',
                    placeId: sheet.place.id,
                    stopId,
                  })
                }
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
