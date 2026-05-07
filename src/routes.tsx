import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { ToolsScreen } from './screens/tools/ToolsScreen';
import { CurrencyScreen } from './screens/tools/CurrencyScreen';
import { ChecklistScreen } from './screens/tools/ChecklistScreen';
import { BalanceScreen } from './screens/tools/BalanceScreen';
import { BalanceHistoryScreen } from './screens/tools/BalanceHistoryScreen';
import { ExpensesScreen } from './screens/tools/ExpensesScreen';
import { FriendsScreen } from './screens/friends/FriendsScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';

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
        <Route path="/place/:id" element={<PlaceScreen />} />
        <Route path="/tools" element={<ToolsScreen />} />
        <Route path="/tools/currency" element={<CurrencyScreen />} />
        <Route path="/tools/checklist" element={<ChecklistScreen />} />
        <Route path="/tools/balance" element={<BalanceScreen />} />
        <Route
          path="/tools/balance/history"
          element={<BalanceHistoryScreen />}
        />
        <Route path="/tools/expenses" element={<ExpensesScreen />} />
        <Route path="/friends" element={<FriendsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}
