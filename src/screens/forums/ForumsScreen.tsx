import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ToolsButton } from '../../components/shared/ToolsButton';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SearchBar } from '../../components/shared/SearchBar';
import { CityForumGroup, RecommendedForumRow } from '../../components/forums/ForumRow';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

/**
 * Forums tab landing. Brief §04 promotes Forums to a top-level tab.
 *
 * City × Subject (5 subjects per city) — joined cities render as grouped
 * sand cards with stacked subject pills; "Recommended for you" surfaces
 * cities the user hasn't joined yet with a one-tap Join CTA.
 *
 * Search filters by city label OR subject label so typing "kosher" or
 * "rio" both narrow as expected.
 */
export function ForumsScreen() {
  const { data, loading, error, joinForum } = useSupabaseData();
  const [query, setQuery] = useState('');

  const lastThreadByForum = useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    for (const t of data.forumThreads) {
      if (!map.has(t.forumId)) map.set(t.forumId, t.title);
    }
    return map;
  }, [data]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const lowerQuery = query.trim().toLowerCase();
  const matches = (text: string) =>
    !lowerQuery || text.toLowerCase().includes(lowerQuery);

  type CityGroup = { cityLabel: string; forums: typeof data.forums };
  const joinedCityGroups: CityGroup[] = (() => {
    const groups = new Map<string, CityGroup>();
    for (const f of data.forums) {
      if (f.isRecommended) continue;
      const cityLabel = f.cityLabel ?? f.nameEn;
      if (!matches(cityLabel) && !matches(f.nameEn)) continue;
      const existing = groups.get(cityLabel);
      if (existing) {
        existing.forums.push(f);
      } else {
        groups.set(cityLabel, { cityLabel, forums: [f] });
      }
    }
    return Array.from(groups.values());
  })();

  const recommendedForums = data.forums
    .filter((f) => f.isRecommended)
    .filter((f) => matches(f.cityLabel ?? f.nameEn));

  return (
    <Screen>
      <TopBar
        title="Forums"
        end={
          <div className="flex items-center gap-0.5">
            <ToolsButton />
            <ProfileAvatarButton initial="N" name="Nissim Guez" />
          </div>
        }
      />

      <div className="flex flex-col gap-md p-md pb-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search a city or subject"
        />

        <p className="text-small leading-snug text-cocoa-70">
          One forum per (city × subject). Anyone verified can post —
          choose full name or anonymous each time.
        </p>

        <ul className="flex flex-col gap-md">
          {joinedCityGroups.map((group) => (
            <li key={group.cityLabel}>
              <CityForumGroup
                cityLabel={group.cityLabel}
                forums={group.forums}
                previewByForumId={lastThreadByForum}
              />
            </li>
          ))}
        </ul>

        {recommendedForums.length > 0 && (
          <>
            <span className="meta-caps text-cocoa-55">Recommended for you</span>
            <ul className="flex flex-col gap-sm">
              {recommendedForums.map((f) => (
                <li key={f.id}>
                  <RecommendedForumRow
                    forum={f}
                    onJoin={() => joinForum(f.id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Screen>
  );
}
