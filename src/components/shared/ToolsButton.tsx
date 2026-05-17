import { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Modal } from './Modal';
import { ToolsGrid } from '../tools/ToolsGrid';

/**
 * Wrench icon in the TopBar end-slot on every tab-root screen. Tapping
 * opens the same tool grid that lives at /tools, inside a Modal —
 * tools are consulted ad-hoc (translator, checklist, eSIM) and don't
 * need a tab slot of their own.
 */
export function ToolsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Tools"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none hover:bg-cocoa-8 active:scale-95 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <Wrench className="h-5 w-5" strokeWidth={1.6} aria-hidden />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="For the road"
        title="Tools"
      >
        <p className="mb-md max-w-body text-small leading-snug text-cocoa-70">
          Everyday tools for trips abroad. Each one stands alone — open, use,
          close. Works offline too.
        </p>
        <ToolsGrid />
      </Modal>
    </>
  );
}
