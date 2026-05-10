import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  X,
  ChevronLeft,
  Coins,
  ListChecks,
  Mic,
  ScanText,
  Languages,
  Wallet,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

type Tool = {
  to: string;
  name: string;
  meta: string;
  Icon: LucideIcon;
};

const TOOLS: Tool[] = [
  { to: '/tools/currency', name: 'ממיר מטבעות', meta: 'עובד גם בלי רשת', Icon: Coins },
  { to: '/tools/checklist', name: 'צ׳ק ליסט לפני יציאה', meta: 'ויזה, חיסונים, ביטוח', Icon: ListChecks },
  { to: '/tools/voice', name: 'מתרגם קולי', meta: 'דיבור-לדיבור, תרגום מיידי', Icon: Mic },
  { to: '/tools/menu', name: 'מתרגם תפריט', meta: 'סורק, מתרגם, מסמן רכיבים', Icon: ScanText },
  { to: '/tools/sign', name: 'מתרגם שלטים', meta: 'איסורים, תחבורה, חירום', Icon: Languages },
  { to: '/tools/balances', name: 'יתרות בין חברים', meta: 'חוב פתוח בין שני חברים', Icon: Wallet },
  { to: '/tools/esim', name: 'eSIM וחבילות גלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Slide-in panel anchored to the end side (physical left in RTL Hebrew).
 * Triggered by the wrench icon in <TopBar>; lives inside <DeviceFrame> so the
 * iPhone shell on desktop bounds it.
 *
 * Closed: translated off-screen via -translate-x-full (off the physical-left
 * edge in RTL). Open: translate-x-0. Backdrop swallows clicks behind the panel
 * and closes on tap or ESC.
 *
 * Each tool row is a launcher — tap closes the panel and navigates to the
 * tool's full screen.
 */
export function ToolsPanel({ open, onClose }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const launch = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <>
      <button
        type="button"
        aria-label="סגירה"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={clsx(
          'absolute inset-0 z-30 cursor-default bg-cocoa-30',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="כלים"
        aria-hidden={!open}
        className={clsx(
          'absolute bottom-0 end-0 top-0 z-40 flex w-[88%] flex-col bg-ivory',
          'shadow-device transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <header className="relative flex h-[14mm] shrink-0 items-center justify-center border-b border-cocoa-15 px-md">
          <button
            type="button"
            aria-label="סגירה"
            onClick={onClose}
            className="absolute start-md inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-col items-center">
            <span className="meta-caps text-copper">Tarmil</span>
            <h2 className="font-serif text-lede leading-none">כלים</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-lg p-md">
            <SectionLabel number="01" label="Tools at launch." />

            <p className="max-w-body text-body text-cocoa-70">
              כלים יומיומיים לטיול בחו״ל. כל כלי עומד לבד — נפתח, בשימוש, נסגר.
            </p>

            <ul className="flex flex-col gap-sm">
              {TOOLS.map(({ to, name, meta, Icon }) => (
                <li key={to}>
                  <button
                    type="button"
                    onClick={() => launch(to)}
                    className={clsx(
                      'flex w-full items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md text-start',
                      'active:bg-cocoa-08',
                    )}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="font-serif text-lede leading-tight">
                        {name}
                      </span>
                      <span className="text-[10pt] text-cocoa-55">{meta}</span>
                    </span>
                    <ChevronLeft className="h-5 w-5 text-cocoa-55" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
