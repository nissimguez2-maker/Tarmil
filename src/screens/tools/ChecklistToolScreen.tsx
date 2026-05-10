import { useState } from 'react';
import clsx from 'clsx';
import { Check, Plus } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Item = {
  id: string;
  label: string;
  checked: boolean;
};

const SEED: Record<string, Item[]> = {
  documents: [
    { id: 'd-passport', label: 'דרכון בתוקף לפחות 6 חודשים', checked: true },
    { id: 'd-visa', label: 'בדיקה אם נדרשת ויזה ליעד', checked: true },
    { id: 'd-insurance', label: 'ביטוח רפואי + ביטוח מטען', checked: false },
    { id: 'd-license', label: 'רישיון נהיגה בינלאומי', checked: false },
  ],
  health: [
    { id: 'h-vaccines', label: 'חיסונים מומלצים — קדחת צהובה, חזרת', checked: false },
    { id: 'h-prescriptions', label: 'מרשמים לתרופות קבועות', checked: true },
    { id: 'h-firstaid', label: 'תיק עזרה ראשונה בסיסי', checked: false },
  ],
  gear: [
    { id: 'g-charger', label: 'מתאם תקע + מטען נייד', checked: true },
    { id: 'g-cards', label: 'גלוית אשראי בלי עמלות חוצה לאומי', checked: false },
    { id: 'g-cash', label: 'מזומן ביעד הראשון', checked: false },
  ],
};

const SECTION_LABELS: Record<string, string> = {
  documents: 'מסמכים וביטוח',
  health: 'בריאות',
  gear: 'ציוד וכספים',
};

export function ChecklistToolScreen() {
  const [sections, setSections] = useState(SEED);

  const toggle = (sectionId: string, itemId: string) => {
    setSections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }));
  };

  const total = Object.values(sections).flat().length;
  const done = Object.values(sections)
    .flat()
    .filter((i) => i.checked).length;

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="צ׳ק ליסט לפני יציאה" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Pre-trip checklist." />

        <p className="max-w-body text-body text-cocoa-70">
          רשימה כללית של דברים לסדר לפני שיוצאים. תרמיל מציע אותה כברירת מחדל;
          הוסיפו, מחקו, סמנו — הכל נשמר על המכשיר.
        </p>

        <div className="flex items-center justify-between rounded-md border border-cocoa-15 bg-sand px-md py-3">
          <span className="font-serif text-lede text-cocoa">
            <span className="tnum">{done}</span> מתוך{' '}
            <span className="tnum">{total}</span> סומנו
          </span>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-full border border-cocoa-15 bg-ivory px-md text-[10pt] text-cocoa active:bg-cocoa-08"
          >
            <Plus className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            הוסף פריט
          </button>
        </div>

        <div className="flex flex-col gap-lg">
          {Object.entries(sections).map(([sectionId, items]) => (
            <section key={sectionId} className="flex flex-col gap-sm">
              <span className="meta-caps text-copper">
                {SECTION_LABELS[sectionId]}
              </span>
              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(sectionId, item.id)}
                      className={clsx(
                        'flex w-full items-center gap-md py-3 text-start',
                        i < items.length - 1 && 'border-b border-cocoa-15',
                      )}
                    >
                      <span
                        aria-hidden
                        className={clsx(
                          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                          item.checked
                            ? 'border-copper bg-copper text-ivory'
                            : 'border-cocoa-30 bg-ivory text-transparent',
                        )}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      <span
                        className={clsx(
                          'flex-1 text-body',
                          item.checked
                            ? 'text-cocoa-55 line-through'
                            : 'text-cocoa',
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Screen>
  );
}
