import type { Place } from '../../../data/places';

export function categoryLabel(c: Place['category']): string {
  switch (c) {
    case 'beach':
      return 'Beach';
    case 'hostel':
      return 'Hostel';
    case 'cafe':
      return 'Café';
    case 'restaurant':
      return 'Restaurant';
    case 'bar':
      return 'Bar';
    case 'club':
      return 'Club';
    case 'chabad':
      return 'Chabad';
    case 'kosher':
      return 'Kosher';
    case 'synagogue':
      return 'Synagogue';
    case 'mikveh':
      return 'Mikveh';
    case 'landmark':
      return 'Landmark';
  }
}
