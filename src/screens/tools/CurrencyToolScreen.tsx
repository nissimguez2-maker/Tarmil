import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Currency = 'USD' | 'ILS' | 'EUR' | 'BRL' | 'ARS';

// Mock rates — locked snapshot, no live API call.
const RATES_TO_USD: Record<Currency, number> = {
  USD: 1,
  ILS: 0.27,
  EUR: 1.08,
  BRL: 0.2,
  ARS: 0.001,
};

const FLAGS: Record<Currency, string> = {
  USD: '🇺🇸',
  ILS: '🇮🇱',
  EUR: '🇪🇺',
  BRL: '🇧🇷',
  ARS: '🇦🇷',
};

const NAMES_HE: Record<Currency, string> = {
  USD: 'דולר אמריקאי',
  ILS: 'שקל ישראלי',
  EUR: 'יורו',
  BRL: 'ריאל ברזילאי',
  ARS: 'פסו ארגנטינאי',
};

export function CurrencyToolScreen() {
  const [from, setFrom] = useState<Currency>('USD');
  const [to, setTo] = useState<Currency>('ILS');
  const [amount, setAmount] = useState('100');

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const numericAmount = Number(amount.replace(/[^0-9.]/g, '')) || 0;
  const result = (numericAmount * RATES_TO_USD[from]) / RATES_TO_USD[to];

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="ממיר מטבעות" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Quick conversion." />

        <p className="max-w-body text-body text-cocoa-70">
          ממיר מהיר עם שערים שמורים על המכשיר. עובד גם בלי רשת — תרמיל מסנכרן
          את השערים פעם ביום.
        </p>

        <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
          <CurrencyRow
            currency={from}
            onChange={setFrom}
            value={amount}
            onValueChange={setAmount}
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swap}
              aria-label="החלף מטבעות"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cocoa-15 bg-ivory text-cocoa active:bg-cocoa-08"
            >
              <ArrowLeftRight className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            </button>
          </div>

          <CurrencyRow
            currency={to}
            onChange={setTo}
            value={result.toLocaleString('he-IL', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            disabled
          />
        </div>

        <p className="text-[10pt] text-cocoa-55">
          השערים מבוססים על תצלום מ־1 במאי 2026. עדכון אוטומטי עם הרשת הבאה.
        </p>
      </div>
    </Screen>
  );
}

function CurrencyRow({
  currency,
  onChange,
  value,
  onValueChange,
  disabled,
}: {
  currency: Currency;
  onChange: (c: Currency) => void;
  value: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-sm rounded-sm border border-cocoa-15 bg-ivory p-sm">
      <span aria-hidden className="text-lede leading-none">
        {FLAGS[currency]}
      </span>
      <select
        value={currency}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="bg-transparent font-serif text-lede text-cocoa focus:outline-none"
      >
        {(Object.keys(RATES_TO_USD) as Currency[]).map((c) => (
          <option key={c} value={c}>
            {c} · {NAMES_HE[c]}
          </option>
        ))}
      </select>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        className="ms-auto w-28 bg-transparent text-end font-serif text-sub tnum text-cocoa focus:outline-none disabled:text-cocoa-70"
      />
    </div>
  );
}
