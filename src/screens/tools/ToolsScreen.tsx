import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { ToolsGrid } from '../../components/tools/ToolsGrid';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';

/**
 * Standalone Tools route. Tools also live in the TopBar wrench on every
 * tab-root, but this route stays so direct links to /tools keep working
 * (and the route shows the same content with a slightly fuller framing).
 */
export function ToolsScreen() {
  return (
    <Screen>
      <TopBar title="Tools" end={<ProfileAvatarButton initial="N" name="Nissim Guez" />} />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Tools for the road." />
          <p className="max-w-body text-small leading-snug text-charcoal-70">
            Everyday tools for trips abroad. Each one stands alone — open, use,
            close. Works offline too.
          </p>
        </section>

        <ToolsGrid />
      </div>
    </Screen>
  );
}
