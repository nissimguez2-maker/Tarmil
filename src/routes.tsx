import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { TripDetailScreen } from './screens/trip/TripDetailScreen';
import { ActivityScreen } from './screens/activity/ActivityScreen';
import { PlanScreen } from './screens/plan/PlanScreen';
import { ForumsScreen } from './screens/forums/ForumsScreen';
import { ForumScreen } from './screens/forums/ForumScreen';
import { ForumThreadScreen } from './screens/forums/ForumThreadScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { FriendsListScreen } from './screens/profile/FriendsListScreen';
import { FriendProfileScreen } from './screens/profile/FriendProfileScreen';
import { SettingsScreen } from './screens/profile/settings/SettingsScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';
import { ToolsScreen } from './screens/tools/ToolsScreen';
import { ModeToggleScreen } from './screens/web/ModeToggleScreen';
import { WebPlannerScreen } from './screens/web/WebPlannerScreen';

/**
 * Route table — v0.8 IA.
 *
 * Tabs (5):
 *   /trip       — TripScreen (map + planned stops + friend bubbles)
 *   /plan       — PlanScreen (saved places spine, opens Discover modal)
 *   /activity   — ActivityScreen (the social feed)
 *   /forums     — ForumsScreen (city × subject)
 *   /tools      — ToolsScreen (utility tiles)
 *
 * Profile drills from the top-right avatar on every tab:
 *   /profile             — ProfileScreen (off-grid, route, past trips, privacy)
 *   /profile/friends     — FriendsListScreen (manage relationships)
 *   /profile/friend/:id  — FriendProfileScreen (single friend)
 *   /profile/settings    — SettingsScreen (account + privacy + notifications)
 *
 * Legacy paths redirect to their new homes for any in-flight links.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone full-viewport screens — OUTSIDE AppLayout so they don't
          inherit the DeviceFrame + TabBar phone chrome. */}
      <Route path="/" element={<ModeToggleScreen />} />
      <Route path="/web" element={<WebPlannerScreen />} />

      <Route element={<AppLayout />}>
        <Route path="/trip" element={<TripScreen />} />
        <Route path="/trip/stop/:plannedStopId" element={<TripDetailScreen />} />
        <Route path="/place/:id" element={<PlaceScreen />} />

        <Route path="/activity" element={<ActivityScreen />} />
        <Route path="/plan" element={<PlanScreen />} />

        {/* Legacy Around route — redirects to Plan (its content lives in
            the + Discover modal inside Plan after the v0.8 pivot). */}
        <Route path="/around" element={<Navigate to="/plan" replace />} />

        <Route path="/forums" element={<ForumsScreen />} />
        <Route path="/forums/:forumId" element={<ForumScreen />} />
        <Route
          path="/forums/:forumId/:threadId"
          element={<ForumThreadScreen />}
        />

        <Route path="/tools" element={<ToolsScreen />} />

        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/friends" element={<FriendsListScreen />} />
        <Route
          path="/profile/friend/:friendId"
          element={<FriendProfileScreen />}
        />
        <Route path="/profile/settings" element={<SettingsScreen />} />

        {/* Legacy redirects. */}
        <Route path="/friends" element={<Navigate to="/activity" replace />} />
        <Route
          path="/friends/friend/:friendId"
          element={<LegacyFriendProfileRedirect />}
        />
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

        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}

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
  return <Navigate to={`/profile/friend/${friendId}`} replace />;
}
