import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { TripScreen } from './screens/trip/TripScreen';
import { ActivityScreen } from './screens/activity/ActivityScreen';
import { ActivityThreadScreen } from './screens/activity/ActivityThreadScreen';
import { FriendsScreen } from './screens/friends/FriendsScreen';
import { FriendProfileScreen } from './screens/friends/FriendProfileScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { PlaceScreen } from './screens/place/PlaceScreen';
import { CurrencyToolScreen } from './screens/tools/CurrencyToolScreen';
import { ChecklistToolScreen } from './screens/tools/ChecklistToolScreen';
import { VoiceTranslateToolScreen } from './screens/tools/VoiceTranslateToolScreen';
import { MenuTranslateToolScreen } from './screens/tools/MenuTranslateToolScreen';
import { SignTranslateToolScreen } from './screens/tools/SignTranslateToolScreen';
import { BalancesToolScreen } from './screens/tools/BalancesToolScreen';
import { EsimToolScreen } from './screens/tools/EsimToolScreen';

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
        <Route path="/tools/currency" element={<CurrencyToolScreen />} />
        <Route path="/tools/checklist" element={<ChecklistToolScreen />} />
        <Route path="/tools/voice" element={<VoiceTranslateToolScreen />} />
        <Route path="/tools/menu" element={<MenuTranslateToolScreen />} />
        <Route path="/tools/sign" element={<SignTranslateToolScreen />} />
        <Route path="/tools/balances" element={<BalancesToolScreen />} />
        <Route path="/tools/esim" element={<EsimToolScreen />} />
        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Route>
    </Routes>
  );
}
