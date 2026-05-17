import type { PlaceCategory } from './places';
import type { ForumSubject } from './forumThreads';
import { SUBJECT_LABEL } from './forums';

/**
 * Map a place's category to the forum subject most likely to discuss it.
 * Loose mapping — meant for "Discuss in forum" CTAs on PlaceScreen and
 * the reverse "Places to try" strip on ForumScreen.
 */
const CATEGORY_TO_SUBJECT: Record<PlaceCategory, ForumSubject> = {
  beach: 'activities_treks',
  hostel: 'accommodation',
  cafe: 'food',
  restaurant: 'food',
  bar: 'nightlife_parties',
  club: 'nightlife_parties',
  chabad: 'meetups',
  kosher: 'food',
  landmark: 'activities_treks',
};

export function subjectForCategory(category: PlaceCategory): ForumSubject {
  return CATEGORY_TO_SUBJECT[category];
}

export function subjectLabelForCategory(category: PlaceCategory): string {
  return SUBJECT_LABEL[CATEGORY_TO_SUBJECT[category]];
}
