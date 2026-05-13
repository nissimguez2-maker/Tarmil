import { useState } from 'react';
import {
  Coins,
  ListChecks,
  Languages,
  ScanText,
  ScanLine,
  Wallet,
  Smartphone,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import {
  ToolDetailSheet,
  type ToolId,
} from '../../components/profile/ToolDetailSheet';

type Tool = {
  id: ToolId;
  name: string;
  meta: string;
  Icon: LucideIcon;
};

const TOOLS: Tool[] = [
  { id: 'currency', name: 'ממיר מטבעות', meta: 'עובד גם בלי רשת', Icon: Coins },
  { id: 'checklist', name: 'צ׳ק ליסט לפני יציאה', meta: 'ויזה, חיסונים, ביטוח', Icon: ListChecks },
  { id: 'voice', name: 'מתרגם קולי', meta: 'דיבור-לדיבור, מיידי', Icon: Languages },
  { id: 'menu', name: 'מתרגם תפריט', meta: 'סורק רכיבים והעדפות', Icon: ScanText },
  { id: 'signs', name: 'סורק שלטים', meta: 'מתרגם שילוט בזמן אמת', Icon: ScanLine },
  { id: 'balances', name: 'יתרות בין חברים', meta: 'חוב פתוח בין שני חברים', Icon: Wallet },
  { id: 'esim', name: 'eSIM וגלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
  { id: 'jewish', name: 'כלים יהודיים', meta: 'חב״ד, כשרות, שבת', Icon: Star },
];

/**
 * Tools tab — promoted out of the Profile screen so it has top-level access
 * from the tab bar. Each card opens the same `ToolDetailSheet` that the
 * Profile section used in the previous PR, so the underlying mock interfaces
 * (currency converter, checklist, balances, etc.) are shared.
 */
export function ToolsScreen() {
  const [openTool, setOpenTool] = useState<ToolId | null>(null);

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="כלים" />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Tools for the road." />
          <p className="max-w-body text-small leading-snug text-cocoa-70">
            כלים יומיומיים לטיול בחו״ל. כל כלי עומד לבד — נפתח, בשימוש, נסגר.
            הכל עובד גם בלי רשת.
          </p>
        </section>

        <ul className="grid grid-cols-2 gap-sm">
          {TOOLS.map(({ id, name, meta, Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setOpenTool(id)}
                className="flex h-full w-full flex-col items-start gap-xs rounded-2xl border border-cocoa-15 bg-ivory shadow-card p-md text-start transition-colors duration-instant ease-out-quart active:bg-cocoa-08"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="font-serif text-body italic leading-tight text-cocoa">
                  {name}
                </span>
                <span className="text-small leading-tight text-cocoa-55">
                  {meta}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ToolDetailSheet
        toolId={openTool}
        onClose={() => setOpenTool(null)}
      />
    </Screen>
  );
}
