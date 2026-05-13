import { useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ToolsButton } from '../../components/shared/ToolsButton';
import {
  TripMap,
  type TripMapHandle,
} from '../../components/tripMap/TripMap';
import { NextTripCard } from '../../components/tripMap/ui/NextTripCard';
import { FilterFab } from '../../components/tripMap/ui/FilterFab';
import { AddDestinationFab } from '../../components/tripMap/ui/AddDestinationFab';
import { PickReticle } from '../../components/tripMap/ui/PickReticle';
import { PickOnMapBar } from '../../components/tripMap/ui/PickOnMapBar';
import { BottomSheet } from '../../components/shared/BottomSheet';
import { PlaceSheet } from '../../components/tripMap/sheets/PlaceSheet';
import { FriendSheet } from '../../components/tripMap/sheets/FriendSheet';
import { SearchDestinationSheet } from '../../components/tripMap/sheets/SearchDestinationSheet';
import { ConfirmDestinationSheet } from '../../components/tripMap/sheets/ConfirmDestinationSheet';
import { PlannedRouteSheet } from '../../components/tripMap/sheets/PlannedRouteSheet';
import { PlannedStopSheet } from '../../components/tripMap/sheets/PlannedStopSheet';
import { SavePlaceToStopSheet } from '../../components/tripMap/sheets/SavePlaceToStopSheet';
import { ArrivalConfirmSheet } from '../../components/tripMap/sheets/ArrivalConfirmSheet';
import { FiltersSheet } from '../../components/tripMap/sheets/FiltersSheet';
import { ConfirmFriendTripSheet } from '../../components/tripMap/sheets/ConfirmFriendTripSheet';
import { MapOnlyToggle } from '../../components/tripMap/ui/MapOnlyToggle';
import { DensityFab } from '../../components/tripMap/ui/DensityFab';
import { DensityLegend } from '../../components/tripMap/ui/DensityLegend';
import {
  tripReducer,
  makeInitialTripState,
} from '../../components/tripMap/tripReducer';
import type { PlannedStop } from '../../data/plannedStops';
import { DEFAULT_ACTIVE_FILTERS } from '../../components/tripMap/utils/categoryLabel';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';

/**
 * Trip tab — the app's hero.
 *
 * Owns ephemeral UI state via useReducer; planned stops + reference data come
 * from SupabaseDataProvider. Mutations (add/edit/remove stop, save place to
 * stop) are async hook calls; the reducer handles only sheet open/close,
 * filters, and pick mode.
 */
export function TripScreen() {
  const {
    data,
    loading,
    error,
    saveStop,
    removeStop,
    savePlaceToStop,
  } = useSupabaseData();
  const [state, dispatch] = useReducer(tripReducer, undefined, () =>
    makeInitialTripState(),
  );
  const navigate = useNavigate();
  const tripMapRef = useRef<TripMapHandle>(null);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const sheet = state.sheet;
  // First-by-arrival stop, falling back to first by array order. v0.3
  // sorts arrival_date ascending in the data provider, so [0] is "next".
  const nextStop: PlannedStop | null = data.plannedStops[0] ?? null;
  const nextStopFriends = nextStop
    ? data.friendOverlaps.filter((f) =>
        nextStop.friendOverlapIds?.includes(f.id),
      )
    : [];
  const isMapOnly = state.mode === 'mapOnly';
  const isHeat = state.heatmapEnabled;
  const headerCollapsed = sheet !== null || isMapOnly || isHeat;
  const floatersVisible = sheet === null && state.mode !== 'pick' && !isHeat;
  const addDestVisible = floatersVisible && !isMapOnly;
  const isTallSheet = sheet?.kind === 'plannedStop' || sheet?.kind === 'filters';

  const plannedFriendIds = new Set(
    data.plannedStops.flatMap((s) => s.friendOverlapIds ?? []),
  );
  const visibleFriends =
    state.friendsView === 'none'
      ? []
      : state.friendsView === 'overlaps'
        ? data.friendOverlaps.filter((f) => plannedFriendIds.has(f.id))
        : data.friendOverlaps;

  const filtersDirty =
    state.friendsView !== 'all' ||
    state.activeFilters.size !== DEFAULT_ACTIVE_FILTERS.size ||
    ![...DEFAULT_ACTIVE_FILTERS].every((f) => state.activeFilters.has(f));

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
    data.plannedStops.find((s) => s.id === id);

  const handleSaveStop = async (stop: PlannedStop) => {
    try {
      await saveStop(stop);
    } catch (e) {
      console.error('Failed to save stop:', e);
    } finally {
      dispatch({ type: 'CLOSE_SHEET' });
    }
  };

  const handleRemoveStop = async (stopId: string) => {
    try {
      await removeStop(stopId);
    } catch (e) {
      console.error('Failed to remove stop:', e);
    } finally {
      dispatch({ type: 'CLOSE_SHEET' });
    }
  };

  const handleSavePlaceToStop = async (placeId: string, stopId: string) => {
    try {
      await savePlaceToStop(placeId, stopId);
    } catch (e) {
      console.error('Failed to save place to stop:', e);
    } finally {
      dispatch({ type: 'CLOSE_SHEET' });
    }
  };

  return (
    <Screen noScroll>
      <div className="flex h-full flex-col">
        <TopBar title="Your trip" end={<ToolsButton />} />

        <div
          aria-hidden={headerCollapsed}
          className={clsx(
            'grid transition-[grid-template-rows,opacity] duration-considered ease-out-quart',
            headerCollapsed
              ? 'grid-rows-[0fr] opacity-0'
              : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="overflow-hidden">
            <NextTripCard
              stop={nextStop}
              friends={nextStopFriends}
              totalStops={data.plannedStops.length}
              onTap={openPlannedRoute}
              onAdd={openSearch}
            />
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <TripMap
            ref={tripMapRef}
            mode={state.mode}
            activeFilters={state.activeFilters}
            places={data.places}
            friendOverlaps={visibleFriends}
            presentLocation={data.myTrip.present}
            plannedStops={data.plannedStops}
            activeStopId={
              sheet?.kind === 'plannedStop' ? sheet.stopId : undefined
            }
            heatmapEnabled={isHeat}
            onOpenSheet={(s) => dispatch({ type: 'OPEN_SHEET', sheet: s })}
            onCloseSheet={() => dispatch({ type: 'CLOSE_SHEET' })}
          />

          {state.mode !== 'pick' && (
            <MapOnlyToggle
              active={isMapOnly}
              onClick={() => dispatch({ type: 'TOGGLE_MAP_ONLY' })}
            />
          )}

          {floatersVisible && (
            <>
              <FilterFab
                active={filtersDirty}
                onClick={() =>
                  dispatch({ type: 'OPEN_SHEET', sheet: { kind: 'filters' } })
                }
              />
              <DensityFab
                active={isHeat}
                onClick={() => dispatch({ type: 'TOGGLE_HEATMAP' })}
              />
              {addDestVisible && <AddDestinationFab onClick={openSearch} />}
            </>
          )}

          {isHeat && (
            <>
              <DensityFab
                active={isHeat}
                onClick={() => dispatch({ type: 'TOGGLE_HEATMAP' })}
              />
              <DensityLegend />
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
                  data.plannedStops.length > 0
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
                onAddToTrip={() =>
                  dispatch({
                    type: 'OPEN_SHEET',
                    sheet: { kind: 'confirmFriendTrip', friend: sheet.friend },
                  })
                }
              />
            )}
            {sheet?.kind === 'confirmFriendTrip' && (
              <ConfirmFriendTripSheet
                friend={sheet.friend}
                onSave={handleSaveStop}
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
                onSave={handleSaveStop}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedRoute' && (
              <PlannedRouteSheet
                stops={data.plannedStops}
                onPickStop={openPlannedStop}
                onAdd={openSearch}
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
            {sheet?.kind === 'plannedStop' &&
              (() => {
                const stop = resolveStop(sheet.stopId);
                if (!stop) return null;
                const stopPlaces = data.places.filter(
                  (p) => p.destinationId === stop.id,
                );
                const overlapIds = new Set(stop.friendOverlapIds ?? []);
                const stopOverlaps = data.friendOverlaps.filter((f) =>
                  overlapIds.has(f.id),
                );
                return (
                  <PlannedStopSheet
                    stop={stop}
                    places={stopPlaces}
                    overlaps={stopOverlaps}
                    onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
                    onBack={openPlannedRoute}
                    onEdit={() => openEditStop(stop)}
                    onRemove={() => handleRemoveStop(stop.id)}
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
                stops={data.plannedStops}
                onSave={(stopId) =>
                  handleSavePlaceToStop(sheet.place.id, stopId)
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
            {sheet?.kind === 'filters' && (
              <FiltersSheet
                friendsView={state.friendsView}
                onSetFriendsView={(view) =>
                  dispatch({ type: 'SET_FRIENDS_VIEW', view })
                }
                activeFilters={state.activeFilters}
                onToggleFilter={(id) =>
                  dispatch({ type: 'TOGGLE_FILTER', id })
                }
                onSetFilters={(filters) =>
                  dispatch({ type: 'SET_FILTERS', filters })
                }
                onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
              />
            )}
          </BottomSheet>
        </div>
      </div>
    </Screen>
  );
}
