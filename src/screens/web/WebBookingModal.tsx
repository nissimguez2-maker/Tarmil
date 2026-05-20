import { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '../../components/Button';

export type BookingTarget =
  | { kind: 'place'; name: string; category: string }
  | { kind: 'transport'; from: string; to: string; provider: string };

type Props = {
  target: BookingTarget | null;
  onClose: () => void;
};

const PROVIDERS = [
  { label: 'Booking.com' },
  { label: 'Expedia' },
  { label: 'Direct' },
];

export function WebBookingModal({ target, onClose }: Props) {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, onClose]);

  if (!target) return null;

  const title =
    target.kind === 'place' ? target.name : `${target.from} → ${target.to}`;
  const subtitle =
    target.kind === 'place'
      ? `Book this ${target.category}`
      : `via ${target.provider}`;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-cocoa/40 flex items-center justify-center p-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '360px' }}
        className="bg-ivory border border-rope rounded-3xl shadow-panel p-md flex flex-col gap-md relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-sm end-sm h-8 w-8 rounded-full flex items-center justify-center text-cocoa-55 hover:text-cocoa hover:bg-cocoa-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <X size={16} strokeWidth={2} />
        </button>
        <div className="flex flex-col gap-xs pe-12">
          <p className="meta-caps text-cocoa-55">Book</p>
          <h2 className="font-serif text-sub text-cocoa leading-tight">
            {title}
          </h2>
          <p className="text-small text-cocoa-55">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-sm">
          {PROVIDERS.map((p) => (
            <Button key={p.label} variant="ghost" fullWidth onClick={onClose}>
              <ExternalLink size={14} strokeWidth={2} />
              Book via {p.label}
            </Button>
          ))}
        </div>
        <p className="text-meta italic text-cocoa-55 text-center">
          Booking partner integrations coming soon
        </p>
      </div>
    </div>
  );
}
