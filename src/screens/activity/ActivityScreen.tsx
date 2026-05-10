import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

/**
 * Placeholder for the Activity tab.
 *
 * Final design (PR4): feed-style surface mixing friends' new declared trips,
 * city threads in declared destinations, and popular destination threads.
 * Each card opens to a thread detail at /activity/:threadId. Posting and
 * following land then; Realtime keeps replies live during demos.
 */
export function ActivityScreen() {
  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="פעילות" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="What's happening." />

        <p className="max-w-body text-body text-cocoa-70">
          פיד הפעילות יראה לך את החברים שהכריזו על טיול חדש, שיחות חיות בערים
          שיצא לך לבקר, ושרשורים פופולריים על יעדים בקורידור.
        </p>

        <p className="max-w-body text-body text-cocoa-55">
          בקרוב — שרשורים, תגובות, וטיולים שזה עתה הוכרזו.
        </p>
      </div>
    </Screen>
  );
}
