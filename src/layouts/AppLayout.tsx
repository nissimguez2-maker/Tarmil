import { Outlet, useLocation } from 'react-router-dom';
import { DeviceFrame } from '../components/DeviceFrame';
import { TabBar } from '../components/TabBar';
import { DemoGuide } from '../components/DemoGuide';

/**
 * Routes that hide the floating tab capsule. Used for drill-downs where the
 * screen owns the bottom edge (chat composers, friend-profile sticky CTAs).
 * iOS-standard pattern — the bar reappears when the user goes back.
 */
const HIDE_TAB_PATTERNS: RegExp[] = [
  /^\/forums\/[^/]+\/[^/]+$/,
  /^\/profile\/friend\/[^/]+$/,
];

export function AppLayout() {
  const { pathname } = useLocation();
  const showTab = !HIDE_TAB_PATTERNS.some((re) => re.test(pathname));

  return (
    <DeviceFrame>
      <Outlet />
      {showTab && <TabBar />}
      <DemoGuide />
    </DeviceFrame>
  );
}
