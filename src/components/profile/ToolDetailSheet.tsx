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

// ---------- Currency converter (interactive) ----------

type Currency = 'ILS' | 'USD' | 'EUR' | 'BRL' | 'ARS' | 'THB';

const CURRENCY_LABEL: Record<Currency, string> = {
  ILS: 'Shekel · ₪',
  USD: 'Dollar · $',
  EUR: 'Euro · €',
  BRL: 'Real · R$',
  ARS: 'Argentine peso · $',
  THB: 'Baht · ฿',
};

// Approximate May 2026 rates (relative to ILS). Mock — not live.
const TO_ILS: Record<Currency, number> = {
  ILS: 1,
  USD: 3.65,
  EUR: 3.95,
  BRL: 0.72,
  ARS: 0.0036,
  THB: 0.105,
};

function CurrencyConverter() {
  const [from, setFrom] = useState<Currency>('ILS');
  const [to, setTo] = useState<Currency>('BRL');
  const [amount, setAmount] = useState('100');

  const numeric = Number.parseFloat(amount.replace(/,/g, '')) || 0;
  const inIls = numeric * TO_ILS[from];
  const result = inIls / TO_ILS[to];

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-charcoal-70">
        Live rates. Values update once a day and keep the last rate even when
        offline.
      </p>

      <div className="flex flex-col gap-xs">
        <label className="meta-caps text-charcoal-55">Amount</label>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-12 w-full rounded-full border border-charcoal-15 bg-sand px-md text-lede tnum text-charcoal transition-colors duration-instant ease-out-quart focus:border-amber focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-charcoal-55">From</label>
          <CurrencySelect value={from} onChange={setFrom} />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-charcoal-55">To</label>
          <CurrencySelect value={to} onChange={setTo} />
        </div>
      </div>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-amber">Result</span>
        <p className="mt-xs font-serif text-display leading-none text-charcoal">
          <span className="tnum">{formatNumber(result)}</span>
        </p>
        <p className="mt-xs text-small text-charcoal-70">
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
      className="h-12 w-full appearance-none rounded-full border border-charcoal-15 bg-sand px-md text-body text-charcoal transition-colors duration-instant ease-out-quart focus:border-amber focus:outline-none"
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

// ---------- Pre-trip checklist (interactive) ----------

const CHECKLIST_ITEMS = [
  { id: 'visa', label: 'Visa for every stop on the route' },
  { id: 'vaccines', label: 'Vaccines — yellow fever, hep A' },
  { id: 'insurance', label: 'Travel insurance with extreme-sports cover' },
  { id: 'passport', label: 'Passport valid at least six months' },
  { id: 'cards', label: 'Credit cards + local cash' },
  { id: 'esim', label: 'Local eSIM booked' },
  { id: 'documents', label: 'Scan documents to the cloud' },
  { id: 'pharmacy', label: 'Basic pharmacy kit' },
];

function PreTripChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-baseline justify-between">
        <p className="text-small text-charcoal-70">
          Run through everything before you leave. Keeps your head clear on the way out.
        </p>
        <span className="text-small text-charcoal-55 tnum">
          {done}/{CHECKLIST_ITEMS.length}
        </span>
      </div>

      <ul className="flex flex-col">
        {CHECKLIST_ITEMS.map((item, i) => {
          const isChecked = !!checked[item.id];
          return (
            <li
              key={item.id}
              className={clsx(
                i > 0 && 'border-t border-charcoal-15',
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-sm py-sm text-start transition-colors duration-instant ease-out-quart active:bg-charcoal-08"
              >
                <span
                  className={clsx(
                    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                    'transition-colors duration-instant ease-out-quart',
                    isChecked
                      ? 'border-amber bg-amber text-cream'
                      : 'border-charcoal-30 bg-cream text-transparent',
                  )}
                  aria-hidden
                >
                  <Check className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <span
                  className={clsx(
                    'text-body',
                    isChecked
                      ? 'text-charcoal-55 line-through'
                      : 'text-charcoal',
                  )}
                >
                  {item.label}
                </span>
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
      <p className="text-small text-charcoal-70">
        Speak English, we'll translate to Portuguese, Spanish, Hebrew, Thai or
        French. Works online; offline it falls back to the last translation.
      </p>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-charcoal-55">Last example</span>
        <p className="mt-xs font-serif text-lede italic text-charcoal">
          Where can I get a taxi?
        </p>
        <p className="mt-xs text-body text-charcoal-70 ltr">
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
          recording ? 'bg-amber text-cream animate-pulse' : 'bg-charcoal text-cream',
        )}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
      >
        <Mic className="h-7 w-7" strokeWidth={1.7} aria-hidden />
      </button>

      <p className="text-center text-small text-charcoal-55">
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
      <p className="text-small text-charcoal-70">
        Point the camera at a menu. We'll flag non-vegan dishes, pork and
        seafood based on your preferences.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-charcoal-30 bg-sand">
        <Camera className="h-8 w-8 text-charcoal-55" strokeWidth={1.5} aria-hidden />
      </div>

      <span className="meta-caps text-charcoal-55">Last scan</span>
      <ul className="flex flex-col">
        {SAMPLE_MENU.map((dish, i) => (
          <li
            key={dish.pt}
            className={clsx(
              'flex items-start justify-between gap-sm py-sm',
              i > 0 && 'border-t border-charcoal-15',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body text-charcoal">{dish.he}</span>
              <span className="text-small text-charcoal-55 ltr">{dish.pt}</span>
            </div>
            {dish.alert && (
              <span
                className={clsx(
                  'shrink-0 rounded-full px-2 py-1 meta-caps',
                  dish.alert === 'Vegan'
                    ? 'bg-amber-70 text-cream'
                    : 'bg-charcoal text-cream',
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
      <p className="text-small text-charcoal-70">
        Translates signs, info boards and flyers in real time. Point, snap,
        get the translation overlaid on the text.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-charcoal-30 bg-sand">
        <Camera className="h-8 w-8 text-charcoal-55" strokeWidth={1.5} aria-hidden />
      </div>

      <div className="rounded-2xl bg-sand shadow-card p-md">
        <span className="meta-caps text-charcoal-55">Last example</span>
        <p className="mt-xs font-serif text-lede italic text-charcoal ltr">
          Cuidado: piso molhado
        </p>
        <p className="mt-xs text-body text-charcoal-70">Caution: wet floor</p>
      </div>
    </div>
  );
}

// ---------- Friend balances (mock, uses real friend rows) ----------

function FriendBalances() {
  const { data } = useSupabaseData();
  const friends = useMemo(
    () => (data ? data.friendOverlaps.slice(0, 4) : []),
    [data],
  );

  const balances = useMemo(() => {
    if (!data) return [];
    return friends.map((f, i) => ({
      friend: f,
      amount: [128, -45, 220, -12][i] ?? 0,
      currency: 'BRL',
    }));
  }, [data, friends]);

  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-charcoal-70">
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
                i > 0 && 'border-t border-charcoal-15',
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-serif text-lede italic text-charcoal">
                  {b.friend.friendName}
                </span>
                <span className="text-small text-charcoal-55">
                  {owesYou ? 'Owes you' : 'You owe'}
                </span>
              </div>
              <span
                className={clsx(
                  'tnum text-lede font-medium',
                  owesYou ? 'text-amber' : 'text-charcoal-70',
                )}
              >
                {owesYou ? '+' : ''}
                {b.amount} {b.currency}
              </span>
            </li>
          );
        })}
      </ul>

      <Button variant="ghost" size="sm" fullWidth>
        <Wallet className="h-4 w-4" aria-hidden />
        Add shared expense
      </Button>
    </div>
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
      <p className="text-small text-charcoal-70">
        eSIM in 30 seconds — no SIM swap, no roaming fees. Pulls your trip
        region and duration so Airalo lands you on the matching plan page.
      </p>

      {trip ? (
        <div className="rounded-2xl bg-sand shadow-card p-md">
          <span className="meta-caps text-amber">Your trip</span>
          <p className="mt-xs font-serif text-lede italic leading-tight text-charcoal">
            {trip.region.label}
          </p>
          <p className="mt-xs text-small text-charcoal-70">
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
        <div className="rounded-2xl bg-sand shadow-card p-md text-small leading-snug text-charcoal-70">
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
            'inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-md py-3 text-body font-medium text-cream shadow-card',
            'transition-[transform,background-color] duration-instant ease-out-quart',
            'hover:bg-charcoal-70 active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
          )}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          Open in Airalo
        </a>
      )}

      <p className="text-small leading-snug text-charcoal-55">
        Pre-fills the {trip ? trip.region.label : 'matching'} region and{' '}
        {trip ? `${trip.days}-day` : 'your trip'} window. Confirm the plan in
        Airalo, pay, install in one tap.
      </p>
    </div>
  );
}

