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
    <div className="absolute inset-x-0 bottom-0 z-[800] flex flex-col gap-sm rounded-t-[20px] border-t border-cocoa-15 bg-ivory px-md pb-md pt-sm shadow-sheet">
      <span className="meta-caps text-copper">בחירת יעד במפה</span>
      <p className="text-small leading-snug text-cocoa-70">
        גרור את המפה כך שהסיכה תהיה במרכז היעד שלך.
      </p>
      <div className="flex items-center gap-sm">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          ביטול
        </Button>
        <Button variant="accent" size="sm" onClick={onConfirm}>
          אישור
        </Button>
      </div>
    </div>
  );
}
