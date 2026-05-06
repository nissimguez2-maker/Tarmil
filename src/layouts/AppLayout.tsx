import { Outlet } from 'react-router-dom';
import { DeviceFrame } from '../components/DeviceFrame';
import { TabBar } from '../components/TabBar';

/**
 * App-shell layout. The <Outlet/> renders the active screen; <TabBar/> persists
 * across routes. Wrapped by <DeviceFrame/> so the iPhone shell shows on
 * desktop/tablet and full-bleed on phone.
 */
export function AppLayout() {
  return (
    <DeviceFrame>
      <Outlet />
      <TabBar />
    </DeviceFrame>
  );
}
