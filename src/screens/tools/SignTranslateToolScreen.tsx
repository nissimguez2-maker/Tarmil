import { useState } from 'react';
import clsx from 'clsx';
import { Camera, ScanText } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

const SIGN_SAMPLES = [
  { src: 'PROIBIDO ESTACIONAR', dst: 'אסור להחנות' },
  { src: 'SAÍDA DE EMERGÊNCIA', dst: 'יציאת חירום' },
  { src: 'BANHEIRO PÚBLICO', dst: 'שירותים ציבוריים' },
  { src: 'NÃO ENTRE — OBRA', dst: 'אין כניסה — עבודות' },
];

export function SignTranslateToolScreen() {
  const [scanned, setScanned] = useState(false);

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="מתרגם שלטים" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Read what's around you." />

        <p className="max-w-body text-body text-cocoa-70">
          מצלמים שלט — תרמיל מציג את הטקסט בעברית מעליו, בלי לאבד את הקונטקסט.
          טוב במיוחד לשלטי תחבורה, איסורים והוראות חירום.
        </p>

        <SignFrame scanned={scanned} onScan={() => setScanned((s) => !s)} />

        {scanned && (
          <>
            <SectionLabel number="02" label="Recently translated." />
            <ul className="flex flex-col gap-sm">
              {SIGN_SAMPLES.map((s, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-1 rounded-sm border border-cocoa-15 bg-sand p-md"
                >
                  <span className="ltr font-serif text-[11pt] text-cocoa-70">
                    {s.src}
                  </span>
                  <span className="font-serif text-lede leading-tight text-cocoa">
                    {s.dst}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="text-[10pt] text-cocoa-55">
          שלטי תחבורה ושלטי איסור מתורגמים גם במצב מטוסים. שלטים סבוכים יותר
          דורשים רשת.
        </p>
      </div>
    </Screen>
  );
}

function SignFrame({
  scanned,
  onScan,
}: {
  scanned: boolean;
  onScan: () => void;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md border border-cocoa-15 bg-cocoa">
      <div className="absolute inset-3 flex items-center justify-center rounded-md bg-ivory">
        <span className="ltr font-serif text-sub text-cocoa">
          PROIBIDO ESTACIONAR
        </span>
      </div>

      {scanned && (
        <div className="absolute inset-0 flex items-center justify-center bg-cocoa-30">
          <div className="rounded-md border-2 border-copper bg-ivory px-md py-3 shadow-device">
            <span className="font-serif text-sub text-cocoa">
              אסור להחנות
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <button
          type="button"
          onClick={onScan}
          className={clsx(
            'inline-flex h-12 w-12 items-center justify-center rounded-full',
            'border border-ivory bg-ivory text-cocoa active:bg-cocoa-08',
          )}
          aria-label={scanned ? 'נקה' : 'סרוק שלט'}
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
