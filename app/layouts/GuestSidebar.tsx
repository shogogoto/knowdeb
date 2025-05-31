import { Outlet } from "react-router";
import { Header } from "~/components/Header";
import { SidebarProvider } from "~/components/ui/sidebar";
import ButtonNavigation from "./ButtonNavigation";

export default function MainLayout() {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-col h-screen items-center bg-white dark:bg-gray-950">
          <div className="sticky top-0 w-full">
            <Header />
          </div>
          <main className="flex-grow overflow-auto">
            <Outlet />
          </main>
          <ButtonNavigation />
        </div>
      </SidebarProvider>
    </>
  );
}
