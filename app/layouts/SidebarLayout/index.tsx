import { Outlet, useMatch } from "react-router";
import { SidebarProvider } from "~/shared/components/ui/sidebar";
import { Toaster } from "~/shared/components/ui/sonner";
import { useIsMobile } from "~/shared/hooks/use-mobile";
import "github-markdown-css/github-markdown.css";
import { FooterHistory } from "~/shared/history/FooterHistory";
import MySidebar from "./MySidebar";
import BottomNavigation from "./components/BottomNavigation";

type Props = { className?: string };

export default function SidebarLayout({ className }: Props) {
  const isMobile = useIsMobile();
  const isDocMode = useMatch("/docs/*");
  const docStyle = isDocMode ? "markdown-body p-4 list-md" : "";
  return (
    <SidebarProvider>
      <MySidebar />
      <div className={"flex flex-col w-full h-dvh  bg-white dark:bg-gray-950"}>
        <main className={`flex-1 overflow-y-auto ${className} ${docStyle}`}>
          <Outlet />
          <Toaster
            richColors
            expand
            closeButton
            position={isMobile ? "top-right" : "bottom-right"}
          />
        </main>

        <footer className="sm:hidden sticky bottom-0 left-0 w-full border-t bg-white dark:bg-gray-950">
          <FooterHistory />
          <nav className="flex w-full p-4 py-2 justify-between">
            <BottomNavigation />
          </nav>
        </footer>
      </div>
    </SidebarProvider>
  );
}
