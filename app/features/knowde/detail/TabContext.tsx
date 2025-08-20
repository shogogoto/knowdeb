import { createContext, useContext } from "react";

const TabContext = createContext<URLSearchParams | undefined>(undefined);

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
}

export const TabProvider = TabContext.Provider;
