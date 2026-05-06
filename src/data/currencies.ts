/**
 * Mock currency table for the Currency exchange tool and the multi-currency
 * Balance tool. Rates are expressed as currency → ILS multipliers
 * (e.g., 1 USD = 3.70 ILS) so conversion is always:
 *   resultIls = amount * from.toIls
 *   resultTo  = resultIls / to.toIls
 *
 * Rates are static. The Currency screen labels them as "מעודכן 6 במאי 2026"
 * so the user understands these are demo values.
 */

export type CurrencyCode =
  | 'ILS'
  | 'USD'
  | 'EUR'
  | 'BRL'
  | 'ARS'
  | 'GBP'
  | 'THB';

export type Currency = {
  code: CurrencyCode;
  /** Display symbol (₪, $, €, …). */
  symbol: string;
  /** Hebrew name (e.g., "שקל"). */
  hebrewName: string;
  /** English name for the picker eyebrow. */
  englishName: string;
  /** Multiplier to ILS. 1 unit of this currency = `toIls` ILS. */
  toIls: number;
};

export const CURRENCIES: Currency[] = [
  {
    code: 'ILS',
    symbol: '₪',
    hebrewName: 'שקל',
    englishName: 'Israeli Shekel',
    toIls: 1,
  },
  {
    code: 'USD',
    symbol: '$',
    hebrewName: 'דולר אמריקאי',
    englishName: 'US Dollar',
    toIls: 3.7,
  },
  {
    code: 'EUR',
    symbol: '€',
    hebrewName: 'יורו',
    englishName: 'Euro',
    toIls: 4.0,
  },
  {
    code: 'BRL',
    symbol: 'R$',
    hebrewName: 'ריאל ברזילאי',
    englishName: 'Brazilian Real',
    toIls: 0.7,
  },
  {
    code: 'ARS',
    symbol: 'AR$',
    hebrewName: 'פסו ארגנטינאי',
    englishName: 'Argentine Peso',
    toIls: 0.003,
  },
  {
    code: 'GBP',
    symbol: '£',
    hebrewName: 'לירה שטרלינג',
    englishName: 'British Pound',
    toIls: 4.7,
  },
  {
    code: 'THB',
    symbol: '฿',
    hebrewName: 'באט תאילנדי',
    englishName: 'Thai Baht',
    toIls: 0.11,
  },
];

export function getCurrency(code: CurrencyCode): Currency {
  const c = CURRENCIES.find((x) => x.code === code);
  if (!c) throw new Error(`Unknown currency: ${code}`);
  return c;
}

/** Convert an amount from one currency to another via the ILS base. */
export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  return (amount * getCurrency(from).toIls) / getCurrency(to).toIls;
}

/** Convert any currency amount to ILS. Used by the Balance tool to net out. */
export function toIls(amount: number, code: CurrencyCode): number {
  return amount * getCurrency(code).toIls;
}

/** "1,234.56" — Latin digits with thousands separator, two decimals. */
export function formatAmount(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Static demo timestamp so the rate panel reads as a real product. */
export const RATES_LABEL = 'מעודכן 6 במאי 2026';
