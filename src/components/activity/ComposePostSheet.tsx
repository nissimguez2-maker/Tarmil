import { useState } from 'react';
import clsx from 'clsx';
import { Modal } from '../shared/Modal';
import { Button } from '../Button';

type PostKind = 'declaration' | 'whos_down';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with the composed body when the user posts. The mockup just stubs. */
  onPost?: (body: string, kind: PostKind) => void;
};

const KIND_OPTIONS: Array<{ value: PostKind; label: string; meta: string }> = [
  {
    value: 'declaration',
    label: 'הכרזה על טיול',
    meta: 'משתף את החברים על מסלול חדש',
  },
  {
    value: 'whos_down',
    label: 'הזמנה פתוחה',
    meta: 'שואל מי מצטרף — מקום או חוויה',
  },
];

/**
 * Compose sheet for the Activity tab's "+" FAB. Pick a post kind, type a body,
 * tap "פרסם". The post is mock — onPost is optional and currently just closes.
 * Drafts to a future PR that wires this to Supabase activity_posts.
 */
export function ComposePostSheet({ open, onClose, onPost }: Props) {
  const [kind, setKind] = useState<PostKind>('declaration');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const canPost = body.trim().length > 0 && !sending;

  const handlePost = async () => {
    if (!canPost) return;
    setSending(true);
    try {
      await onPost?.(body.trim(), kind);
      setBody('');
      setKind('declaration');
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="פוסט חדש"
      title="מה קורה במסע?"
      footer={
        <Button
          variant="accent"
          fullWidth
          disabled={!canPost}
          onClick={handlePost}
        >
          {sending ? 'מפרסם…' : 'פרסם'}
        </Button>
      }
    >
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <span className="meta-caps text-cocoa-55">סוג פוסט</span>
          <div className="flex flex-col gap-sm">
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setKind(opt.value)}
                  aria-pressed={active}
                  className={clsx(
                    'flex items-start gap-sm rounded-2xl border p-md text-start',
                    'transition-colors duration-instant ease-out-quart',
                    active
                      ? 'border-copper bg-sand'
                      : 'border-cocoa-15 bg-ivory active:bg-cocoa-08',
                  )}
                >
                  <span
                    className={clsx(
                      'mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                      active
                        ? 'border-copper bg-copper'
                        : 'border-cocoa-30',
                    )}
                    aria-hidden
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-ivory" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="font-serif text-lede italic text-cocoa">
                      {opt.label}
                    </span>
                    <span className="text-small text-cocoa-55">{opt.meta}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <span className="meta-caps text-cocoa-55">הגוף</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            dir="rtl"
            placeholder="שני משפטים זה הרבה. השאר את זה אמיתי."
            className="resize-none rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md text-body text-cocoa placeholder:text-cocoa-55 transition-colors duration-instant ease-out-quart focus:border-copper focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
