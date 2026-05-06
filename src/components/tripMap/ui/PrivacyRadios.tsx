import type { PlannedStopPrivacy } from '../../../data/plannedStops';

type Props = {
  value: PlannedStopPrivacy;
  onChange: (v: PlannedStopPrivacy) => void;
};

const OPTIONS: Array<{
  value: PlannedStopPrivacy;
  label: string;
  hint: string;
}> = [
  { value: 'private', label: 'פרטי', hint: 'רק אני רואה את היעד.' },
  { value: 'friends', label: 'חברים', hint: 'מאפשר זיהוי חפיפות עם חברים.' },
  { value: 'hidden', label: 'מוסתר', hint: 'לא נכלל בחפיפות. שקט מוחלט.' },
];

export function PrivacyRadios({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-sm">
      <span className="meta-caps text-cocoa-55">מי יכול לראות חפיפות?</span>
      <div className="flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-sm py-1"
          >
            <input
              type="radio"
              name="planned-stop-privacy"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-1 h-4 w-4 accent-copper"
            />
            <div className="flex flex-col">
              <span className="text-body text-cocoa">{opt.label}</span>
              <span className="text-[10pt] text-cocoa-55">{opt.hint}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
