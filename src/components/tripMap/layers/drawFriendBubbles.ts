import L from 'leaflet';
import type { FriendOverlap } from '../../../data/myTrip';

/**
 * Friend overlap bubbles at neighborhood/town centroids. Soft halo (in CSS)
 * communicates "approximately in this area" — never street-level.
 */
export function drawFriendBubbles(
  map: L.Map,
  friends: FriendOverlap[],
  onClickFriend: (friend: FriendOverlap) => void,
): () => void {
  const markers: L.Marker[] = [];
  friends.forEach((friend) => {
    const icon = L.divIcon({
      className: 'tarmil-friend-bubble',
      html: `<div class="tarmil-friend-circle ${
        friend.status === 'present' ? 'is-present' : 'is-future'
      }">${friend.friendInitial}</div>`,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });
    const marker = L.marker([friend.lat, friend.lng], {
      icon,
      title: friend.friendName,
      zIndexOffset: 500,
    }).addTo(map);
    marker.on('click', () => onClickFriend(friend));
    markers.push(marker);
  });

  return () => {
    markers.forEach((marker) => map.removeLayer(marker));
  };
}
