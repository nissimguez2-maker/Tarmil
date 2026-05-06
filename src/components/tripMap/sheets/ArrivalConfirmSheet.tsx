import { X } from 'lucide-react';
import { Button } from '../../Button';
import type { PlannedStop } from '../../../data/plannedStops';

type Props = {
  stop: PlannedStop;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * Gentle "did you arrive?" confirmation. Per the brief this is optional/TBD —
 * the demo shows the concept without being creepy: privacy-first language,
 * dismiss is the primary affordance, confirm is opt-in.
 */
export function ArrivalConfirmSheet({ stop, onConfirm, onDismiss }: Props) {
  return (
    <div className="flex flex-col gap-md p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-copper">בדיקה עדינה</span>
          <h3 className="font-serif text-lede leading-tight">
            הגעת ל{stop.nameHe}?
          </h3>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onDismiss}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="text-body leading-snug text-cocoa-70">
        אם הגעת, נוסיף את {stop.nameHe} למסלול שעברת בפועל. אם לא — לא נוגעים
        בכלום.
      </p>

      <div className="flex items-center gap-sm">
        <Button variant="ghost" onClick={onDismiss}>
          לא עכשיו
        </Button>
        <Button variant="accent" onClick={onConfirm}>
          הוסף למסע
        </Button>
      </div>

      <p className="text-[9pt] leading-snug text-cocoa-55">
        תמיד פרטי. תרמיל לעולם לא מסיק את התנועה שלך אוטומטית.
      </p>
    </div>
  );
}
