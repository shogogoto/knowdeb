import { PanelRightOpen } from "lucide-react";
import { Outlet } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/shared/components/ui/drawer";
import { useIsMobile } from "~/shared/hooks/use-mobile";
import { FooterHistory } from "./FooterHistory";

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
            <DrawerContent className="w-full max-w-sm p-0">
              {/* <HistoryListContainer /> */}
            </DrawerContent>
          </Drawer>
        </div>
        <FooterHistory />
      </>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      <main>
        <Outlet />
      </main>
      <aside className="sticky top-16 h-[calc(100vh-4rem)]">
        {/* <HistoryListContainer /> */}
      </aside>
    </div>
  );
}
