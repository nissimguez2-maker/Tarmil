/**
 * Shared types + constants + math for the Balance tool. BalanceScreen and
 * BalanceHistoryScreen both read from `tarmil:balance:v2` so the same
 * roster, ids, and seed data live here.
 *
 * Net balances are computed in ILS using live FX rates. The `useLiveRates`
 * hook is the source for `rates` — pass `null` (or the ILS-only fallback)
 * when not yet loaded; conversion falls back to static `toIls` multipliers.
 */
import type { LiveRates } from '../hooks/useLiveRates';
import { toIls, type CurrencyCode } from './currencies';
import type { ExpenseCategory } from './expenses';

export const ME_ID = 'me';
export const ME_LABEL = 'אני';

export const FRIENDS: Array<{
  id: string;
  name: string;
  initial: string;
  photoUrl: string;
}> = [
  // Photos match friendOverlaps in src/data/myTrip.ts so the same person
  // looks the same across Trip / Friends / Balance.
  {
    id: 'maya',
    name: 'מאיה לוי',
    initial: 'מ',
    photoUrl: 'https://i.pravatar.cc/200?img=47',
  },
  {
    id: 'roi',
    name: 'רועי בן עמי',
    initial: 'ר',
    photoUrl: 'https://i.pravatar.cc/200?img=33',
  },
  {
    id: 'shir',
    name: 'שיר כהן',
    initial: 'ש',
    photoUrl: 'https://i.pravatar.cc/200?img=49',
  },
];

export type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  paidBy: string; // ME_ID or friend id
  splitWith: string[]; // includes ME_ID for everyone sharing
  createdAt: string; // ISO yyyy-mm-dd
  /** Category — added in v2 of the schema; pre-existing entries default to
   * 'other' at read time. Used by the Personal Expense Tracker when this
   * balance entry is mirrored over. */
  category?: ExpenseCategory;
  /** True for synthetic settlement entries created by tapping "סגור חוב". */
  isSettlement?: boolean;
};

export const SEED_EXPENSES: Expense[] = [
  {
    id: 'seed-1',
    description: 'ארוחת צהריים בקופקבנה',
    amount: 90,
    currency: 'BRL',
    paidBy: ME_ID,
    splitWith: [ME_ID, 'maya'],
    createdAt: '2026-05-04',
    category: 'food',
  },
  {
    id: 'seed-2',
    description: 'אובר מאיפנמה לסנטה טרזה',
    amount: 45,
    currency: 'BRL',
    paidBy: 'maya',
    splitWith: [ME_ID, 'maya', 'roi'],
    createdAt: '2026-05-05',
    category: 'transport',
  },
  {
    id: 'seed-3',
    description: 'בירות בלאפא',
    amount: 60,
    currency: 'BRL',
    paidBy: ME_ID,
    splitWith: [ME_ID, 'roi'],
    createdAt: '2026-05-05',
    category: 'nightlife',
  },
];

export const BALANCE_STORAGE_KEY = 'tarmil:balance:v2';
export const FRIEND_CCY_KEY = 'tarmil:balance:friend-ccy:v1';

/** Net balance in ILS per friend. Positive = friend owes you; negative = you owe friend. */
export function computeBalances(
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

export function personLabel(id: string): string {
  if (id === ME_ID) return ME_LABEL;
  return FRIENDS.find((f) => f.id === id)?.name ?? id;
}

/** Friends an expense involves on the friend side (excluding ME). Used by
 * the history screen's friend filter. */
export function expenseFriends(exp: Expense): string[] {
  const ids = new Set<string>();
  if (exp.paidBy !== ME_ID) ids.add(exp.paidBy);
  for (const p of exp.splitWith) if (p !== ME_ID) ids.add(p);
  return [...ids];
}
