import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { TripDetailScreen } from './screens/trip/TripDetailScreen';
import { FriendsScreen } from './screens/friends/FriendsScreen';
import { ForumsScreen } from './screens/forums/ForumsScreen';
import { ForumScreen } from './screens/messages/forums/ForumScreen';
import { ForumThreadScreen } from './screens/messages/forums/ForumThreadScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { FriendProfileScreen } from './screens/friends/FriendProfileScreen';
import { SettingsScreen } from './screens/profile/settings/SettingsScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';
import { ToolsScreen } from './screens/tools/ToolsScreen';

/**
 * Route table.
 *
 * Tabs (5):
 *   /trip       — TripScreen (map + planned route)
 *   /friends    — FriendsScreen (Overlaps · Activity · Ping · List)
 *   /forums     — ForumsScreen (city × subject)
 *   /tools      — ToolsScreen (utility tiles, incl. Places nearby)
 *   /profile    — ProfileScreen
 *
 * Drill-downs nest under their parent tab folder in src/screens/.
 *
 * Legacy paths (`/activity`, `/messages/*`, `/around`, `/profile/friends`)
 * redirect to their new homes for any deep-links investors may have
 * bookmarked. Chunks 2–5 replace the stubs with real screens.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/trip" replace />} />

        <Route path="/trip" element={<TripScreen />} />
        <Route path="/trip/stop/:plannedStopId" element={<TripDetailScreen />} />
        <Route path="/place/:id" element={<PlaceScreen />} />

        <Route path="/friends" element={<FriendsScreen />} />
        <Route
          path="/friends/friend/:friendId"
          element={<FriendProfileScreen />}
        />

        <Route path="/forums" element={<ForumsScreen />} />
        <Route path="/forums/:forumId" element={<ForumScreen />} />
        <Route
          path="/forums/:forumId/:threadId"
          element={<ForumThreadScreen />}
        />

        <Route path="/tools" element={<ToolsScreen />} />

        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/settings" element={<SettingsScreen />} />

        {/* Legacy redirects — preserved so any in-flight links keep working. */}
        <Route path="/activity" element={<Navigate to="/friends#activity" replace />} />
        <Route path="/messages" element={<Navigate to="/forums" replace />} />
        <Route
          path="/messages/forums/:forumId"
          element={<LegacyForumRedirect />}
        />
        <Route
          path="/messages/forums/:forumId/:threadId"
          element={<LegacyForumThreadRedirect />}
        />
        <Route path="/messages/*" element={<Navigate to="/forums" replace />} />
        <Route path="/around" element={<Navigate to="/tools" replace />} />
        <Route
          path="/profile/friends"
          element={<Navigate to="/friends#list" replace />}
        />
        <Route
          path="/profile/friend/:friendId"
          element={<LegacyFriendProfileRedirect />}
        />

        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}

// Tiny inline redirects so URL parameters survive the legacy-path move.
function LegacyForumRedirect() {
  const segments = window.location.pathname.split('/');
  const forumId = segments[3];
  return <Navigate to={`/forums/${forumId}`} replace />;
}

function LegacyForumThreadRedirect() {
  const segments = window.location.pathname.split('/');
  const forumId = segments[3];
  const threadId = segments[4];
  return <Navigate to={`/forums/${forumId}/${threadId}`} replace />;
}

function LegacyFriendProfileRedirect() {
  const segments = window.location.pathname.split('/');
  const friendId = segments[3];
  return <Navigate to={`/friends/friend/${friendId}`} replace />;
}
