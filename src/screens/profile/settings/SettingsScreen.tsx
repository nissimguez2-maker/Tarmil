import { useState } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { SectionLabel } from '../../../components/SectionLabel';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/shared/Modal';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

type Row = {
  label: string;
  value: string;
  /** Optional choices a tap opens; first is current. When omitted, the row shows a static read-out. */
  choices?: string[];
  /** Optional one-paragraph explainer for the detail sheet. */
  detail?: string;
};

const SECTIONS: { number: string; label: string; rows: Row[] }[] = [
  {
    number: '01',
    label: 'Account.',
    rows: [
      { label: 'שם', value: 'נסים גז', detail: 'השם שמופיע לחברים שלך באפליקציה.' },
      { label: 'טלפון', value: '+972 ··· (מאומת)', detail: 'אומת בעת ההרשמה. שינוי דורש אימות מחדש.' },
      {
        label: 'שפה',
        value: 'עברית',
        choices: ['עברית', 'English', 'Português'],
        detail: 'שפת הממשק. תאריכים, מטבעות וכיווניות מתעדכנים אוטומטית.',
      },
    ],
  },
  {
    number: '02',
    label: 'Privacy.',
    rows: [
      {
        label: 'מצב מחתרת',
        value: 'כבוי',
        choices: ['כבוי', 'דקה', 'שעה', 'יום', 'עד שאחזור'],
        detail:
          'במצב מחתרת המסלול שלך לא מופיע אצל אף חבר, וחפיפות לא נחשבות. שקט מוחלט.',
      },
      {
        label: 'גלוי לחברי חברים',
        value: 'מופעל',
        choices: ['מופעל', 'כבוי'],
        detail:
          'מאפשר לחברים של חברים לזהות חפיפה רק כאשר מסלול שלך באמת חופף בעיר משותפת.',
      },
      {
        label: 'רזולוציית מיקום',
        value: 'ברמת עיר בלבד',
        choices: ['ברמת עיר בלבד', 'ברמת אזור (וריאציה רחבה יותר)'],
        detail:
          'תרמיל לעולם לא חושף לחברים את הכתובת המדויקת שלך. הרזולוציה ברמת עיר היא ברירת המחדל.',
      },
    ],
  },
  {
    number: '03',
    label: 'Notifications.',
    rows: [
      {
        label: 'פעילות',
        value: 'הכל',
        choices: ['הכל', 'רק חברים בקרבת מקום', 'כבוי'],
      },
      {
        label: 'פורומים',
        value: 'תגובות אליי',
        choices: ['הכל', 'תגובות אליי', 'כבוי'],
      },
      {
        label: 'הודעות',
        value: 'הכל',
        choices: ['הכל', 'מהחברים בלבד', 'כבוי'],
      },
    ],
  },
  {
    number: '04',
    label: 'About.',
    rows: [
      { label: 'גרסה', value: 'beta · 2026.05.11', detail: 'מהדורת ההדגמה הנוכחית. נושאים פתוחים מתועדים בדוקס.' },
      { label: 'פרטיות', value: 'מסמך', detail: 'תרמיל אוסף רק את המינימום הנדרש להפעלת חפיפות וטיולים. ראה מסמך מלא לדוגמה.' },
      { label: 'תנאים', value: 'מסמך', detail: 'תנאי שימוש מעוגנים בפרוטוקול ברירת המחדל של ברקלייז. ראה מסמך מלא.' },
    ],
  },
];

/**
 * Settings drill-down. Each row taps into a SettingDetailSheet — the rows
 * with `choices` let the user (locally) pick a new value; rows with just
 * `detail` show a read-only explainer.
 */
export function SettingsScreen() {
  const { resetDemo } = useSupabaseData();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<Row | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [signoutOpen, setSignoutOpen] = useState(false);

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

  const valueFor = (row: Row) => overrides[row.label] ?? row.value;

  return (
    <Screen>
      <TopBar back title="הגדרות" eyebrow="Tarmil" />

      <div className="flex flex-col gap-lg p-md pb-xl">
        {SECTIONS.map((section) => (
          <section key={section.number} className="flex flex-col gap-sm">
            <SectionLabel number={section.number} label={section.label} />
            <ul className="overflow-hidden rounded-2xl border border-cocoa-15 bg-ivory">
              {section.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={clsx(
                    i < section.rows.length - 1 && 'border-b border-cocoa-15',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenRow(row)}
                    className="flex w-full items-center justify-between gap-sm px-md py-3 text-start transition-colors duration-instant ease-out-quart active:bg-cocoa-08"
                  >
                    <span className="text-body text-cocoa">{row.label}</span>
                    <span className="flex shrink-0 items-center gap-2 text-small text-cocoa-55">
                      {valueFor(row)}
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="flex flex-col gap-sm">
          <SectionLabel number="05" label="Demo controls." />
          <div className="flex flex-col gap-sm rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
            <p className="text-small text-cocoa-70">
              מאפס את היעדים המתוכננים למצב הדגמה הקנוני. שימוש בין הדגמות
              למשקיעים.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={resetting}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              {resetting ? 'מאפס…' : 'אפס מצב הדגמה'}
            </Button>
            {resetMessage && (
              <p className="text-small text-cocoa-55">{resetMessage}</p>
            )}
          </div>
        </section>

        <Button variant="ghost" fullWidth onClick={() => setSignoutOpen(true)}>
          התנתקות
        </Button>
      </div>

      <SettingDetailSheet
        row={openRow}
        currentValue={openRow ? valueFor(openRow) : ''}
        onSelect={(value) => {
          if (openRow) {
            setOverrides((prev) => ({ ...prev, [openRow.label]: value }));
          }
          setOpenRow(null);
        }}
        onClose={() => setOpenRow(null)}
      />

      <SignOutConfirm
        open={signoutOpen}
        onClose={() => setSignoutOpen(false)}
      />
    </Screen>
  );
}

function SettingDetailSheet({
  row,
  currentValue,
  onSelect,
  onClose,
}: {
  row: Row | null;
  currentValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={row !== null}
      onClose={onClose}
      eyebrow="הגדרה"
      title={row?.label ?? ''}
    >
      <div className="flex flex-col gap-md">
        {row?.detail && (
          <p className="text-small leading-snug text-cocoa-70">{row.detail}</p>
        )}

        {row?.choices ? (
          <ul className="flex flex-col">
            {row.choices.map((choice, i) => {
              const active = choice === currentValue;
              return (
                <li
                  key={choice}
                  className={clsx(
                    i > 0 && 'border-t border-cocoa-15',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(choice)}
                    className="flex w-full items-center justify-between gap-sm py-sm text-start transition-colors duration-instant ease-out-quart active:bg-cocoa-08"
                  >
                    <span className="text-body text-cocoa">{choice}</span>
                    {active && (
                      <span className="meta-caps text-copper">נבחר</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl bg-sand p-md">
            <span className="meta-caps text-cocoa-55">ערך נוכחי</span>
            <p className="mt-xs text-body text-cocoa">{currentValue}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function SignOutConfirm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="התנתקות"
      title="להתנתק מתרמיל?"
      footer={
        <div className="flex gap-sm">
          <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
            לא עכשיו
          </Button>
          <Button
            variant="accent"
            size="sm"
            fullWidth
            onClick={() => {
              // Demo mode: just acknowledge and close. A real auth flow lands later.
              onClose();
            }}
          >
            התנתק
          </Button>
        </div>
      }
    >
      <p className="text-body leading-snug text-cocoa-70">
        תוכל לחזור בכל רגע. המסלול שלך, החברים והודעות נשמרים בשרתי תרמיל.
      </p>
      <p className="mt-sm text-small leading-snug text-cocoa-55">
        מהדורת ההדגמה — הניתוק כאן לא מבצע פעולה אמיתית.
      </p>
    </Modal>
  );
}
