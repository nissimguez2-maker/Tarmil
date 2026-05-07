import { useMemo } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useLiveRates } from '../../hooks/useLiveRates';
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
  const live = useLiveRates();

  const amountNum = Number(state.amount);
  const valid = !Number.isNaN(amountNum) && state.amount.trim() !== '';
  const from = getCurrency(state.from);
  const to = getCurrency(state.to);

  const result = useMemo(() => {
    if (!valid) return null;
    return convert(amountNum, state.from, state.to, live.rates ?? undefined);
  }, [amountNum, state.from, state.to, valid, live.rates]);

  // 1 unit of FROM in ILS — for the transparency line ("1 USD = 3.70 ₪").
  const fromUnitInIls = useMemo(
    () => convert(1, state.from, 'ILS', live.rates ?? undefined),
    [state.from, live.rates],
  );

  const swap = () =>
    setState((s) => ({ ...s, from: s.to, to: s.from }));

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="ממיר מטבעות" back />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Quick conversion." />

        {/* Input card: amount → from/to selectors. */}
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
            className="tnum w-full border-none bg-transparent text-center text-display text-cocoa focus:outline-none"
          />
          <CurrencyRow
            from={state.from}
            to={state.to}
            onChangeFrom={(c) => setState((s) => ({ ...s, from: c }))}
            onChangeTo={(c) => setState((s) => ({ ...s, to: c }))}
            onSwap={swap}
          />
        </div>

        {/* Output card: mirrors the input card so the screen reads as a
          * symmetric "in / out" comparison. The display number is centered
          * and dominant; the implied rate sits beneath as a quiet caption. */}
        <div className="flex flex-col items-center gap-1 rounded-md border border-rope bg-sand p-md text-center">
          <span className="meta-caps self-start text-cocoa-55">תוצאה</span>
          {valid && result != null ? (
            <div className="flex flex-col items-center gap-1">
              <span className="tnum font-serif text-display leading-none text-cocoa">
                {formatAmount(result)}
              </span>
              <span className="ltr text-lede text-cocoa-70">
                {to.symbol} {to.code}
              </span>
            </div>
          ) : (
            <span className="py-sm text-body text-cocoa-55">הזן סכום תקין</span>
          )}
          <span className="mt-1 text-small text-cocoa-55">
            <span className="ltr">
              1 {from.code} = {formatAmount(fromUnitInIls, 4)} ₪
            </span>
          </span>
        </div>

        <p className="text-small leading-snug text-cocoa-55">
          {live.error
            ? `${RATES_LABEL} (שערים סטטיים — לא הצלחנו למשוך עדכון חי).`
            : live.fetchedDate
              ? `שערים חיים, עודכנו ${live.fetchedDate}. לפני המרה משמעותית בדוק שער עדכני.`
              : 'טוען שערים חיים…'}
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
    // Stack From/To vertically so each select gets the full card width —
    // the previous side-by-side row clipped the displayed value (e.g.
    // "$ U…"). Swap button sits on its own line, centered, between the
    // two selects.
    <div className="flex flex-col gap-2" dir="ltr">
      <CurrencyPicker label="From" value={from} onChange={onChangeFrom} />
      <button
        type="button"
        onClick={onSwap}
        aria-label="החלף מטבעות"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-copper-70 bg-ivory text-copper active:bg-cocoa-8"
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
    <label className="flex flex-col gap-1">
      <span className="meta-caps text-cocoa-55">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="tnum h-11 w-full rounded-full border border-cocoa-15 bg-ivory px-md text-body text-cocoa focus:border-copper focus:outline-none"
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
