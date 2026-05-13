import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SubNav } from '../../components/shared/SubNav';
import { SearchBar } from '../../components/shared/SearchBar';
import { ForumRow } from '../../components/messages/ForumRow';
import { GroupChatRow } from '../../components/messages/GroupChatRow';
import { DMRow } from '../../components/messages/DMRow';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { GroupMessage } from '../../data/groupMessages';

type SubTab = 'forums' | 'chats' | 'dms';

const TABS = [
  { id: 'forums' as const, label: 'Forums' },
  { id: 'chats' as const, label: 'Groups' },
  { id: 'dms' as const, label: 'Messages' },
];

/**
 * Messages tab landing screen. Sub-nav switches between three lists; a
 * single search bar above filters by Hebrew substring across the active
 * list's primary names.
 *
 * Initial sub-tab is read from the URL hash so back-button navigation
 * preserves the user's section. The hash is updated on switch, replace not
 * push, so the back button doesn't snowshoe through sub-tabs.
 */
export function MessagesScreen() {
  const { data, loading, error, joinForum } = useSupabaseData();
  const initialTab: SubTab = (() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'chats' || hash === 'dms' || hash === 'forums') return hash;
    return 'forums';
  })();
  const [active, setActive] = useState<SubTab>(initialTab);
  const [query, setQuery] = useState('');

  const onChangeTab = (id: SubTab) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const lastThreadByForum = useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    for (const t of data.forumThreads) {
      if (!map.has(t.forumId)) map.set(t.forumId, t.title);
    }
    return map;
  }, [data]);

  const lastMessageByChat = useMemo(() => {
    const map = new Map<string, GroupMessage>();
    if (!data) return map;
    // groupMessages are ordered chronologically; iterate forward and overwrite
    // so the final write per chat is the newest.
    for (const m of data.groupMessages) {
      map.set(m.chatId, m);
    }
    return map;
  }, [data]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const lowerQuery = query.trim().toLowerCase();
  const matches = (text: string) =>
    !lowerQuery || text.toLowerCase().includes(lowerQuery);

  const joinedForums = data.forums
    .filter((f) => !f.isRecommended)
    .filter((f) => matches(f.nameHe));
  const recommendedForums = data.forums
    .filter((f) => f.isRecommended)
    .filter((f) => matches(f.nameHe));
  const chats = data.groupChats.filter((c) => matches(c.nameHe));
  const dms = data.dms.filter((d) => {
    const friend = data.friendOverlaps.find((f) => f.id === d.friendId);
    return friend ? matches(friend.friendName) : false;
  });

  return (
    <Screen>
      <TopBar title="Messages" />

      <SubNav items={TABS} active={active} onChange={onChangeTab} />

      <div className="flex flex-col gap-md p-md">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search forum, group or friend"
        />

        {active === 'forums' && (
          <>
            <ul className="flex flex-col gap-sm">
              {joinedForums.map((f) => (
                <li key={f.id}>
                  <ForumRow
                    forum={f}
                    previewTitle={lastThreadByForum.get(f.id)}
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
                      <ForumRow
                        forum={f}
                        recommended
                        onJoin={() => joinForum(f.id)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        {active === 'chats' && (
          <ul className="flex flex-col gap-sm">
            {chats.map((c) => {
              const memberIds = data.groupChatMembers
                .filter((m) => m.chatId === c.id)
                .map((m) => m.friendId);
              const members = memberIds
                .map((id) => data.friendOverlaps.find((f) => f.id === id))
                .filter((f): f is NonNullable<typeof f> => !!f);
              return (
                <li key={c.id}>
                  <GroupChatRow
                    chat={c}
                    members={members}
                    lastMessage={lastMessageByChat.get(c.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {active === 'dms' && (
          <ul className="flex flex-col gap-sm">
            {dms.map((d) => (
              <li key={d.id}>
                <DMRow
                  dm={d}
                  friend={data.friendOverlaps.find((f) => f.id === d.friendId)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
