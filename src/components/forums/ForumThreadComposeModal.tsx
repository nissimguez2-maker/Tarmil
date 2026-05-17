import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '../shared/Modal';
import { Button } from '../Button';
import { IdentityToggle } from './IdentityToggle';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { useDemoState } from '../../lib/demoState';
import {
  encodePurposeBody,
  PURPOSE_LABEL,
  PURPOSE_TONE,
  type ForumPurpose,
} from '../../data/forumPurpose';

type Props = {
  open: boolean;
  onClose: () => void;
  forumId: string;
  forumSubject: string;
};

const SELF_NAME = 'Nissim Guez';
const PURPOSES: ForumPurpose[] = ['question', 'tip', 'warning'];

/**
 * New-thread composer. Required: title, body, purpose tag. Identity
 * defaults to the user's real name (anonymous opt-in per post). Off-grid
 * mode forces anonymous and disables the toggle.
 */
export function ForumThreadComposeModal({
  open,
  onClose,
  forumId,
  forumSubject,
}: Props) {
  const { postForumThread } = useSupabaseData();
  const demo = useDemoState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [purpose, setPurpose] = useState<ForumPurpose | null>(null);
  const [identity, setIdentity] = useState<'name' | 'anonymous'>('name');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setBody('');
      setPurpose(null);
      setIdentity('name');
    }
  }, [open]);

  useEffect(() => {
    if (demo.offGrid && identity !== 'anonymous') setIdentity('anonymous');
  }, [demo.offGrid, identity]);

  const canSubmit =
    title.trim().length >= 4 &&
    body.trim().length >= 6 &&
    purpose !== null &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !purpose) return;
    setSubmitting(true);
    try {
      await postForumThread({
        forumId,
        title: title.trim(),
        body: encodePurposeBody(purpose, body),
      });
      onClose();
    } catch (e) {
      console.error('Failed to post thread:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={`New thread · ${forumSubject}`}
      title="Start a thread"
      footer={
        <Button
          variant="accent"
          fullWidth
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {submitting ? 'Posting…' : 'Post thread'}
        </Button>
      }
    >
      <div className="flex flex-col gap-md">
        <p className="text-small leading-snug text-cocoa-70">
          Subjects exist to keep noise down. If a search above the thread
          list didn't surface your question, this is the place.
        </p>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Purpose</label>
          <div className="flex flex-wrap gap-2">
            {PURPOSES.map((p) => {
              const active = purpose === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={clsx(
                    'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-small font-medium leading-none',
                    'transition-colors duration-instant ease-out-quart',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                    active
                      ? PURPOSE_TONE[p]
                      : 'border border-cocoa-15 text-cocoa-70 hover:text-cocoa',
                  )}
                >
                  {PURPOSE_LABEL[p]}
                </button>
              );
            })}
          </div>
          {purpose === null && (
            <span className="text-small text-cocoa-55">
              Pick one — keeps the forum filterable.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short and clear — what's the thread about?"
            maxLength={120}
            className="h-12 w-full rounded-full border border-cocoa-15 bg-sand px-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Context, dates, what you've tried already — the more specific, the better the answer."
            maxLength={1200}
            rows={5}
            className="w-full resize-y rounded-2xl border border-cocoa-15 bg-sand px-md py-3 text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="meta-caps text-cocoa-55">Post as</label>
          {demo.offGrid ? (
            <span className="text-small italic text-cocoa-55">
              Off-grid mode — this thread will post anonymously.
            </span>
          ) : (
            <IdentityToggle
              value={identity}
              onChange={setIdentity}
              realName={SELF_NAME}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
