import type React from "react";
import { useSwipeable } from "react-swipeable";
import Loading from "~/shared/components/Loading";
import { Tabs, TabsList, TabsTrigger } from "~/shared/components/ui/tabs";

// TabItemからcontentを除外したUI用の型
export type TabUiItem = {
  value: string;
  tab: React.ReactNode;
  className?: string;
};

type Props = {
  items: TabUiItem[];
  value: string;
  onValueChange: (value: string) => void;
  headerContent?: React.ReactNode; // 元のTabPageのchildrenに相当
  isLoading?: boolean;
} & React.PropsWithChildren; // childrenはTabsContentになる

export default function TabUI({
  items,
  value,
  onValueChange,
  headerContent,
  isLoading,
  children,
}: Props) {
  const validTabs = items.map((item) => item.value);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = validTabs.indexOf(value);
      if (currentIndex < validTabs.length - 1) {
        onValueChange(validTabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = validTabs.indexOf(value);
      if (currentIndex > 0) {
        onValueChange(validTabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const nTab = items.length;
  const tabTriggers = items.map((item) => (
    <TabsTrigger value={item.value} key={item.value} className={item.className}>
      {item.tab}
    </TabsTrigger>
  ));

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className="w-full flex flex-col"
      {...handlers}
    >
      <div className="sticky top-0 z-5 bg-background">
        {headerContent}
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
        <div className="p-4">
          <Loading type="center-x" />
        </div>
      ) : (
        <>{children}</>
      )}
    </Tabs>
  );
}

export function tabColor(light: string, dark: string) {
  return `data-[state=active]:${light} dark:data-[state=active]:${dark}`;
}
