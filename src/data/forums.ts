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
      accommodation:
        'Hostels, Airbnbs and which neighborhoods feel safe at night.',
      transits:
        'Metro, taxis, buses, Uber, the airport run — how to move around.',
      scams_danger:
        'No-go streets, fake taxis, beach scams, what to do if it gets weird.',
      food:
        'Açaí bowls, churrascarias on a budget, the best pão de queijo in Botafogo.',
      activities_treks:
        'Pão de Açúcar sunrise hikes, Tijuca trails, surf lessons in Ipanema.',
      nightlife_parties:
        'Lapa blocos, baile funk recommendations, who is going out tonight.',
      money_visas:
        'ATMs, cash-vs-card, exchange spots, visa runs and paperwork.',
      meetups:
        'Israeli get-togethers, hostel pickups, "who is here this week?".',
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
      accommodation:
        'Pousadas, beach hostels and where to stay if you do not have a car.',
      transits:
        'Getting in from Rio, scooters, taxis and the beach hop route.',
      scams_danger:
        'Mostly chill, but: beach pickpockets, peak-season overcharges.',
      food:
        'Seafood under fairy lights, açaí shacks, where the locals eat lunch.',
      activities_treks:
        'Boat trips to 12-beach loops, kayak rentals, snorkel spots.',
      nightlife_parties:
        'Beach bars on Rua das Pedras, sunset DJ sets, full-moon parties.',
      money_visas:
        'ATMs are limited — bring cash from Rio. Card friendliness.',
      meetups:
        'Long-weekend crews, peninsula day-trippers from Rio, who is in.',
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
      accommodation:
        'Vila Madalena vs Jardins, where to crash, the youth hostel scene.',
      transits:
        'Metro is the move. Ubers OK, taxis sketchy at the airport.',
      scams_danger:
        'Where not to walk at night, phone snatches, the standard SP rules.',
      food:
        'Asado in Vila Madalena, ramen in Liberdade, pastel in the markets.',
      activities_treks:
        'Day trips to Embu, Santos beach runs, MASP exhibits worth queueing for.',
      nightlife_parties:
        'Vila Madalena bar crawls, Augusta clubs, electronic nights in Bixiga.',
      money_visas:
        'ATMs everywhere, card-friendly city, federal police for visa work.',
      meetups:
        'Israeli expats meetups, weekly coffee at Paulista, hostel buddies.',
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
      accommodation:
        'Pousadas, kitesurfer hostels and the no-cars-in-town quirk.',
      transits:
        'Fortaleza bus + buggy. The sand street rules. Day trip logistics.',
      scams_danger:
        'Tiny town, mostly fine. The kitesurf school overcharge is the main one.',
      food:
        'Beachfront grilled fish, açaí bowls, the best caipirinha in town.',
      activities_treks:
        'Kitesurf lessons, buggy tours, lagoon hopping, dune sandboarding.',
      nightlife_parties:
        'Sunset at Duna do Pôr-do-Sol, forró on the sand, full-moon bonfires.',
      money_visas:
        'Limited ATMs — bring reais from Fortaleza. Most pousadas take cards.',
      meetups:
        'Kite crews looking for partners, dune sunset groups, jeep-share rides.',
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
    heroBlurbHe:
      'Palermo coffee meetups, San Telmo Sunday market crew, asado plans.',
    isRecommended: true,
  },
];

export const forums: Forum[] = [...joined, ...recommended];
