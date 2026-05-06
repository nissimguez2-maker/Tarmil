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
    <div
      className="absolute inset-x-md bottom-md z-[800] flex flex-col gap-sm rounded-md border border-rope bg-ivory p-md"
      style={{ boxShadow: '0 -10px 30px -10px rgba(53, 40, 24, 0.20)' }}
    >
      <span className="meta-caps text-copper">בחירת יעד במפה</span>
      <p className="text-[10pt] leading-snug text-cocoa-70">
        גרור את המפה כך שהסיכה תהיה במרכז היעד שלך.
      </p>
      <div className="flex items-center gap-sm">
        <Button variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
        <Button variant="accent" onClick={onConfirm}>
          אישור
        </Button>
      </div>
    </div>
  );
}
