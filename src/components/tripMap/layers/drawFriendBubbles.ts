import mapboxgl from 'mapbox-gl';
import type { FriendOverlap } from '../../../data/myTrip';
import type { FriendRelationship } from '../utils/relateFriend';
import { escapeHtml } from '../utils/escapeHtml';

/**
 * Friend bubbles at neighborhood / city centroids. Soft halo (in CSS)
 * communicates "approximately in this area" — never street-level.
 *
 * Three visual styles, driven by the runtime-derived relationship:
 *  - `present`        → solid copper bubble at the user's current zone
 *  - `future_overlap` → dashed copper bubble at a matching planned stop
 *  - `traveling`      → smaller, muted dashed cocoa bubble somewhere the
 *                       user is NOT going (informational, never an overlap)
 *
 * The relationship resolver is injected so callers can pass a memoised
 * map or per-friend computation without this layer re-deriving it.
 */
export function drawFriendBubbles(
  map: mapboxgl.Map,
  friends: FriendOverlap[],
  getRelationship: (friend: FriendOverlap) => FriendRelationship,
  onClickFriend: (friend: FriendOverlap) => void,
): () => void {
  const markers: mapboxgl.Marker[] = [];
  friends.forEach((friend) => {
    const kind = getRelationship(friend).kind;
    const stateClass =
      kind === 'present'
        ? 'is-present'
        : kind === 'future_overlap'
          ? 'is-overlap'
          : 'is-traveling';
    // Box mirrors the old Leaflet iconSize so the CSS margins centre the
    // circle; Mapbox then anchors the box centre on the coordinate.
    const box = kind === 'traveling' ? 44 : 56;

    const el = document.createElement('div');
    el.className = 'tarmil-friend-bubble';
    el.style.width = `${box}px`;
    el.style.height = `${box}px`;
    el.style.boxSizing = 'border-box';
    el.style.zIndex = kind === 'traveling' ? '300' : '500';
    el.title = friend.friendName;
    el.innerHTML = `<div class="tarmil-friend-circle ${stateClass}">${escapeHtml(
      friend.friendInitial,
    )}</div>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClickFriend(friend);
    });

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([friend.lng, friend.lat])
      .addTo(map);
    markers.push(marker);
  });

  return () => {
    markers.forEach((marker) => marker.remove());
  };
}
