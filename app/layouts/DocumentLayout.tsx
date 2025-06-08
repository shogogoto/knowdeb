import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import ButtonNavigation from "./ButtonNavigation";
import GuestSidebar from "./GuestLayout/GuestSidebar";
import "github-markdown-css/github-markdown.css";

export default function GuestLayout() {
  return (
    <SidebarProvider>
      <GuestSidebar />
      <div className="flex flex-col w-full h-screen  bg-white dark:bg-gray-950">
        <main className="overflow-y-auto markdown-body p-4 list-md">
          <Outlet />
        </main>
        <ButtonNavigation />
      </div>
    </SidebarProvider>
  );
}
