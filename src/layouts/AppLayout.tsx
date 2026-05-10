import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DeviceFrame } from '../components/DeviceFrame';
import { TabBar } from '../components/TabBar';
import { ToolsPanel } from '../components/ToolsPanel';
import { ToolsPanelProvider } from '../lib/ToolsPanelContext';

/**
 * App-shell layout. The <Outlet/> renders the active screen; <TabBar/> persists
 * across routes. Wrapped by <DeviceFrame/> so the iPhone shell shows on
 * desktop/tablet and full-bleed on phone.
 *
 * Owns the global <ToolsPanel> open state and exposes `open()` via context so
 * any <TopBar>'s wrench button can trigger it. The panel auto-closes on route
 * change so navigating to another screen feels clean.
 */
export function AppLayout() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();

  const open = useCallback(() => setToolsOpen(true), []);
  const close = useCallback(() => setToolsOpen(false), []);
  const ctx = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    setToolsOpen(false);
  }, [location.pathname]);

  return (
    <ToolsPanelProvider value={ctx}>
      <DeviceFrame>
        <Outlet />
        <TabBar />
        <ToolsPanel open={toolsOpen} onClose={close} />
      </DeviceFrame>
    </ToolsPanelProvider>
  );
}
