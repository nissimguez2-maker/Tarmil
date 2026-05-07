import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { Settings, ChevronLeft, RotateCcw } from 'lucide-react';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

const SETTINGS = [
  { label: 'שפה', value: 'עברית' },
  { label: 'התראות', value: 'מותאם' },
  { label: 'פרטיות', value: 'עיר בלבד' },
  { label: 'מצב מחתרת', value: 'כבוי' },
];

/**
 * Placeholder for the Profile tab.
 *
 * Final design (later PR): own trip past/present/future, reviews, settings
 * under a gear icon, language/notifications/privacy controls, off-grid toggle.
 */
export function ProfileScreen() {
  const { resetDemo } = useSupabaseData();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

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

      <div className="flex flex-col gap-lg p-md">
        <div className="flex items-center gap-md">
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cocoa font-serif text-sub text-ivory"
            aria-hidden
          >
            נ
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-sub leading-tight">נסים גז</span>
            <span className="text-[10pt] text-cocoa-55">מטייל מאז מאי 2026</span>
          </div>
        </div>

        <SectionLabel number="01" label="Settings." />

        <ul className="flex flex-col">
          {SETTINGS.map(({ label, value }, i) => (
            <li
              key={label}
              className={`flex items-center justify-between py-3 ${
                i < SETTINGS.length - 1 ? 'border-b border-cocoa-15' : ''
              }`}
            >
              <span className="text-body text-cocoa">{label}</span>
              <span className="flex items-center gap-2 text-[10pt] text-cocoa-55">
                {value}
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </span>
            </li>
          ))}
        </ul>

        <SectionLabel number="02" label="Demo controls." />
        <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
          <p className="text-[10pt] text-cocoa-70">
            מאפס את היעדים המתוכננים למצב הדגמה (4 ערים: בוזיוס, סאו פאולו, ז׳רי, בואנוס איירס). שימוש בין הדגמות למשקיעים.
          </p>
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={resetting}
          >
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
