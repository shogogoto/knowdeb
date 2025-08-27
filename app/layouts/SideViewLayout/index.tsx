import { PanelRightOpen } from "lucide-react";
import { Outlet } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/shared/components/ui/drawer";
import { ScrollArea } from "~/shared/components/ui/scroll-area";
import History from "~/shared/history";
import { useHistory } from "~/shared/history/hooks";
import { useIsMobile } from "~/shared/hooks/use-mobile";

export default function SideViewLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <main>
          <Outlet />
        </main>
        <div className="fixed bottom-20 right-4 z-20">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button size="icon" variant="secondary" className="rounded-full">
                <PanelRightOpen />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-sm p-0" />
          </Drawer>
        </div>
      </>
    );
  }

  const { histories } = useHistory();
  const count = histories.length;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      <main>
        <Outlet />
      </main>
      <aside className="sticky top-16 h-[calc(100vh-4rem)]">
        <>
          <p>履歴 {count}</p>
          <ScrollArea className="h-72 w-full">
            <History />
          </ScrollArea>
        </>
      </aside>
    </div>
  );
}
