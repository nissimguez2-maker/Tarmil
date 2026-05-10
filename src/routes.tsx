import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { ActivityScreen } from './screens/activity/ActivityScreen';
import { ActivityThreadScreen } from './screens/activity/ActivityThreadScreen';
import { FriendsScreen } from './screens/friends/FriendsScreen';
import { FriendProfileScreen } from './screens/friends/FriendProfileScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';

/**
 * Route table.
 *
 * Add new screens here. Drill-downs (e.g., /place/:id, /activity/:threadId,
 * /friends/:id) nest under their parent tab folder in src/screens/.
 *
 * Tools moved out of the route table in PR2 — it's a slide-in panel triggered
 * by the wrench in <TopBar>, not a screen.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/trip" replace />} />
        <Route path="/trip" element={<TripScreen />} />
        <Route path="/place/:id" element={<PlaceScreen />} />
        <Route path="/activity" element={<ActivityScreen />} />
        <Route path="/activity/:threadId" element={<ActivityThreadScreen />} />
        <Route path="/friends" element={<FriendsScreen />} />
        <Route path="/friends/:id" element={<FriendProfileScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}
