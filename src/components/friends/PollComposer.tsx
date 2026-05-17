import { Plus, X } from 'lucide-react';
import clsx from 'clsx';
import type { Poll } from '../../data/activityPosts';

type Props = {
  value: { question: string; options: string[]; multipleChoice: boolean };
  onChange: (v: Props['value']) => void;
  onRemove: () => void;
};

/**
 * Inline poll editor used inside the Activity compose modal. 2–4 options
 * per brief §05 "optional 2-to-4-option poll". Multiple-choice is a single
 * checkbox.
 */
export function PollComposer({ value, onChange, onRemove }: Props) {
  const setQuestion = (q: string) => onChange({ ...value, question: q });
  const setOption = (i: number, text: string) => {
    const next = [...value.options];
    next[i] = text;
    onChange({ ...value, options: next });
  };
  const addOption = () => {
    if (value.options.length >= 4) return;
    onChange({ ...value, options: [...value.options, ''] });
  };
  const removeOption = (i: number) => {
    if (value.options.length <= 2) return;
    onChange({
      ...value,
      options: value.options.filter((_, idx) => idx !== i),
    });
  };
  const toggleMulti = () =>
    onChange({ ...value, multipleChoice: !value.multipleChoice });

  return (
    <section className="flex flex-col gap-sm rounded-2xl border border-copper/40 bg-sand/40 p-md">
      <header className="flex items-center justify-between">
        <span className="meta-caps text-copper">Poll</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove poll"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 hover:text-cocoa"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </header>
      <input
        type="text"
        value={value.question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What's the question?"
        className="w-full rounded-xl border border-cocoa-15 bg-ivory px-md py-2 text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
      />
      <ul className="flex flex-col gap-1">
        {value.options.map((option, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={option}
              onChange={(e) => setOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 rounded-xl border border-cocoa-15 bg-ivory px-md py-2 text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeOption(i)}
              disabled={value.options.length <= 2}
              aria-label={`Remove option ${i + 1}`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 hover:text-cocoa disabled:opacity-30 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      {value.options.length < 4 && (
        <button
          type="button"
          onClick={addOption}
          className="inline-flex items-center gap-1 self-start text-small text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Add option
        </button>
      )}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.multipleChoice}
          onChange={toggleMulti}
          className={clsx(
            'h-4 w-4 rounded border-cocoa-30 text-copper focus:ring-copper',
          )}
        />
        <span className="text-small text-cocoa-70">
          Allow multiple choices
        </span>
      </label>
    </section>
  );
}

/** Materialize a Poll from a PollComposer draft. Filters empty options. */
export function buildPoll(draft: {
  question: string;
  options: string[];
  multipleChoice: boolean;
}): Poll | null {
  const question = draft.question.trim();
  if (!question) return null;
  const options = draft.options
    .map((o) => o.trim())
    .filter((o) => o.length > 0)
    .map((text) => ({ text, voteCount: 0 }));
  if (options.length < 2) return null;
  return {
    question,
    options,
    multipleChoice: draft.multipleChoice,
    votes: {},
  };
}
