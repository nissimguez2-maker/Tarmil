import { useState } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { SectionLabel } from '../../../components/SectionLabel';
import { Button } from '../../../components/Button';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

const SECTIONS: { number: string; label: string; rows: { label: string; value: string }[] }[] = [
  {
    number: '01',
    label: 'Account.',
    rows: [
      { label: 'שם', value: 'נסים גז' },
      { label: 'טלפון', value: '+972 ··· (מאומת)' },
      { label: 'שפה', value: 'עברית' },
    ],
  },
  {
    number: '02',
    label: 'Privacy.',
    rows: [
      { label: 'מצב מחתרת', value: 'כבוי' },
      { label: 'גלוי לחברי חברים', value: 'מופעל' },
      { label: 'רזולוציית מיקום', value: 'ברמת עיר בלבד' },
    ],
  },
  {
    number: '03',
    label: 'Notifications.',
    rows: [
      { label: 'פעילות', value: 'הכל' },
      { label: 'פורומים', value: 'תגובות אליי' },
      { label: 'הודעות', value: 'הכל' },
    ],
  },
  {
    number: '04',
    label: 'About.',
    rows: [
      { label: 'גרסה', value: 'beta · 2026.05.11' },
      { label: 'פרטיות', value: 'מסמך' },
      { label: 'תנאים', value: 'מסמך' },
    ],
  },
];

/**
 * Settings drill-down. Listy by design — every row has a chevron and is
 * tappable in spirit (no destination wired yet for individual rows, matches
 * the demo posture). The demo reset button (relocated from ProfileScreen)
 * lives at the bottom inside the "Demo controls" section.
 */
export function SettingsScreen() {
  const { resetDemo } = useSupabaseData();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function handleReset() {
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
  }

  return (
    <Screen>
      <TopBar back title="הגדרות" eyebrow="Tarmil" />

      <div className="flex flex-col gap-lg p-md">
        {SECTIONS.map((section) => (
          <section key={section.number} className="flex flex-col gap-sm">
            <SectionLabel number={section.number} label={section.label} />
            <ul className="rounded-md border border-cocoa-15 bg-ivory">
              {section.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={`flex items-center justify-between px-md py-3 ${
                    i < section.rows.length - 1
                      ? 'border-b border-cocoa-15'
                      : ''
                  }`}
                >
                  <span className="text-[11pt] text-cocoa">{row.label}</span>
                  <span className="flex items-center gap-2 text-[10pt] text-cocoa-55">
                    {row.value}
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="flex flex-col gap-sm">
          <SectionLabel number="05" label="Demo controls." />
          <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
            <p className="text-[10pt] text-cocoa-70">
              מאפס את היעדים המתוכננים למצב הדגמה הקנוני. שימוש בין הדגמות
              למשקיעים.
            </p>
            <Button variant="ghost" onClick={handleReset} disabled={resetting}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              {resetting ? 'מאפס…' : 'אפס מצב הדגמה'}
            </Button>
            {resetMessage && (
              <p className="text-[10pt] text-cocoa-55">{resetMessage}</p>
            )}
          </div>
        </section>

        <Button variant="ghost" fullWidth>
          התנתקות
        </Button>
      </div>
    </Screen>
  );
}
