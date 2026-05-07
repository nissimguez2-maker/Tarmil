import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Plus, Trash2, X } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { Button } from '../../components/Button';
import { ConfirmPill } from '../../components/ConfirmPill';
import { CategoryPicker } from '../../components/CategoryPicker';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useLiveRates } from '../../hooks/useLiveRates';
import {
  CURRENCIES,
  formatAmount,
  toIls,
  type CurrencyCode,
} from '../../data/currencies';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  EXPENSES_STORAGE_KEY,
  EXPENSE_CCY_KEY,
  SEED_PERSONAL_EXPENSES,
  type ExpenseCategory,
  type PersonalExpense,
} from '../../data/expenses';
import { formatDateChip } from '../../components/tripMap/utils/formatDateRange';

type DateRange = 'week' | 'month' | 'all';

const DATE_RANGES: Array<{ id: DateRange; label: string }> = [
  { id: 'week', label: 'שבוע' },
  { id: 'month', label: 'חודש' },
  { id: 'all', label: 'הכל' },
];

function withinRange(iso: string, range: DateRange): boolean {
  if (range === 'all') return true;
  const days = range === 'week' ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return iso >= cutoff.toISOString().slice(0, 10);
}

function newId(): string {
  return `pe-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/** Group entries by `date` (ISO yyyy-mm-dd), ordered desc. Each group's
 * entries also ordered desc (last-added shows first within a day). */
function groupByDay(
  entries: PersonalExpense[],
): Array<{ date: string; entries: PersonalExpense[] }> {
  const map = new Map<string, PersonalExpense[]>();
  for (const e of entries) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date)!.push(e);
  }
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      entries: items.sort((a, b) => b.id.localeCompare(a.id)),
    }));
}

export function ExpensesScreen() {
  const [expenses, setExpenses] = usePersistentState<PersonalExpense[]>(
    EXPENSES_STORAGE_KEY,
    SEED_PERSONAL_EXPENSES,
  );
  const [displayCcy, setDisplayCcy] = usePersistentState<CurrencyCode>(
    EXPENSE_CCY_KEY,
    'ILS',
  );
  const [range, setRange] = useState<DateRange>('month');
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] =
    useState<PersonalExpense | null>(null);

  const live = useLiveRates();

  const filtered = useMemo(
    () => expenses.filter((e) => withinRange(e.date, range)),
    [expenses, range],
  );
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const totalIls = useMemo(
    () =>
      filtered.reduce(
        (sum, e) => sum + toIls(e.amount, e.currency, live.rates ?? undefined),
        0,
      ),
    [filtered, live.rates],
  );
  const totalDisplay = useMemo(() => {
    const displayCur = CURRENCIES.find((c) => c.code === displayCcy)!;
    return totalIls / displayCur.toIls;
  }, [totalIls, displayCcy]);

  const byCategory = useMemo(() => {
    const m = new Map<ExpenseCategory, number>();
    for (const e of filtered) {
      const ils = toIls(e.amount, e.currency, live.rates ?? undefined);
      m.set(e.category, (m.get(e.category) ?? 0) + ils);
    }
    return [...m.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
  }, [filtered, live.rates]);

  const symbol = CURRENCIES.find((c) => c.code === displayCcy)?.symbol ?? '';

  const addExpense = (e: Omit<PersonalExpense, 'id'>) => {
    setExpenses((cur) => [...cur, { ...e, id: newId() }]);
    setAdding(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses((cur) => cur.filter((e) => e.id !== id));
  };

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="מעקב הוצאות" back />

      <div className="flex flex-col gap-lg p-md">
        <SummaryCard
          totalDisplay={totalDisplay}
          symbol={symbol}
          displayCcy={displayCcy}
          onChangeDisplayCcy={setDisplayCcy}
          range={range}
          onChangeRange={setRange}
          totalIls={totalIls}
          byCategory={byCategory}
        />

        {adding ? (
          <AddExpenseForm
            onSave={addExpense}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <Button
            variant="primary"
            onClick={() => setAdding(true)}
            fullWidth
          >
            <Plus className="h-4 w-4" aria-hidden />
            <span>הוסף הוצאה</span>
          </Button>
        )}

        {grouped.length === 0 ? (
          <p className="rounded-md border border-cocoa-15 bg-ivory p-md text-body text-cocoa-55">
            עדיין לא נרשמו הוצאות בתקופה הזו. תוסיף את הראשונה ב־"הוסף הוצאה".
          </p>
        ) : (
          <section className="flex flex-col gap-md">
            {grouped.map((day) => (
              <div key={day.date} className="flex flex-col gap-sm">
                <span className="meta-caps text-cocoa-55">
                  {formatDateChip(day.date)}
                </span>
                <ul className="flex flex-col rounded-md border border-rope bg-ivory">
                  {day.entries.map((exp) => (
                    <ExpenseRow
                      key={exp.id}
                      expense={exp}
                      onDelete={() => setConfirmDelete(exp)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <p className="text-small leading-snug text-cocoa-55">
          המצב נשמר אצלך במכשיר. רענון לא יאפס. הוצאות שנוספו דרך "יתרות בין
          חברים" מסומנות בהתאם ונמחקות מכאן כשסוגרים את החוב.
        </p>
      </div>

      <ConfirmPill
        open={confirmDelete !== null}
        title="למחוק את ההוצאה?"
        body={
          confirmDelete
            ? `${confirmDelete.note ?? CATEGORY_LABELS[confirmDelete.category]} — ${formatAmount(
                confirmDelete.amount,
                confirmDelete.amount % 1 === 0 ? 0 : 2,
              )} ${confirmDelete.currency}. הפעולה לא ניתנת לביטול.`
            : undefined
        }
        confirmLabel="מחק"
        danger
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) deleteExpense(confirmDelete.id);
          setConfirmDelete(null);
        }}
      />
    </Screen>
  );
}

function SummaryCard({
  totalDisplay,
  symbol,
  displayCcy,
  onChangeDisplayCcy,
  range,
  onChangeRange,
  totalIls,
  byCategory,
}: {
  totalDisplay: number;
  symbol: string;
  displayCcy: CurrencyCode;
  onChangeDisplayCcy: (c: CurrencyCode) => void;
  range: DateRange;
  onChangeRange: (r: DateRange) => void;
  totalIls: number;
  byCategory: Array<[ExpenseCategory, number]>;
}) {
  const hasSpend = totalIls > 0;
  return (
    <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
      <span className="meta-caps text-cocoa-55">סך הכל</span>
      <div className="flex items-baseline gap-2">
        <span className="tnum font-serif text-display leading-none text-cocoa">
          {formatAmount(totalDisplay, totalDisplay >= 100 ? 0 : 2)}
        </span>
        <select
          value={displayCcy}
          onChange={(e) => onChangeDisplayCcy(e.target.value as CurrencyCode)}
          aria-label="מטבע תצוגה"
          className="ltr inline-flex h-9 items-center rounded-full border border-cocoa-15 bg-ivory px-sm text-small text-cocoa focus:border-copper focus:outline-none"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        {DATE_RANGES.map((opt) => {
          const active = range === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeRange(opt.id)}
              className={clsx(
                'inline-flex h-9 items-center rounded-full border px-md text-small transition-colors duration-200 ease-out-quart',
                active
                  ? 'border-cocoa bg-cocoa text-ivory'
                  : 'border-cocoa-15 bg-ivory text-cocoa active:bg-cocoa-08',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {hasSpend && byCategory.length > 0 && (
        <div className="mt-sm flex flex-col gap-1">
          <span className="meta-caps text-cocoa-55">מובילים</span>
          <ul className="flex flex-col gap-1">
            {byCategory.map(([cat, ils]) => {
              const pct = Math.round((ils / totalIls) * 100);
              return (
                <li key={cat} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2 text-small text-cocoa">
                    <span>{CATEGORY_LABELS[cat]}</span>
                    <span className="tnum text-cocoa-70">
                      <span>{pct}</span>%
                    </span>
                  </div>
                  <div
                    className="relative h-1 w-full overflow-hidden rounded-full bg-cocoa-08"
                    aria-hidden
                  >
                    <div
                      className="absolute inset-y-0 start-0 rounded-full bg-copper-70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!hasSpend && (
        <p className="text-small text-cocoa-55">
          אין עדיין הוצאות בתקופה הזו.
        </p>
      )}
    </div>
  );
}

function ExpenseRow({
  expense,
  onDelete,
}: {
  expense: PersonalExpense;
  onDelete: () => void;
}) {
  const Icon = CATEGORY_ICONS[expense.category];
  return (
    <li className="flex items-start gap-sm border-b border-cocoa-08 p-md last:border-b-0">
      <span
        className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa-08 text-cocoa"
        aria-hidden
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-body text-cocoa">
            {expense.note ?? CATEGORY_LABELS[expense.category]}
          </span>
          {expense.note && (
            <span className="text-small text-cocoa-55">
              {CATEGORY_LABELS[expense.category]}
            </span>
          )}
        </div>
        {expense.sourceBalanceId && (
          <span className="meta-caps text-copper">
            מתוך יתרות בין חברים
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="tnum text-body text-cocoa">
          {formatAmount(expense.amount, expense.amount % 1 === 0 ? 0 : 2)}{' '}
          <span className="ltr text-cocoa-70">{expense.currency}</span>
        </span>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`מחק ${expense.note ?? CATEGORY_LABELS[expense.category]}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-08 hover:text-cocoa active:bg-cocoa-15"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </li>
  );
}

function AddExpenseForm({
  onSave,
  onCancel,
}: {
  onSave: (e: Omit<PersonalExpense, 'id'>) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [note, setNote] = useState('');

  const amountNum = Number(amount);
  const valid = !Number.isNaN(amountNum) && amountNum > 0;

  const save = () => {
    if (!valid) return;
    onSave({
      date,
      amount: amountNum,
      currency,
      category,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-lg rounded-md border border-rope bg-sand p-md">
      {/* Header — title + close. */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-lede leading-tight text-cocoa">
          הוצאה חדשה
        </span>
        <button
          type="button"
          aria-label="סגור"
          onClick={onCancel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-08 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Amount hero — large centered display input with currency
        * selector underneath, full width. Mirrors the Currency tool's
        * input-card pattern so the "what's the number?" question is the
        * visual focus, not buried in a row of small fields. */}
      <div className="flex flex-col items-stretch gap-sm rounded-md border border-cocoa-15 bg-ivory p-md">
        <span className="meta-caps text-center text-cocoa-55">סכום</span>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          dir="ltr"
          placeholder="0"
          aria-label="סכום"
          className="tnum w-full border-none bg-transparent text-center text-display leading-none text-cocoa focus:outline-none"
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          aria-label="מטבע"
          className="h-11 w-full rounded-full border border-cocoa-15 bg-white px-md text-body text-cocoa focus:border-copper focus:outline-none"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.englishName}
            </option>
          ))}
        </select>
      </div>

      {/* Category — 2-col chip grid (shared component). */}
      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">קטגוריה</span>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      {/* Note — optional, full width. */}
      <label className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">הערה (לא חובה)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          dir="rtl"
          placeholder="לדוגמה: ארוחת ערב באיפנמה"
          className="h-11 rounded-full border border-cocoa-15 bg-white px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />
      </label>

      {/* Date — full width. */}
      <label className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">תאריך</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          dir="ltr"
          className="tnum h-11 rounded-full border border-cocoa-15 bg-white px-md text-body text-cocoa focus:border-copper focus:outline-none"
          style={{ accentColor: 'var(--copper)' }}
        />
      </label>

      {!valid && amount.length > 0 && (
        <span className="text-small text-cocoa-55">
          הזן סכום חיובי תקין.
        </span>
      )}

      {/* Action row — full-width primary save, ghost cancel. */}
      <div className="flex items-center gap-sm">
        <Button variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
        <Button variant="accent" onClick={save} fullWidth>
          שמור
        </Button>
      </div>
    </div>
  );
}

