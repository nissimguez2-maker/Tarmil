import type { RioPlace } from '../../data/rioPlaces';
import type { GlobalPlace } from '../../data/globalPlaces';
import type { FriendOverlap } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import {
  DEFAULT_ACTIVE_FILTERS,
  type FilterId,
} from './utils/categoryLabel';

export type SheetState =
  | { kind: 'place'; place: RioPlace | GlobalPlace }
  | { kind: 'friend'; friend: FriendOverlap }
  | { kind: 'searchDest' }
  | {
      kind: 'confirmDest';
      candidate: { nameHe: string; latlng: [number, number] };
      editingStopId?: string;
    }
  | { kind: 'plannedRoute' }
  | { kind: 'plannedStop'; stopId: string }
  | { kind: 'savePlaceToStop'; place: RioPlace | GlobalPlace }
  | { kind: 'arrivalConfirm'; stopId: string };

export type TripState = {
  mode: 'default' | 'pick';
  activeFilters: Set<FilterId>;
  plannedStops: PlannedStop[];
  sheet: SheetState | null;
  /** Pre-filled name when entering pick mode from a search row. */
  pickPrefillName?: string;
  arrivalDismissed: boolean;
};

export type TripAction =
  | { type: 'OPEN_SHEET'; sheet: SheetState }
  | { type: 'CLOSE_SHEET' }
  | { type: 'TOGGLE_FILTER'; id: FilterId }
  | { type: 'SET_FILTERS'; filters: Set<FilterId> }
  | { type: 'START_PICK'; nameHe?: string }
  | { type: 'CANCEL_PICK' }
  | { type: 'CONFIRM_PICK'; latlng: [number, number] }
  | { type: 'SAVE_STOP'; stop: PlannedStop }
  | { type: 'REMOVE_STOP'; stopId: string }
  | { type: 'SAVE_PLACE_TO_STOP'; placeId: string; stopId: string }
  | { type: 'DISMISS_ARRIVAL' };

export function makeInitialTripState(stops: PlannedStop[]): TripState {
  return {
    mode: 'default',
    activeFilters: new Set(DEFAULT_ACTIVE_FILTERS),
    plannedStops: stops,
    sheet: null,
    arrivalDismissed: false,
  };
}

export function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'OPEN_SHEET':
      return { ...state, sheet: action.sheet };
    case 'CLOSE_SHEET':
      return { ...state, sheet: null };
    case 'TOGGLE_FILTER': {
      const next = new Set(state.activeFilters);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      return { ...state, activeFilters: next };
    }
    case 'SET_FILTERS':
      return { ...state, activeFilters: new Set(action.filters) };
    case 'START_PICK':
      return {
        ...state,
        mode: 'pick',
        sheet: null,
        pickPrefillName: action.nameHe,
      };
    case 'CANCEL_PICK':
      return { ...state, mode: 'default', pickPrefillName: undefined };
    case 'CONFIRM_PICK':
      return {
        ...state,
        mode: 'default',
        pickPrefillName: undefined,
        sheet: {
          kind: 'confirmDest',
          candidate: {
            nameHe: state.pickPrefillName ?? 'יעד חדש',
            latlng: action.latlng,
          },
        },
      };
    case 'SAVE_STOP': {
      const idx = state.plannedStops.findIndex((s) => s.id === action.stop.id);
      const next = [...state.plannedStops];
      if (idx >= 0) next[idx] = action.stop;
      else next.push(action.stop);
      next.sort((a, b) => a.arrivalDate.localeCompare(b.arrivalDate));
      return { ...state, plannedStops: next, sheet: null };
    }
    case 'REMOVE_STOP':
      return {
        ...state,
        plannedStops: state.plannedStops.filter((s) => s.id !== action.stopId),
        sheet: null,
      };
    case 'SAVE_PLACE_TO_STOP': {
      const next = state.plannedStops.map((s) => {
        if (s.id !== action.stopId) return s;
        const existing = s.savedPlaceIds ?? [];
        if (existing.includes(action.placeId)) return s;
        return { ...s, savedPlaceIds: [...existing, action.placeId] };
      });
      return { ...state, plannedStops: next, sheet: null };
    }
    case 'DISMISS_ARRIVAL':
      return { ...state, sheet: null, arrivalDismissed: true };
  }
}
