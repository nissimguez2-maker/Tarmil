import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { Settings, ChevronLeft, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
 *
 * Demo controls section: a Reset button that calls reset_demo_state()
 * (server-side function that deletes every row from app_state) so the
 * founder can wipe investor edits between sessions and restore each
 * screen's seed initial values on next page load.
 */
export function ProfileScreen() {
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetMessage(null);
    try {
      const { error } = await supabase.rpc('reset_demo_state');
      if (error) throw error;
      setResetMessage(
        'מצב ההדגמה אופס. רענן את הדף כדי לראות את הסידור המקורי.',
      );
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8"
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
            <span className="text-small text-cocoa-55">מטייל מאז מאי 2026</span>
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
              <span className="flex items-center gap-2 text-small text-cocoa-55">
                {value}
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </span>
            </li>
          ))}
        </ul>

        <SectionLabel number="02" label="Demo controls." />
        <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
          <p className="text-small text-cocoa-70">
            מאפס את כל הנתונים שניתנים לעריכה (יעדים מתוכננים, הוצאות, יתרות,
            צ׳ק ליסט, ממיר מטבעות) למצב ההדגמה הראשוני. שימוש בין הדגמות
            למשקיעים.
          </p>
          <Button variant="ghost" onClick={handleReset} disabled={resetting}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            {resetting ? 'מאפס…' : 'אפס מצב הדגמה'}
          </Button>
          {resetMessage && (
            <p className="text-small text-cocoa-55">{resetMessage}</p>
          )}
        </div>

        <Button variant="ghost" fullWidth>
          התנתקות
        </Button>
      </div>
    </Screen>
  );
}
