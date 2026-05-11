import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Coins,
  ListChecks,
  Languages,
  ScanText,
  ScanLine,
  Wallet,
  Smartphone,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { StatsPill } from '../../components/profile/StatsPill';
import { FriendGridItem } from '../../components/profile/FriendGridItem';
import { PastTripCard } from '../../components/profile/PastTripCard';
import {
  ToolDetailSheet,
  type ToolId,
} from '../../components/profile/ToolDetailSheet';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

type Tool = {
  id: ToolId;
  name: string;
  meta: string;
  Icon: LucideIcon;
};

const TOOLS: Tool[] = [
  { id: 'currency', name: 'ממיר מטבעות', meta: 'עובד גם בלי רשת', Icon: Coins },
  { id: 'checklist', name: 'צ׳ק ליסט לפני יציאה', meta: 'ויזה, חיסונים, ביטוח', Icon: ListChecks },
  { id: 'voice', name: 'מתרגם קולי', meta: 'דיבור-לדיבור, מיידי', Icon: Languages },
  { id: 'menu', name: 'מתרגם תפריט', meta: 'סורק רכיבים והעדפות', Icon: ScanText },
  { id: 'signs', name: 'סורק שלטים', meta: 'מתרגם שילוט בזמן אמת', Icon: ScanLine },
  { id: 'balances', name: 'יתרות בין חברים', meta: 'חוב פתוח בין שני חברים', Icon: Wallet },
  { id: 'esim', name: 'eSIM וגלישה', meta: 'תמיכה בעברית בחו״ל', Icon: Smartphone },
  { id: 'jewish', name: 'כלים יהודיים', meta: 'חב״ד, כשרות, שבת', Icon: Star },
];

/**
 * Profile tab. Four editorial sections — route, past trips, friends in network,
 * and a tools shelf. The gear icon in the top bar routes to /profile/settings.
 *
 * Tools moved out of the global top-bar wrench so the chrome can breathe.
 * Tapping a tool opens its mock detail in a portaled bottom-attached modal.
 */
export function ProfileScreen() {
  const { data, loading, error } = useSupabaseData();
  const [openTool, setOpenTool] = useState<ToolId | null>(null);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  // Quick stats derived from existing data — countries via destination_id of
  // planned_stops + past leg seeding, places visited via friends_know-style
  // count, total nights from planned_stops.
  const countriesCount = (() => {
    const stops = data.plannedStops.map((s) => s.id);
    return new Set(
      stops.map((id) => {
        if (id === 'buenos-aires' || id === 'punta-del-este') return 'sa';
        return 'br';
      }),
    ).size;
  })();
  const placesCount = data.places.length;
  const totalNights = data.plannedStops.reduce((acc, s) => acc + s.nights, 0);

  const friendsForGrid = data.friendOverlaps.slice(0, 6);

  return (
    <Screen>
      <TopBar
        eyebrow="Tarmil"
        title="פרופיל"
        end={
          <Link
            to="/profile/settings"
            aria-label="הגדרות"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </Link>
        }
      />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <header className="flex flex-col items-center gap-sm">
          <Avatar
            photoUrl={null}
            initial="נ"
            name="נסים גז"
            size="hero"
            copperBorder
          />
          <span className="font-serif text-sub leading-tight text-cocoa">
            נסים גז
          </span>
          <span className="text-small text-cocoa-55">מטייל מאז קיץ 2024</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <StatsPill label="ארצות" value={countriesCount + 2} />
            <StatsPill label="מקומות" value={placesCount} />
            <StatsPill label="לילות מתוכננים" value={totalNights} />
          </div>
        </header>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Your route." />
          <Link
            to="/trip"
            className="flex items-center justify-between gap-sm rounded-md border border-cocoa-15 bg-sand p-md transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate font-serif text-lede italic text-cocoa">
                המסלול שלך
              </span>
              <span className="text-small text-cocoa-70">
                ריו עכשיו · 4 יעדים מתוכננים בלאטם
              </span>
            </span>
            <span className="meta-caps shrink-0 text-copper">פתח מפה</span>
          </Link>
        </section>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="02" label="Past trips." />
          <ul className="flex flex-col gap-sm">
            <li>
              <PastTripCard
                destinationHe="ברזיל — ריו, פטרופוליס"
                metaLine="חורף 2026 · 21 ימים"
                flag="🇧🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="דרום־מזרח אסיה"
                metaLine="סתיו 2025 · בנגקוק, קראבי, צ׳יאנג מאי"
                flag="🇹🇭"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="קוט ד׳אזור"
                metaLine="קיץ 2025 · ניס, קאן, מונקו"
                flag="🇫🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="יוון — הקיקלאדס"
                metaLine="קיץ 2024 · אתונה, סנטוריני, מיקונוס"
                flag="🇬🇷"
              />
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-sm">
          <div className="flex items-baseline justify-between">
            <SectionLabel number="03" label="Friends in network." />
            <Link
              to="/profile/friends"
              className="text-small text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85"
            >
              ראה הכל
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-sm">
            {friendsForGrid.map((f) => (
              <li key={f.id}>
                <FriendGridItem friend={f} />
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="04" label="Tools for the road." />
          <p className="text-small text-cocoa-70">
            כלים יומיומיים לטיול בחו״ל. כל כלי עומד לבד — נפתח, בשימוש, נסגר.
          </p>
          <ul className="grid grid-cols-2 gap-sm">
            {TOOLS.map(({ id, name, meta, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setOpenTool(id)}
                  className="flex h-full w-full flex-col items-start gap-xs rounded-md border border-cocoa-15 bg-ivory p-md text-start transition-colors duration-instant ease-out-quart active:bg-cocoa-08"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-ivory">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="font-serif text-body italic leading-tight text-cocoa">
                    {name}
                  </span>
                  <span className="text-small leading-tight text-cocoa-55">
                    {meta}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ToolDetailSheet
        toolId={openTool}
        onClose={() => setOpenTool(null)}
      />
    </Screen>
  );
}
