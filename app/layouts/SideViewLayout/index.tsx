import { PanelRightOpen } from "lucide-react";
import { Outlet } from "react-router";
import { HistoryList } from "~/features/history/components/HistoryList";
import { Button } from "~/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/shared/components/ui/sheet";
import { useIsMobile } from "~/shared/hooks/use-mobile";
import { FooterHistory } from "./FooterHistory";

export default function SideHistoryLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <main>
          <Outlet />
        </main>
        <div className="fixed bottom-20 right-4 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" className="rounded-full">
                <PanelRightOpen />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-sm p-0">
              <HistoryList />
            </SheetContent>
          </Sheet>
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
        <HistoryList />
      </aside>
    </div>
  );
}
