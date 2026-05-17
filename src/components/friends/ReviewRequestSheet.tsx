import { Check, X } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Avatar } from '../shared/Avatar';
import {
  resolveIncomingRequest,
  type IncomingRequest,
} from '../../lib/demoState';

type Props = {
  open: boolean;
  onClose: () => void;
  requests: IncomingRequest[];
};

/**
 * Inbound friend requests inbox. Accept moves them into a "New friends"
 * section on the Friends list. Decline removes them silently.
 */
export function ReviewRequestSheet({ open, onClose, requests }: Props) {
  const handleAccept = (r: IncomingRequest) => {
    resolveIncomingRequest(r.id, 'accept', r.name, r.initial);
    if (requests.length === 1) onClose();
  };

  const handleDecline = (r: IncomingRequest) => {
    resolveIncomingRequest(r.id, 'decline');
    if (requests.length === 1) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Incoming"
      title="Friend requests"
    >
      <div className="flex flex-col gap-md">
        {requests.length === 0 ? (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
            All caught up. New requests will appear here when friends find
            you via contacts or QR.
          </p>
        ) : (
          <ul className="flex flex-col gap-sm">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-sm rounded-2xl bg-sand p-md"
              >
                <Avatar
                  photoUrl={null}
                  initial={r.initial}
                  name={r.name}
                  size="md"
                />
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-serif text-body italic text-cocoa">
                    {r.name}
                  </span>
                  <span className="text-small text-cocoa-55">
                    Wants to connect
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Decline ${r.name}`}
                  onClick={() => handleDecline(r)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cocoa-15 text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Accept ${r.name}`}
                  onClick={() => handleAccept(r)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-copper text-ivory shadow-card transition-[transform,background-color] duration-instant ease-out-quart hover:bg-copper-85 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-small leading-snug text-cocoa-55">
          City-level visibility kicks in only after both sides accept.
          Tarmil never connects you without two-way consent.
        </p>
      </div>
    </Modal>
  );
}
