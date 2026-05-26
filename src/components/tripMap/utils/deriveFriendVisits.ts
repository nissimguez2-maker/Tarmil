import type { Place, PlaceCategory } from '../../../data/places';

export type FriendVisit = {
  friendName: string;
  friendInitial: string;
  /** 1–5. */
  rating: number;
  /** Single line of copy. */
  comment: string;
};

/** Friend pool for deterministic place reviews — overlaps the friendOverlaps roster. */
const POOL: Array<{ name: string; initial: string }> = [
  { name: 'Maya Levi', initial: 'M' },
  { name: 'Yael Abraham', initial: 'Y' },
  { name: 'Roi Ben Ami', initial: 'R' },
  { name: 'Shir Cohen', initial: 'S' },
  { name: 'Yotam Harari', initial: 'H' },
  { name: 'Tom Friedman', initial: 'T' },
  { name: 'Aviv Gutman', initial: 'A' },
  { name: 'Daniel Levi', initial: 'D' },
];

const COMMENTS: Record<PlaceCategory, string[]> = {
  beach: [
    'Endless beach, good crew, and a sea that felt like it was just ours.',
    'Showed up with paddles, left at sunset with two new friends.',
    'Clean and chill on weekdays, turns into a thousand-person promenade at night.',
    'The water can get wild, but the sand itself is perfect for burying yourself with a book.',
  ],
  hostel: [
    'Courtyard full of hammocks and Israelis, felt like family from minute one.',
    'Rooms are fine, kitchen actually works, people are easy — exactly what you need.',
    'Killer location, five minutes walk to anything that matters.',
    'Bit crowded in summer but the staff always sort something out.',
  ],
  cafe: [
    'Solid coffee, wifi good enough to book flights and lose your mind.',
    'Insane açaí, I camped here for an hour and stayed for lunch.',
    'Quiet spot in the middle of the chaos, great place to sit alone.',
    'Barista is a legend, explained everything and I still ordered the usual.',
  ],
  restaurant: [
    'One dish was plenty for two, we ate till we couldn\'t stand up.',
    'Home cooking, warm vibes, way cheaper than the tour-trail places.',
    'Menu is a bit confusing, trusted the waitress and she nailed it.',
    'Closest thing to mum\'s food without booking a flight home.',
  ],
  bar: [
    'Cheap beer, right music, doesn\'t take much to start dancing.',
    'Small place, Israelis at your table within ten minutes.',
    'Solid local brew, hot sandwich at midnight saved my life.',
    'Mellow before going out clubbing, perfect warm-up.',
  ],
  club: [
    'Dance floor on fire, sound is great, we walked out at 5:30 happy.',
    'Crazy line outside but inside we were gone completely.',
    'Two floors, different music on each, everyone finds their thing.',
    'Strong opening, locals were super friendly and not the usual scene.',
  ],
  chabad: [
    'Shabbat table with Israelis from everywhere, felt like home instantly.',
    'The rabbi is solid, explained the area, hooked us up with more travelers.',
    'Home cooked food, perfect reset after a packed week of sights.',
    'Nice having this far from home, the meal kind of takes care of itself.',
  ],
  kosher: [
    'Homestyle kosher, fair price, and you can grab sides to take away.',
    'Schnitzel and mash after a week of plain food — religious experience.',
    'Line moves fast, they spoke Hebrew with us, recommendations were gold.',
    'They bake on site, smell of grandma\'s kitchen without breaking down.',
  ],
  synagogue: [
    'Beautiful old shul, caught Kabbalat Shabbat with travelers from everywhere.',
    'Visitors welcome, security was chill once we showed our passports.',
    'Quiet weekday minyan, the gabbai sorted us with tefillin and tips.',
    'Stunning inside, stayed for services and got invited to a Shabbat meal.',
  ],
  mikveh: [
    'Spotless and private, booked a slot over WhatsApp the day before.',
    'Well-kept and calm, the attendant walked us through everything.',
    'Exactly what you need on the road, call ahead for evening hours.',
    'Clean, quiet, no fuss — grateful it existed this far from home.',
  ],
  landmark: [
    'Must-see once, snapped a photo and moved on relaxed.',
    'Worth the walk, the vibe actually hits harder in the evening.',
    'Lively square, musicians, lots of colour, perfect for a lazy morning.',
    'Mind-blowing viewpoint, come at sunset if you can and you won\'t regret it.',
  ],
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic 1–3 friend reviews for a place. Uses `friendsKnow` to bound
 * the visible count and the place id as a seed so the demo data stays stable
 * across renders. Returns [] when no friends know the place.
 */
export function deriveFriendVisits(place: {
  id: string;
  category: PlaceCategory;
  friendsKnow: number;
}): FriendVisit[] {
  if (place.friendsKnow <= 0) return [];
  const count = Math.min(3, place.friendsKnow);
  const seed = hashStr(place.id);
  const comments = COMMENTS[place.category];
  const used = new Set<number>();
  const out: FriendVisit[] = [];
  for (let i = 0; i < count; i++) {
    let friendIdx = (seed + i * 17) % POOL.length;
    while (used.has(friendIdx)) friendIdx = (friendIdx + 1) % POOL.length;
    used.add(friendIdx);
    const commentIdx = (seed + i * 13) % comments.length;
    const rating = 3 + ((seed + i * 7) % 3); // 3, 4, or 5
    out.push({
      friendName: POOL[friendIdx].name,
      friendInitial: POOL[friendIdx].initial,
      rating,
      comment: comments[commentIdx],
    });
  }
  return out;
}

export type { Place };
