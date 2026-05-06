import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';

type Friend = {
  name: string;
  status: string;
  initial: string;
  here?: boolean;
};

const FRIENDS: Friend[] = [
  { name: 'מאיה לוי', status: 'בבנגקוק עכשיו · נפגשתם פעמיים', initial: 'מ', here: true },
  { name: 'דוד כהן', status: 'הצהיר על וייטנאם בנובמבר', initial: 'ד' },
  { name: 'נועה ברק', status: 'בקסול לפני שלושה ימים', initial: 'נ' },
];

/**
 * Placeholder for the Friends tab.
 *
 * Final design (later PR): friend list with overlap notifications,
 * "friends who know this place" entry points, friend detail with shared trip.
 */
export function FriendsScreen() {
  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="חברים" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Where trips touch." />

        <p className="max-w-body text-body text-cocoa-70">
          תמיד תראה רק את הרגעים שבהם הטיול שלך נוגע בטיול של חבר. לא היסטוריה,
          לא מעקב — רק חפיפה.
        </p>

        <ul className="flex flex-col gap-sm">
          {FRIENDS.map(({ name, status, initial, here }) => (
            <li
              key={name}
              className="flex items-center gap-md rounded-sm border border-cocoa-15 bg-sand p-md"
            >
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cocoa font-serif text-lede text-ivory"
                aria-hidden
              >
                {initial}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-2">
                  <span className="font-serif text-lede leading-tight">{name}</span>
                  {here && (
                    <span className="meta-caps text-copper">איתך כאן</span>
                  )}
                </span>
                <span className="text-[10pt] text-cocoa-55">{status}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  );
}
