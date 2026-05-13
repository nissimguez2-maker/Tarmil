import { Button } from '../../Button';

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Bottom action bar shown in pick mode — cancel returns to the search sheet
 * (handled by the reducer) and confirm reads the map center and opens the
 * destination-confirmation sheet.
 */
export function PickOnMapBar({ onCancel, onConfirm }: Props) {
  return (
    <div className="absolute inset-x-md bottom-[88px] z-[800] flex flex-col gap-sm rounded-2xl bg-ivory px-md pb-md pt-sm shadow-card">
      <span className="meta-caps text-copper">Pick a spot on the map</span>
      <p className="text-small leading-snug text-cocoa-70">
        Drag the map so the pin sits on your destination.
      </p>
      <div className="flex items-center gap-sm">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="accent" size="sm" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
