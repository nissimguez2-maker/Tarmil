import { Send } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import clsx from 'clsx';

type Props = {
  placeholder?: string;
  onSend: (body: string) => void | Promise<void>;
};

/**
 * Sticky chat composer. Sand input + copper send button. Pressed Enter
 * submits; Shift+Enter inserts a newline. The input clears after a
 * successful send.
 */
export function MessageComposer({ placeholder = 'Type a message…', onSend }: Props) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setValue('');
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 flex items-center gap-sm border-t border-cocoa-15 bg-ivory px-md pt-sm"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={sending}
        className={clsx(
          'h-10 min-w-0 flex-1 rounded-full bg-sand ps-md pe-md text-body text-cocoa placeholder:text-cocoa-55',
          'outline-none transition-colors duration-instant ease-out-quart',
          'focus:bg-ivory focus:ring-2 focus:ring-copper-70',
        )}
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={!value.trim() || sending}
        className={clsx(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          'bg-copper text-ivory shadow-fab',
          'transition-[transform,background-color] duration-instant ease-out-quart',
          'hover:bg-copper-85 active:scale-[0.96] active:bg-copper',
          'disabled:opacity-30 disabled:shadow-none disabled:active:scale-100',
        )}
      >
        <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </form>
  );
}
