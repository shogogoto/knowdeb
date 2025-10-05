import type React from "react";
import { useLocation, useNavigate } from "react-router";
import { TabsContent } from "~/shared/components/ui/tabs";
import type { TabUiItem } from "./TabUI";
import TabUI from "./TabUI";

export type LinkTabItem = {
  param: string; // 一意な識別子
  href: string; // URL
  tab: React.ReactNode;
  className?: string;
  content: React.ReactNode;
};

type Props = {
  items: LinkTabItem[];
  defaultTab?: string;
  isLoading?: boolean;
} & React.PropsWithChildren;

export default function LinkTabPage({
  items,
  defaultTab,
  isLoading,
  children,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const firstTab = items[0]?.param;

  const getCurrentTabValue = () => {
    const currentTab = items.find((item) => item.href === location.pathname);
    if (currentTab) {
      return currentTab.param;
    }
    return defaultTab ?? firstTab;
  };
  const tabValue = getCurrentTabValue();

  const handleTabChange = (value: string) => {
    const selectedTab = items.find((item) => item.param === value);
    if (selectedTab?.href) {
      navigate(selectedTab.href);
    }
  };

  const uiItems: TabUiItem[] = items.map(({ content, href, ...rest }) => rest);

  const renderContents = () => {
    return items.map((item) => (
      <TabsContent value={item.param} key={item.param} className="mt-[-0.5rem]">
        {item.content}
      </TabsContent>
    ));
  };

  return (
    <TabUI
      items={uiItems}
      value={tabValue}
      onValueChange={handleTabChange}
      headerContent={children}
      isLoading={isLoading}
    >
      {renderContents()}
    </TabUI>
  );
}
