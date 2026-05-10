import { createContext, useContext } from 'react';

type ToolsPanelContextValue = {
  open: () => void;
};

const ToolsPanelContext = createContext<ToolsPanelContextValue | null>(null);

export const ToolsPanelProvider = ToolsPanelContext.Provider;

export function useToolsPanel(): ToolsPanelContextValue {
  const ctx = useContext(ToolsPanelContext);
  if (!ctx) {
    throw new Error(
      'useToolsPanel must be used inside <ToolsPanelProvider>. AppLayout supplies it.',
    );
  }
  return ctx;
}
