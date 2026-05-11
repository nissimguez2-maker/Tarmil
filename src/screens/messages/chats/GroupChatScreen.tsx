import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';
import { MessageBubble } from '../../../components/messages/MessageBubble';
import { MessageComposer } from '../../../components/messages/MessageComposer';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

/**
 * Group chat detail. Message bubbles ordered chronologically (oldest top,
 * newest bottom). Auto-scrolls to the bottom on mount and when messages
 * change so the latest message stays in view.
 *
 * "Self" messages (author_friend_id = null) render in copper-70 on the end
 * side; friend messages in sand on the start side with their avatar.
 */
export function GroupChatScreen() {
  const { chatId = '' } = useParams<{ chatId: string }>();
  const { data, loading, error, sendGroupMessage } = useSupabaseData();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chat = data?.groupChats.find((c) => c.id === chatId);
  const messages = useMemo(
    () => (data ? data.groupMessages.filter((m) => m.chatId === chatId) : []),
    [data, chatId],
  );
  const memberIds = useMemo(
    () =>
      data
        ? data.groupChatMembers
            .filter((m) => m.chatId === chatId)
            .map((m) => m.friendId)
        : [],
    [data, chatId],
  );

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  // Suppress initial scroll-jump on cold mount by deferring focus.
  useEffect(() => {
    const t = window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ block: 'end' });
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;
  if (!chat) {
    return (
      <Screen>
        <TopBar back title="קבוצה לא נמצאה" />
      </Screen>
    );
  }

  return (
    <Screen className="flex flex-col">
      <TopBar
        back
        title={chat.nameHe}
        eyebrow={`${memberIds.length} משתתפים`}
      />

      <div className="flex flex-1 flex-col gap-sm overflow-y-auto p-md">
        {messages.map((m) => {
          const isSelf = m.authorFriendId === null;
          const friend = data.friendOverlaps.find(
            (f) => f.id === m.authorFriendId,
          );
          return (
            <MessageBubble
              key={m.id}
              self={isSelf}
              authorName={!isSelf ? friend?.friendName : undefined}
              leading={
                !isSelf && friend ? (
                  <Avatar
                    photoUrl={friend.photoUrl}
                    initial={friend.friendInitial}
                    name={friend.friendName}
                    size="xs"
                  />
                ) : undefined
              }
            >
              {m.body}
            </MessageBubble>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={(body) => sendGroupMessage(chat.id, body)} />
    </Screen>
  );
}
