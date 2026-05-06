import { useMemo } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { usePersistentState } from '../../hooks/usePersistentState';
import {
  CURRENCIES,
  RATES_LABEL,
  convert,
  formatAmount,
  getCurrency,
  type CurrencyCode,
} from '../../data/currencies';

type State = {
  amount: string;
  from: CurrencyCode;
  to: CurrencyCode;
};

const INITIAL: State = { amount: '100', from: 'ILS', to: 'BRL' };
const STORAGE_KEY = 'tarmil:currency:v1';

export function CurrencyScreen() {
  const [state, setState] = usePersistentState<State>(STORAGE_KEY, INITIAL);

  const amountNum = Number(state.amount);
  const valid = !Number.isNaN(amountNum) && state.amount.trim() !== '';
  const from = getCurrency(state.from);
  const to = getCurrency(state.to);

  const result = useMemo(() => {
    if (!valid) return null;
    return convert(amountNum, state.from, state.to);
  }, [amountNum, state.from, state.to, valid]);

  // 1 unit of FROM in ILS — for the transparency line ("1 USD = 3.70 ₪").
  const fromUnitInIls = useMemo(
    () => convert(1, state.from, 'ILS'),
    [state.from],
  );

  const swap = () =>
    setState((s) => ({ ...s, from: s.to, to: s.from }));

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="ממיר מטבעות" back />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Quick conversion." />

        <div className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
          <span className="meta-caps text-cocoa-55">סכום</span>
          <input
            type="number"
            inputMode="decimal"
            value={state.amount}
            onChange={(e) =>
              setState((s) => ({ ...s, amount: e.target.value }))
            }
            dir="ltr"
            aria-label="סכום להמרה"
            className="tnum w-full border-none bg-transparent text-display text-cocoa focus:outline-none"
          />
          <CurrencyRow
            from={state.from}
            to={state.to}
            onChangeFrom={(c) => setState((s) => ({ ...s, from: c }))}
            onChangeTo={(c) => setState((s) => ({ ...s, to: c }))}
            onSwap={swap}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="meta-caps text-cocoa-55">תוצאה</span>
          {valid && result != null ? (
            <div className="flex items-baseline gap-sm">
              <span className="tnum font-serif text-sub leading-tight text-cocoa">
                {formatAmount(result)}
              </span>
              <span className="text-lede text-cocoa-70 ltr">
                {to.symbol} {to.code}
              </span>
            </div>
          ) : (
            <span className="text-body text-cocoa-55">הזן סכום תקין</span>
          )}
          <span className="text-[10pt] text-cocoa-55">
            <span className="ltr">
              1 {from.code} = {formatAmount(fromUnitInIls, 4)} ₪
            </span>
          </span>
        </div>

        <p className="text-[9pt] leading-snug text-cocoa-55">
          {RATES_LABEL}. שערים לדוגמה — לפני המרה משמעותית בדוק שער עדכני.
        </p>
      </div>
    </Screen>
  );
}

function CurrencyRow({
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onSwap,
}: {
  from: CurrencyCode;
  to: CurrencyCode;
  onChangeFrom: (c: CurrencyCode) => void;
  onChangeTo: (c: CurrencyCode) => void;
  onSwap: () => void;
}) {
  return (
    <div className="flex items-center gap-sm" dir="ltr">
      <CurrencyPicker label="From" value={from} onChange={onChangeFrom} />
      <button
        type="button"
        onClick={onSwap}
        aria-label="החלף מטבעות"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cocoa-15 bg-ivory text-copper active:bg-cocoa-8"
      >
        <ArrowDownUp className="h-4 w-4" aria-hidden />
      </button>
      <CurrencyPicker label="To" value={to} onChange={onChangeTo} />
    </div>
  );
}

function CurrencyPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="meta-caps text-cocoa-55">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="tnum h-10 w-full rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa focus:border-copper focus:outline-none"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code} — {c.englishName}
          </option>
        ))}
      </select>
    </label>
  );
}
