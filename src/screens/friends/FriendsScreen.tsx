import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ToolsButton } from '../../components/shared/ToolsButton';

/**
 * Friends tab stub. Replaced in Chunk 2 with the real four-sub-section
 * implementation (Overlaps · Activity wall · Ping · Friends list).
 */
export function FriendsScreen() {
  return (
    <Screen>
      <TopBar title="Friends" end={<ToolsButton />} />
      <div className="flex flex-col gap-md p-md pb-xl">
        <p className="text-small leading-snug text-cocoa-70">
          Friends is being rebuilt. Overlaps, Activity wall, Ping, and the
          Friends list all land here next.
        </p>
      </div>
    </Screen>
  );
}
