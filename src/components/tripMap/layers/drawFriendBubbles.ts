import tt from '@tomtom-international/web-sdk-maps';
import type { FriendOverlap } from '../../../data/myTrip';

/**
 * Friend overlap bubbles at neighborhood/town/city centroids. Soft halo (in
 * CSS) communicates "approximately in this area" — never street-level.
 */
export function drawFriendBubbles(
  map: tt.Map,
  friends: FriendOverlap[],
  onClickFriend: (friend: FriendOverlap) => void,
): () => void {
  const markers: tt.Marker[] = [];

  friends.forEach((friend) => {
    const el = document.createElement('div');
    el.className = 'tarmil-friend-bubble';
    el.title = friend.friendName;
    el.innerHTML = `<div class="tarmil-friend-circle ${
      friend.status === 'present' ? 'is-present' : 'is-future'
    }">${friend.friendInitial}</div>`;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClickFriend(friend);
    });

    const marker = new tt.Marker({ element: el, anchor: 'center' })
      .setLngLat([friend.lng, friend.lat])
      .addTo(map);
    markers.push(marker);
  });

  return () => {
    markers.forEach((m) => m.remove());
  };
}
