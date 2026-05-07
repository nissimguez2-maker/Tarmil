/**
 * Personal Expense Tracker — solo spend log that pairs with the Balance
 * tool. Each entry stores amount + currency + category + optional note +
 * date. Entries created via the Balance tool carry a `sourceBalanceId`
 * link; settling that friend's balance erases all matching entries here.
 *
 * Stored at `tarmil:expenses:v1`. Display currency persisted at
 * `tarmil:expenses:display-ccy:v1` so the user's chosen "show totals in"
 * setting survives reload.
 */
import {
  Beer,
  Bus,
  Hotel,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react';
import type { CurrencyCode } from './currencies';

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'lodging'
  | 'nightlife'
  | 'shopping'
  | 'health'
  | 'services'
  | 'other';

export type PersonalExpense = {
  id: string;
  /** ISO yyyy-mm-dd. Defaults to today on creation; user can override. */
  date: string;
  amount: number;
  currency: CurrencyCode;
  category: ExpenseCategory;
  note?: string;
  /** When set, this entry mirrors a Balance expense and is erased
   * automatically when that friend's balance is settled. The id matches
   * the original `Expense.id` in `src/data/balance.ts`. */
  sourceBalanceId?: string;
};

export const EXPENSES_STORAGE_KEY = 'tarmil:expenses:v1';
export const EXPENSE_CCY_KEY = 'tarmil:expenses:display-ccy:v1';

export const ALL_CATEGORIES: ExpenseCategory[] = [
  'food',
  'transport',
  'lodging',
  'nightlife',
  'shopping',
  'health',
  'services',
  'other',
];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'אוכל',
  transport: 'תחבורה',
  lodging: 'לינה',
  nightlife: 'בילויים',
  shopping: 'קניות',
  health: 'בריאות',
  services: 'שירותים',
  other: 'אחר',
};

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  food: UtensilsCrossed,
  transport: Bus,
  lodging: Hotel,
  nightlife: Beer,
  shopping: ShoppingBag,
  health: HeartPulse,
  services: Wrench,
  other: CircleDashed,
};

/** Resolve a category that might be missing (back-compat with v1 balance
 * entries that pre-date the category field). */
export function categoryOrOther(
  c: ExpenseCategory | undefined,
): ExpenseCategory {
  return c ?? 'other';
}

/**
 * Seed: a handful of plausible solo entries dated within the past two
 * weeks (the "today" of the demo is 2026-05-07 per CLAUDE.md). Mix of
 * currencies so the multi-currency totals show real numbers. No
 * `sourceBalanceId` — these are pure solo spend.
 */
export const SEED_PERSONAL_EXPENSES: PersonalExpense[] = [
  {
    id: 'pe-seed-1',
    date: '2026-05-06',
    amount: 14,
    currency: 'BRL',
    category: 'food',
    note: 'אסאי על הטיילת',
  },
  {
    id: 'pe-seed-2',
    date: '2026-05-06',
    amount: 22,
    currency: 'BRL',
    category: 'transport',
    note: 'אובר חזרה לקופה',
  },
  {
    id: 'pe-seed-3',
    date: '2026-05-05',
    amount: 180,
    currency: 'BRL',
    category: 'lodging',
    note: 'לילה נוסף בהוסטל',
  },
  {
    id: 'pe-seed-4',
    date: '2026-05-04',
    amount: 35,
    currency: 'BRL',
    category: 'nightlife',
    note: 'כניסה למועדון בלאפא',
  },
  {
    id: 'pe-seed-5',
    date: '2026-05-03',
    amount: 12,
    currency: 'USD',
    category: 'services',
    note: 'eSIM שבוע נוסף',
  },
  {
    id: 'pe-seed-6',
    date: '2026-05-02',
    amount: 60,
    currency: 'BRL',
    category: 'shopping',
    note: 'מטקות חדשות',
  },
];
