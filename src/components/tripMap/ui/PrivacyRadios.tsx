import clsx from 'clsx';
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
  { value: 'private', label: 'Private', hint: 'Only I can see the stop.' },
  { value: 'friends', label: 'Friends', hint: 'Lets friends see overlaps with you.' },
  { value: 'hidden', label: 'Hidden', hint: 'Not counted for overlaps. Total silence.' },
];

export function PrivacyRadios({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="meta-caps text-cocoa-55">Who can see overlaps?</span>
      <div className="flex flex-col">
        {OPTIONS.map((opt, i) => (
          <label
            key={opt.value}
            className={clsx(
              'flex cursor-pointer items-start gap-sm py-sm',
              i > 0 && 'border-t border-cocoa-15',
            )}
          >
            <input
              type="radio"
              name="planned-stop-privacy"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-1 h-4 w-4 shrink-0 accent-copper"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-body text-cocoa">{opt.label}</span>
              <span className="text-small text-cocoa-55">{opt.hint}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
