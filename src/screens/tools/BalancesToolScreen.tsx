import clsx from 'clsx';
import { Plus, MinusCircle, PlusCircle } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Balance = {
  friendInitial: string;
  friendName: string;
  /** Positive: friend owes you. Negative: you owe friend. ILS. */
  delta: number;
  lastNote: string;
};

const BALANCES: Balance[] = [
  {
    friendInitial: 'מ',
    friendName: 'מאיה לוי',
    delta: 142,
    lastNote: 'אסאי בקופקבנה · 12 במאי',
  },
  {
    friendInitial: 'י',
    friendName: 'יעל אברהם',
    delta: -68,
    lastNote: 'מונית מסנטה תרזה · 9 במאי',
  },
  {
    friendInitial: 'ר',
    friendName: 'רועי בן עמי',
    delta: 0,
    lastNote: 'נסגר בסוף שבוע שעבר',
  },
];

export function BalancesToolScreen() {
  const youAreOwed = BALANCES.filter((b) => b.delta > 0).reduce(
    (s, b) => s + b.delta,
    0,
  );
  const youOwe = BALANCES.filter((b) => b.delta < 0).reduce(
    (s, b) => s + Math.abs(b.delta),
    0,
  );

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="יתרות בין חברים" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Open balances." />

        <p className="max-w-body text-body text-cocoa-70">
          ספירת חוב פשוטה בין שני אנשים. תרמיל לא חוקר על מי האחריות, רק
          מציג את ההפרש האחרון. סוגרים — מאפסים.
        </p>

        <div className="grid grid-cols-2 gap-sm">
          <SummaryCard label="חבים לך" value={youAreOwed} positive />
          <SummaryCard label="אתה חב" value={youOwe} positive={false} />
        </div>

        <ul className="flex flex-col gap-sm">
          {BALANCES.map((b) => (
            <BalanceRow key={b.friendName} balance={b} />
          ))}
        </ul>

        <button
          type="button"
          className="inline-flex h-lg items-center justify-center gap-2 rounded-full bg-cocoa px-md text-[11pt] font-medium text-ivory active:bg-cocoa-70"
        >
          <Plus className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          הוסף הוצאה משותפת
        </button>
      </div>
    </Screen>
  );
}

function SummaryCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-cocoa-15 bg-sand p-md">
      <span className="meta-caps text-copper">{label}</span>
      <span
        className={clsx(
          'font-serif text-sub leading-tight',
          positive ? 'text-cocoa' : 'text-cocoa-70',
        )}
      >
        <span className="tnum">₪{value.toLocaleString('he-IL')}</span>
      </span>
    </div>
  );
}

function BalanceRow({ balance }: { balance: Balance }) {
  const positive = balance.delta > 0;
  const settled = balance.delta === 0;
  return (
    <div
      className={clsx(
        'flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md',
      )}
    >
      <span
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cocoa font-serif text-lede text-ivory"
        aria-hidden
      >
        {balance.friendInitial}
      </span>
      <div className="flex flex-1 flex-col">
        <span className="font-serif text-lede leading-tight">
          {balance.friendName}
        </span>
        <span className="text-[10pt] text-cocoa-55">{balance.lastNote}</span>
      </div>
      <div className="flex flex-col items-end">
        {settled ? (
          <span className="meta-caps text-cocoa-55">סגור</span>
        ) : (
          <span
            className={clsx(
              'inline-flex items-center gap-1 font-serif text-lede leading-none',
              positive ? 'text-cocoa' : 'text-copper',
            )}
          >
            {positive ? (
              <PlusCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <MinusCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
            <span className="tnum">
              ₪{Math.abs(balance.delta).toLocaleString('he-IL')}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
