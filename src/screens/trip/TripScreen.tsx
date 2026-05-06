import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { RioMap } from '../../components/RioMap';

/**
 * Trip tab — the app's hero.
 *
 * Hosts the Rio de Janeiro map full-bleed below the TopBar. The user's trip
 * line is drawn on the map; tapping a place or friend overlay slides up a
 * preview sheet, with a "פרטים מלאים" button into the full place detail.
 */
export function TripScreen() {
  return (
    <Screen noScroll>
      <div className="flex h-full flex-col">
        <TopBar eyebrow="Tarmil" title="המסע שלך" />
        <div className="relative flex-1">
          <RioMap />
        </div>
      </div>
    </Screen>
  );
}
