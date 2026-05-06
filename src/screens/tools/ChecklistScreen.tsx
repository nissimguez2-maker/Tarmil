import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { Button } from '../../components/Button';
import { usePersistentState } from '../../hooks/usePersistentState';
import { CHECKLIST_TEMPLATE } from '../../data/checklistTemplate';

type Item = { id: string; label: string; checked: boolean };
type Section = {
  id: string;
  label: string;
  items: Item[];
  collapsed: boolean;
};
type State = { sections: Section[] };

const STORAGE_KEY = 'tarmil:checklist:v2';

function fromTemplate(): State {
  return {
    sections: CHECKLIST_TEMPLATE.map((s) => ({
      id: s.id,
      label: s.hebrewLabel,
      collapsed: false,
      items: s.items.map((i) => ({
        id: i.id,
        label: i.hebrewLabel,
        checked: false,
      })),
    })),
  };
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

function sectionNumber(i: number): string {
  return (i + 1).toString().padStart(2, '0');
}

export function ChecklistScreen() {
  const [state, setState] = usePersistentState<State>(STORAGE_KEY, fromTemplate());
  const [confirmRestore, setConfirmRestore] = useState(false);

  const totalItems = useMemo(
    () => state.sections.reduce((n, s) => n + s.items.length, 0),
    [state.sections],
  );
  const completed = useMemo(
    () =>
      state.sections.reduce(
        (n, s) => n + s.items.filter((i) => i.checked).length,
        0,
      ),
    [state.sections],
  );
  const pct = totalItems === 0 ? 0 : Math.round((completed / totalItems) * 100);

  const toggleCheck = (sectionId: string, itemId: string) =>
    setState((s) => ({
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              items: sec.items.map((i) =>
                i.id === itemId ? { ...i, checked: !i.checked } : i,
              ),
            },
      ),
    }));

  const addItem = (sectionId: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setState((s) => ({
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              items: [
                ...sec.items,
                { id: newId('item'), label: trimmed, checked: false },
              ],
            },
      ),
    }));
  };

  const deleteItem = (sectionId: string, itemId: string) =>
    setState((s) => ({
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : { ...sec, items: sec.items.filter((i) => i.id !== itemId) },
      ),
    }));

  const toggleCollapse = (sectionId: string) =>
    setState((s) => ({
      sections: s.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, collapsed: !sec.collapsed } : sec,
      ),
    }));

  const addSection = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setState((s) => ({
      sections: [
        ...s.sections,
        { id: newId('section'), label: trimmed, items: [], collapsed: false },
      ],
    }));
  };

  const deleteSection = (sectionId: string) =>
    setState((s) => ({
      sections: s.sections.filter((sec) => sec.id !== sectionId),
    }));

  const resetChecks = () =>
    setState((s) => ({
      sections: s.sections.map((sec) => ({
        ...sec,
        items: sec.items.map((i) => ({ ...i, checked: false })),
      })),
    }));

  const restoreTemplate = () => setState(fromTemplate());

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="צ׳ק ליסט לפני יציאה" back />

      <div className="flex flex-col gap-lg p-md">
        <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
          <div className="flex items-baseline justify-between">
            <span className="meta-caps text-cocoa-55">התקדמות</span>
            <span className="tnum text-body text-cocoa">
              {completed} / {totalItems} הושלמו
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

        {state.sections.map((sec, idx) => (
          <SectionBlock
            key={sec.id}
            section={sec}
            number={sectionNumber(idx)}
            onToggleCollapse={() => toggleCollapse(sec.id)}
            onToggleCheck={(itemId) => toggleCheck(sec.id, itemId)}
            onAddItem={(label) => addItem(sec.id, label)}
            onDeleteItem={(itemId) => deleteItem(sec.id, itemId)}
            onDeleteSection={() => deleteSection(sec.id)}
          />
        ))}

        <AddSectionRow onAdd={addSection} />

        <div className="flex flex-col gap-sm">
          <Button variant="ghost" onClick={resetChecks} fullWidth>
            אפס סימונים
          </Button>
          {confirmRestore ? (
            <div className="flex flex-col gap-sm rounded-md border border-copper-70 bg-sand p-md">
              <p className="text-body text-cocoa">
                להחזיר את הצ׳ק ליסט לתבנית ברירת המחדל? כל ההוספות והמחיקות
                שלך ייעלמו.
              </p>
              <div className="flex items-center gap-sm">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmRestore(false)}
                >
                  ביטול
                </Button>
                <Button
                  variant="accent"
                  onClick={() => {
                    restoreTemplate();
                    setConfirmRestore(false);
                  }}
                  fullWidth
                >
                  החזר לתבנית
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRestore(true)}
              className="inline-flex h-11 items-center justify-center text-small text-cocoa-55 underline-offset-4 hover:text-cocoa hover:underline"
            >
              החזר לתבנית
            </button>
          )}
        </div>

        <p className="text-small leading-snug text-cocoa-55">
          המצב נשמר אצלך במכשיר. רענון לא יאפס.
        </p>
      </div>
    </Screen>
  );
}

function SectionBlock({
  section,
  number,
  onToggleCollapse,
  onToggleCheck,
  onAddItem,
  onDeleteItem,
  onDeleteSection,
}: {
  section: Section;
  number: string;
  onToggleCollapse: () => void;
  onToggleCheck: (itemId: string) => void;
  onAddItem: (label: string) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteSection: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const sectionDone = section.items.filter((i) => i.checked).length;

  const handleAddItem = () => {
    if (!draft.trim()) return;
    onAddItem(draft);
    setDraft('');
  };

  if (confirmDelete) {
    return (
      <section className="flex flex-col gap-sm rounded-md border border-copper-70 bg-sand p-sm">
        <p className="text-body text-cocoa">
          למחוק את הקטגוריה "{section.label}"? כל הפריטים בתוכה יימחקו.
        </p>
        <div className="flex items-center gap-sm">
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(false)}
          >
            ביטול
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              onDeleteSection();
              setConfirmDelete(false);
            }}
            fullWidth
          >
            מחק קטגוריה
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-sm">
      <header className="flex items-center gap-sm">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex flex-1 items-center gap-sm text-start"
          aria-expanded={!section.collapsed}
        >
          <ChevronDown
            className={clsx(
              'h-4 w-4 shrink-0 text-cocoa-55 transition-transform',
              section.collapsed && '-rotate-90',
            )}
            aria-hidden
          />
          <div className="flex flex-1 items-baseline justify-between gap-sm">
            <span className="meta-caps text-copper">
              <span className="tnum me-1">{number}</span>
              <span className="mid-title text-cocoa">{section.label}</span>
            </span>
            <span className="tnum text-small text-cocoa-55">
              {sectionDone}/{section.items.length}
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label={`מחק את ${section.label}`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-08 hover:text-cocoa"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </header>
      <div className="h-px bg-cocoa-15" aria-hidden />

      {!section.collapsed && (
        <>
          {section.items.length === 0 ? (
            <p className="text-small text-cocoa-55">
              אין פריטים בקטגוריה הזו עדיין.
            </p>
          ) : (
            <ul className="flex flex-col">
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-sm border-b border-cocoa-08 last:border-b-0"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-md py-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggleCheck(item.id)}
                      className="h-5 w-5 shrink-0 cursor-pointer accent-copper"
                    />
                    <span
                      className={clsx(
                        'text-body transition-colors',
                        item.checked
                          ? 'text-cocoa-55 line-through'
                          : 'text-cocoa',
                      )}
                    >
                      {item.label}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    aria-label={`מחק ${item.label}`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-08 hover:text-cocoa"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <AddItemRow
            value={draft}
            onChange={setDraft}
            onSubmit={handleAddItem}
          />
        </>
      )}
    </section>
  );
}

function AddItemRow({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-sm"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="rtl"
        placeholder="הוסף פריט…"
        className="h-11 flex-1 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
      />
      <button
        type="submit"
        aria-label="הוסף"
        disabled={!value.trim()}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cocoa text-ivory disabled:bg-cocoa-30 active:bg-cocoa-70"
      >
        <Plus className="h-4 w-4" aria-hidden strokeWidth={2.5} />
      </button>
    </form>
  );
}

function AddSectionRow({ onAdd }: { onAdd: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-cocoa-15 px-md text-body text-cocoa active:bg-cocoa-08"
      >
        <Plus className="h-4 w-4" aria-hidden strokeWidth={2.5} />
        <span>הוסף קטגוריה</span>
      </button>
    );
  }

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft('');
    setOpen(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-center gap-sm rounded-md border border-rope bg-sand p-sm"
    >
      <input
        autoFocus
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        dir="rtl"
        placeholder="שם הקטגוריה…"
        className="h-11 flex-1 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
      />
      <button
        type="submit"
        disabled={!draft.trim()}
        className="inline-flex h-11 items-center justify-center rounded-full bg-copper px-md text-body font-medium text-ivory disabled:opacity-50 active:bg-copper-85"
      >
        שמור
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setDraft('');
        }}
        aria-label="ביטול"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cocoa-55 active:bg-cocoa-08"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
