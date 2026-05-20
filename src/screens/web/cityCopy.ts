export const CITY_DESCRIPTIONS: Record<string, string> = {
  buzios:
    'Brigitte Bardot put Búzios on the map in the 60s. The peninsula holds twenty beaches in a one-hour drive, cobbled streets that empty at sunset, and the calmest water on the Rio coast.',
  'sao-paulo':
    "Brazil's restless engine, with the best food in the southern hemisphere and the nightlife to match. Skip the postcards. Eat through Vila Madalena, drink standing on Rua Augusta, sleep through Monday.",
  jericoacoara:
    'Dunes that swallow the streetlights at night. Wind that bends the palms by mid-afternoon. Barefoot mornings, kitesurf afternoons, lagoons that stay warm past midnight.',
  'buenos-aires':
    'A European capital with Latin lungs. Asado till midnight, tango at the milonga, breakfast at dawn. Five days barely scrapes Palermo, San Telmo, and the bookshop on Avenida Santa Fe.',
  'punta-del-este':
    "Uruguay's coastal exhale after Argentina's noise. Casapueblo for the sunset, José Ignacio for the fish, Punta itself for the long, slow Atlantic stretch.",
};

export function cityDescription(stopId: string, fallback?: string): string {
  return CITY_DESCRIPTIONS[stopId] ?? fallback ?? '';
}
