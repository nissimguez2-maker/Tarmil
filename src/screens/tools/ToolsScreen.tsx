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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tool = {
  name: string;
  meta: string;
  Icon: LucideIcon;
};

const TOOLS: Tool[] = [
  { name: 'ממיר מטבעות', meta: 'עובד גם בלי רשת', Icon: Coins },
  { name: 'צ׳ק ליסט לפני יציאה', meta: 'ויזה, חיסונים, ביטוח', Icon: ListChecks },
  { name: 'מתרגם קולי', meta: 'דיבור-לדיבור, תרגום מיידי', Icon: Languages },
  { name: 'מתרגם תפריט ושלטים', meta: 'סורק, מתרגם, מסמן רכיבים', Icon: ScanText },
  { name: 'יתרות בין חברים', meta: 'חוב פתוח בין שני חברים', Icon: Wallet },
  { name: 'eSIM וחבילות גלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
];

/**
 * Placeholder for the Tools tab.
 *
 * Final design (later PR): each tool taps into its own sub-screen.
 * Currency converter is the natural first one to build out.
 */
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
          {TOOLS.map(({ name, meta, Icon }) => (
            <li
              key={name}
              className="flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="flex flex-col">
                <span className="font-serif text-lede leading-tight">{name}</span>
                <span className="text-[10pt] text-cocoa-55">{meta}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
