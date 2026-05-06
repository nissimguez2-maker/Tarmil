import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { ToolsScreen } from './screens/tools/ToolsScreen';
import { FriendsScreen } from './screens/friends/FriendsScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';

/**
 * Route table.
 *
 * Add new screens here. Drill-downs (e.g., /place/:id, /tools/currency,
 * /friends/:id) nest under their parent tab folder in src/screens/.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/trip" replace />} />
        <Route path="/trip" element={<TripScreen />} />
        <Route path="/tools" element={<ToolsScreen />} />
        <Route path="/friends" element={<FriendsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}
