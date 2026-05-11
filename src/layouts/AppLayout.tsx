import { Outlet } from 'react-router-dom';
import { DeviceFrame } from '../components/DeviceFrame';
import { TabBar } from '../components/TabBar';

/**
 * App-shell layout. The <Outlet/> renders the active screen; <TabBar/> persists
 * across routes. Wrapped by <DeviceFrame/> so the iPhone shell shows on
 * desktop/tablet and full-bleed on phone.
 *
 * Tools used to live in a slide-down panel triggered by a wrench in the top
 * bar — they're now a section inside the Profile tab so the top bar can
 * breathe and the tools have a logical home.
 */
export function AppLayout() {
  return (
    <DeviceFrame>
      <Outlet />
      <TabBar />
    </DeviceFrame>
  );
}
