import L from 'leaflet';
import type { FriendOverlap } from '../../../data/myTrip';
import type { FriendRelationship } from '../utils/relateFriend';

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
  map: L.Map,
  friends: FriendOverlap[],
  getRelationship: (friend: FriendOverlap) => FriendRelationship,
  onClickFriend: (friend: FriendOverlap) => void,
): () => void {
  const markers: L.Marker[] = [];
  friends.forEach((friend) => {
    const kind = getRelationship(friend).kind;
    const stateClass =
      kind === 'present'
        ? 'is-present'
        : kind === 'future_overlap'
          ? 'is-overlap'
          : 'is-traveling';
    const iconSize: [number, number] =
      kind === 'traveling' ? [44, 44] : [56, 56];
    const iconAnchor: [number, number] =
      kind === 'traveling' ? [22, 22] : [28, 28];

    const icon = L.divIcon({
      className: 'tarmil-friend-bubble',
      html: `<div class="tarmil-friend-circle ${stateClass}">${friend.friendInitial}</div>`,
      iconSize,
      iconAnchor,
    });
    const marker = L.marker([friend.lat, friend.lng], {
      icon,
      title: friend.friendName,
      zIndexOffset: kind === 'traveling' ? 300 : 500,
    }).addTo(map);
    marker.on('click', () => onClickFriend(friend));
    markers.push(marker);
  });

  return () => {
    markers.forEach((marker) => map.removeLayer(marker));
  };
}
