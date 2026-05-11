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
 * 1:1 DM thread. Same shell as the group chat, scoped to a single friend.
 * Friend's avatar shows up in the TopBar's `end` slot so the user knows who
 * they're talking to even mid-scroll.
 */
export function DMScreen() {
  const { dmId = '' } = useParams<{ dmId: string }>();
  const { data, loading, error, sendDM } = useSupabaseData();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const dm = data?.dms.find((d) => d.id === dmId);
  const friend = dm
    ? data?.friendOverlaps.find((f) => f.id === dm.friendId)
    : undefined;
  const messages = useMemo(
    () => (data ? data.dmMessages.filter((m) => m.dmThreadId === dmId) : []),
    [data, dmId],
  );

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ block: 'end' });
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;
  if (!dm) {
    return (
      <Screen>
        <TopBar back title="הודעה לא נמצאה" />
      </Screen>
    );
  }

  return (
    <Screen className="flex flex-col">
      <TopBar
        back
        title={friend?.friendName ?? 'חבר'}
        eyebrow={friend?.zoneLabel}
        end={
          friend ? (
            <Avatar
              photoUrl={friend.photoUrl}
              initial={friend.friendInitial}
              name={friend.friendName}
              size="sm"
              statusDot={friend.status === 'present'}
            />
          ) : null
        }
      />

      <div className="flex flex-1 flex-col gap-sm overflow-y-auto p-md">
        {messages.map((m) => (
          <MessageBubble key={m.id} self={!m.fromFriend}>
            {m.body}
          </MessageBubble>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={(body) => sendDM(dm.id, body)} />
    </Screen>
  );
}
