import { useState, useMemo } from 'react';
import {
  Check,
  Mic,
  Camera,
  Wallet,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { Modal } from '../shared/Modal';
import { Button } from '../Button';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

export type ToolId =
  | 'currency'
  | 'checklist'
  | 'voice'
  | 'menu'
  | 'signs'
  | 'balances'
  | 'esim';

type Props = {
  toolId: ToolId | null;
  onClose: () => void;
};

const TITLES: Record<ToolId, { title: string; eyebrow: string }> = {
  currency: { title: 'Currency converter', eyebrow: 'Tool' },
  checklist: { title: 'Pre-trip checklist', eyebrow: 'Tool' },
  voice: { title: 'Voice translator', eyebrow: 'Tool' },
  menu: { title: 'Menu translator', eyebrow: 'Tool' },
  signs: { title: 'Sign scanner', eyebrow: 'Tool' },
  balances: { title: 'Friend balances', eyebrow: 'Tool' },
  esim: { title: 'eSIM & data', eyebrow: 'Tool' },
};

/**
 * Modal that opens for each tool tile in the Profile tab. Each tool ships a
 * mock interface — enough fidelity for the demo, not a real implementation.
 * Currency converter and checklist are interactive; the rest render
 * realistic mock states.
 */
export function ToolDetailSheet({ toolId, onClose }: Props) {
  const meta = toolId ? TITLES[toolId] : null;

  return (
    <Modal
      open={toolId !== null}
      onClose={onClose}
      eyebrow={meta?.eyebrow}
      title={meta?.title ?? ''}
      level={1}
    >
      {toolId === 'currency' && <CurrencyConverter />}
      {toolId === 'checklist' && <PreTripChecklist />}
      {toolId === 'voice' && <VoiceTranslator />}
      {toolId === 'menu' && <MenuTranslator />}
      {toolId === 'signs' && <SignScanner />}
      {toolId === 'balances' && <FriendBalances />}
      {toolId === 'esim' && <EsimPlans />}
    </Modal>
  );
}

// ---------- Currency converter (interactive, trip-aware) ----------

type Currency = 'ILS' | 'USD' | 'EUR' | 'BRL' | 'ARS' | 'UYU' | 'THB';

const CURRENCY_LABEL: Record<Currency, string> = {
  ILS: 'Shekel · ₪',
  USD: 'Dollar · $',
  EUR: 'Euro · €',
  BRL: 'Real · R$',
  ARS: 'Argentine peso · $',
  UYU: 'Uruguayan peso · $U',
  THB: 'Baht · ฿',
};

// Approximate May 2026 rates (relative to ILS). Mock — not live.
const TO_ILS: Record<Currency, number> = {
  ILS: 1,
  USD: 3.65,
  EUR: 3.95,
  BRL: 0.72,
  ARS: 0.0036,
  UYU: 0.09,
  THB: 0.105,
};

const CURRENCY_BY_DESTINATION: Record<string, Currency> = {
  buzios: 'BRL',
  'sao-paulo': 'BRL',
  jericoacoara: 'BRL',
  'rio-de-janeiro': 'BRL',
  'buenos-aires': 'ARS',
  'punta-del-este': 'UYU',
};

function CurrencyConverter() {
  const { data } = useSupabaseData();
  const tripCurrency: Currency = useMemo(() => {
    const firstStop = data?.plannedStops[0];
    if (!firstStop) return 'BRL';
    return CURRENCY_BY_DESTINATION[firstStop.id] ?? 'BRL';
  }, [data]);
  const tripDestination = useMemo(
    () => data?.plannedStops[0]?.nameEn,
    [data],
  );
  const [from, setFrom] = useState<Currency>('USD');
  const [to, setTo] = useState<Currency>(tripCurrency);
  const [amount, setAmount] = useState('100');

  const numeric = Number.parseFloat(amount.replace(/,/g, '')) || 0;
  const inIls = numeric * TO_ILS[from];
  const result = inIls / TO_ILS[to];

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        Live rates. Values update once a day and keep the last rate even when
        offline.
      </p>

      {tripDestination && (
        <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
          You're headed to <span className="text-cocoa">{tripDestination}</span> —
          defaulting to {CURRENCY_LABEL[tripCurrency].split(' · ')[0]}.
        </p>
      )}

      <div className="flex flex-col gap-xs">
        <label className="meta-caps text-cocoa-55">Amount</label>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-12 w-full rounded-full border border-cocoa-15 bg-sand px-md text-lede tnum text-cocoa transition-colors duration-instant ease-out-quart focus:border-copper focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">From</label>
          <CurrencySelect value={from} onChange={setFrom} />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">To</label>
          <CurrencySelect value={to} onChange={setTo} />
        </div>
      </div>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-copper">Result</span>
        <p className="mt-xs font-serif text-display leading-none text-cocoa">
          <span className="tnum">{formatNumber(result)}</span>
        </p>
        <p className="mt-xs text-small text-cocoa-70">
          {CURRENCY_LABEL[to]}
        </p>
      </div>
    </div>
  );
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (v: Currency) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Currency)}
      className="h-12 w-full appearance-none rounded-full border border-cocoa-15 bg-sand px-md text-body text-cocoa transition-colors duration-instant ease-out-quart focus:border-copper focus:outline-none"
    >
      {(Object.keys(CURRENCY_LABEL) as Currency[]).map((c) => (
        <option key={c} value={c}>
          {CURRENCY_LABEL[c]}
        </option>
      ))}
    </select>
  );
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

// ---------- Pre-trip checklist (interactive, trip-aware) ----------

type ChecklistItem = { id: string; label: string; trip?: true };

const GENERIC_CHECKLIST: ChecklistItem[] = [
  { id: 'insurance', label: 'Travel insurance with extreme-sports cover' },
  { id: 'passport', label: 'Passport valid at least six months' },
  { id: 'cards', label: 'Credit cards + local cash' },
  { id: 'esim', label: 'Local eSIM booked' },
  { id: 'documents', label: 'Scan documents to the cloud' },
  { id: 'pharmacy', label: 'Basic pharmacy kit' },
];

const COUNTRY_BY_STOP_ID: Record<string, string> = {
  buzios: 'Brazil',
  'sao-paulo': 'Brazil',
  jericoacoara: 'Brazil',
  'rio-de-janeiro': 'Brazil',
  'buenos-aires': 'Argentina',
  'punta-del-este': 'Uruguay',
};

const COUNTRY_ITEMS: Record<string, ChecklistItem[]> = {
  Brazil: [
    { id: 'br-yellow', label: 'Yellow-fever vaccine (Brazil mandates entry)', trip: true },
    { id: 'br-cash', label: 'Reais cash for Búzios and Jeri (ATMs limited)', trip: true },
  ],
  Argentina: [
    { id: 'ar-pesos', label: 'Argentine pesos in cash (blue-dollar rate beats cards)', trip: true },
  ],
  Uruguay: [
    { id: 'uy-pesos', label: 'Uruguayan pesos for Punta del Este weekends', trip: true },
  ],
};

function PreTripChecklist() {
  const { data } = useSupabaseData();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    const countries = new Set<string>();
    for (const s of data?.plannedStops ?? []) {
      const c = COUNTRY_BY_STOP_ID[s.id];
      if (c) countries.add(c);
    }
    const tripItems: ChecklistItem[] = [];
    for (const c of countries) {
      const seq = COUNTRY_ITEMS[c];
      if (seq) tripItems.push(...seq);
    }
    return [...tripItems, ...GENERIC_CHECKLIST];
  }, [data]);

  const done = Object.values(checked).filter(Boolean).length;
  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-baseline justify-between">
        <p className="text-small text-cocoa-70">
          Tailored to your planned stops — country-specific items on top.
        </p>
        <span className="text-small text-cocoa-55 tnum">
          {done}/{items.length}
        </span>
      </div>

      <ul className="flex flex-col">
        {items.map((item, i) => {
          const isChecked = !!checked[item.id];
          return (
            <li
              key={item.id}
              className={clsx(
                i > 0 && 'border-t border-cocoa-15',
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-sm py-sm text-start transition-colors duration-instant ease-out-quart active:bg-cocoa-08"
              >
                <span
                  className={clsx(
                    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                    'transition-colors duration-instant ease-out-quart',
                    isChecked
                      ? 'border-copper bg-copper text-ivory'
                      : 'border-cocoa-30 bg-ivory text-transparent',
                  )}
                  aria-hidden
                >
                  <Check className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <span
                  className={clsx(
                    'min-w-0 flex-1 text-body',
                    isChecked
                      ? 'text-cocoa-55 line-through'
                      : 'text-cocoa',
                  )}
                >
                  {item.label}
                </span>
                {item.trip && (
                  <span className="meta-caps shrink-0 text-copper">
                    Trip
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Voice translator (mock) ----------

function VoiceTranslator() {
  const [recording, setRecording] = useState(false);

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        Speak English, we'll translate to Portuguese, Spanish, Hebrew, Thai or
        French. Works online; offline it falls back to the last translation.
      </p>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-cocoa-55">Last example</span>
        <p className="mt-xs font-serif text-lede italic text-cocoa">
          Where can I get a taxi?
        </p>
        <p className="mt-xs text-body text-cocoa-70 ltr">
          Onde posso pedir um táxi?
        </p>
      </div>

      <button
        type="button"
        onClick={() => setRecording((r) => !r)}
        className={clsx(
          'mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full',
          'transition-[transform,background-color] duration-instant ease-out-quart',
          'shadow-fab active:scale-[0.96]',
          recording ? 'bg-copper text-ivory animate-pulse' : 'bg-cocoa text-ivory',
        )}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
      >
        <Mic className="h-7 w-7" strokeWidth={1.7} aria-hidden />
      </button>

      <p className="text-center text-small text-cocoa-55">
        {recording ? 'Recording…' : 'Tap to record'}
      </p>
    </div>
  );
}

// ---------- Menu translator (mock) ----------

const SAMPLE_MENU = [
  { pt: 'Picanha grelhada', he: 'Grilled picanha steak', alert: null },
  { pt: 'Feijoada completa', he: 'Traditional feijoada', alert: 'Contains pork' },
  { pt: 'Açaí na tigela', he: 'Açaí bowl', alert: 'Vegan' },
  { pt: 'Pão de queijo', he: 'Cheese bread', alert: null },
];

function MenuTranslator() {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        Point the camera at a menu. We'll flag non-vegan dishes, pork and
        seafood based on your preferences.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-cocoa-30 bg-sand">
        <Camera className="h-8 w-8 text-cocoa-55" strokeWidth={1.5} aria-hidden />
      </div>

      <span className="meta-caps text-cocoa-55">Last scan</span>
      <ul className="flex flex-col">
        {SAMPLE_MENU.map((dish, i) => (
          <li
            key={dish.pt}
            className={clsx(
              'flex items-start justify-between gap-sm py-sm',
              i > 0 && 'border-t border-cocoa-15',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body text-cocoa">{dish.he}</span>
              <span className="text-small text-cocoa-55 ltr">{dish.pt}</span>
            </div>
            {dish.alert && (
              <span
                className={clsx(
                  'shrink-0 rounded-full px-2 py-1 meta-caps',
                  dish.alert === 'Vegan'
                    ? 'bg-copper-70 text-ivory'
                    : 'bg-cocoa text-ivory',
                )}
              >
                {dish.alert}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Sign scanner (mock) ----------

function SignScanner() {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        Translates signs, info boards and flyers in real time. Point, snap,
        get the translation overlaid on the text.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-cocoa-30 bg-sand">
        <Camera className="h-8 w-8 text-cocoa-55" strokeWidth={1.5} aria-hidden />
      </div>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-cocoa-55">Last example</span>
        <p className="mt-xs font-serif text-lede italic text-cocoa ltr">
          Cuidado: piso molhado
        </p>
        <p className="mt-xs text-body text-cocoa-70">Caution: wet floor</p>
      </div>
    </div>
  );
}

// ---------- Friend balances (mock, uses real friend rows) ----------

type Expense = {
  id: string;
  friendId: string;
  amount: number;
  note: string;
};

function FriendBalances() {
  const { data } = useSupabaseData();
  const friends = useMemo(
    () => (data ? data.friendOverlaps.slice(0, 4) : []),
    [data],
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const baseAmounts = [128, -45, 220, -12];

  const balances = useMemo(() => {
    if (!data) return [];
    return friends.map((f, i) => {
      const extra = expenses
        .filter((e) => e.friendId === f.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        friend: f,
        amount: (baseAmounts[i] ?? 0) + extra,
        currency: 'BRL',
      };
    });
  }, [data, friends, expenses]);

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        Open tab between friends. Live balances — who paid, who owes, who's
        even.
      </p>

      <ul className="flex flex-col">
        {balances.map((b, i) => {
          const owesYou = b.amount > 0;
          return (
            <li
              key={b.friend.id}
              className={clsx(
                'flex items-center justify-between gap-sm py-sm',
                i > 0 && 'border-t border-cocoa-15',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-serif text-lede italic text-cocoa">
                  {b.friend.friendName}
                </span>
                <span className="text-small text-cocoa-55">
                  {owesYou ? 'Owes you' : 'You owe'}
                </span>
              </div>
              <span
                className={clsx(
                  'tnum text-lede font-medium',
                  owesYou ? 'text-copper' : 'text-cocoa-70',
                )}
              >
                {owesYou ? '+' : ''}
                {b.amount} {b.currency}
              </span>
            </li>
          );
        })}
      </ul>

      {expenses.length > 0 && (
        <div className="rounded-2xl bg-sand p-md">
          <span className="meta-caps text-copper">Recent</span>
          <ul className="mt-2 flex flex-col gap-1">
            {expenses.slice(-3).reverse().map((e) => {
              const f = friends.find((x) => x.id === e.friendId);
              return (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-sm text-small text-cocoa-70"
                >
                  <span className="truncate">
                    {e.note} · {f?.friendName ?? 'Friend'}
                  </span>
                  <span className="tnum shrink-0 text-cocoa">
                    {e.amount > 0 ? '+' : ''}
                    {e.amount} BRL
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={() => setAddOpen(true)}
      >
        <Wallet className="h-4 w-4" aria-hidden />
        Add shared expense
      </Button>

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        friends={friends}
        onSubmit={(expense) => {
          setExpenses((prev) => [...prev, expense]);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

function AddExpenseModal({
  open,
  onClose,
  friends,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  friends: { id: string; friendName: string }[];
  onSubmit: (expense: Expense) => void;
}) {
  const [friendId, setFriendId] = useState(friends[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [direction, setDirection] = useState<'owesYou' | 'youOwe'>('owesYou');

  const handleSubmit = () => {
    const numeric = Number.parseFloat(amount.replace(/,/g, ''));
    if (!Number.isFinite(numeric) || numeric <= 0 || !friendId) return;
    const signed = direction === 'owesYou' ? numeric : -numeric;
    onSubmit({
      id: `exp-${Date.now()}`,
      friendId,
      amount: Math.round(signed),
      note: note.trim() || 'Shared expense',
    });
    setAmount('');
    setNote('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="New expense"
      title="Add shared expense"
      level={1}
      footer={
        <Button variant="accent" fullWidth onClick={handleSubmit}>
          Add to tab
        </Button>
      }
    >
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">With</label>
          <select
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-cocoa-15 bg-sand px-md text-body text-cocoa focus:border-copper focus:outline-none"
          >
            {friends.map((f) => (
              <option key={f.id} value={f.id}>
                {f.friendName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Amount (BRL)</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="h-12 w-full rounded-full border border-cocoa-15 bg-sand px-md text-lede tnum text-cocoa focus:border-copper focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Direction</label>
          <div className="inline-flex self-start rounded-full bg-cocoa-08 p-1">
            {(['owesYou', 'youOwe'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={clsx(
                  'rounded-full px-md py-1.5 text-small font-medium leading-none',
                  'transition-colors duration-instant ease-out-quart',
                  direction === d
                    ? 'bg-cocoa text-ivory'
                    : 'text-cocoa-70 hover:text-cocoa',
                )}
              >
                {d === 'owesYou' ? 'They owe you' : 'You owe them'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Dinner at Aprazível"
            className="h-12 w-full rounded-full border border-cocoa-15 bg-sand px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}

// ---------- eSIM (Airalo hand-off, pre-filled from the trip) ----------

/**
 * Pulls the user's planned trip (region + duration) and hands them off to
 * Airalo's matching regional eSIM page. No prices, no plan list — Airalo
 * owns that surface. We pre-fill the region and a day-count so the user
 * lands one tap away from buying the right plan.
 *
 * v0.3 demo data only spans South America, so the region inference is a
 * static map of every seeded destination_id → continent slug. Extend the
 * table when adding new destinations.
 */
const COUNTRY_BY_DESTINATION_ID: Record<string, string> = {
  buzios: 'Brazil',
  'sao-paulo': 'Brazil',
  jericoacoara: 'Brazil',
  'rio-de-janeiro': 'Brazil',
  'buenos-aires': 'Argentina',
  'punta-del-este': 'Uruguay',
};

type EsimRegion = {
  /** Display label for the summary card. */
  label: string;
  /** Airalo regional / global deep-link target. */
  url: string;
};

const REGIONS: Record<string, EsimRegion> = {
  'south-america': {
    label: 'South America',
    url: 'https://www.airalo.com/south-america-esim',
  },
  global: {
    label: 'Global',
    url: 'https://www.airalo.com/global-esims',
  },
};

function EsimPlans() {
  const { data } = useSupabaseData();
  const stops = data?.plannedStops ?? [];

  const trip = useMemo(() => {
    if (stops.length === 0) return null;
    const countries = new Set<string>();
    for (const s of stops) {
      const country = COUNTRY_BY_DESTINATION_ID[s.id];
      if (country) countries.add(country);
    }
    const first = stops[0];
    const last = stops[stops.length - 1];
    const arr = new Date(first.arrivalDate + 'T00:00:00Z');
    const dep = new Date(last.departureDate + 'T00:00:00Z');
    const days = Math.max(
      1,
      Math.round((dep.getTime() - arr.getTime()) / 86_400_000),
    );
    const allSouthAmerica = [...countries].every((c) =>
      ['Brazil', 'Argentina', 'Uruguay', 'Chile', 'Peru', 'Colombia'].includes(c),
    );
    const region = allSouthAmerica ? REGIONS['south-america'] : REGIONS.global;
    return { countries: [...countries], region, days };
  }, [stops]);

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        eSIM in 30 seconds — no SIM swap, no roaming fees. Pulls your trip
        region and duration so Airalo lands you on the matching plan page.
      </p>

      {trip ? (
        <div className="rounded-2xl bg-sand shadow-card p-md">
          <span className="meta-caps text-copper">Your trip</span>
          <p className="mt-xs font-serif text-lede italic leading-tight text-cocoa">
            {trip.region.label}
          </p>
          <p className="mt-xs text-small text-cocoa-70">
            <span className="tnum">{trip.days}</span> days ·{' '}
            <span className="tnum">{stops.length}</span> stops
            {trip.countries.length > 0 && (
              <>
                {' · '}
                {trip.countries.join(' · ')}
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-sand shadow-card p-md text-small leading-snug text-cocoa-70">
          Add a stop to your trip first — we'll pre-fill the region and
          duration so Airalo opens on the right plan.
        </div>
      )}

      {trip && (
        <a
          href={`${trip.region.url}?days=${trip.days}`}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'inline-flex w-full items-center justify-center gap-2 rounded-full bg-copper px-md py-3 text-body font-medium text-ivory shadow-card',
            'transition-[transform,background-color] duration-instant ease-out-quart',
            'hover:bg-copper-85 active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
          )}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          Open in Airalo
        </a>
      )}

      <p className="text-small leading-snug text-cocoa-55">
        Pre-fills the {trip ? trip.region.label : 'matching'} region and{' '}
        {trip ? `${trip.days}-day` : 'your trip'} window. Confirm the plan in
        Airalo, pay, install in one tap.
      </p>
    </div>
  );
}

