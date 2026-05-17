import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ToolsButton } from '../../components/shared/ToolsButton';

/**
 * Forums tab stub. Replaced in Chunk 3 with the real city-grouped forum
 * list lifted from MessagesScreen.
 */
export function ForumsScreen() {
  return (
    <Screen>
      <TopBar title="Forums" end={<ToolsButton />} />
      <div className="flex flex-col gap-md p-md pb-xl">
        <p className="text-small leading-snug text-cocoa-70">
          Forums is being promoted to a top-level tab. City and subject
          forums land here next.
        </p>
      </div>
    </Screen>
  );
}
