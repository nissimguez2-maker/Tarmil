import { useParams } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { StatsPill } from '../../components/profile/StatsPill';
import { PastTripCard } from '../../components/profile/PastTripCard';
import { PingButton } from '../../components/friends/PingButton';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

type RawPastTrip = {
  destinationHe?: string;
  season?: string;
  year?: number;
  durationLabel?: string;
};

const SEASON_LABEL: Record<string, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

/**
 * Friend profile drill-down. 96px photo, name, status pill, stats row,
 * past trips at SEASON + YEAR + DURATION resolution only (brief §02
 * Privacy-first; CLAUDE.md hard rule). Sticky bottom CTA is a Ping.
 *
 * No DM CTA — brief §06 removes direct messages entirely. Conversation
 * happens on whatever channel the user and friend already share.
 *
 * Past trips come from `friend_overlaps.past_trips` JSONB (migration 0006).
 * Each row is whitelisted to the four privacy-safe fields.
 */
export function FriendProfileScreen() {
  const { friendId = '' } = useParams<{ friendId: string }>();
  const { data, loading, error, sendPing } = useSupabaseData();

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

  const pastTrips: { destinationHe: string; metaLine: string }[] = (() => {
    const raw = (friend as unknown as { past_trips?: unknown }).past_trips;
    if (!Array.isArray(raw)) {
      return DEMO_PAST_TRIPS[friend.id] ?? [];
    }
    return (raw as RawPastTrip[])
      .filter((t) => t.destinationHe && t.season && t.year && t.durationLabel)
      .map((t) => ({
        destinationHe: t.destinationHe!,
        metaLine: `${SEASON_LABEL[t.season!] ?? t.season!} ${t.year!} · ${t.durationLabel!}`,
      }));
  })();

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
            Dates always at season + year resolution — Tarmil never exposes
            a friend's exact dates.
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
        className="flex items-center justify-end gap-sm border-t border-cocoa-15 bg-ivory p-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
      >
        <span className="me-auto text-small leading-snug text-cocoa-55">
          One ping per co-presence event.
        </span>
        <PingButton
          pinged={data.pings.some(
            (p) => p.friendId === friend.id && p.direction === 'sent',
          )}
          onPing={() => sendPing(friend.id)}
        />
      </div>
    </Screen>
  );
}

const DEMO_PAST_TRIPS: Record<
  string,
  { destinationHe: string; metaLine: string }[]
> = {
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
