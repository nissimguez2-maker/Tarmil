import { useSyncExternalStore } from 'react';

/**
 * Demo-only client state that needs to survive a page refresh on the same
 * device. The real product would back these with per-user rows in Supabase;
 * for the investor demo, localStorage is the right resolution — the backend
 * is shared global state today (see CLAUDE.md), so per-user toggles can't
 * meaningfully live in the DB anyway.
 *
 * Anything UI-only that should "feel real" between taps but doesn't need a
 * server round-trip lives here.
 */

export type AcceptedFriend = {
  id: string;
  name: string;
  initial: string;
};

export type IncomingRequest = {
  id: string;
  name: string;
  initial: string;
};

type DemoState = {
  offGrid: boolean;
  stopVisibility: Record<string, boolean>;
  pendingFriendRequests: string[];
  acceptedFriends: AcceptedFriend[];
  resolvedRequestIds: string[];
  hasOnboarded: boolean;
  arrivalToastStopId: string | null;
  settingsOverrides: Record<string, string>;
};

const STORAGE_KEY = 'tarmil-demo-state-v1';

const DEFAULT: DemoState = {
  offGrid: false,
  stopVisibility: {},
  pendingFriendRequests: [],
  acceptedFriends: [],
  resolvedRequestIds: [],
  hasOnboarded: false,
  arrivalToastStopId: null,
  settingsOverrides: {},
};

function load(): DemoState {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}

let state: DemoState = load();
const listeners = new Set<() => void>();

function save() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode, quota). Best-effort only.
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, () => state, () => DEFAULT);
}

export function setOffGrid(value: boolean) {
  state = { ...state, offGrid: value };
  save();
  emit();
}

export function setStopVisibility(stopId: string, visible: boolean) {
  state = {
    ...state,
    stopVisibility: { ...state.stopVisibility, [stopId]: visible },
  };
  save();
  emit();
}

export function getStopVisibility(stopId: string): boolean {
  return state.stopVisibility[stopId] ?? true;
}

export function addPendingFriendRequest(name: string) {
  if (state.pendingFriendRequests.includes(name)) return;
  state = {
    ...state,
    pendingFriendRequests: [...state.pendingFriendRequests, name],
  };
  save();
  emit();
}

export function resolveIncomingRequest(
  id: string,
  outcome: 'accept' | 'decline',
  name?: string,
  initial?: string,
) {
  const nextResolved = state.resolvedRequestIds.includes(id)
    ? state.resolvedRequestIds
    : [...state.resolvedRequestIds, id];
  const nextAccepted =
    outcome === 'accept' && name && initial
      ? state.acceptedFriends.some((f) => f.id === id)
        ? state.acceptedFriends
        : [...state.acceptedFriends, { id, name, initial }]
      : state.acceptedFriends;
  state = {
    ...state,
    resolvedRequestIds: nextResolved,
    acceptedFriends: nextAccepted,
  };
  save();
  emit();
}

export function setOnboarded(value: boolean) {
  state = { ...state, hasOnboarded: value };
  save();
  emit();
}

export function setArrivalToast(stopId: string | null) {
  state = { ...state, arrivalToastStopId: stopId };
  save();
  emit();
}

export function setSettingsOverride(key: string, value: string) {
  state = {
    ...state,
    settingsOverrides: { ...state.settingsOverrides, [key]: value },
  };
  save();
  emit();
}

export function clearDemoState() {
  state = DEFAULT;
  save();
  emit();
}
