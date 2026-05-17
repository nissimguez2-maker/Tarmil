import { useState } from 'react';
import {
  Coins,
  ListChecks,
  Languages,
  ScanText,
  ScanLine,
  Wallet,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ToolDetailSheet,
  type ToolId,
} from '../profile/ToolDetailSheet';

type Tool = {
  id: ToolId;
  name: string;
  meta: string;
  Icon: LucideIcon;
};

// Seven tiles — the brief's §05 MVP set. Places-discovery moved out of
// the Tools shell in v0.6 (it's now the Around tab); Jewish-abroad-tools
// stays a V1 surface.
const TOOLS: Tool[] = [
  { id: 'currency', name: 'Currency converter', meta: 'Works offline too', Icon: Coins },
  { id: 'checklist', name: 'Pre-trip checklist', meta: 'Visa, vaccines, insurance', Icon: ListChecks },
  { id: 'voice', name: 'Voice translator', meta: 'Speech to speech, instant', Icon: Languages },
  { id: 'menu', name: 'Menu translator', meta: 'Scans ingredients & preferences', Icon: ScanText },
  { id: 'signs', name: 'Sign scanner', meta: 'Live signage translation', Icon: ScanLine },
  { id: 'balances', name: 'Friend balances', meta: 'Open tab between friends', Icon: Wallet },
  { id: 'esim', name: 'eSIM & data', meta: 'English-friendly support abroad', Icon: Smartphone },
];

/**
 * Grid of tool tiles. Used by both the standalone `/tools` route and the
 * Tools wrench in the TopBar end-slot (which mounts the grid inside a
 * Modal). The grid mounts its own `ToolDetailSheet` so opening a tool
 * works identically from either entry point.
 */
export function ToolsGrid() {
  const [openTool, setOpenTool] = useState<ToolId | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-sm">
        {TOOLS.map(({ id, name, meta, Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => setOpenTool(id)}
              className="flex h-full w-full flex-col items-start gap-xs rounded-2xl bg-sand shadow-card p-md text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="font-serif text-body italic leading-tight text-cocoa">
                {name}
              </span>
              <span className="text-small leading-tight text-cocoa-55">
                {meta}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ToolDetailSheet
        toolId={openTool}
        onClose={() => setOpenTool(null)}
      />
    </>
  );
}
