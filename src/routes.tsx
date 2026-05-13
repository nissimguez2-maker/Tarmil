import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { TripDetailScreen } from './screens/trip/TripDetailScreen';
import { ActivityScreen } from './screens/activity/ActivityScreen';
import { MessagesScreen } from './screens/messages/MessagesScreen';
import { ForumScreen } from './screens/messages/forums/ForumScreen';
import { ForumThreadScreen } from './screens/messages/forums/ForumThreadScreen';
import { GroupChatScreen } from './screens/messages/chats/GroupChatScreen';
import { DMScreen } from './screens/messages/dms/DMScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { FriendsScreen } from './screens/profile/friends/FriendsScreen';
import { FriendProfileScreen } from './screens/profile/friends/FriendProfileScreen';
import { SettingsScreen } from './screens/profile/settings/SettingsScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';
import { ToolsScreen } from './screens/tools/ToolsScreen';
import { AroundMeScreen } from './screens/around/AroundMeScreen';

/**
 * Route table.
 *
 * Tabs (5):
 *   /trip       — TripScreen (map + planned route)
 *   /activity   — ActivityScreen (feed)
 *   /messages   — MessagesScreen (sub-nav: forums / chats / dms)
 *   /tools      — ToolsScreen (8 tools for the road)
 *   /profile    — ProfileScreen
 *
 * Drill-downs nest under their parent tab folder in src/screens/.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/trip" replace />} />

        <Route path="/trip" element={<TripScreen />} />
        <Route path="/trip/stop/:plannedStopId" element={<TripDetailScreen />} />
        <Route path="/place/:id" element={<PlaceScreen />} />

        <Route path="/activity" element={<ActivityScreen />} />

        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/messages/forums/:forumId" element={<ForumScreen />} />
        <Route
          path="/messages/forums/:forumId/:threadId"
          element={<ForumThreadScreen />}
        />
        <Route path="/messages/chats/:chatId" element={<GroupChatScreen />} />
        <Route path="/messages/dms/:dmId" element={<DMScreen />} />

        <Route path="/around" element={<AroundMeScreen />} />
        <Route path="/tools" element={<ToolsScreen />} />

        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/friends" element={<FriendsScreen />} />
        <Route
          path="/profile/friend/:friendId"
          element={<FriendProfileScreen />}
        />
        <Route path="/profile/settings" element={<SettingsScreen />} />

        <Route
          path="/friends"
          element={<Navigate to="/profile/friends" replace />}
        />

        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}
