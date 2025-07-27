// import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Outlet } from "react-router";
import { useMatch } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useAuth } from "~/features/auth/AuthProvider";
import GuestSidebar from "./GuestLayout/GuestSidebar";
import UserSidebar from "./UserLayout/UserSidebar";
import BottomNavigation from "./components/BottomNavigation";

// export async function loader(args: Route.LoaderArgs) {
//   return rootAuthLoader(args);
// }

type Props = { className?: string };

export default function SidebarLayout({ className }: Props) {
  const isDocMode = useMatch("/docs/*");
  const { isAuthenticated } = useAuth();

  const sidebar = isAuthenticated ? <UserSidebar /> : <GuestSidebar />;
  const docStyle = isDocMode ? "markdown-body p-4 list-md" : "";
  return (
    <SidebarProvider>
      {sidebar}
      <div
        className={`flex flex-col w-full h-screen  bg-white dark:bg-gray-950 ${docStyle}`}
      >
        <main className={`flex-1 overflow-auto ${className}`}>
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
}
