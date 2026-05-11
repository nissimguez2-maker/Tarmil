import { useEffect } from 'react';
import clsx from 'clsx';
import {
  X,
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

type Tool = {
  name: string;
  meta: string;
  Icon: LucideIcon;
};

const TOOLS: Tool[] = [
  { name: 'ממיר מטבעות', meta: 'עובד גם בלי רשת', Icon: Coins },
  { name: 'צ׳ק ליסט לפני יציאה', meta: 'ויזה, חיסונים, ביטוח', Icon: ListChecks },
  { name: 'מתרגם קולי', meta: 'דיבור-לדיבור, תרגום מיידי', Icon: Languages },
  { name: 'מתרגם תפריט', meta: 'סורק, מתרגם, מסמן רכיבים', Icon: ScanText },
  { name: 'סורק שלטים', meta: 'מתרגם שילוט ושלטים', Icon: ScanLine },
  { name: 'יתרות בין חברים', meta: 'חוב פתוח בין שני חברים', Icon: Wallet },
  { name: 'eSIM וגלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
  { name: 'כלים יהודיים', meta: 'חב״ד, כשרות, שבת', Icon: Star },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Slide-down tools panel anchored to the top-trailing corner.
 *
 * Triggered by the wrench icon in <TopBar>. Lives inside <DeviceFrame> so the
 * iPhone shell on desktop bounds it.
 *
 * Closed: translated above the screen via -translate-y-full. Open:
 * translate-y-0. Backdrop swallows clicks behind the panel and closes on tap
 * or Escape.
 *
 * 8 tools in a 2-column grid. Each card is an 80px-square ivory tile inside
 * the sand panel body.
 */
export function ToolsPanel({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
          'absolute inset-x-0 top-0 z-40 flex flex-col bg-sand',
          'rounded-b-md shadow-device transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : '-translate-y-full',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <header className="relative flex h-[14mm] shrink-0 items-center justify-center border-b border-cocoa-15 px-md">
          <button
            type="button"
            aria-label="סגירה"
            onClick={onClose}
            className="absolute end-md inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-col items-center">
            <span className="meta-caps text-copper">Tarmil</span>
            <h2 className="font-serif text-lede leading-none">כלים</h2>
          </div>
        </header>

        <div className="flex flex-col gap-md p-md">
          <p className="text-[10pt] text-cocoa-70">
            כלים יומיומיים לטיול בחו״ל. כל כלי עומד לבד — נפתח, בשימוש, נסגר.
          </p>

          <ul className="grid grid-cols-2 gap-sm">
            {TOOLS.map(({ name, meta, Icon }) => (
              <li key={name}>
                <button
                  type="button"
                  className="flex h-full w-full flex-col items-center gap-1 rounded-md bg-ivory p-md text-center transition-colors hover:bg-ivory/80 active:bg-cocoa-8"
                  onClick={() => {
                    // Each tool is a stub for now — taps acknowledge via close.
                    onClose();
                  }}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="font-serif text-[12pt] italic leading-tight text-cocoa">
                    {name}
                  </span>
                  <span className="text-[9pt] leading-tight text-cocoa-55">
                    {meta}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
