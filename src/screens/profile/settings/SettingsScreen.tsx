import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { SectionLabel } from '../../../components/SectionLabel';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/shared/Modal';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

type Row = {
  label: string;
  value: string;
  /** Optional choices a tap opens; first is current. When omitted, the row shows a static read-out. */
  choices?: string[];
  /** Optional one-paragraph explainer for the detail sheet. */
  detail?: string;
};

const SECTIONS: { number: string; label: string; rows: Row[] }[] = [
  {
    number: '01',
    label: 'Account.',
    rows: [
      { label: 'Name', value: 'Nissim Guez', detail: 'The name your friends see in the app.' },
      { label: 'Phone', value: '+1 ··· (verified)', detail: 'Verified at signup. Changing it requires re-verification.' },
      {
        label: 'Language',
        value: 'English',
        choices: ['English', 'Português', 'Español'],
        detail: 'Interface language. Dates and currencies update automatically.',
      },
    ],
  },
  {
    number: '02',
    label: 'Privacy.',
    rows: [
      {
        label: 'Off-grid mode',
        value: 'Set on Profile',
        detail:
          'Off-grid hides you from every friend across overlaps, density, forums and pings. The one-tap switch sits at the top of your Profile.',
      },
      {
        label: 'Visible to friends of friends',
        value: 'On',
        choices: ['On', 'Off'],
        detail:
          'Lets friends of friends spot an overlap only when your route actually crosses theirs in a shared city.',
      },
      {
        label: 'Location resolution',
        value: 'City level only',
        choices: ['City level only', 'Region level (wider buffer)'],
        detail:
          'Tarmil never exposes your exact address to friends. City-level resolution is the default and stays that way.',
      },
    ],
  },
  {
    number: '03',
    label: 'Notifications.',
    rows: [
      {
        label: 'Activity',
        value: 'All',
        choices: ['All', 'Only friends nearby', 'Off'],
      },
      {
        label: 'Forums',
        value: 'Replies to me',
        choices: ['All', 'Replies to me', 'Off'],
      },
      {
        label: 'Pings',
        value: 'All',
        choices: ['All', 'Friends only', 'Off'],
      },
    ],
  },
  {
    number: '04',
    label: 'About.',
    rows: [
      { label: 'Version', value: 'beta · 2026.05.11', detail: 'Current demo build. Open items live in the design docs.' },
      { label: 'Privacy', value: 'Document', detail: 'Tarmil collects only what overlaps and trips actually need. Full document available.' },
      { label: 'Terms', value: 'Document', detail: 'Terms of service. Full document available.' },
    ],
  },
];

/**
 * Settings drill-down. Each row taps into a SettingDetailSheet — the rows
 * with `choices` let the user (locally) pick a new value; rows with just
 * `detail` show a read-only explainer.
 */
export function SettingsScreen() {
  const { resetDemo } = useSupabaseData();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [openRow, setOpenRow] = useState<Row | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [signoutOpen, setSignoutOpen] = useState(false);

  async function handleReset() {
    setResetting(true);
    setResetMessage(null);
    try {
      await resetDemo();
      setResetMessage('Demo state reset.');
    } catch (e) {
      setResetMessage(e instanceof Error ? e.message : 'Reset failed.');
    } finally {
      setResetting(false);
    }
  }

  const valueFor = (row: Row) => overrides[row.label] ?? row.value;

  return (
    <Screen>
      <TopBar back title="Settings" />

      <div className="flex flex-col gap-lg p-md pb-xl">
        {SECTIONS.map((section) => (
          <section key={section.number} className="flex flex-col gap-sm">
            <SectionLabel number={section.number} label={section.label} />
            <ul className="overflow-hidden rounded-2xl border border-charcoal-15 bg-cream">
              {section.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={clsx(
                    i < section.rows.length - 1 && 'border-b border-charcoal-15',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenRow(row)}
                    className="flex w-full items-center justify-between gap-sm px-md py-3 text-start transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:bg-charcoal-8"
                  >
                    <span className="text-body text-charcoal">{row.label}</span>
                    <span className="flex shrink-0 items-center gap-2 text-small text-charcoal-55">
                      {valueFor(row)}
                      <ChevronRight className="h-4 w-4 text-charcoal-30" strokeWidth={1.5} aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="flex flex-col gap-sm">
          <SectionLabel number="05" label="Demo controls." />
          <div className="flex flex-col gap-sm rounded-2xl bg-sand shadow-card p-md">
            <p className="text-small text-charcoal-70">
              Restores the planned stops to the canonical demo state. Useful
              between investor demos.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={resetting}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              {resetting ? 'Resetting…' : 'Reset demo state'}
            </Button>
            {resetMessage && (
              <p className="text-small text-charcoal-55">{resetMessage}</p>
            )}
          </div>
        </section>

        <Button variant="ghost" fullWidth onClick={() => setSignoutOpen(true)}>
          Sign out
        </Button>
      </div>

      <SettingDetailSheet
        row={openRow}
        currentValue={openRow ? valueFor(openRow) : ''}
        onSelect={(value) => {
          if (openRow) {
            setOverrides((prev) => ({ ...prev, [openRow.label]: value }));
          }
          setOpenRow(null);
        }}
        onClose={() => setOpenRow(null)}
      />

      <SignOutConfirm
        open={signoutOpen}
        onClose={() => setSignoutOpen(false)}
      />
    </Screen>
  );
}

function SettingDetailSheet({
  row,
  currentValue,
  onSelect,
  onClose,
}: {
  row: Row | null;
  currentValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={row !== null}
      onClose={onClose}
      eyebrow="Setting"
      title={row?.label ?? ''}
    >
      <div className="flex flex-col gap-md">
        {row?.detail && (
          <p className="text-small leading-snug text-charcoal-70">{row.detail}</p>
        )}

        {row?.choices ? (
          <ul className="flex flex-col">
            {row.choices.map((choice, i) => {
              const active = choice === currentValue;
              return (
                <li
                  key={choice}
                  className={clsx(
                    i > 0 && 'border-t border-charcoal-15',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(choice)}
                    className="flex w-full items-center justify-between gap-sm py-sm text-start transition-colors duration-instant ease-out-quart active:bg-charcoal-08"
                  >
                    <span className="text-body text-charcoal">{choice}</span>
                    {active && (
                      <span className="meta-caps text-amber">Selected</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl bg-sand p-md">
            <span className="meta-caps text-charcoal-55">Current value</span>
            <p className="mt-xs text-body text-charcoal">{currentValue}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function SignOutConfirm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Sign out"
      title="Sign out of Tarmil?"
      footer={
        <div className="flex gap-sm">
          <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
            Not now
          </Button>
          <Button
            variant="accent"
            size="sm"
            fullWidth
            onClick={() => {
              // Demo mode: just acknowledge and close. A real auth flow lands later.
              onClose();
            }}
          >
            Sign out
          </Button>
        </div>
      }
    >
      <p className="text-body leading-snug text-charcoal-70">
        You can come back any time. Your route, friends and messages stay on Tarmil's servers.
      </p>
      <p className="mt-sm text-small leading-snug text-charcoal-55">
        Demo build — sign-out here is a no-op.
      </p>
    </Modal>
  );
}
