import { useState } from 'react';
import clsx from 'clsx';
import { Mic, MicOff } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Lang = 'he' | 'pt' | 'es' | 'en';

const LANG_LABEL: Record<Lang, string> = {
  he: 'עברית',
  pt: 'פורטוגזית',
  es: 'ספרדית',
  en: 'אנגלית',
};

const SAMPLES: Array<{ from: Lang; to: Lang; src: string; dst: string }> = [
  {
    from: 'he',
    to: 'pt',
    src: 'איפה האוטובוס לאיפנמה?',
    dst: 'Onde fica o ônibus para Ipanema?',
  },
  {
    from: 'he',
    to: 'es',
    src: 'אפשר חשבון בלי בשר?',
    dst: '¿Puede traerme la cuenta, sin carne?',
  },
];

export function VoiceTranslateToolScreen() {
  const [recording, setRecording] = useState(false);
  const [from, setFrom] = useState<Lang>('he');
  const [to, setTo] = useState<Lang>('pt');

  return (
    <Screen>
      <TopBar back eyebrow="Tarmil" title="מתרגם קולי" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Speak, hear, repeat." />

        <p className="max-w-body text-body text-cocoa-70">
          מדברים עברית — תרמיל מתרגם בקול לשפה המקומית. מדברים אליך — תרמיל
          מתרגם הביתה. הכל בלייב, בלי הקלטה לענן.
        </p>

        <div className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
          <div className="flex items-center gap-sm">
            <LangPicker value={from} onChange={setFrom} />
            <span className="text-cocoa-30" aria-hidden>↔</span>
            <LangPicker value={to} onChange={setTo} />
          </div>

          <div className="flex items-center justify-center py-lg">
            <button
              type="button"
              aria-pressed={recording}
              onClick={() => setRecording((r) => !r)}
              className={clsx(
                'inline-flex h-20 w-20 items-center justify-center rounded-full transition-colors',
                recording
                  ? 'bg-copper text-ivory'
                  : 'border border-cocoa-15 bg-ivory text-cocoa active:bg-cocoa-08',
              )}
            >
              {recording ? (
                <MicOff className="h-8 w-8" strokeWidth={1.7} aria-hidden />
              ) : (
                <Mic className="h-8 w-8" strokeWidth={1.7} aria-hidden />
              )}
            </button>
          </div>
          <span className="text-center text-[10pt] text-cocoa-55">
            {recording ? 'מקליט… לחצו כדי לעצור' : 'לחצו כדי לדבר'}
          </span>
        </div>

        <SectionLabel number="02" label="Recent." />

        <ul className="flex flex-col gap-sm">
          {SAMPLES.map((s, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 rounded-sm border border-cocoa-15 bg-sand p-md"
            >
              <span className="meta-caps text-copper">
                {LANG_LABEL[s.from]} → {LANG_LABEL[s.to]}
              </span>
              <span className="font-serif text-lede leading-tight">
                {s.src}
              </span>
              <span className="ltr text-body text-cocoa-70">{s.dst}</span>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}

function LangPicker({
  value,
  onChange,
}: {
  value: Lang;
  onChange: (v: Lang) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Lang)}
      className="rounded-sm border border-cocoa-15 bg-ivory px-sm py-2 font-serif text-lede text-cocoa focus:outline-none"
    >
      {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
        <option key={l} value={l}>
          {LANG_LABEL[l]}
        </option>
      ))}
    </select>
  );
}
