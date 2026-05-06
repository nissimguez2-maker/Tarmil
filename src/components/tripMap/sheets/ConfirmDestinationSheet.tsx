import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../Button';
import { PrivacyRadios } from '../ui/PrivacyRadios';
import { nightsBetween } from '../utils/nightsBetween';
import type {
  PlannedStop,
  PlannedStopPrivacy,
} from '../../../data/plannedStops';

type Props = {
  candidate: { nameHe: string; latlng: [number, number] };
  /** When set, the sheet edits an existing stop instead of creating one. */
  editingStop?: PlannedStop;
  onSave: (stop: PlannedStop) => void;
  onClose: () => void;
};

const DEFAULT_ARRIVAL = '2026-11-15';
const DEFAULT_DEPARTURE = '2026-11-18';

export function ConfirmDestinationSheet({
  candidate,
  editingStop,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(editingStop?.nameHe ?? candidate.nameHe);
  const [arrivalDate, setArrivalDate] = useState(
    editingStop?.arrivalDate ?? DEFAULT_ARRIVAL,
  );
  const [departureDate, setDepartureDate] = useState(
    editingStop?.departureDate ?? DEFAULT_DEPARTURE,
  );
  const [privacy, setPrivacy] = useState<PlannedStopPrivacy>(
    editingStop?.privacy ?? 'friends',
  );
  const [note, setNote] = useState(editingStop?.note ?? '');

  const nights = Math.max(0, nightsBetween(arrivalDate, departureDate));
  const isEditing = !!editingStop;

  const handleSave = () => {
    const trimmedName = name.trim() || candidate.nameHe || 'יעד חדש';
    const stop: PlannedStop = {
      id: editingStop?.id ?? `stop-${Date.now()}`,
      nameHe: trimmedName,
      nameEn: editingStop?.nameEn ?? trimmedName,
      type: editingStop?.type ?? 'city',
      lat: candidate.latlng[0],
      lng: candidate.latlng[1],
      arrivalDate,
      departureDate,
      nights,
      privacy,
      note: note.trim() || undefined,
      friendOverlapIds: editingStop?.friendOverlapIds,
      savedPlaceIds: editingStop?.savedPlaceIds,
    };
    onSave(stop);
  };

  return (
    <div className="flex max-h-[80dvh] flex-col gap-md overflow-y-auto p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-cocoa-70">
            {isEditing ? 'ערוך יעד' : 'יעד חדש'}
          </span>
          <h2 className="font-serif text-lede leading-tight">
            פרטי היעד
          </h2>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">שם היעד</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          dir="rtl"
          className="h-11 w-full rounded-full border border-cocoa-15 bg-sand px-md text-body text-cocoa focus:border-copper focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">מתי תהיה שם?</span>
        <div className="flex flex-col gap-2">
          <DateField
            label="תאריך הגעה"
            value={arrivalDate}
            onChange={setArrivalDate}
          />
          <DateField
            label="תאריך יציאה"
            value={departureDate}
            onChange={setDepartureDate}
          />
        </div>
        <span className="text-small text-cocoa-70">
          <span className="tnum">{nights}</span> לילות
        </span>
      </div>

      <PrivacyRadios value={privacy} onChange={setPrivacy} />

      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">הערה (אופציונלי)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          dir="rtl"
          placeholder="לדוגמה: לבדוק טיסה מבנגקוק…"
          className="resize-none rounded-md border border-cocoa-15 bg-sand p-sm text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />
      </div>

      <Button variant="accent" onClick={handleSave} fullWidth>
        {isEditing ? 'שמור שינויים' : 'שמור לנסיעה'}
      </Button>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex h-11 cursor-pointer items-center justify-between gap-sm rounded-full border border-rope bg-sand px-md text-cocoa focus-within:border-copper">
      <span className="text-small text-cocoa-55">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        aria-label={label}
        className="tnum cursor-pointer border-none bg-transparent text-body text-cocoa focus:outline-none"
      />
    </label>
  );
}
