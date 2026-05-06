import { useMemo } from 'react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { Button } from '../../components/Button';
import { SectionLabel } from '../../components/SectionLabel';
import { usePersistentState } from '../../hooks/usePersistentState';
import {
  CHECKLIST_TEMPLATE,
  TOTAL_ITEMS,
} from '../../data/checklistTemplate';

const STORAGE_KEY = 'tarmil:checklist:v1';

export function ChecklistScreen() {
  const [checked, setChecked] = usePersistentState<string[]>(STORAGE_KEY, []);
  const checkedSet = useMemo(() => new Set(checked), [checked]);

  const completed = checked.length;
  const pct = TOTAL_ITEMS === 0 ? 0 : Math.round((completed / TOTAL_ITEMS) * 100);

  const toggle = (id: string) => {
    setChecked((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const reset = () => setChecked([]);

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="צ׳ק ליסט לפני יציאה" back />

      <div className="flex flex-col gap-lg p-md">
        <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
          <div className="flex items-baseline justify-between">
            <span className="meta-caps text-cocoa-55">התקדמות</span>
            <span className="tnum text-body text-cocoa">
              {completed} / {TOTAL_ITEMS} הושלמו
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-cocoa-08">
            <div
              className="absolute inset-y-0 start-0 rounded-full bg-cocoa transition-[width]"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
        </div>

        {CHECKLIST_TEMPLATE.map((section) => {
          const sectionDone = section.items.filter((i) =>
            checkedSet.has(i.id),
          ).length;
          return (
            <section key={section.id} className="flex flex-col gap-sm">
              <div className="flex items-baseline justify-between">
                <SectionLabel
                  number={section.number}
                  label={section.hebrewLabel}
                />
                <span className="tnum text-[10pt] text-cocoa-55">
                  {sectionDone}/{section.items.length}
                </span>
              </div>
              <ul className="flex flex-col">
                {section.items.map((item) => {
                  const isChecked = checkedSet.has(item.id);
                  return (
                    <li
                      key={item.id}
                      className="border-b border-cocoa-08 last:border-b-0"
                    >
                      <label className="flex cursor-pointer items-center gap-md py-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(item.id)}
                          className="h-5 w-5 shrink-0 cursor-pointer accent-copper"
                        />
                        <span
                          className={clsx(
                            'text-body transition-colors',
                            isChecked
                              ? 'text-cocoa-55 line-through'
                              : 'text-cocoa',
                          )}
                        >
                          {item.hebrewLabel}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <Button variant="ghost" onClick={reset} fullWidth>
          אפס הכל
        </Button>

        <p className="text-[9pt] leading-snug text-cocoa-55">
          המצב נשמר אצלך במכשיר. רענון לא יאפס את הבחירות.
        </p>
      </div>
    </Screen>
  );
}
