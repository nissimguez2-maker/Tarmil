import clsx from 'clsx';
import { UserCircle2, EyeOff } from 'lucide-react';

type Props = {
  value: 'name' | 'anonymous';
  onChange: (value: 'name' | 'anonymous') => void;
  /** Real name shown when picking "Post as <Name>". */
  realName: string;
};

/**
 * Brief §04 Forums: identity per post is the user's choice — full name
 * (profile clickable) or anonymous. Segmented control above the forum
 * reply composer. Activity wall posts are always real-name; this control
 * is forum-only.
 */
export function IdentityToggle({ value, onChange, realName }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Post identity"
      className="inline-flex rounded-full bg-cocoa-08 p-1"
    >
      <Button
        active={value === 'name'}
        onClick={() => onChange('name')}
        ariaLabel={`Post as ${realName}`}
      >
        <UserCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        Post as {realName.split(' ')[0]}
      </Button>
      <Button
        active={value === 'anonymous'}
        onClick={() => onChange('anonymous')}
        ariaLabel="Post anonymously"
      >
        <EyeOff className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        Anonymous
      </Button>
    </div>
  );
}

function Button({
  active,
  onClick,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-medium leading-none',
        'transition-colors duration-instant ease-out-quart',
        active
          ? 'bg-cocoa text-ivory'
          : 'text-cocoa-70 hover:text-cocoa',
      )}
    >
      {children}
    </button>
  );
}
