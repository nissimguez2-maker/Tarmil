import clsx from 'clsx';
import { Smartphone, Globe2, Wifi, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Plan = {
  id: string;
  region: string;
  Icon: LucideIcon;
  data: string;
  duration: string;
  priceIls: number;
  recommended?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'sa-30',
    region: 'דרום אמריקה',
    Icon: Globe2,
    data: '20GB',
    duration: '30 ימים',
    priceIls: 119,
    recommended: true,
  },
  {
    id: 'sa-7',
    region: 'דרום אמריקה',
    Icon: Wifi,
    data: '5GB',
    duration: '7 ימים',
    priceIls: 49,
  },
  {
    id: 'global-30',
    region: '120 מדינות',
    Icon: Phone,
    data: '15GB',
    duration: '30 ימים',
    priceIls: 159,
  },
  {
    id: 'global-call',
    region: '120 מדינות',
    Icon: Smartphone,
    data: 'ללא הגבלה',
    duration: '14 ימים',
    priceIls: 99,
  },
];

export function EsimToolScreen() {
  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="eSIM וחבילות" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Get online in two minutes." />

        <p className="max-w-body text-body text-cocoa-70">
          תרמיל מצוות עם 7G לחבילות eSIM שמופעלות באייפון בלי לפתוח אריזה.
          בוחרים, מאשרים, יורדים מהמטוס עם רשת.
        </p>

        <ul className="flex flex-col gap-sm">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </ul>

        <p className="text-[10pt] text-cocoa-55">
          התשלום מתבצע בשקלים בכרטיס שמירת הדירוג של 7G. תרמיל לא מחזיק את
          פרטי האשראי שלכם.
        </p>
      </div>
    </Screen>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { Icon } = plan;
  return (
    <article
      className={clsx(
        'flex items-center gap-md rounded-md border bg-sand p-md',
        plan.recommended ? 'border-copper' : 'border-cocoa-15',
      )}
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cocoa text-ivory">
        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-sm">
          <span className="font-serif text-lede leading-tight">
            {plan.region}
          </span>
          {plan.recommended && (
            <span className="meta-caps text-copper">בחירת תרמיל</span>
          )}
        </div>
        <span className="text-[10pt] text-cocoa-70">
          <span className="tnum">{plan.data}</span> · {plan.duration}
        </span>
      </div>
      <span className="font-serif text-lede leading-none">
        <span className="tnum">₪{plan.priceIls}</span>
      </span>
    </article>
  );
}
