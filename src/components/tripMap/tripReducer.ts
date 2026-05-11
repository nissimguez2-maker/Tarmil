import type { Place } from '../../data/places';
import type { FriendOverlap } from '../../data/myTrip';
import {
  ALL_FILTERS,
  DEFAULT_ACTIVE_FILTERS,
  type FilterId,
} from './utils/categoryLabel';

export type SheetState =
  | { kind: 'place'; place: Place | Place }
  | { kind: 'friend'; friend: FriendOverlap }
  | { kind: 'searchDest' }
  | {
      kind: 'confirmDest';
      candidate: { nameHe: string; latlng: [number, number] };
      editingStopId?: string;
    }
  | { kind: 'plannedRoute' }
  | { kind: 'plannedStop'; stopId: string }
  | { kind: 'savePlaceToStop'; place: Place | Place }
  | { kind: 'arrivalConfirm'; stopId: string }
  | { kind: 'filters' };

/**
 * How friends render on the map.
 * - 'all'      : every friend in the overlap list.
 * - 'overlaps' : only friends linked to a planned stop (friendOverlapIds).
 * - 'none'     : hidden.
 */
export type FriendsView = 'all' | 'overlaps' | 'none';

// UI state only. Persisted data (planned_stops) lives in Supabase and is
// fetched by SupabaseDataProvider; mutators on that hook handle add/edit/
// remove. This reducer covers only ephemeral session state.
export type TripState = {
  mode: 'default' | 'pick';
  activeFilters: Set<FilterId>;
  sheet: SheetState | null;
  pickPrefillName?: string;
  arrivalDismissed: boolean;
  friendsView: FriendsView;
};

export type TripAction =
  | { type: 'OPEN_SHEET'; sheet: SheetState }
  | { type: 'CLOSE_SHEET' }
  | { type: 'TOGGLE_FILTER'; id: FilterId }
  | { type: 'SET_FILTERS'; filters: Set<FilterId> }
  | { type: 'START_PICK'; nameHe?: string }
  | { type: 'CANCEL_PICK' }
  | { type: 'CONFIRM_PICK'; latlng: [number, number] }
  | { type: 'DISMISS_ARRIVAL' }
  | { type: 'SET_FRIENDS_VIEW'; view: FriendsView };

export function makeInitialTripState(): TripState {
  return {
    mode: 'default',
    activeFilters: new Set(DEFAULT_ACTIVE_FILTERS),
    sheet: null,
    arrivalDismissed: false,
    friendsView: 'all',
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
    case 'DISMISS_ARRIVAL':
      return { ...state, sheet: null, arrivalDismissed: true };
    case 'SET_FRIENDS_VIEW':
      return { ...state, friendsView: action.view };
  }
}

export function isAllFiltersActive(filters: Set<FilterId>): boolean {
  return filters.size === ALL_FILTERS.length;
}
