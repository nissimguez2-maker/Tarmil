import { useParams, useNavigate } from 'react-router-dom';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';
import { StatsPill } from '../../../components/profile/StatsPill';
import { PastTripCard } from '../../../components/profile/PastTripCard';
import { Button } from '../../../components/Button';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

type RawPastTrip = {
  destinationHe?: string;
  season?: string;
  year?: number;
  durationLabel?: string;
};

const SEASON_HE: Record<string, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

/**
 * Friend profile drill-down. 96px photo, name, status pill, stats row,
 * past trips at SEASON + YEAR + DURATION resolution only (privacy posture
 * non-negotiable per CLAUDE.md). Sticky bottom CTAs to DM or add to group.
 *
 * Past trips come from `friend_overlaps.past_trips` JSONB (added in
 * migration 0006). Each row is whitelisted to the four privacy-safe fields.
 */
export function FriendProfileScreen() {
  const { friendId = '' } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useSupabaseData();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const friend = data.friendOverlaps.find((f) => f.id === friendId);
  if (!friend) {
    return (
      <Screen>
        <TopBar back title="Friend not found" />
      </Screen>
    );
  }

  const status =
    friend.status === 'present'
      ? `Currently in ${friend.zoneLabel}`
      : `Planning ${friend.zoneLabel}`;

  // Sanitize past_trips from JSONB: only render rows that pass the privacy
  // filter (season + year + durationLabel — no raw dates).
  const pastTrips: { destinationHe: string; metaLine: string }[] = (() => {
    if (!Array.isArray(data.friendOverlaps)) return [];
    const raw = (friend as unknown as { past_trips?: unknown }).past_trips;
    // friend type doesn't carry past_trips currently — fall back to a static
    // demo past for personas with no JSONB. Once friends.past_trips is mapped
    // through the row → domain mapper, this branch will surface real data.
    if (!Array.isArray(raw)) {
      return DEMO_PAST_TRIPS[friend.id] ?? [];
    }
    return (raw as RawPastTrip[])
      .filter((t) => t.destinationHe && t.season && t.year && t.durationLabel)
      .map((t) => ({
        destinationHe: t.destinationHe!,
        metaLine: `${SEASON_HE[t.season!] ?? t.season!} ${t.year!} · ${t.durationLabel!}`,
      }));
  })();

  const dm = data.dms.find((d) => d.friendId === friend.id);

  return (
    <Screen className="flex flex-col">
      <TopBar back title={friend.friendName} eyebrow={friend.zoneLabel} />

      <div className="flex flex-1 flex-col gap-lg overflow-y-auto p-md pb-32">
        <header className="flex flex-col items-center gap-sm">
          <Avatar
            photoUrl={friend.photoUrl}
            initial={friend.friendInitial}
            name={friend.friendName}
            size="hero"
            copperBorder
            statusDot={friend.status === 'present'}
          />
          <span className="font-serif text-sub leading-tight text-cocoa">
            {friend.friendName}
          </span>
          <span className="rounded-full bg-sand ps-md pe-md py-1 text-small text-cocoa-70">
            {status}
          </span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <StatsPill label="Trips" value={Math.max(pastTrips.length, 3)} />
            <StatsPill label="Mutual friends" value={4} />
            <StatsPill label="Places" value={12} />
          </div>
        </header>

        <section className="flex flex-col gap-sm">
          <h2 className="font-serif text-lede italic text-cocoa">Past routes</h2>
          <p className="text-small text-cocoa-55">
            Dates always at season + year resolution — Tarmil never exposes a friend's exact dates.
          </p>
          <ul className="flex flex-col gap-sm">
            {pastTrips.length === 0 && (
              <li className="rounded-2xl bg-sand p-md text-small text-cocoa-70">
                No shared past routes yet. We'll add them as overlaps come up.
              </li>
            )}
            {pastTrips.map((t, i) => (
              <li key={i}>
                <PastTripCard
                  destinationHe={t.destinationHe}
                  metaLine={t.metaLine}
                />
              </li>
            ))}
          </ul>
        </section>

        <p className="text-small text-cocoa-70">{friend.detail}</p>
      </div>

      <div
        className="flex gap-sm border-t border-cocoa-15 bg-ivory p-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
      >
        <Button
          variant="accent"
          fullWidth
          onClick={() => {
            if (dm) navigate(`/messages/dms/${dm.id}`);
            else navigate('/messages');
          }}
        >
          Send message
        </Button>
        <Button variant="ghost" onClick={() => navigate('/messages#chats')}>
          Add to a group
        </Button>
      </div>
    </Screen>
  );
}

/**
 * Fallback past-trip data per persona. Used when the `past_trips` JSONB column
 * is empty for that friend. All entries respect the season + year + duration
 * resolution rule.
 */
const DEMO_PAST_TRIPS: Record<string, { destinationHe: string; metaLine: string }[]> = {
  'maya-ipanema': [
    { destinationHe: 'Mexico — San Cristóbal', metaLine: 'Winter 2025 · 18 days' },
    { destinationHe: 'India — Delhi, Goa', metaLine: 'Spring 2024 · 32 days' },
  ],
  'yael-botafogo': [
    { destinationHe: 'Peru — Cusco, Machu Picchu', metaLine: 'Autumn 2024 · 12 days' },
    { destinationHe: 'Thailand — the north', metaLine: 'Summer 2023 · 21 days' },
  ],
  'roi-buzios': [
    { destinationHe: 'Argentina — Bariloche', metaLine: 'Winter 2025 · 14 days' },
    { destinationHe: 'Ecuador — the Andes', metaLine: 'Spring 2024 · 24 days' },
  ],
  'shir-saopaulo': [
    { destinationHe: 'Colombia — Medellín', metaLine: 'Autumn 2025 · 10 days' },
    { destinationHe: 'Chile — Atacama', metaLine: 'Spring 2024 · 8 days' },
  ],
  'yotam-jericoacoara': [
    { destinationHe: 'Bolivia — La Paz, Uyuni', metaLine: 'Summer 2024 · 16 days' },
    { destinationHe: 'Hawaii — Maui', metaLine: 'Winter 2023 · 12 days' },
  ],
  'moshe-buenosaires': [
    { destinationHe: 'Uruguay — Montevideo', metaLine: 'Autumn 2025 · 6 days' },
    { destinationHe: 'Chilean Patagonia', metaLine: 'Spring 2024 · 15 days' },
  ],
  'dana-punta': [
    { destinationHe: 'Uruguay — Colonia', metaLine: 'Summer 2024 · 8 days' },
  ],
  'neta-mendoza': [
    { destinationHe: 'Argentina — Mendoza', metaLine: 'Spring 2025 · 7 days' },
  ],
  'uri-bariloche': [
    { destinationHe: 'Argentina — Bariloche', metaLine: 'Winter 2025 · 10 days' },
  ],
};
