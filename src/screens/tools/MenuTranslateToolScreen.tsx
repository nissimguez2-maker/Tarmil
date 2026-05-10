import { useState } from 'react';
import clsx from 'clsx';
import { Camera, ScanText } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

const MENU_ITEMS = [
  { src: 'Picanha à brasileira', dst: 'פיקניה בסגנון ברזילאי', meta: 'בקר' },
  { src: 'Feijoada completa', dst: 'תבשיל פולים שחורים מסורתי', meta: 'מכיל בשר חזיר' },
  { src: 'Acarajé baiano', dst: 'כדורי שעועית מטוגנים בתוספות', meta: 'צמחוני' },
  { src: 'Pão de queijo', dst: 'לחמניית גבינה אפויה', meta: 'מכיל גלוטן וחלב' },
];

export function MenuTranslateToolScreen() {
  const [scanned, setScanned] = useState(false);

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="מתרגם תפריט" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Scan to read." />

        <p className="max-w-body text-body text-cocoa-70">
          מצלמים תפריט — תרמיל מסמן רכיבים, מתריע על אלרגנים ומציג מחיר בשקלים.
          כל זה במצב מטוסים, בלי לשלוח את התמונה לענן.
        </p>

        <CameraFrame scanned={scanned} onScan={() => setScanned((s) => !s)} />

        {scanned && (
          <>
            <SectionLabel number="02" label="Translation overlay." />
            <ul className="flex flex-col gap-sm">
              {MENU_ITEMS.map((m, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-1 rounded-sm border border-cocoa-15 bg-sand p-md"
                >
                  <span className="ltr text-[10pt] text-cocoa-55">{m.src}</span>
                  <span className="font-serif text-lede leading-tight">
                    {m.dst}
                  </span>
                  <span className="meta-caps text-copper">{m.meta}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="text-[10pt] text-cocoa-55">
          זיהוי OCR מקומי. תרמיל לעולם לא שולח את הצילום שלכם לענן או לצד
          שלישי.
        </p>
      </div>
    </Screen>
  );
}

function CameraFrame({
  scanned,
  onScan,
}: {
  scanned: boolean;
  onScan: () => void;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-cocoa-15 bg-cocoa">
      {/* fake "menu" surface */}
      <div className="absolute inset-3 flex flex-col gap-1 rounded-md bg-ivory p-md">
        <span className="ltr font-serif text-lede text-cocoa">Cardápio</span>
        <span className="ltr text-body text-cocoa-70">Picanha à brasileira</span>
        <span className="ltr text-body text-cocoa-70">Feijoada completa</span>
        <span className="ltr text-body text-cocoa-70">Acarajé baiano</span>
        <span className="ltr text-body text-cocoa-70">Pão de queijo</span>
      </div>

      {scanned && (
        <div className="absolute inset-0 bg-cocoa-30">
          <div className="absolute inset-3 flex flex-col gap-1 rounded-md border border-copper bg-ivory p-md">
            <span className="font-serif text-lede text-cocoa">תפריט</span>
            <span className="text-body text-cocoa">
              פיקניה ברזילאית
            </span>
            <span className="text-body text-cocoa">תבשיל פולים שחורים</span>
            <span className="text-body text-cocoa">כדורי שעועית מטוגנים</span>
            <span className="text-body text-cocoa">לחמניית גבינה</span>
          </div>
        </div>
      )}

      {/* corner brackets */}
      <Brackets />

      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <button
          type="button"
          onClick={onScan}
          className={clsx(
            'inline-flex h-12 w-12 items-center justify-center rounded-full',
            'border border-ivory bg-ivory text-cocoa active:bg-cocoa-08',
          )}
          aria-label={scanned ? 'נקה' : 'סרוק תפריט'}
        >
          {scanned ? (
            <ScanText className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          ) : (
            <Camera className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

function Brackets() {
  return (
    <>
      <span className="absolute start-2 top-2 h-5 w-5 border-s-2 border-t-2 border-copper" aria-hidden />
      <span className="absolute end-2 top-2 h-5 w-5 border-e-2 border-t-2 border-copper" aria-hidden />
      <span className="absolute start-2 bottom-2 h-5 w-5 border-s-2 border-b-2 border-copper" aria-hidden />
      <span className="absolute end-2 bottom-2 h-5 w-5 border-e-2 border-b-2 border-copper" aria-hidden />
    </>
  );
}
