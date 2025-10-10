import type React from "react";
import Loading from "~/shared/components/Loading";
import { Tabs } from "~/shared/components/ui/tabs";
import tabListAndHandler from "./tabListAndHandler";

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
  const { tabList, tabHandler } = tabListAndHandler({
    items,
    value,
    onValueChange,
  });

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className="w-full flex flex-col"
      {...tabHandler}
    >
      <div className="sticky top-0 z-5 bg-background">
        {headerContent}
        {tabList}
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="p-4">
            <Loading type="center-x" />
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    </Tabs>
  );
}

export function tabColor(light: string, dark: string, extra: string) {
  return `data-[state=active]:${light} dark:data-[state=active]:${dark} ${extra}`;
}
