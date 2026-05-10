import { useState } from 'react';
import clsx from 'clsx';
import { Settings, RotateCcw, Star, EyeOff, Eye } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { pastLegMeta } from '../../data/myTrip';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import type { PlannedStop } from '../../data/plannedStops';

const PAST_LEG_ORDER: Array<keyof typeof pastLegMeta> = [
  'greece2024',
  'coteAzur2025',
  'southeastAsia2025',
  'brazil2026',
];

const REVIEWS = [
  {
    placeName: 'חוף ארפואדור',
    placeCity: 'ריו דה ז׳ניירו',
    stars: 5,
    text: 'שקיעה ראשונה בריו, כולם מוחאים כפיים. רגע שקשה לשכוח.',
  },
  {
    placeName: 'דיסקאברי הוסטל',
    placeCity: 'ריו דה ז׳ניירו',
    stars: 5,
    text: 'בית בגלוריה — חברים חדשים בסלון, כיוונים בוואטסאפ, חיבוקים בכניסה.',
  },
  {
    placeName: 'מבשלת ברלינה',
    placeCity: 'בריצ׳ה',
    stars: 4,
    text: 'בירת חיטה אחרי יום סקי. מנגלים בחוץ, כלבים ברגליים, ביקשתי שוב.',
  },
];

export function ProfileScreen() {
  const { data, loading, error, resetDemo } = useSupabaseData();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [offGrid, setOffGrid] = useState(false);
  const [fofEnabled, setFofEnabled] = useState(false);
  const [hiddenStopIds, setHiddenStopIds] = useState<Set<string>>(new Set());

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const handleReset = async () => {
    setResetting(true);
    setResetMessage(null);
    try {
      await resetDemo();
      setResetMessage('מצב ההדגמה אופס.');
    } catch (e) {
      setResetMessage(e instanceof Error ? e.message : 'נכשל לאפס.');
    } finally {
      setResetting(false);
    }
  };

  const toggleStopVisibility = (id: string) => {
    setHiddenStopIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Screen>
      <TopBar
        eyebrow="Tarmil"
        title="פרופיל"
        end={
          <button
            type="button"
            aria-label="הגדרות"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </button>
        }
      />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <header className="flex items-center gap-md">
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cocoa font-serif text-sub text-ivory"
            aria-hidden
          >
            נ
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-sub leading-tight">נסים גז</span>
            <span className="text-[10pt] text-cocoa-55">
              מטייל מאז יולי 2024
            </span>
          </div>
        </header>

        <SectionLabel number="01" label="The arc so far." />

        <p className="max-w-body text-body text-cocoa-70">
          המסלול הרב-שנתי שלך, בתאריכים מלאים. רק אתה רואה אותו ככה — לחברים
          התאריכים מוצגים ברמת עונה ושנה בלבד.
        </p>

        <ul className="flex flex-col">
          {PAST_LEG_ORDER.map((key, i) => {
            const m = pastLegMeta[key];
            return (
              <li
                key={key}
                className={clsx(
                  'flex items-start gap-md py-3',
                  i < PAST_LEG_ORDER.length - 1 && 'border-b border-cocoa-15',
                )}
              >
                <span className="mt-1 inline-flex h-3 w-3 shrink-0 rounded-full bg-cocoa" aria-hidden />
                <div className="flex flex-1 flex-col">
                  <span className="font-serif text-lede leading-tight">
                    {m.label}
                  </span>
                  <span className="text-[10pt] tnum text-cocoa-55">
                    {formatDateRange(m.startIso, m.endIso)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <SectionLabel number="02" label="Declared future trips." />

        {data.plannedStops.length === 0 ? (
          <p className="text-body text-cocoa-55">
            אין יעדים מוצהרים. הוסף ראשון מהמפה.
          </p>
        ) : (
          <ul className="flex flex-col gap-sm">
            {data.plannedStops.map((stop) => (
              <FutureStopRow
                key={stop.id}
                stop={stop}
                hidden={hiddenStopIds.has(stop.id)}
                onToggle={() => toggleStopVisibility(stop.id)}
              />
            ))}
          </ul>
        )}

        <SectionLabel number="03" label="Reviews you wrote." />

        <ul className="flex flex-col gap-sm">
          {REVIEWS.map((r, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 rounded-sm border border-cocoa-15 bg-sand p-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lede leading-tight">
                  {r.placeName}
                </span>
                <span className="flex gap-0.5" aria-label={`${r.stars} כוכבים`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={
                        idx < r.stars
                          ? 'h-3 w-3 fill-copper text-copper'
                          : 'h-3 w-3 fill-cocoa-15 text-cocoa-15'
                      }
                      strokeWidth={0}
                      aria-hidden
                    />
                  ))}
                </span>
              </div>
              <span className="text-[10pt] text-cocoa-55">{r.placeCity}</span>
              <p className="text-body text-cocoa-70 allow-select">{r.text}</p>
            </li>
          ))}
        </ul>

        <SectionLabel number="04" label="Settings." />

        <div className="flex flex-col gap-sm">
          <SettingToggle
            label="מצב מחתרת"
            description="לא נראה לחברים שאתה בחו״ל. תרמיל לא משדר חפיפות עד שתכבה."
            enabled={offGrid}
            onToggle={setOffGrid}
          />
          <SettingToggle
            label="חברים של חברים"
            description="מציג חפיפות גם עם חברים של חברים — תמיד ברמת עיר בלבד."
            enabled={fofEnabled}
            onToggle={setFofEnabled}
          />
        </div>

        <p className="text-[10pt] text-cocoa-55">
          ניראות לכל יעד עתידי נשלטת ברשימה למעלה. סמן עין סגורה — היעד מוסתר
          מחברים, ממשיך להופיע אצלך.
        </p>

        <SectionLabel number="05" label="Demo controls." />

        <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
          <p className="text-[10pt] text-cocoa-70">
            מאפס את היעדים המתוכננים למצב הדגמה. שימוש בין הדגמות למשקיעים.
          </p>
          <Button variant="ghost" onClick={handleReset} disabled={resetting}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            {resetting ? 'מאפס…' : 'אפס מצב הדגמה'}
          </Button>
          {resetMessage && (
            <p className="text-[10pt] text-cocoa-55">{resetMessage}</p>
          )}
        </div>

        <Button variant="ghost" fullWidth>
          התנתקות
        </Button>
      </div>
    </Screen>
  );
}

function FutureStopRow({
  stop,
  hidden,
  onToggle,
}: {
  stop: PlannedStop;
  hidden: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={clsx(
        'flex items-center gap-md rounded-sm border border-cocoa-15 p-md',
        hidden ? 'bg-ivory' : 'bg-sand',
      )}
    >
      <div className="flex flex-1 flex-col">
        <span
          className={clsx(
            'font-serif text-lede leading-tight',
            hidden ? 'text-cocoa-55' : 'text-cocoa',
          )}
        >
          {stop.nameHe}
        </span>
        <span className="text-[10pt] text-cocoa-55 tnum">
          {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
          <span className="tnum">{stop.nights}</span> לילות
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!hidden}
        onClick={onToggle}
        aria-label={hidden ? 'הצג לחברים' : 'הסתר מחברים'}
        className={clsx(
          'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
          hidden
            ? 'bg-cocoa-08 text-cocoa-55'
            : 'bg-cocoa text-ivory',
        )}
      >
        {hidden ? (
          <EyeOff className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        ) : (
          <Eye className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        )}
      </button>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md">
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-serif text-lede leading-tight">{label}</span>
        <span className="text-[10pt] text-cocoa-55">{description}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          enabled ? 'bg-copper' : 'bg-cocoa-15',
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'inline-block h-5 w-5 rounded-full bg-ivory shadow transition-transform',
            enabled ? 'translate-x-[2px]' : 'translate-x-[22px]',
          )}
        />
      </button>
    </div>
  );
}
