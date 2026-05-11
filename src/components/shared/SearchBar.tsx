import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import clsx from 'clsx';

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * Sand-filled search input. Used at the top of MessagesScreen to filter
 * forums/chats/DMs by substring match.
 *
 * Pill shape (rounded-full), magnifying-glass icon at the trailing edge in
 * RTL (end-side, after the text), cocoa-55 placeholder. Height matches the
 * top bar (14mm) so the chrome stays in rhythm.
 */
export function SearchBar({ value, onChange, placeholder, className }: Props) {
  return (
    <div
      className={clsx(
        'flex h-lg items-center gap-2 rounded-full bg-sand ps-md pe-md',
        'text-body text-cocoa placeholder:text-cocoa-55',
        className,
      )}
    >
      <Search
        className="h-4 w-4 shrink-0 text-cocoa-55"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none"
      />
    </div>
  );
}
