/**
 * Forums — city-scoped discussion boards. One row per city.
 *
 * SEED ONLY. Runtime data is read from the `forums` table in Supabase via
 * SupabaseDataProvider. Nothing in `src/` imports this array outside of
 * `scripts/seed-supabase.ts`.
 *
 * Distribution: 4 joined city forums tracking the user's LATAM trip (Rio,
 * Búzios, São Paulo, Jericoacoara) + 1 recommended forum for Buenos Aires
 * (their next stop they haven't joined yet — demos the "join" CTA).
 *
 * Each forum carries the same 5 subject sub-categories on its threads:
 * Kosher & Chabad, Parties, Treks & Activities, Restaurants, Meetups. The
 * subject lives on `forum_threads.subject` (see `forumThreads.ts`).
 *
 * `member_count` realistic 80–240 range. `last_activity_at` is illustrative
 * — the seed writes `now()` server-side so it always looks recent.
 */

export type ForumKind = 'city' | 'interest' | 'region';

export type Forum = {
  /** Stable id, FK target for forum_threads. */
  id: string;
  /** URL-safe slug for /messages/forums/:slug routing. */
  slug: string;
  nameHe: string;
  nameEn: string;
  cityLabel?: string;
  /** Matches places.destination_id when this is a city forum. */
  destinationId?: string;
  kind: ForumKind;
  memberCount: number;
  /** 1-sentence tagline in backpacker tone. */
  heroBlurbHe: string;
  /** True = surfaced under "Recommended for you" with a join CTA. */
  isRecommended: boolean;
};

export const forums: Forum[] = [
  {
    id: 'forum-rio',
    slug: 'rio',
    nameHe: 'Rio de Janeiro',
    nameEn: 'Rio de Janeiro',
    cityLabel: 'Rio',
    destinationId: 'rio-de-janeiro',
    kind: 'city',
    memberCount: 234,
    heroBlurbHe: 'The spot for anyone passing through Rio. Hostel reviews, beach crew, and emergency help.',
    isRecommended: false,
  },
  {
    id: 'forum-buzios',
    slug: 'buzios',
    nameHe: 'Búzios',
    nameEn: 'Búzios',
    cityLabel: 'Búzios',
    destinationId: 'buzios',
    kind: 'city',
    memberCount: 87,
    heroBlurbHe: 'Beach weekend, snorkelling, and a bar by the water. Mostly weekend traffic.',
    isRecommended: false,
  },
  {
    id: 'forum-sao-paulo',
    slug: 'sao-paulo',
    nameHe: 'São Paulo',
    nameEn: 'São Paulo',
    cityLabel: 'São Paulo',
    destinationId: 'sao-paulo',
    kind: 'city',
    memberCount: 156,
    heroBlurbHe: 'Vila Madalena, churrasco, and bars in dodgy corners. Huge city, small blunt forum.',
    isRecommended: false,
  },
  {
    id: 'forum-jericoacoara',
    slug: 'jericoacoara',
    nameHe: 'Jericoacoara',
    nameEn: 'Jericoacoara',
    cityLabel: 'Jeri',
    destinationId: 'jericoacoara',
    kind: 'city',
    memberCount: 112,
    heroBlurbHe: 'Kitesurf, dunes, and barefoot mornings. Who is coming, who is leaving, where to crash.',
    isRecommended: false,
  },
  {
    id: 'forum-buenos-aires',
    slug: 'buenos-aires',
    nameHe: 'Buenos Aires',
    nameEn: 'Buenos Aires',
    cityLabel: 'Buenos Aires',
    destinationId: 'buenos-aires',
    kind: 'city',
    memberCount: 142,
    heroBlurbHe: 'Palermo, San Telmo, asado till midnight. Join before you go.',
    isRecommended: true,
  },
];
