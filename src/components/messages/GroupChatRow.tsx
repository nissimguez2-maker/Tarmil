import { Link } from 'react-router-dom';
import type { GroupChat } from '../../data/groupChats';
import type { FriendOverlap } from '../../data/myTrip';
import type { GroupMessage } from '../../data/groupMessages';
import { Avatar } from '../shared/Avatar';

type Props = {
  chat: GroupChat;
  /** Friend rows that are members of the chat. */
  members: FriendOverlap[];
  /** Latest message in the chat, for the preview line. */
  lastMessage?: GroupMessage;
  /** When the last message is `null` author, show the user's display string. */
  selfLabel?: string;
};

/**
 * List row for a group chat. Composite avatar: stacked overlapping photos of
 * up to 3 members. Last-message preview is prefixed with the sender's name.
 */
export function GroupChatRow({ chat, members, lastMessage, selfLabel = 'אני' }: Props) {
  const previewMembers = members.slice(0, 3);
  const senderName = (() => {
    if (!lastMessage) return null;
    if (lastMessage.authorFriendId === null) return selfLabel;
    const m = members.find((f) => f.id === lastMessage.authorFriendId);
    return m?.friendName.split(' ')[0] ?? null;
  })();

  return (
    <Link
      to={`/messages/chats/${chat.id}`}
      className="flex items-center gap-3 rounded-md border border-cocoa-15 bg-ivory p-md hover:bg-sand/40 active:bg-sand/60"
    >
      <span className="relative inline-flex h-12 w-12 shrink-0 items-center">
        {previewMembers.map((m, i) => (
          <Avatar
            key={m.id}
            photoUrl={m.photoUrl}
            initial={m.friendInitial}
            name={m.friendName}
            size="sm"
            className={i === 0 ? '' : '-ms-2'}
          />
        ))}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-serif text-lede italic text-cocoa">
          {chat.nameHe}
        </span>
        {lastMessage && (
          <span className="line-clamp-1 text-[10pt] text-cocoa-70">
            {senderName ? `${senderName}: ` : ''}
            {lastMessage.body}
          </span>
        )}
      </div>
    </Link>
  );
}
