import { useState, useMemo } from 'react';
import { Check, Globe, Mic, Camera, Wallet, Smartphone, Star } from 'lucide-react';
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
  | 'esim'
  | 'jewish';

type Props = {
  toolId: ToolId | null;
  onClose: () => void;
};

const TITLES: Record<ToolId, { title: string; eyebrow: string }> = {
  currency: { title: 'ממיר מטבעות', eyebrow: 'כלי' },
  checklist: { title: 'צ׳ק ליסט לפני יציאה', eyebrow: 'כלי' },
  voice: { title: 'מתרגם קולי', eyebrow: 'כלי' },
  menu: { title: 'מתרגם תפריט', eyebrow: 'כלי' },
  signs: { title: 'סורק שלטים', eyebrow: 'כלי' },
  balances: { title: 'יתרות בין חברים', eyebrow: 'כלי' },
  esim: { title: 'eSIM וגלישה', eyebrow: 'כלי' },
  jewish: { title: 'כלים יהודיים', eyebrow: 'כלי' },
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
    >
      {toolId === 'currency' && <CurrencyConverter />}
      {toolId === 'checklist' && <PreTripChecklist />}
      {toolId === 'voice' && <VoiceTranslator />}
      {toolId === 'menu' && <MenuTranslator />}
      {toolId === 'signs' && <SignScanner />}
      {toolId === 'balances' && <FriendBalances />}
      {toolId === 'esim' && <EsimPlans />}
      {toolId === 'jewish' && <JewishTools />}
    </Modal>
  );
}

// ---------- Currency converter (interactive) ----------

type Currency = 'ILS' | 'USD' | 'EUR' | 'BRL' | 'ARS' | 'THB';

const CURRENCY_LABEL: Record<Currency, string> = {
  ILS: 'שקל · ₪',
  USD: 'דולר · $',
  EUR: 'יורו · €',
  BRL: 'ריאל · R$',
  ARS: 'פסו ארגנטינאי · $',
  THB: 'באט · ฿',
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
      <p className="text-small text-cocoa-70">
        שערים מקוונים. הערכים מתעדכנים אחת ליום ושומרים על השער האחרון גם בלי
        רשת.
      </p>

      <div className="flex flex-col gap-xs">
        <label className="meta-caps text-cocoa-55">סכום</label>
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
          <label className="meta-caps text-cocoa-55">ממטבע</label>
          <CurrencySelect value={from} onChange={setFrom} />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">למטבע</label>
          <CurrencySelect value={to} onChange={setTo} />
        </div>
      </div>

      <div className="rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
        <span className="meta-caps text-copper">תוצאה</span>
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

// ---------- Pre-trip checklist (interactive) ----------

const CHECKLIST_ITEMS = [
  { id: 'visa', label: 'ויזה לכל יעד במסלול' },
  { id: 'vaccines', label: 'חיסונים — קדחת צהובה, צהבת A' },
  { id: 'insurance', label: 'ביטוח נסיעות עם כיסוי ספורט אתגרי' },
  { id: 'passport', label: 'דרכון בתוקף לפחות שישה חודשים' },
  { id: 'cards', label: 'כרטיסי אשראי + מטבע מקומי במזומן' },
  { id: 'esim', label: 'הזמנת eSIM מקומי' },
  { id: 'documents', label: 'סריקת מסמכים לענן' },
  { id: 'pharmacy', label: 'ערכת רוקח בסיסית' },
];

function PreTripChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-baseline justify-between">
        <p className="text-small text-cocoa-70">
          לפני שיוצאים — לעבור על הכל. ידאג שתישאר רגוע ביציאה.
        </p>
        <span className="text-small text-cocoa-55 tnum">
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
                    'text-body',
                    isChecked
                      ? 'text-cocoa-55 line-through'
                      : 'text-cocoa',
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
      <p className="text-small text-cocoa-70">
        דבר בעברית, נתרגם לפורטוגזית, ספרדית, אנגלית, תאית או צרפתית. עובד
        מקוון; אם אין רשת, יחזור על התרגום האחרון.
      </p>

      <div className="rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
        <span className="meta-caps text-cocoa-55">דוגמה אחרונה</span>
        <p className="mt-xs font-serif text-lede italic text-cocoa">
          איפה אפשר להזמין מונית?
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
        aria-label={recording ? 'עצור הקלטה' : 'התחל הקלטה'}
      >
        <Mic className="h-7 w-7" strokeWidth={1.7} aria-hidden />
      </button>

      <p className="text-center text-small text-cocoa-55">
        {recording ? 'מקליט…' : 'הקש להקלטה'}
      </p>
    </div>
  );
}

// ---------- Menu translator (mock) ----------

const SAMPLE_MENU = [
  { pt: 'Picanha grelhada', he: 'פיקניה צלויה', alert: null },
  { pt: 'Feijoada completa', he: 'פייז׳ואדה מסורתית', alert: 'מכיל חזיר' },
  { pt: 'Açaí na tigela', he: 'אסאי בקערה', alert: 'טבעוני' },
  { pt: 'Pão de queijo', he: 'לחמניות גבינה', alert: null },
];

function MenuTranslator() {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        כיוון את המצלמה על תפריט. אנחנו נסמן מנות לא־טבעוניות, חזיר, ופירות
        ים, לפי ההעדפות שלך.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-cocoa-30 bg-sand">
        <Camera className="h-8 w-8 text-cocoa-55" strokeWidth={1.5} aria-hidden />
      </div>

      <span className="meta-caps text-cocoa-55">סריקה אחרונה</span>
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
                  dish.alert === 'טבעוני'
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
        מתרגם שלטים, תפסי מידע ופלקטים בזמן אמת. כיוון, צלם, קבל את התרגום
        ישר מעל הטקסט.
      </p>

      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-cocoa-30 bg-sand">
        <Camera className="h-8 w-8 text-cocoa-55" strokeWidth={1.5} aria-hidden />
      </div>

      <div className="rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
        <span className="meta-caps text-cocoa-55">דוגמה אחרונה</span>
        <p className="mt-xs font-serif text-lede italic text-cocoa ltr">
          Cuidado: piso molhado
        </p>
        <p className="mt-xs text-body text-cocoa-70">זהירות: רצפה רטובה</p>
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
      <p className="text-small text-cocoa-70">
        מעקב פתוח בין שני חברים. הסכומים מתעדכנים בזמן אמת — מי משלם, מי
        חייב, מי שווה.
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
                  {owesYou ? 'חייב לך' : 'אתה חייב'}
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

      <Button variant="ghost" size="sm" fullWidth>
        <Wallet className="h-4 w-4" aria-hidden />
        הוסף הוצאה משותפת
      </Button>
    </div>
  );
}

// ---------- eSIM (mock plans) ----------

const ESIM_PLANS = [
  { region: 'דרום אמריקה', days: 30, gb: 10, price: 89, popular: true },
  { region: 'אירופה', days: 14, gb: 5, price: 49, popular: false },
  { region: 'דרום־מזרח אסיה', days: 21, gb: 8, price: 65, popular: false },
  { region: 'גלובלי', days: 30, gb: 15, price: 149, popular: false },
];

function EsimPlans() {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-small text-cocoa-70">
        eSIM מותקן ב־30 שניות. עובד עם כל יצרני המכשירים החל מ־iPhone XS
        וגלקסי S20.
      </p>

      <ul className="flex flex-col gap-sm">
        {ESIM_PLANS.map((plan) => (
          <li
            key={plan.region}
            className={clsx(
              'flex items-center justify-between gap-sm rounded-2xl border p-md',
              'transition-colors duration-instant ease-out-quart active:bg-cocoa-08',
              plan.popular
                ? 'border-copper bg-sand'
                : 'border-cocoa-15 bg-ivory',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lede italic text-cocoa">
                  {plan.region}
                </span>
                {plan.popular && (
                  <span className="meta-caps text-copper">פופולרי</span>
                )}
              </div>
              <span className="text-small text-cocoa-70">
                <span className="tnum">{plan.gb}</span>GB ·{' '}
                <span className="tnum">{plan.days}</span> ימים
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <span className="font-serif text-sub leading-none text-cocoa tnum">
                ₪{plan.price}
              </span>
              <button
                type="button"
                className="meta-caps text-copper transition-colors duration-instant ease-out-quart active:text-copper-70"
              >
                הזמן
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Jewish tools (mock) ----------

const CHABAD_HOUSES = [
  { name: 'חב״ד ריו דה ז׳נרו', dist: '1.2 ק״מ', address: 'Botafogo' },
  { name: 'חב״ד סאו פאולו', dist: '442 ק״מ', address: 'Jardins' },
  { name: 'חב״ד פלוריאנופוליס', dist: '1,180 ק״מ', address: 'Centro' },
];

function JewishTools() {
  return (
    <div className="flex flex-col gap-md">
      <div className="rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
        <div className="flex items-baseline justify-between">
          <span className="meta-caps text-copper">שבת קרובה · ריו</span>
          <Globe className="h-4 w-4 text-cocoa-55" aria-hidden />
        </div>
        <p className="mt-xs font-serif text-lede italic text-cocoa">
          כניסת שבת <span className="tnum">17:38</span> · יציאה{' '}
          <span className="tnum">18:34</span>
        </p>
      </div>

      <span className="meta-caps text-cocoa-55">בתי חב״ד בקרבת מקום</span>
      <ul className="flex flex-col">
        {CHABAD_HOUSES.map((h, i) => (
          <li
            key={h.name}
            className={clsx(
              'flex items-center justify-between gap-sm py-sm',
              i > 0 && 'border-t border-cocoa-15',
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body text-cocoa">{h.name}</span>
              <span className="text-small text-cocoa-55">{h.address}</span>
            </div>
            <span className="shrink-0 text-small text-cocoa-55 tnum">
              {h.dist}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-sm rounded-2xl border border-cocoa-15 bg-ivory shadow-card p-md">
        <Star className="h-5 w-5 shrink-0 text-copper" aria-hidden fill="currentColor" strokeWidth={0} />
        <p className="text-small text-cocoa-70">
          סורק כשרות — סרוק מוצר במכולת לבדיקה מהירה. כולל את כשרויות חו״ל
          המקובלות.
        </p>
      </div>

      <Button variant="ghost" size="sm" fullWidth>
        <Smartphone className="h-4 w-4" aria-hidden />
        פתח סורק כשרות
      </Button>
    </div>
  );
}
