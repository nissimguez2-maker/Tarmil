import { Link } from 'react-router-dom';
import { Avatar } from './Avatar';

type Props = {
  initial: string;
  name: string;
  photoUrl?: string | null;
};

/**
 * Top-right avatar icon. Lives on every tab's TopBar end-slot and drills
 * to /profile. v0.6 promoted Profile out of the bottom nav into this
 * always-available header icon — frees the tab slot Around now occupies,
 * and matches the consumer-app pattern (Instagram, Twitter, Strava).
 */
export function ProfileAvatarButton({ initial, name, photoUrl }: Props) {
  return (
    <Link
      to="/profile"
      aria-label="Profile"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none hover:bg-cocoa-8 active:scale-95 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      <Avatar
        photoUrl={photoUrl}
        initial={initial}
        name={name}
        size="sm"
      />
    </Link>
  );
}
