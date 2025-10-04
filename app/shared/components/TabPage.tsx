import { TabsContent } from "@radix-ui/react-tabs";
import type React from "react";
import { useSearchParams } from "react-router";
import { useSwipeable } from "react-swipeable";
import Loading from "./Loading";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export type TabItem = {
  param: string; // URLに対応 tab=xxx
  tab: React.ReactNode;
  className?: string;
  content: React.ReactNode;
};
type Props = {
  items: TabItem[];
  defaultTab?: string;
  isLoading?: boolean;
} & React.PropsWithChildren;

export default function TabPage({
  items,
  defaultTab,
  isLoading,
  children,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = items.map((item) => item.param);
  const tabs = items.map((item) => item.tab);
  const contents = items.map((item) => item.content);
  const classNames = items.map((item) => item.className);

  const firstTab = items[0]?.param;
  const currentTab = searchParams.get("tab");
  const tabValue =
    (currentTab && validTabs.includes(currentTab) ? currentTab : defaultTab) ??
    firstTab;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = validTabs.indexOf(tabValue);
      if (currentIndex < validTabs.length - 1) {
        handleTabChange(validTabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = validTabs.indexOf(tabValue);
      if (currentIndex > 0) {
        handleTabChange(validTabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const nTab = tabs.length;
  const tabTriggers = validTabs.map((tab, i) => (
    <TabsTrigger value={tab} key={tab} className={classNames[i]}>
      {tabs[i]}
    </TabsTrigger>
  ));

  return (
    <Tabs
      value={tabValue}
      onValueChange={handleTabChange}
      className="w-full flex flex-col"
      {...handlers}
    >
      <div className="sticky top-0 z-5 bg-background">
        {children}
        {nTab > 4 ? (
          <div className="w-full overflow-x-auto border-b">
            <TabsList className="rounded-none">{tabTriggers}</TabsList>
          </div>
        ) : (
          <TabsList
            className="grid w-full rounded-none"
            style={{ gridTemplateColumns: `repeat(${nTab}, 1fr)` }}
          >
            {tabTriggers}
          </TabsList>
        )}
      </div>
      {isLoading ? (
        <>
          {contents.map((content, i) => {
            return (
              <TabsContent
                value={validTabs[i]}
                key={validTabs[i]}
                className="mt-[-0.5rem]"
              >
                {content}
              </TabsContent>
            );
          })}
        </>
      ) : (
        <div className="p-4">
          <Loading type="center-x" />
        </div>
      )}
    </Tabs>
  );
}
