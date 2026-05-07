import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronLeft, History, Plus, X } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { Button } from '../../components/Button';
import { ConfirmPill } from '../../components/ConfirmPill';
import { CategoryPicker } from '../../components/CategoryPicker';
import {
  FriendsPicker,
  type FriendOption,
} from '../../components/tools/FriendsPicker';
import { useSupabaseState } from '../../hooks/useSupabaseState';
import { useLiveRates, type LiveRates } from '../../hooks/useLiveRates';
import {
  CURRENCIES,
  convert,
  formatAmount,
  type CurrencyCode,
} from '../../data/currencies';
import {
  BALANCE_STORAGE_KEY,
  FRIENDS,
  FRIEND_CCY_KEY,
  ME_ID,
  ME_LABEL,
  SEED_EXPENSES,
  computeBalances,
  type Expense,
} from '../../data/balance';
import {
  EXPENSES_STORAGE_KEY,
  SEED_PERSONAL_EXPENSES,
  type ExpenseCategory,
  type PersonalExpense,
} from '../../data/expenses';

const ALL_PEOPLE: FriendOption[] = [
  { id: ME_ID, label: ME_LABEL },
  ...FRIENDS.map((f) => ({ id: f.id, label: f.name })),
];

type ConfirmState =
  | { kind: 'settle'; friendId: string }
  | null;

/**
 * Balance tool — focused on per-friend status. The full expense log lives
 * at /tools/balance/history (BalanceHistoryScreen). Settle actions are
 * gated by a centered ConfirmPill so they can't be triggered by accident.
 */
export function BalanceScreen() {
  const [expenses, setExpenses] = useSupabaseState<Expense[]>(
    BALANCE_STORAGE_KEY,
    SEED_EXPENSES,
  );
  // Personal Expense Tracker store — Balance writes a mirrored entry here
  // every time the user adds an expense they paid for, and erases all
  // matching entries when settling that friend's debt. Reads the same
  // localStorage key as ExpensesScreen so the two tabs stay in sync.
  const [, setPersonalExpenses] = useSupabaseState<PersonalExpense[]>(
    EXPENSES_STORAGE_KEY,
    SEED_PERSONAL_EXPENSES,
  );
  const [friendCcy, setFriendCcy] = useSupabaseState<
    Record<string, CurrencyCode>
  >(FRIEND_CCY_KEY, {});
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

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

    // Mirror into the Personal Expense Tracker iff THE USER paid. If a
    // friend paid, no money came out of the user's pocket yet, so there's
    // nothing to track personally — that flow is captured purely as a
    // balance owed. Settlement entries are never mirrored either.
    if (expense.paidBy === ME_ID) {
      const mirrored: PersonalExpense = {
        id: `pe-from-${expense.id}`,
        date: expense.createdAt,
        amount: expense.amount,
        currency: expense.currency,
        category: expense.category ?? 'other',
        note: expense.description,
        sourceBalanceId: expense.id,
      };
      setPersonalExpenses((cur) => [...cur, mirrored]);
    }
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

    // Find every (paid-by-me, friend-involved, non-settlement) balance
    // expense — those are the entries we mirrored into the tracker. We
    // erase the tracker rows linked back to them by `sourceBalanceId`.
    const erasableBalanceIds = new Set(
      expenses
        .filter(
          (x) =>
            !x.isSettlement &&
            x.paidBy === ME_ID &&
            x.splitWith.includes(friendId),
        )
        .map((x) => x.id),
    );
    setPersonalExpenses((cur) =>
      cur.filter(
        (pe) =>
          !pe.sourceBalanceId || !erasableBalanceIds.has(pe.sourceBalanceId),
      ),
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

  const confirmDetails = (() => {
    if (!confirm) return null;
    if (confirm.kind === 'settle') {
      const friend = FRIENDS.find((f) => f.id === confirm.friendId);
      if (!friend) return null;
      const netIls = balances[confirm.friendId];
      const ccy = friendCcy[confirm.friendId] ?? 'ILS';
      const symbol =
        CURRENCIES.find((c) => c.code === ccy)?.symbol ?? '';
      const amount = formatAmount(
        Math.abs(convert(netIls, 'ILS', ccy, live.rates ?? undefined)),
        netIls >= 100 ? 0 : 2,
      );
      const direction =
        netIls > 0
          ? `${friend.name} שילם לך ${amount} ${symbol}`
          : `שילמת ל${friend.name} ${amount} ${symbol}`;
      return {
        title: 'לסגור את החוב?',
        body: `${direction}. הפעולה תיכתב להיסטוריה ולא תוכל לבטל אותה משם.`,
        action: () => settleFriend(confirm.friendId),
      };
    }
    return null;
  })();

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="יתרות בין חברים" back />

      <div className="flex flex-col gap-lg p-md">
        <SummaryCard totalNet={totalNet} />

        {/* Add-expense — primary CTA at the top of the friend list, where
          * the user expects "do something" actions to live. Inline form
          * expands on tap so we don't punch the user out to a new sheet. */}
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
                onSettle={() => setConfirm({ kind: 'settle', friendId: f.id })}
              />
            ))}
          </div>
        </section>

        {/* Link to the full transaction log. Ghost styling so it doesn't
          * compete with the primary "+הוסף הוצאה" CTA above. */}
        <Link
          to="/tools/balance/history"
          className="inline-flex h-11 items-center justify-between rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa active:bg-cocoa-08"
        >
          <span className="inline-flex items-center gap-2">
            <History className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span>היסטוריית תשלומים</span>
          </span>
          <ChevronLeft className="h-4 w-4 text-cocoa-55" aria-hidden />
        </Link>

        <p className="text-small leading-snug text-cocoa-55">
          {live.error
            ? 'שערים סטטיים — לא הצלחנו למשוך שערים חיים. החישוב עדיין עובד.'
            : live.fetchedDate
              ? `שערים חיים מ־${live.fetchedDate}. המצב נשמר במכשיר שלך.`
              : 'טוען שערים חיים…'}
        </p>
      </div>

      <ConfirmPill
        open={confirmDetails !== null}
        title={confirmDetails?.title ?? ''}
        body={confirmDetails?.body}
        confirmLabel="סגור חוב"
        danger
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirmDetails?.action();
          setConfirm(null);
        }}
      />
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
  friend: { id: string; name: string; initial: string; photoUrl: string };
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
    <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
      <div className="flex items-center gap-md">
        <span
          className="inline-block h-11 w-11 shrink-0 rounded-full border border-cocoa-15 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${friend.photoUrl}')` }}
          role="img"
          aria-label={friend.name}
        />
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
                  ? 'font-medium text-cocoa'
                  : 'font-medium italic text-cocoa',
            )}
          >
            {line}
          </span>
        </div>
      </div>
      {/* Settle + currency selector. The currency picker is compact (no
        * full-width label) and only appears when there's an open balance —
        * for "אין חוב פתוח" friends, the row is silent so the card reads as
        * "all settled" without competing controls. */}
      {!balanced && (
        <div className="flex items-center gap-sm">
          <select
            value={displayCurrency}
            onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
            aria-label={`מטבע עבור ${friend.name}`}
            className="h-11 flex-1 rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa focus:border-copper focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onSettle}
            className="inline-flex h-11 items-center justify-center rounded-full bg-copper px-md text-body font-medium text-ivory active:bg-copper-85"
          >
            סגור חוב
          </button>
        </div>
      )}
    </div>
  );
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
  const [category, setCategory] = useState<ExpenseCategory>('food');
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
      category,
      paidBy,
      splitWith,
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Amount hero — same pattern as the Currency tool and the personal
        * Expense Tracker form. Big centered display number with the
        * currency selector full-width below. */}
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

      {/* Description — full width. */}
      <label className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">תיאור</span>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          dir="rtl"
          placeholder="לדוגמה: ארוחת ערב באיפנמה"
          className="h-11 rounded-full border border-cocoa-15 bg-white px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />
      </label>

      {/* Category — 2-col chip grid (shared component). */}
      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">קטגוריה</span>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      {/* Who paid + who split with. */}
      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">מי שילם?</span>
        <FriendsPicker
          options={ALL_PEOPLE}
          value={paidBy}
          onChange={setPaidBy}
          placeholder="בחר מי שילם"
        />
      </div>

      <div className="flex flex-col gap-sm">
        <span className="meta-caps text-cocoa-55">מי בחלוקה?</span>
        <FriendsPicker
          multi
          options={ALL_PEOPLE}
          value={splitWith}
          onChange={setSplitWith}
          placeholder="בחר מחלקים"
        />
      </div>

      {!valid && (description.length > 0 || amount.length > 0) && (
        <span className="text-small text-cocoa-55">
          מלא תיאור, סכום חיובי ולפחות אדם אחד בחלוקה.
        </span>
      )}

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
