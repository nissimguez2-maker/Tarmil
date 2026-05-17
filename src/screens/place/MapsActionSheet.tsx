import clsx from 'clsx';
import { ChevronRight, Map, MapPin, Navigation as NavIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Place } from '../../data/places';

type MapsProvider = 'apple' | 'google' | 'waze';

type Props = {
  open: boolean;
  place: Place;
  onClose: () => void;
};

const PROVIDERS: Array<{
  id: MapsProvider;
  label: string;
  meta: string;
  Icon: LucideIcon;
}> = [
  { id: 'apple', label: 'Apple Maps', meta: 'Default on iPhone', Icon: MapPin },
  { id: 'google', label: 'Google Maps', meta: 'Best for searching abroad', Icon: Map },
  { id: 'waze', label: 'Waze', meta: 'Driving with live traffic', Icon: NavIcon },
];

/**
 * Inline expansion below the "Get directions" button on PlaceScreen. Tapping
 * a provider opens the place in that app's web URL — no real API hit, just a
 * window.open hand-off. The phone OS hands control to the appropriate native
 * app when one of these schemes resolves.
 */
export function MapsActionSheet({ open, place, onClose }: Props) {
  const handlePick = (provider: MapsProvider) => {
    const url = buildUrl(provider, place);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="menu"
      aria-label="Open in a maps app"
      className="flex flex-col overflow-hidden rounded-2xl border border-cocoa-15 bg-sand"
    >
      <div className="flex items-center justify-between border-b border-cocoa-15 px-md py-sm">
        <span className="meta-caps text-copper">Open in maps</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="text-small text-cocoa-55 transition-colors duration-instant ease-out-quart hover:text-cocoa focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2"
        >
          Cancel
        </button>
      </div>
      <ul className="flex flex-col">
        {PROVIDERS.map(({ id, label, meta, Icon }, i) => (
          <li key={id}>
            <button
              type="button"
              role="menuitem"
              onClick={() => handlePick(id)}
              className={clsx(
                'flex w-full items-center gap-md px-md py-3 text-start',
                'transition-colors duration-instant ease-out-quart active:bg-cocoa-08',
                i < PROVIDERS.length - 1 && 'border-b border-cocoa-15',
              )}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa text-ivory">
                <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-serif text-lede leading-tight text-cocoa ltr">
                  {label}
                </span>
                <span className="text-small text-cocoa-55">{meta}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-cocoa-55" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildUrl(provider: MapsProvider, place: Place): string {
  const { lat, lng, englishName } = place;
  const q = encodeURIComponent(englishName);
  switch (provider) {
    case 'apple':
      return `https://maps.apple.com/?q=${q}&ll=${lat},${lng}`;
    case 'google':
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    case 'waze':
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }
}
