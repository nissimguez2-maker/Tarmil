/**
 * Forums — one per (city × subject) pair. v0.6 expanded the subject set
 * from 5 (Israel-flavored) to 8 (international): accommodation, transits,
 * scams_danger, food, activities_treks, nightlife_parties, money_visas,
 * meetups.
 *
 * SEED ONLY. Runtime data is read from the `forums` table in Supabase
 * via SupabaseDataProvider. Nothing in `src/` imports this array outside
 * `scripts/seed-supabase.ts`.
 *
 * Joined cities: Rio, Búzios, São Paulo, Jericoacoara → 8 subject forums
 * each = 32 forums. Buenos Aires keeps a single Meetups forum surfaced
 * under "Recommended for you" with a join CTA.
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
 * Each subject has a stable display label. Icons live in
 * `src/components/forums/ForumRow.tsx`.
 */
export const SUBJECT_LABEL: Record<ForumSubject, string> = {
  accommodation: 'Accommodation',
  transits: 'Transits',
  scams_danger: 'Scams & danger',
  food: 'Food',
  activities_treks: 'Activities & treks',
  nightlife_parties: 'Nightlife & parties',
  money_visas: 'Money & visas',
  meetups: 'Meetups',
};

const SUBJECTS_ALL: ForumSubject[] = [
  'accommodation',
  'transits',
  'scams_danger',
  'food',
  'activities_treks',
  'nightlife_parties',
  'money_visas',
  'meetups',
];

type CitySeed = {
  citySlug: string;
  destinationId: string;
  nameEn: string;
  cityLabel: string;
  blurbBySubject: Record<ForumSubject, string>;
  memberCountBySubject: Record<ForumSubject, number>;
};

const CITY_SEEDS: CitySeed[] = [
  {
    citySlug: 'rio',
    destinationId: 'rio-de-janeiro',
    nameEn: 'Rio de Janeiro',
    cityLabel: 'Rio de Janeiro',
    blurbBySubject: {
      accommodation: 'Hostels, neighbourhoods, what is actually safe at night',
      transits: 'Metro, Uber, taxis, the GIG airport run',
      scams_danger: 'What to watch for in Lapa, Copa, Centro',
      food: 'Açaí, churrasco, where Israelis eat in Botafogo',
      activities_treks: 'Pão de Açúcar, Tijuca trails, Ipanema surf',
      nightlife_parties: 'Lapa blocos, baile funk, who is out tonight',
      money_visas: 'ATMs, Wise vs cash, federal police hours',
      meetups: 'Who is in Rio this week',
    },
    memberCountBySubject: {
      accommodation: 246,
      transits: 198,
      scams_danger: 312,
      food: 174,
      activities_treks: 156,
      nightlife_parties: 198,
      money_visas: 167,
      meetups: 211,
    },
  },
  {
    citySlug: 'buzios',
    destinationId: 'buzios',
    nameEn: 'Búzios',
    cityLabel: 'Búzios',
    blurbBySubject: {
      accommodation: 'Pousadas, beach hostels, which streets get loud',
      transits: 'Rio drive, scooters, the beach hop route',
      scams_danger: 'Beach pickpockets, peak-season overcharges',
      food: 'Seafood, açaí shacks, where locals eat lunch',
      activities_treks: 'The 12-beach boat loop, kayaks, snorkel spots',
      nightlife_parties: 'Rua das Pedras bars, sunset DJs, full moons',
      money_visas: 'ATMs are limited. Bring cash from Rio',
      meetups: 'Weekend crews, day trips from Rio',
    },
    memberCountBySubject: {
      accommodation: 98,
      transits: 74,
      scams_danger: 56,
      food: 83,
      activities_treks: 71,
      nightlife_parties: 92,
      money_visas: 41,
      meetups: 64,
    },
  },
  {
    citySlug: 'sao-paulo',
    destinationId: 'sao-paulo',
    nameEn: 'São Paulo',
    cityLabel: 'São Paulo',
    blurbBySubject: {
      accommodation: 'Vila Madalena vs Jardins, the hostel scene',
      transits: 'Metro, Uber, GRU airport at night',
      scams_danger: 'Where not to walk at night, phone snatches',
      food: 'Asado in Vila Mada, ramen in Liberdade, market pastels',
      activities_treks: 'Embu day trips, Santos beaches, MASP',
      nightlife_parties: 'Vila Madalena, Augusta, Bixiga electronic',
      money_visas: 'ATMs everywhere, federal police for visa work',
      meetups: 'Israeli meetups, Paulista coffee, hostel crews',
    },
    memberCountBySubject: {
      accommodation: 211,
      transits: 184,
      scams_danger: 263,
      food: 189,
      activities_treks: 98,
      nightlife_parties: 167,
      money_visas: 142,
      meetups: 142,
    },
  },
  {
    citySlug: 'jericoacoara',
    destinationId: 'jericoacoara',
    nameEn: 'Jericoacoara',
    cityLabel: 'Jericoacoara',
    blurbBySubject: {
      accommodation: 'Pousadas, kitesurf hostels, no cars in town',
      transits: 'Fortaleza bus + buggy. The sand street rules',
      scams_danger: 'Tiny town. Kitesurf school overcharge is the one',
      food: 'Beachfront fish, açaí bowls, the caipirinha to try',
      activities_treks: 'Kitesurf, buggy tours, lagoons, sandboarding',
      nightlife_parties: 'Sunset at Duna do Pôr-do-Sol, forró, full moons',
      money_visas: 'Limited ATMs. Bring reais from Fortaleza',
      meetups: 'Kite crews, sunset groups, jeep-share rides',
    },
    memberCountBySubject: {
      accommodation: 92,
      transits: 81,
      scams_danger: 38,
      food: 67,
      activities_treks: 124,
      nightlife_parties: 78,
      money_visas: 34,
      meetups: 91,
    },
  },
];

const joined: Forum[] = CITY_SEEDS.flatMap((city) =>
  SUBJECTS_ALL.map((subject): Forum => ({
    id: `forum-${city.citySlug}-${subject.replace(/_/g, '-')}`,
    slug: `${city.citySlug}-${subject.replace(/_/g, '-')}`,
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
    heroBlurbHe: 'Palermo coffee, San Telmo Sunday market, asado plans',
    isRecommended: true,
  },
];

export const forums: Forum[] = [...joined, ...recommended];
