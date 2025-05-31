import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import ButtonNavigation from "./ButtonNavigation";
import { AppSidebar } from "./SidebarLayout";

export default function MainLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full h-screen  bg-white dark:bg-gray-950">
          {/* <div className="sticky top-0 w-full"> */}
          {/*   <Header /> */}
          {/* </div> */}
          <main className="overflow-auto">
            <Outlet />
          </main>
          <ButtonNavigation />
        </div>
      </SidebarProvider>
    </>
  );
}
