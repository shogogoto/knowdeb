import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import ButtonNavigation from "../ButtonNavigation";
import GuestSidebar from "./GuestSidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <GuestSidebar />
      <div className="flex flex-col w-full h-screen  bg-white dark:bg-gray-950">
        <main className="overflow-auto">
          <Outlet />
        </main>
        <ButtonNavigation />
      </div>
    </SidebarProvider>
  );
}
