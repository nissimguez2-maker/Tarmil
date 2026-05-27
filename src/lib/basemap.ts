/**
 * Shared basemap (map tiles) for both the mobile Trip map and the web planner.
 *
 * Priority: Mapbox (premium, brand-tinted) → TomTom → CARTO fallback.
 *
 * Mapbox uses the clean "light" style at retina (@2x) resolution — the same
 * class of map you see in Apple/Google Maps — warmed toward the Tarmil cream /
 * charcoal palette via a CSS filter on the tile pane (see the
 * `.tarmil-basemap--mapbox` rule in index.css). Set VITE_MAPBOX_TOKEN to enable
 * it; without the token the map quietly falls back, so a missing token never
 * breaks the build.
 */
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_KEY as string | undefined;

// Clean, minimal light base. Swap for a custom Mapbox Studio style id later for
// a fully bespoke look (e.g. 'your-account/your-style-id').
const MAPBOX_STYLE = 'mapbox/light-v11';

type TileOptions = {
  tileSize?: number;
  zoomOffset?: number;
  maxZoom: number;
  attribution: string;
  subdomains?: string;
};

export type Basemap = {
  provider: 'mapbox' | 'tomtom' | 'carto';
  url: string;
  options: TileOptions;
};

export function getBasemap(): Basemap {
  if (MAPBOX_TOKEN) {
    return {
      provider: 'mapbox',
      url: `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`,
      options: {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
        attribution: '© Mapbox © OpenStreetMap',
      },
    };
  }
  if (TOMTOM_KEY) {
    return {
      provider: 'tomtom',
      url: `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${TOMTOM_KEY}&tileSize=512`,
      options: {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
        attribution: '© TomTom',
      },
    };
  }
  return {
    provider: 'carto',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
    },
  };
}
