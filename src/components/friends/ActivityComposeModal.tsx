import { useState } from 'react';
import { MapPin, BarChart3, Smile } from 'lucide-react';
import clsx from 'clsx';
import { Modal } from '../shared/Modal';
import { Button } from '../Button';
import { PollComposer, buildPoll } from './PollComposer';
import type { Poll } from '../../data/activityPosts';
import type { PlannedStop } from '../../data/plannedStops';

type Props = {
  open: boolean;
  onClose: () => void;
  stops: PlannedStop[];
  onSubmit: (body: string, destinationId: string | undefined, poll: Poll | null) => Promise<void>;
};

const QUICK_EMOJI = ['🌎', '🔥', '🏖️', '🥾', '🍝', '🎒', '☕', '🌅'];

/**
 * Activity post composer. Text + emoji + optional city-level location pin
 * (chosen from the user's planned stops) + optional 2–4 option poll.
 * No media — brief §06 makes "Media inside Activity posts" a forbidden
 * surface area at MVP.
 */
export function ActivityComposeModal({ open, onClose, stops, onSubmit }: Props) {
  const [body, setBody] = useState('');
  const [destinationId, setDestinationId] = useState<string | undefined>(
    undefined,
  );
  const [pollDraft, setPollDraft] = useState<
    { question: string; options: string[]; multipleChoice: boolean } | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setBody('');
    setDestinationId(undefined);
    setPollDraft(null);
  };

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    const poll = pollDraft ? buildPoll(pollDraft) : null;
    setSubmitting(true);
    try {
      await onSubmit(trimmed, destinationId, poll);
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const addPoll = () =>
    setPollDraft({ question: '', options: ['', ''], multipleChoice: false });

  const insertEmoji = (e: string) => setBody((prev) => prev + e);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      eyebrow="New post"
      title="What's on your mind?"
      footer={
        <div className="flex gap-sm">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            size="sm"
            fullWidth
            disabled={submitting || body.trim().length === 0}
            onClick={handleSubmit}
          >
            {submitting ? 'Posting…' : 'Post'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-md">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Trip declaration, who's down, a question, a party — text and emoji."
          rows={4}
          className="w-full resize-none rounded-xl border border-cocoa-15 bg-ivory p-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <Smile className="h-4 w-4 text-cocoa-55" strokeWidth={1.8} aria-hidden />
          <div className="flex flex-wrap items-center gap-1">
            {QUICK_EMOJI.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => insertEmoji(e)}
                aria-label={`Insert ${e}`}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-body transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cocoa-55" strokeWidth={1.8} aria-hidden />
            <span className="text-small text-cocoa-70">Posting from</span>
          </div>
          <ul className="flex flex-wrap gap-1">
            <li>
              <PinChip
                active={destinationId === undefined}
                onClick={() => setDestinationId(undefined)}
              >
                None
              </PinChip>
            </li>
            {stops.map((s) => (
              <li key={s.id}>
                <PinChip
                  active={destinationId === s.id}
                  onClick={() => setDestinationId(s.id)}
                >
                  {s.nameEn}
                </PinChip>
              </li>
            ))}
          </ul>
        </section>

        {pollDraft ? (
          <PollComposer
            value={pollDraft}
            onChange={setPollDraft}
            onRemove={() => setPollDraft(null)}
          />
        ) : (
          <button
            type="button"
            onClick={addPoll}
            className="inline-flex items-center gap-2 self-start rounded-full bg-cocoa-08 ps-3 pe-md py-2 text-small text-cocoa transition-colors duration-instant ease-out-quart hover:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <BarChart3 className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            Add a poll
          </button>
        )}
      </div>
    </Modal>
  );
}

function PinChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'inline-flex h-8 items-center rounded-full ps-3 pe-3 text-small leading-none',
        'transition-colors duration-instant ease-out-quart',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        active
          ? 'bg-cocoa text-ivory'
          : 'bg-cocoa-08 text-cocoa-70 hover:bg-cocoa-15 hover:text-cocoa',
      )}
    >
      {children}
    </button>
  );
}
