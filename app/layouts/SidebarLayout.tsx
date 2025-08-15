// import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Outlet } from "react-router";
import { useMatch } from "react-router";
import { SidebarProvider } from "~/shared/components/ui/sidebar";
import MySidebar from "./MySidebar";
import BottomNavigation from "./components/BottomNavigation";
import "github-markdown-css/github-markdown.css";
import { Toaster } from "~/shared/components/ui/sonner";
import { useIsMobile } from "~/shared/hooks/use-mobile";

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

        <nav className="sm:hidden sticky flex bottom-0 left-0 w-full p-4 py-2 border-t justify-between bg-white dark:bg-gray-950">
          <BottomNavigation />
        </nav>
      </div>
    </SidebarProvider>
  );
}
