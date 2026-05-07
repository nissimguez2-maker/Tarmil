import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Calendar, Trash2 } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ConfirmPill } from '../../components/ConfirmPill';
import {
  FriendsPicker,
  type FriendOption,
} from '../../components/tools/FriendsPicker';
import { useSupabaseState } from '../../hooks/useSupabaseState';
import { formatAmount } from '../../data/currencies';
import {
  BALANCE_STORAGE_KEY,
  FRIENDS,
  SEED_EXPENSES,
  expenseFriends,
  personLabel,
  type Expense,
} from '../../data/balance';
import { formatDateChip } from '../../components/tripMap/utils/formatDateRange';

type DateFilter = 'all' | '7d' | '30d' | '90d';

const DATE_OPTIONS: Array<{ id: DateFilter; label: string }> = [
  { id: 'all', label: 'הכל' },
  { id: '7d', label: 'שבוע' },
  { id: '30d', label: 'חודש' },
  { id: '90d', label: 'רבעון' },
];

const FRIEND_OPTIONS: FriendOption[] = FRIENDS.map((f) => ({
  id: f.id,
  label: f.name,
}));

function withinDate(iso: string, filter: DateFilter): boolean {
  if (filter === 'all') return true;
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  // ISO string compare works because both are yyyy-mm-dd anchored.
  return iso >= cutoff.toISOString().slice(0, 10);
}

/**
 * Full transaction log for the Balance tool. Filterable by date and by
 * friend. Lives at /tools/balance/history. Reads the same persistent
 * store as BalanceScreen (`tarmil:balance:v2`) — settlements show as
 * "סגירת חוב" entries inline with the rest of the timeline.
 */
export function BalanceHistoryScreen() {
  const [expenses, setExpenses] = useSupabaseState<Expense[]>(
    BALANCE_STORAGE_KEY,
    SEED_EXPENSES,
  );
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [friendFilter, setFriendFilter] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => withinDate(e.createdAt, dateFilter))
      .filter((e) => {
        if (friendFilter.length === 0) return true;
        const friends = expenseFriends(e);
        return friendFilter.some((id) => friends.includes(id));
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [expenses, dateFilter, friendFilter]);

  const deleteExpense = (id: string) => {
    setExpenses((cur) => cur.filter((e) => e.id !== id));
  };

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="היסטוריית תשלומים" back />

      <div className="flex flex-col gap-md p-md">
        {/* Date filter — short, label + chip rail. */}
        <section className="flex flex-col gap-sm">
          <span className="meta-caps text-cocoa-55">תאריך</span>
          <div className="flex items-center gap-2">
            {DATE_OPTIONS.map((opt) => {
              const active = dateFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDateFilter(opt.id)}
                  className={clsx(
                    'inline-flex h-11 items-center gap-1 rounded-full border px-md text-body transition-colors duration-200 ease-out-quart',
                    active
                      ? 'border-cocoa bg-cocoa text-ivory'
                      : 'border-cocoa-15 bg-ivory text-cocoa active:bg-cocoa-08',
                  )}
                >
                  {opt.id === 'all' && (
                    <Calendar
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Friend filter — multi-select via the existing FriendsPicker.
          * Empty selection = include everyone. */}
        <section className="flex flex-col gap-sm">
          <span className="meta-caps text-cocoa-55">חברים</span>
          <FriendsPicker
            multi
            options={FRIEND_OPTIONS}
            value={friendFilter}
            onChange={setFriendFilter}
            placeholder="כל החברים"
          />
        </section>

        {/* Result count + clear action when filters are non-default. */}
        <div className="flex items-center justify-between text-small text-cocoa-55">
          <span>
            <span className="tnum">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'רישום' : 'רישומים'}
          </span>
          {(dateFilter !== 'all' || friendFilter.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setDateFilter('all');
                setFriendFilter([]);
              }}
              className="text-cocoa underline-offset-4 hover:underline"
            >
              נקה סינון
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-md border border-cocoa-15 bg-ivory p-md text-body text-cocoa-55">
            אין רישומים שתואמים את הסינון.
          </p>
        ) : (
          <ul className="flex flex-col rounded-md border border-rope bg-ivory">
            {filtered.map((exp) => (
              <li
                key={exp.id}
                className="flex items-start justify-between gap-sm border-b border-cocoa-08 p-md last:border-b-0"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={clsx(
                        'text-body',
                        exp.isSettlement
                          ? 'italic text-cocoa-70'
                          : 'text-cocoa',
                      )}
                    >
                      {exp.description}
                    </span>
                    {exp.isSettlement && (
                      <span className="meta-caps text-copper">סגירה</span>
                    )}
                  </div>
                  <span className="text-small text-cocoa-55">
                    {personLabel(exp.paidBy)} שילם · חולק עם{' '}
                    {exp.splitWith
                      .filter((p) => p !== exp.paidBy)
                      .map(personLabel)
                      .join(', ') || 'אף אחד'}
                  </span>
                  <span className="text-small text-cocoa-55">
                    {formatDateChip(exp.createdAt)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="tnum text-body text-cocoa">
                    {formatAmount(exp.amount, exp.amount % 1 === 0 ? 0 : 2)}{' '}
                    <span className="ltr text-cocoa-70">{exp.currency}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(exp)}
                    aria-label={`מחק ${exp.description}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-08 hover:text-cocoa active:bg-cocoa-15"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-small leading-snug text-cocoa-55">
          ההיסטוריה נשמרת אצלך במכשיר. מחיקת רישום פה לא תשנה את היתרות אם
          הוא חלק מסגירת חוב שכבר התבצעה.
        </p>
      </div>

      <ConfirmPill
        open={confirmDelete !== null}
        title={`למחוק את הרישום?`}
        body={
          confirmDelete
            ? `${confirmDelete.description} — ${formatAmount(
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
