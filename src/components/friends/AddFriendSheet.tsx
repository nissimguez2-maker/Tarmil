import { useState } from 'react';
import { Smartphone, QrCode, Check, UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { Modal } from '../shared/Modal';
import { Button } from '../Button';
import { Avatar } from '../shared/Avatar';
import { addPendingFriendRequest, useDemoState } from '../../lib/demoState';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Mode = 'contacts' | 'qr';

type ContactMatch = {
  name: string;
  initial: string;
  phone: string;
};

const CONTACT_MATCHES: ContactMatch[] = [
  { name: 'Aviv Levi', initial: 'A', phone: '+972 50 ··· 3914' },
  { name: 'Noa Berger', initial: 'N', phone: '+972 54 ··· 2287' },
  { name: 'Daniel Mor', initial: 'D', phone: '+972 52 ··· 0541' },
  { name: 'Lior Shavit', initial: 'L', phone: '+972 50 ··· 8866' },
  { name: 'Maya Tal', initial: 'M', phone: '+972 54 ··· 1129' },
];

const QR_DOT_GRID: number[][] = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1],
];

/**
 * Add-friend flow. Two paths — phone-contact auto-match and QR code in
 * person. Per Tarmil's privacy stance there is no public directory; you
 * find friends by knowing them, not by searching them.
 */
export function AddFriendSheet({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('contacts');
  const demo = useDemoState();

  const isSent = (name: string) => demo.pendingFriendRequests.includes(name);

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Connect"
      title="Add a friend"
    >
      <div className="flex flex-col gap-md">
        <p className="text-small leading-snug text-cocoa-70">
          Tarmil has no public directory. Connect with people you already
          know — from your phone contacts, or by scanning their QR code in
          person.
        </p>

        <div className="inline-flex self-start rounded-full bg-cocoa-08 p-1">
          {(['contacts', 'qr'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={clsx(
                'rounded-full px-md py-1.5 text-small font-medium leading-none',
                'transition-colors duration-instant ease-out-quart',
                mode === id
                  ? 'bg-cocoa text-ivory'
                  : 'text-cocoa-70 hover:text-cocoa',
              )}
            >
              {id === 'contacts' ? 'From contacts' : 'QR code'}
            </button>
          ))}
        </div>

        {mode === 'contacts' ? (
          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-sm rounded-2xl bg-sand px-md py-sm">
              <Smartphone className="h-4 w-4 shrink-0 text-cocoa-55" aria-hidden />
              <span className="text-small text-cocoa-70">
                <span className="tnum font-medium text-cocoa">
                  {CONTACT_MATCHES.length}
                </span>{' '}
                contacts already on Tarmil
              </span>
            </div>
            <ul className="flex flex-col">
              {CONTACT_MATCHES.map((c, i) => {
                const sent = isSent(c.name);
                return (
                  <li
                    key={c.name}
                    className={clsx(
                      'flex items-center gap-sm py-2',
                      i > 0 && 'border-t border-cocoa-15',
                    )}
                  >
                    <Avatar
                      photoUrl={null}
                      initial={c.initial}
                      name={c.name}
                      size="sm"
                    />
                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="text-body text-cocoa">{c.name}</span>
                      <span className="truncate text-small text-cocoa-55">
                        {c.phone}
                      </span>
                    </div>
                    {sent ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cocoa-08 px-2 py-1 meta-caps text-cocoa-55">
                        <Check className="h-3 w-3" aria-hidden />
                        Sent
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addPendingFriendRequest(c.name)}
                      >
                        <UserPlus className="h-3 w-3" aria-hidden />
                        Add
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-md py-sm">
            <p className="text-small leading-snug text-cocoa-70 text-center">
              Have your friend point their camera at this code. Face-to-face
              is the strongest signal we have.
            </p>
            <div className="rounded-2xl border border-cocoa-15 bg-ivory p-md">
              <div
                className="grid gap-px"
                style={{ gridTemplateColumns: 'repeat(9, 14px)' }}
                aria-label="Your Tarmil QR code"
                role="img"
              >
                {QR_DOT_GRID.flatMap((row, ri) =>
                  row.map((cell, ci) => (
                    <span
                      key={`${ri}-${ci}`}
                      className={clsx(
                        'h-3.5 w-3.5 rounded-sm',
                        cell ? 'bg-cocoa' : 'bg-transparent',
                      )}
                      aria-hidden
                    />
                  )),
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <QrCode className="h-4 w-4" aria-hidden />
              Scan a friend's code
            </Button>
            <p className="text-small leading-snug text-cocoa-55 text-center">
              Demo build — scanning is mocked. In production this opens the
              camera and connects on capture.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
