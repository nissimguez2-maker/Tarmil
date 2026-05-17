import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';

/**
 * Plan tab stub. PR2 of the v0.8 series fills this in — sections for
 * Right now / Upcoming / Saved (unsorted) / Past, plus the + Discover
 * FAB that opens the old AroundScreen content as a modal sheet.
 */
export function PlanScreen() {
  return (
    <Screen>
      <TopBar
        title="Plan"
        end={<ProfileAvatarButton initial="N" name="Nissim Guez" />}
      />
      <div className="flex flex-col gap-md p-md pb-xl">
        <p className="text-small leading-snug text-cocoa-70">
          Plan is being built. Saved places, your upcoming trips, and a
          one-tap Discover sheet land here next.
        </p>
      </div>
    </Screen>
  );
}
