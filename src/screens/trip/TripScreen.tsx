import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { PlaceCard } from '../../components/PlaceCard';
import { Dunes } from '../../components/Dunes';

/**
 * Placeholder for the Trip tab — the app's hero.
 *
 * Final design (later PR): continent-scale stylized SVG map with the user's
 * trip line (solid past / bright present / dashed future), curated places
 * hugging the line, friend overlap bubbles where trips touch.
 */
export function TripScreen() {
  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="המסע שלך" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Where you've been." />

        <p className="max-w-lede font-serif text-lede leading-snug text-cocoa">
          המסע שלך נמתח על פני יבשת — הקו שמאחוריך, המקום שאתה בו עכשיו,
          והמקומות שתכננת קדימה.
        </p>

        <p className="max-w-body text-body text-cocoa-70">
          המפה המאוירת המלאה תיבנה בגרסה הבאה. בינתיים זה הבסיס: צבעים, גופנים,
          מסגרת iPhone, ניווט RTL, רכיבי בסיס.
        </p>

        <SectionLabel number="02" label="Curated places." />

        <div className="flex flex-col gap-sm">
          <PlaceCard
            name="קפה גדעון"
            meta="קפה · בנגקוק"
            rating={4.6}
            friendsKnow={3}
            tarmilPick
          />
          <PlaceCard
            name="הוסטל פנגיה"
            meta="הוסטל · קסול"
            rating={4.3}
            friendsKnow={7}
          />
        </div>
      </div>

      <div className="mt-lg h-[64px] w-full">
        <Dunes />
      </div>
    </Screen>
  );
}
