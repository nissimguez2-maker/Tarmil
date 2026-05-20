import { MapPin, X } from 'lucide-react';
import clsx from 'clsx';
import { ADDABLE_CITIES, type AddableCity } from './addableCities';
import { cityPhotos } from './cityPhotos';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (city: AddableCity) => void;
  existingStopIds: string[];
};

export function WebAddStopModal({ open, onClose, onAdd, existingStopIds }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-cocoa/40 flex items-center justify-center p-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '480px' }}
        className="bg-ivory border border-rope rounded-3xl shadow-panel p-md flex flex-col gap-md relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-sm end-sm h-8 w-8 rounded-full flex items-center justify-center text-cocoa-55 hover:text-cocoa hover:bg-cocoa-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <X size={16} strokeWidth={2} />
        </button>
        <div className="flex flex-col gap-xs pe-12">
          <p className="meta-caps text-cocoa-55">Add stop</p>
          <h2 className="font-serif text-sub text-cocoa leading-tight">
            Extend your trip
          </h2>
          <p className="text-small text-cocoa-55">
            Pick a city. It lands after your last stop with a default duration; drag it into place from the sidebar.
          </p>
        </div>
        <div className="flex flex-col gap-sm">
          {ADDABLE_CITIES.map((city) => {
            const alreadyAdded = existingStopIds.includes(city.id);
            return (
              <CityRow
                key={city.id}
                city={city}
                disabled={alreadyAdded}
                onAdd={() => {
                  onAdd(city);
                  onClose();
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CityRow({
  city,
  disabled,
  onAdd,
}: {
  city: AddableCity;
  disabled: boolean;
  onAdd: () => void;
}) {
  const thumb = cityPhotos(city.id)[0];
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className={clsx(
        'group w-full text-start rounded-2xl border bg-sand p-sm flex gap-sm items-center transition-[border-color,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        disabled
          ? 'border-cocoa-15 opacity-50 cursor-not-allowed'
          : 'border-rope hover:border-copper',
      )}
    >
      <div className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-rope to-sand">
        {thumb && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-xs">
        <h3 className="font-serif text-lede text-cocoa leading-tight">
          {city.nameEn}
        </h3>
        <p className="text-small text-cocoa-70 leading-snug">{city.blurb}</p>
        <p className="text-meta uppercase text-cocoa-55">
          {disabled ? 'Already in trip' : `${city.defaultNights} night default`}
        </p>
      </div>
      {!disabled && (
        <span className="shrink-0 text-copper">
          <MapPin size={16} strokeWidth={2} />
        </span>
      )}
    </button>
  );
}
