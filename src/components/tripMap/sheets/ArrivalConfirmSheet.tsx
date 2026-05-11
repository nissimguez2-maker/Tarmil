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
    <div className="flex flex-col gap-md px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-copper">בדיקה עדינה</span>
          <h3 className="font-serif text-lede leading-tight text-cocoa">
            הגעת ל{stop.nameHe}?
          </h3>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onDismiss}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <p className="text-body leading-snug text-cocoa-70">
        אם הגעת, נוסיף את {stop.nameHe} למסלול שעברת בפועל. אם לא — לא נוגעים
        בכלום.
      </p>

      <div className="flex items-center gap-sm">
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          לא עכשיו
        </Button>
        <Button variant="accent" size="sm" onClick={onConfirm}>
          הוסף למסע
        </Button>
      </div>

      <p className="text-small leading-snug text-cocoa-55">
        תמיד פרטי. תרמיל לעולם לא מסיק את התנועה שלך אוטומטית.
      </p>
    </div>
  );
}
