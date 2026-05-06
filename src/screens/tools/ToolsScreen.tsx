import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import {
  Coins,
  ListChecks,
  Languages,
  ScanText,
  Wallet,
  Smartphone,
  ChevronLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Tool = {
  name: string;
  meta: string;
  Icon: LucideIcon;
  /** When set, the row navigates to this route. Otherwise it renders dimmed with "בקרוב". */
  to?: string;
};

const TOOLS: Tool[] = [
  {
    name: 'ממיר מטבעות',
    meta: 'עובד גם בלי רשת',
    Icon: Coins,
    to: '/tools/currency',
  },
  {
    name: 'צ׳ק ליסט לפני יציאה',
    meta: 'ויזה, חיסונים, ביטוח',
    Icon: ListChecks,
    to: '/tools/checklist',
  },
  {
    name: 'יתרות בין חברים',
    meta: 'מחשב חוב פתוח, מטבעות מעורבים',
    Icon: Wallet,
    to: '/tools/balance',
  },
  { name: 'מתרגם קולי', meta: 'דיבור-לדיבור, תרגום מיידי', Icon: Languages },
  {
    name: 'מתרגם תפריט ושלטים',
    meta: 'סורק, מתרגם, מסמן רכיבים',
    Icon: ScanText,
  },
  { name: 'eSIM וחבילות גלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
];

export function ToolsScreen() {
  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="כלים" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Tools at launch." />

        <p className="max-w-body text-body text-cocoa-70">
          כלים יומיומיים לטיול בחו״ל. כל כלי עומד לבד — נפתח, בשימוש, נסגר.
        </p>

        <ul className="flex flex-col gap-sm">
          {TOOLS.map((tool) =>
            tool.to ? (
              <li key={tool.name}>
                <Link
                  to={tool.to}
                  className="flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md active:bg-cocoa-08"
                >
                  <ToolBody {...tool} />
                  <ChevronLeft
                    className="h-4 w-4 shrink-0 text-cocoa-55"
                    aria-hidden
                  />
                </Link>
              </li>
            ) : (
              <li
                key={tool.name}
                className={clsx(
                  'flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md',
                  'opacity-60',
                )}
              >
                <ToolBody {...tool} comingSoon />
              </li>
            ),
          )}
        </ul>
      </div>
    </Screen>
  );
}

function ToolBody({
  name,
  meta,
  Icon,
  comingSoon,
}: Tool & { comingSoon?: boolean }) {
  return (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa text-ivory">
        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="flex items-center gap-2">
          <span className="font-serif text-lede leading-tight">{name}</span>
          {comingSoon && <span className="meta-caps text-cocoa-70">בקרוב</span>}
        </span>
        <span className="text-small text-cocoa-55">{meta}</span>
      </span>
    </>
  );
}
