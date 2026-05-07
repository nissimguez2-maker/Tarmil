/**
 * Hex values mirrored from src/brand/tokens.css for use with third-party
 * libraries (Leaflet, SVG attributes) whose APIs don't accept CSS custom
 * properties.
 *
 * MUST stay in sync with brand/tokens.css. Update both files together.
 */
export const mapColors = {
  ivory: '#F4EBD5',
  sand: '#EAD8C0',
  rope: '#D1BB9E',
  cocoa: '#352818',
  cocoa70: 'rgba(53, 40, 24, 0.70)',
  cocoa55: 'rgba(53, 40, 24, 0.55)',
  cocoa30: 'rgba(53, 40, 24, 0.30)',
  cocoa15: 'rgba(53, 40, 24, 0.15)',
  copper: '#A64B29',
  copper85: 'rgba(166, 75, 41, 0.85)',
  copper70: 'rgba(166, 75, 41, 0.70)',
} as const;
