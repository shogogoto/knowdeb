import type React from "react";
import { useSearchParams } from "react-router";
import { TabsContent } from "~/shared/components/ui/tabs";
import TabUI from "./TabUI";
import type { TabUiItem } from "./TabUI";

export type QueryParamTabItem = {
  param: string;
  tab: React.ReactNode;
  className?: string;
  content: React.ReactNode;
};

type Props = {
  items: QueryParamTabItem[];
  defaultTab?: string;
  isLoading?: boolean;
} & React.PropsWithChildren;

export default function QueryParamTabPage({
  items,
  defaultTab,
  isLoading,
  children,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = items.map((item) => item.param);
  const firstTab = items[0]?.param;

  const currentTab = searchParams.get("tab");
  const tabValue =
    (currentTab && validTabs.includes(currentTab) ? currentTab : defaultTab) ??
    firstTab;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const uiItems: TabUiItem[] = items.map(({ content, ...rest }) => rest);

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
