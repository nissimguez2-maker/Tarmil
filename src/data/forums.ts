/**
 * Forums — one per (city × subject) pair. v0.3 dropped the city-level
 * catch-all forum in favor of focused subject-forums. Free-form chatter
 * goes to Group chats instead.
 *
 * SEED ONLY. Runtime data is read from the `forums` table in Supabase
 * via SupabaseDataProvider. Nothing in `src/` imports this array outside
 * `scripts/seed-supabase.ts`.
 *
 * Joined cities: Rio, Búzios, São Paulo, Jericoacoara → 5 subject forums
 * each = 20 forums. Buenos Aires keeps a single Meetups forum surfaced
 * under "Recommended for you" with a join CTA — demoes the discover
 * pattern without flooding the joined list.
 */

import type { ForumSubject } from './forumThreads';

export type ForumKind = 'city' | 'interest' | 'region';

export type Forum = {
  /** Stable id, FK target for forum_threads. Pattern: `forum-{city}-{subject}`. */
  id: string;
  /** URL-safe slug. Pattern: `{city}-{subject}`. */
  slug: string;
  nameHe: string;
  nameEn: string;
  cityLabel?: string;
  /** Matches places.destination_id when this is a city forum. */
  destinationId?: string;
  kind: ForumKind;
  /** Predefined subject. Null only for legacy / interest forums (none today). */
  subject?: ForumSubject;
  memberCount: number;
  /** 1-sentence tagline in backpacker tone. */
  heroBlurbHe: string;
  /** True = surfaced under "Recommended for you" with a join CTA. */
  isRecommended: boolean;
};

/**
 * Each subject has a stable display label, a Lucide icon name (mapped to
 * a real Icon in `src/components/messages/ForumRow.tsx`), and a small
 * library of city-flavored taglines so the seeded blurbs read distinct.
 */
export const SUBJECT_LABEL: Record<ForumSubject, string> = {
  kosher_chabad: 'Kosher & Chabad',
  parties: 'Parties',
  treks_activities: 'Treks & activities',
  restaurants: 'Restaurants',
  meetups: 'Meetups',
};

type CitySeed = {
  citySlug: string;
  destinationId: string;
  nameEn: string;
  cityLabel: string;
  /** Per-subject hero blurb. Backpacker tone, single sentence. */
  blurbBySubject: Record<ForumSubject, string>;
  /** Per-subject member count to vary the city's surface. */
  memberCountBySubject: Record<ForumSubject, number>;
};

const CITY_SEEDS: CitySeed[] = [
  {
    citySlug: 'rio',
    destinationId: 'rio-de-janeiro',
    nameEn: 'Rio de Janeiro',
    cityLabel: 'Rio de Janeiro',
    blurbBySubject: {
      kosher_chabad:
        'Chabad Copacabana times, kosher meat tips, Shabbat dinner crews.',
      parties:
        'Lapa blocos, baile funk recommendations, who is going out tonight.',
      treks_activities:
        'Pão de Açúcar sunrise hikes, Tijuca trails, surf lessons in Ipanema.',
      restaurants:
        'Acai bowls, churrascarias on a budget, the best pão de queijo in Botafogo.',
      meetups:
        'Israeli get-togethers, hostel pickups, "who is here this week?".',
    },
    memberCountBySubject: {
      kosher_chabad: 132,
      parties: 198,
      treks_activities: 156,
      restaurants: 174,
      meetups: 211,
    },
  },
  {
    citySlug: 'buzios',
    destinationId: 'buzios',
    nameEn: 'Búzios',
    cityLabel: 'Búzios',
    blurbBySubject: {
      kosher_chabad:
        'Shabbat options when the closest minyan is back in Rio.',
      parties:
        'Beach bars on Rua das Pedras, sunset DJ sets, full-moon parties.',
      treks_activities:
        'Boat trips to 12-beach loops, kayak rentals, snorkel spots.',
      restaurants:
        'Seafood under fairy lights, açaí shacks, where the locals eat lunch.',
      meetups:
        'Long-weekend crews, peninsula day-trippers from Rio, who is in.',
    },
    memberCountBySubject: {
      kosher_chabad: 38,
      parties: 92,
      treks_activities: 71,
      restaurants: 83,
      meetups: 64,
    },
  },
  {
    citySlug: 'sao-paulo',
    destinationId: 'sao-paulo',
    nameEn: 'São Paulo',
    cityLabel: 'São Paulo',
    blurbBySubject: {
      kosher_chabad:
        'Chabad Higienópolis, kosher cafés in Bom Retiro, Shabbat in Jardins.',
      parties:
        'Vila Madalena bar crawls, Augusta clubs, electronic nights in Bixiga.',
      treks_activities:
        'Day trips to Embu, Santos beach runs, MASP exhibits worth queueing for.',
      restaurants:
        'Asado in Vila Madalena, ramen in Liberdade, pastel in the markets.',
      meetups:
        'Israeli expats meetups, weekly coffee at Paulista, hostel buddies.',
    },
    memberCountBySubject: {
      kosher_chabad: 124,
      parties: 167,
      treks_activities: 98,
      restaurants: 189,
      meetups: 142,
    },
  },
  {
    citySlug: 'jericoacoara',
    destinationId: 'jericoacoara',
    nameEn: 'Jericoacoara',
    cityLabel: 'Jericoacoara',
    blurbBySubject: {
      kosher_chabad:
        'Shabbat on the dunes — small Chabad presence, who is hosting this week.',
      parties:
        'Sunset at Duna do Pôr-do-Sol, forró on the sand, full-moon bonfires.',
      treks_activities:
        'Kitesurf lessons, buggy tours, lagoon hopping, dune sandboarding.',
      restaurants:
        'Beachfront grilled fish, açaí bowls, the best caipirinha in town.',
      meetups:
        'Kite crews looking for partners, dune sunset groups, jeep-share rides.',
    },
    memberCountBySubject: {
      kosher_chabad: 22,
      parties: 78,
      treks_activities: 124,
      restaurants: 67,
      meetups: 91,
    },
  },
];

const SUBJECTS_ALL: ForumSubject[] = [
  'kosher_chabad',
  'parties',
  'treks_activities',
  'restaurants',
  'meetups',
];

const joined: Forum[] = CITY_SEEDS.flatMap((city) =>
  SUBJECTS_ALL.map((subject): Forum => ({
    id: `forum-${city.citySlug}-${subject}`,
    slug: `${city.citySlug}-${subject}`,
    nameEn: SUBJECT_LABEL[subject],
    nameHe: SUBJECT_LABEL[subject],
    cityLabel: city.cityLabel,
    destinationId: city.destinationId,
    kind: 'city',
    subject,
    memberCount: city.memberCountBySubject[subject],
    heroBlurbHe: city.blurbBySubject[subject],
    isRecommended: false,
  })),
);

const recommended: Forum[] = [
  {
    id: 'forum-buenos-aires-meetups',
    slug: 'buenos-aires-meetups',
    nameEn: SUBJECT_LABEL.meetups,
    nameHe: SUBJECT_LABEL.meetups,
    cityLabel: 'Buenos Aires',
    destinationId: 'buenos-aires',
    kind: 'city',
    subject: 'meetups',
    memberCount: 142,
    heroBlurbHe:
      'Palermo coffee meetups, San Telmo Sunday market crew, asado plans.',
    isRecommended: true,
  },
];

export const forums: Forum[] = [...joined, ...recommended];
