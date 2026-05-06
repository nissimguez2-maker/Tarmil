import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Plus, X } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import {
  FriendsPicker,
  type FriendOption,
} from '../../components/tools/FriendsPicker';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useLiveRates, type LiveRates } from '../../hooks/useLiveRates';
import {
  CURRENCIES,
  convert,
  formatAmount,
  toIls,
  type CurrencyCode,
} from '../../data/currencies';
import { formatDateChip } from '../../components/tripMap/utils/formatDateRange';

const ME_ID = 'me';
const ME_LABEL = 'אני';

const FRIENDS: Array<{ id: string; name: string; initial: string }> = [
  { id: 'maya', name: 'מאיה לוי', initial: 'מ' },
  { id: 'roi', name: 'רועי בן עמי', initial: 'ר' },
  { id: 'shir', name: 'שיר כהן', initial: 'ש' },
];

const ALL_PEOPLE: FriendOption[] = [
  { id: ME_ID, label: ME_LABEL },
  ...FRIENDS.map((f) => ({ id: f.id, label: f.name })),
];

type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  paidBy: string; // ME_ID or friend id
  splitWith: string[]; // includes ME_ID for everyone sharing
  createdAt: string; // ISO yyyy-mm-dd
  isSettlement?: boolean;
};

const SEED: Expense[] = [
  {
    id: 'seed-1',
    description: 'ארוחת צהריים בקופקבנה',
    amount: 90,
    currency: 'BRL',
    paidBy: ME_ID,
    splitWith: [ME_ID, 'maya'],
    createdAt: '2026-05-04',
  },
  {
    id: 'seed-2',
    description: 'אובר מאיפנמה לסנטה טרזה',
    amount: 45,
    currency: 'BRL',
    paidBy: 'maya',
    splitWith: [ME_ID, 'maya', 'roi'],
    createdAt: '2026-05-05',
  },
  {
    id: 'seed-3',
    description: 'בירות בלאפא',
    amount: 60,
    currency: 'BRL',
    paidBy: ME_ID,
    splitWith: [ME_ID, 'roi'],
    createdAt: '2026-05-05',
  },
];

const STORAGE_KEY = 'tarmil:balance:v2';
const FRIEND_CCY_KEY = 'tarmil:balance:friend-ccy:v1';

/** Net balance in ILS per friend. Positive = friend owes you; negative = you owe friend. */
function computeBalances(
  expenses: Expense[],
  rates: LiveRates | null,
): Record<string, number> {
  const balances: Record<string, number> = {};
  FRIENDS.forEach((f) => (balances[f.id] = 0));
  for (const exp of expenses) {
    const amountIls = toIls(exp.amount, exp.currency, rates ?? undefined);
    const share = amountIls / exp.splitWith.length;
    if (exp.paidBy === ME_ID) {
      for (const personId of exp.splitWith) {
        if (personId === ME_ID) continue;
        if (!(personId in balances)) continue;
        balances[personId] += share;
      }
    } else if (exp.paidBy in balances) {
      if (exp.splitWith.includes(ME_ID)) {
        balances[exp.paidBy] -= share;
      }
    }
  }
  return balances;
}

export function BalanceScreen() {
  const [expenses, setExpenses] = usePersistentState<Expense[]>(
    STORAGE_KEY,
    SEED,
  );
  const [friendCcy, setFriendCcy] = usePersistentState<
    Record<string, CurrencyCode>
  >(FRIEND_CCY_KEY, {});
  const [adding, setAdding] = useState(false);

  const live = useLiveRates();

  const balances = useMemo(
    () => computeBalances(expenses, live.rates),
    [expenses, live.rates],
  );
  const totalNet = useMemo(
    () => Object.values(balances).reduce((s, n) => s + n, 0),
    [balances],
  );

  const addExpense = (e: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...e,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setExpenses((cur) => [...cur, expense]);
    setAdding(false);
  };

  const settleFriend = (friendId: string) => {
    const netIls = balances[friendId];
    if (Math.abs(netIls) < 0.01) return;
    const ccy = friendCcy[friendId] ?? 'ILS';
    const amountInCcy = convert(
      Math.abs(netIls),
      'ILS',
      ccy,
      live.rates ?? undefined,
    );
    const settle: Expense = {
      id: `settle-${Date.now()}`,
      description: 'סגירת חוב',
      amount: round2(amountInCcy),
      currency: ccy,
      paidBy: netIls > 0 ? friendId : ME_ID,
      splitWith: netIls > 0 ? [ME_ID] : [friendId],
      createdAt: new Date().toISOString().slice(0, 10),
      isSettlement: true,
    };
    setExpenses((cur) => [...cur, settle]);
  };

  const setFriendCurrency = (friendId: string, ccy: CurrencyCode) => {
    setFriendCcy((cur) => ({ ...cur, [friendId]: ccy }));
  };

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="יתרות בין חברים" back />

      <div className="flex flex-col gap-lg p-md">
        <SummaryCard totalNet={totalNet} />

        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Per friend." />
          <div className="flex flex-col gap-sm">
            {FRIENDS.map((f) => (
              <FriendCard
                key={f.id}
                friend={f}
                netIls={balances[f.id]}
                displayCurrency={friendCcy[f.id] ?? 'ILS'}
                rates={live.rates}
                onChangeCurrency={(c) => setFriendCurrency(f.id, c)}
                onSettle={() => settleFriend(f.id)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="02" label="History." />
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
          <ExpenseList expenses={expenses} />
        </section>

        <p className="text-small leading-snug text-cocoa-55">
          {live.error
            ? 'שערים סטטיים — לא הצלחנו למשוך שערים חיים. החישוב עדיין עובד.'
            : live.fetchedDate
              ? `שערים חיים מ־${live.fetchedDate}. המצב נשמר במכשיר שלך.`
              : 'טוען שערים חיים…'}
        </p>
      </div>
    </Screen>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function SummaryCard({ totalNet }: { totalNet: number }) {
  const abs = Math.abs(totalNet);
  let title = 'ביזנס אפס';
  let sub = 'אין חובות פתוחים בין חברים.';
  let tint: 'cocoa' | 'copper' | 'mute' = 'mute';
  if (totalNet > 0.5) {
    title = `חייבים לך ${formatAmount(abs, 0)} ₪`;
    sub = 'סך החובות הפתוחים לטובתך.';
    tint = 'cocoa';
  } else if (totalNet < -0.5) {
    title = `אתה חייב ${formatAmount(abs, 0)} ₪`;
    sub = 'סך החובות שעדיין צריך לסגור.';
    tint = 'copper';
  }
  return (
    <div
      className={clsx(
        'flex flex-col gap-1 rounded-md border p-md',
        tint === 'cocoa' && 'border-rope bg-sand',
        tint === 'copper' && 'border-copper-70 bg-sand',
        tint === 'mute' && 'border-cocoa-15 bg-ivory',
      )}
    >
      <span className="meta-caps text-cocoa-55">סך הכל</span>
      <span
        className={clsx(
          'font-serif text-sub leading-tight',
          tint === 'copper' ? 'text-copper' : 'text-cocoa',
        )}
      >
        {title}
      </span>
      <span className="text-small text-cocoa-70">{sub}</span>
    </div>
  );
}

function FriendCard({
  friend,
  netIls,
  displayCurrency,
  rates,
  onChangeCurrency,
  onSettle,
}: {
  friend: { id: string; name: string; initial: string };
  netIls: number;
  displayCurrency: CurrencyCode;
  rates: LiveRates | null;
  onChangeCurrency: (c: CurrencyCode) => void;
  onSettle: () => void;
}) {
  const balanced = Math.abs(netIls) < 0.01;
  const netInCcy = convert(
    Math.abs(netIls),
    'ILS',
    displayCurrency,
    rates ?? undefined,
  );
  const symbol = CURRENCIES.find((c) => c.code === displayCurrency)?.symbol ?? '';

  let line: string;
  if (balanced) line = 'אין חוב פתוח';
  else if (netIls > 0)
    line = `חייב לך ${formatAmount(netInCcy, netInCcy >= 100 ? 0 : 2)} ${symbol}`;
  else
    line = `אתה חייב ${formatAmount(netInCcy, netInCcy >= 100 ? 0 : 2)} ${symbol}`;

  return (
    <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
      <div className="flex items-center gap-md">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cocoa font-serif text-lede text-ivory"
          aria-hidden
        >
          {friend.initial}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="font-serif text-lede leading-tight">
            {friend.name}
          </span>
          <span
            className={clsx(
              'text-small',
              balanced
                ? 'text-cocoa-55'
                : netIls > 0
                  ? 'text-cocoa font-medium'
                  : 'text-cocoa font-medium italic',
            )}
          >
            {line}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <label className="flex flex-1 items-center gap-2 text-small text-cocoa-55">
          <span>מטבע</span>
          <select
            value={displayCurrency}
            onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
            className="h-11 flex-1 rounded-full border border-cocoa-15 bg-ivory px-sm text-body text-cocoa focus:border-copper focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </label>
        {!balanced && (
          <button
            type="button"
            onClick={onSettle}
            className="inline-flex h-11 items-center justify-center rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa active:bg-cocoa-8"
          >
            סגור חוב
          </button>
        )}
      </div>
    </div>
  );
}

function ExpenseList({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <p className="text-body text-cocoa-55">
        עדיין לא נוספו הוצאות. תוסיף אחת ב־"הוסף הוצאה".
      </p>
    );
  }
  const ordered = [...expenses].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return (
    <ul className="flex flex-col">
      {ordered.map((exp) => (
        <li
          key={exp.id}
          className="flex items-start justify-between gap-sm border-b border-cocoa-08 py-sm last:border-b-0"
        >
          <div className="flex flex-col">
            <span
              className={clsx(
                'text-body',
                exp.isSettlement ? 'text-cocoa italic' : 'text-cocoa',
              )}
            >
              {exp.description}
            </span>
            <span className="text-small text-cocoa-55">
              {personLabel(exp.paidBy)} שילם · חולק עם{' '}
              {exp.splitWith
                .filter((p) => p !== exp.paidBy)
                .map(personLabel)
                .join(', ') || 'אף אחד'}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="tnum text-body text-cocoa">
              {formatAmount(exp.amount, exp.amount % 1 === 0 ? 0 : 2)}{' '}
              <span className="ltr text-cocoa-70">{exp.currency}</span>
            </span>
            <span className="text-small text-cocoa-55">
              {formatDateChip(exp.createdAt)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function personLabel(id: string): string {
  if (id === ME_ID) return ME_LABEL;
  return FRIENDS.find((f) => f.id === id)?.name ?? id;
}

function AddExpenseForm({
  onSave,
  onCancel,
}: {
  onSave: (e: Omit<Expense, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [paidBy, setPaidBy] = useState<string>(ME_ID);
  const [splitWith, setSplitWith] = useState<string[]>([ME_ID, 'maya']);

  const amountNum = Number(amount);
  const valid =
    description.trim().length > 0 &&
    !Number.isNaN(amountNum) &&
    amountNum > 0 &&
    splitWith.length >= 1;

  const save = () => {
    if (!valid) return;
    onSave({
      description: description.trim(),
      amount: amountNum,
      currency,
      paidBy,
      splitWith,
    });
  };

  return (
    <div className="flex flex-col gap-md rounded-md border border-rope bg-sand p-md">
      <div className="flex items-start justify-between">
        <span className="meta-caps text-cocoa-70">הוצאה חדשה</span>
        <button
          type="button"
          aria-label="סגור"
          onClick={onCancel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="meta-caps text-cocoa-55">תיאור</span>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          dir="rtl"
          placeholder="לדוגמה: ארוחת ערב באיפנמה"
          className="h-11 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />
      </label>

      <div className="flex items-end gap-sm">
        <label className="flex flex-1 flex-col gap-1">
          <span className="meta-caps text-cocoa-55">סכום</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            dir="ltr"
            placeholder="0"
            className="tnum h-11 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa focus:border-copper focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="meta-caps text-cocoa-55">מטבע</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="h-11 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa focus:border-copper focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <span className="meta-caps text-cocoa-55">מי שילם?</span>
        <FriendsPicker
          options={ALL_PEOPLE}
          value={paidBy}
          onChange={setPaidBy}
          placeholder="בחר מי שילם"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="meta-caps text-cocoa-55">מי בחלוקה?</span>
        <FriendsPicker
          multi
          options={ALL_PEOPLE}
          value={splitWith}
          onChange={setSplitWith}
          placeholder="בחר מחלקים"
        />
      </div>

      <div className="flex items-center gap-sm">
        <Button variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
        <Button variant="accent" onClick={save} fullWidth>
          שמור
        </Button>
      </div>

      {!valid && (description.length > 0 || amount.length > 0) && (
        <span className="text-small text-cocoa-55">
          מלא תיאור, סכום חיובי ולפחות אדם אחד בחלוקה.
        </span>
      )}
    </div>
  );
}
