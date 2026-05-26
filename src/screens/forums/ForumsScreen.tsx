import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SearchBar } from '../../components/shared/SearchBar';
import { CityForumGroup, RecommendedForumRow } from '../../components/forums/ForumRow';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

/**
 * Forums tab landing. City × Subject (8 subjects per city, v0.6).
 *
 * v0.6a: cities collapse by default. Tap a city header → expand to
 * reveal its 8 subject pills. Multiple cities can stay expanded.
 * Typing in search overrides the collapse state for any city that
 * matches — so search always shows the results without an extra tap.
 */
export function ForumsScreen() {
  const { data, loading, error, joinForum } = useSupabaseData();
  const [query, setQuery] = useState('');
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<string>>(
    new Set(),
  );

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
  const searching = lowerQuery.length > 0;
  const matches = (text: string) =>
    !searching || text.toLowerCase().includes(lowerQuery);

  type CityGroup = { cityLabel: string; forums: typeof data.forums };
  const joinedCityGroups: CityGroup[] = (() => {
    const groups = new Map<string, CityGroup>();
    for (const f of data.forums) {
      if (f.isRecommended) continue;
      const cityLabel = f.cityLabel ?? f.nameEn;
      // Match against city label OR subject label (forum.nameEn = subject label
      // after v0.6 since name_en is set to SUBJECT_LABEL[subject]).
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

  const isExpanded = (cityLabel: string) =>
    searching || manuallyExpanded.has(cityLabel);

  const toggleCity = (cityLabel: string) => {
    setManuallyExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cityLabel)) next.delete(cityLabel);
      else next.add(cityLabel);
      return next;
    });
  };

  return (
    <Screen>
      <TopBar
        title="Forums"
        end={<ProfileAvatarButton initial="N" name="Nissim Guez" />}
      />

      <div className="flex flex-col gap-md p-md pb-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search a city or subject"
        />

        <p className="text-small leading-snug text-charcoal-70">
          One forum per (city × subject). Anyone verified can post —
          choose full name or anonymous each time.
        </p>

        <ul className="flex flex-col gap-sm">
          {joinedCityGroups.map((group) => (
            <li key={group.cityLabel}>
              <CityForumGroup
                cityLabel={group.cityLabel}
                forums={group.forums}
                previewByForumId={lastThreadByForum}
                expanded={isExpanded(group.cityLabel)}
                onToggle={() => toggleCity(group.cityLabel)}
              />
            </li>
          ))}
        </ul>

        {recommendedForums.length > 0 && (
          <>
            <span className="meta-caps text-charcoal-55">Recommended for you</span>
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
