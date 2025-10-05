import type React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import type { TabUiItem } from "./TabUI";
import TabUI from "./TabUI";

export type LinkTabItem = {
  href: string; // URL
  tab: React.ReactNode;
  className?: string;
};

type Props = {
  items: LinkTabItem[];
  defaultTab?: string;
} & React.PropsWithChildren;

export default function LinkTabPage({ items, defaultTab, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const firstTab = items[0]?.href;

  const getCurrentTabValue = () => {
    const currentTab = items.find((item) => item.href === location.pathname);
    if (currentTab) {
      return currentTab.href;
    }
    return defaultTab ?? firstTab;
  };
  const tabValue = getCurrentTabValue();

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  const uiItems: TabUiItem[] = items.map(({ href, ...rest }) => ({
    value: href,
    ...rest,
  }));

  return (
    <TabUI
      items={uiItems}
      value={tabValue}
      onValueChange={handleTabChange}
      headerContent={children}
    >
      <Outlet />
    </TabUI>
  );
}
