import {
  siAircanada,
  siAirchina,
  siAirfrance,
  siAirindia,
  siAirserbia,
  siAirbnb,
  siAeromexico,
  siAmericanairlines,
  siAna,
  siAvianca,
  siBookingdotcom,
  siBritishairways,
  siCopaairlines,
  siDelta,
  siDeutschebahn,
  siEasyjet,
  siEmirates,
  siIberia,
  siIndigo,
  siJapanairlines,
  siJetblue,
  siKlm,
  siLufthansa,
  siQantas,
  siQatarairways,
  siRyanair,
  siSingaporeairlines,
  siSncf,
  siTurkishairlines,
  siUnitedairlines,
  siVirginatlantic,
  siWizzair,
  type SimpleIcon,
} from 'simple-icons';

/**
 * Per-operator brand marks for the /web Transport panel.
 *
 * Two-step lookup keeps tree-shaking honest: a normalised `provider` string is
 * resolved to a `simple-icons` slug, which then resolves to the imported icon
 * record. Anything that doesn't match a known slug returns `null` so the
 * `OperatorMark` component can fall through to the initials chip (still
 * tasteful, never broken).
 *
 * Brand hexes are data (not Tailwind tokens) — same pattern the Mapbox heatmap
 * layer uses for its colour ramp. They flow into inline `<svg fill={hex}>` and
 * never into `className`, so DA token discipline stays intact.
 */

/** Strip diacritics + non-alphanumerics so "Aerolíneas Argentinas" → "aerolineasargentinas". */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Imported icon records, indexed by simple-icons slug. */
const ICONS: Record<string, SimpleIcon> = {
  aircanada: siAircanada,
  airchina: siAirchina,
  airfrance: siAirfrance,
  airindia: siAirindia,
  airserbia: siAirserbia,
  airbnb: siAirbnb,
  aeromexico: siAeromexico,
  americanairlines: siAmericanairlines,
  ana: siAna,
  avianca: siAvianca,
  bookingdotcom: siBookingdotcom,
  britishairways: siBritishairways,
  copaairlines: siCopaairlines,
  delta: siDelta,
  deutschebahn: siDeutschebahn,
  easyjet: siEasyjet,
  emirates: siEmirates,
  iberia: siIberia,
  indigo: siIndigo,
  japanairlines: siJapanairlines,
  jetblue: siJetblue,
  klm: siKlm,
  lufthansa: siLufthansa,
  qantas: siQantas,
  qatarairways: siQatarairways,
  ryanair: siRyanair,
  singaporeairlines: siSingaporeairlines,
  sncf: siSncf,
  turkishairlines: siTurkishairlines,
  unitedairlines: siUnitedairlines,
  virginatlantic: siVirginatlantic,
  wizzair: siWizzair,
};

/**
 * Normalised provider string → simple-icons slug.
 *
 * Multiple keys can map to the same slug (e.g., "SNCF TGV" and "SNCF" both
 * → `sncf`) — that's how the seed data's slightly-rich provider strings
 * resolve to the cleaner brand mark.
 */
const PROVIDER_TO_SLUG: Record<string, string> = {
  // ── Flight ──
  aircanada: 'aircanada',
  airchina: 'airchina',
  airfrance: 'airfrance',
  airindia: 'airindia',
  airserbia: 'airserbia',
  aeromexico: 'aeromexico',
  americanairlines: 'americanairlines',
  ana: 'ana',
  allnipponairways: 'ana',
  avianca: 'avianca',
  britishairways: 'britishairways',
  copa: 'copaairlines',
  copaairlines: 'copaairlines',
  delta: 'delta',
  deltaairlines: 'delta',
  easyjet: 'easyjet',
  emirates: 'emirates',
  iberia: 'iberia',
  indigo: 'indigo',
  jal: 'japanairlines',
  japanairlines: 'japanairlines',
  jetblue: 'jetblue',
  klm: 'klm',
  lufthansa: 'lufthansa',
  qantas: 'qantas',
  qatarairways: 'qatarairways',
  ryanair: 'ryanair',
  singaporeairlines: 'singaporeairlines',
  turkishairlines: 'turkishairlines',
  united: 'unitedairlines',
  unitedairlines: 'unitedairlines',
  virginatlantic: 'virginatlantic',
  wizzair: 'wizzair',
  // ── Train ──
  sncf: 'sncf',
  sncftgv: 'sncf',
  deutschebahn: 'deutschebahn',
  deutschebahnice: 'deutschebahn',
  // ── Stay platforms (not used by Transport panel today but the registry
  //    is a natural home if we add a "Stays" sheet later, à la Polarsteps) ──
  airbnb: 'airbnb',
  booking: 'bookingdotcom',
  bookingcom: 'bookingdotcom',
  bookingdotcom: 'bookingdotcom',
};

export type OperatorBrand = {
  /** Hex string with leading `#`, ready to drop into an inline `fill`. */
  hex: string;
  /** Raw `d` attribute for the simple-icons SVG path. */
  path: string;
  /** Brand title (e.g., "British Airways") for `<title>` / aria-label. */
  title: string;
};

export function resolveOperatorBrand(provider: string): OperatorBrand | null {
  const slug = PROVIDER_TO_SLUG[normalize(provider)];
  if (!slug) return null;
  const icon = ICONS[slug];
  if (!icon) return null;
  return { hex: `#${icon.hex}`, path: icon.path, title: icon.title };
}
