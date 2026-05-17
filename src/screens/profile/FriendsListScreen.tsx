import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SearchBar } from '../../components/shared/SearchBar';
import { Avatar } from '../../components/shared/Avatar';
import { Button } from '../../components/Button';
import { Fab } from '../../components/shared/Fab';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import {
  useDemoState,
  type IncomingRequest,
} from '../../lib/demoState';
import { AddFriendSheet } from '../../components/friends/AddFriendSheet';
import { ReviewRequestSheet } from '../../components/friends/ReviewRequestSheet';

const INCOMING_REQUESTS: IncomingRequest[] = [
  { id: 'req-tamar', name: 'Tamar Yaron', initial: 'T' },
  { id: 'req-itai', name: 'Itai Cohen', initial: 'I' },
];

/**
 * Friends list — drill-down from the Profile screen ("Friends in
 * network" → See all).
 *
 * Manages the relationship list itself: search, incoming friend
 * requests, an Add-friend FAB (contacts auto-match + QR code), and a
 * map-density toggle.
 */
export function FriendsListScreen() {
  const { data, loading, error } = useSupabaseData();
  const [query, setQuery] = useState('');
  const [showDensity, setShowDensity] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const demo = useDemoState();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const lower = query.trim().toLowerCase();
  const filtered = !lower
    ? data.friendOverlaps
    : data.friendOverlaps.filter(
        (f) =>
          f.friendName.toLowerCase().includes(lower) ||
          f.zoneLabel.toLowerCase().includes(lower),
      );

  const pendingRequests = INCOMING_REQUESTS.filter(
    (r) => !demo.resolvedRequestIds.includes(r.id),
  );

  return (
    <Screen>
      <TopBar back title="Friends" />

      <div className="flex flex-col gap-md p-md pb-32">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search friends"
        />

        {pendingRequests.length > 0 && (
          <section className="flex items-center justify-between gap-sm rounded-2xl bg-sand p-md">
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="font-serif text-body italic text-cocoa">
                {pendingRequests.length} friend{' '}
                {pendingRequests.length === 1 ? 'request' : 'requests'}
              </span>
              <span className="truncate text-small text-cocoa-55">
                {pendingRequests.map((r) => r.name).join(', ')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReviewOpen(true)}
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              Review
            </Button>
          </section>
        )}

        {demo.pendingFriendRequests.length > 0 && (
          <section className="rounded-2xl border border-cocoa-15 bg-ivory p-md">
            <span className="meta-caps text-cocoa-55">Sent requests</span>
            <ul className="mt-2 flex flex-col gap-2">
              {demo.pendingFriendRequests.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-between gap-sm text-small text-cocoa-70"
                >
                  <span>{name}</span>
                  <span className="meta-caps text-cocoa-55">Pending</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {demo.acceptedFriends.length > 0 && (
          <section className="rounded-2xl border border-copper bg-copper/5 p-md">
            <span className="meta-caps text-copper">
              {demo.acceptedFriends.length === 1
                ? 'New friend'
                : 'New friends'}
            </span>
            <ul className="mt-2 flex flex-col gap-2">
              {demo.acceptedFriends.map((f) => (
                <li key={f.id} className="flex items-center gap-sm">
                  <Avatar
                    photoUrl={null}
                    initial={f.initial}
                    name={f.name}
                    size="sm"
                  />
                  <span className="text-body text-cocoa">{f.name}</span>
                  <span className="ms-auto inline-flex items-center gap-1 meta-caps text-copper">
                    <UserCheck className="h-3 w-3" aria-hidden />
                    Connected
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-1 rounded-2xl border border-cocoa-15 bg-ivory">
          <ToggleRow
            label="Show friend density on the map"
            description="Direct friends appear as pins on the Trip map."
            checked={showDensity}
            onChange={() => setShowDensity((v) => !v)}
          />
        </section>

        <ul className="flex flex-col gap-sm">
          {filtered.map((friend) => {
            const isPresent = friend.status === 'present';
            const dates =
              friend.overlapStart && friend.overlapEnd
                ? formatDateRange(friend.overlapStart, friend.overlapEnd)
                : undefined;
            return (
              <li key={friend.id}>
                <Link
                  to={`/profile/friend/${friend.id}`}
                  className={clsx(
                    'flex items-start gap-sm rounded-2xl bg-sand shadow-card p-md',
                    'transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand',
                  )}
                >
                  <Avatar
                    photoUrl={friend.photoUrl}
                    initial={friend.friendInitial}
                    name={friend.friendName}
                    size="lg"
                    statusDot={isPresent}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-xs">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="font-serif text-lede leading-tight text-cocoa">
                        {friend.friendName}
                      </span>
                      <span className="meta-caps text-copper">
                        {isPresent ? 'Here with you' : 'Future overlap'}
                      </span>
                    </span>
                    <span className="text-small text-cocoa-70">
                      <span className="text-cocoa">{friend.zoneLabel}</span>
                      {dates && (
                        <span className="text-cocoa-55"> · {dates}</span>
                      )}
                    </span>
                    <span className="text-small text-cocoa-55">
                      {friend.detail}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-small leading-snug text-cocoa-55">
          City-level location only. Tarmil never shows friends your exact
          address — overlaps appear at city level only.
        </p>
      </div>

      <Fab
        icon={<UserPlus className="h-5 w-5" strokeWidth={2} />}
        ariaLabel="Add a friend"
        onClick={() => setAddOpen(true)}
      />

      <AddFriendSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <ReviewRequestSheet
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        requests={pendingRequests}
      />
    </Screen>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-sm border-b border-cocoa-08 px-md py-3 last:border-b-0">
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-body text-cocoa">{label}</span>
        <span className="text-small text-cocoa-55">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={clsx(
          'relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full',
          'transition-colors duration-instant ease-out-quart',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
          checked ? 'bg-copper' : 'bg-cocoa-15',
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-ivory shadow-card transition-transform duration-instant ease-out-quart',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  );
}
