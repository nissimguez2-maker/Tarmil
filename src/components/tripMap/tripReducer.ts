import type { FriendOverlap, Place } from '../../data/types';
import {
  DEFAULT_ACTIVE_FILTERS,
  type FilterId,
} from './utils/categoryLabel';

export type SheetState =
  | { kind: 'place'; place: Place }
  | { kind: 'friend'; friend: FriendOverlap }
  | { kind: 'searchDest' }
  | {
      kind: 'confirmDest';
      candidate: {
        nameHe: string;
        latlng: [number, number];
        /** When set, the saved planned-stop uses this as its id (instead of
         *  the auto-generated `stop-${Date.now()}`). Suggestions in
         *  SearchDestinationSheet pass their canonical id through here so
         *  the saved stop's `id` matches `places.destination_id` rows
         *  already in Supabase — that's what makes the new city's curated
         *  places light up the moment the stop is saved. */
        idHint?: string;
      };
      editingStopId?: string;
    }
  | { kind: 'plannedRoute' }
  | { kind: 'plannedStop'; stopId: string }
  | { kind: 'savePlaceToStop'; place: Place }
  | { kind: 'arrivalConfirm'; stopId: string };

// UI-only state. Planned stops live in Supabase (app_state) and are owned
// by TripScreen via useSupabaseState — mutators on the screen wrap setState
// directly, not dispatch.
export type TripState = {
  mode: 'default' | 'pick';
  activeFilters: Set<FilterId>;
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
  | { type: 'DISMISS_ARRIVAL' };

export function makeInitialTripState(): TripState {
  return {
    mode: 'default',
    activeFilters: new Set(DEFAULT_ACTIVE_FILTERS),
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
    case 'DISMISS_ARRIVAL':
      return { ...state, sheet: null, arrivalDismissed: true };
  }
}
