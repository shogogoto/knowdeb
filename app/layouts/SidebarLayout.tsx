// import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import AuthGuard from "~/features/auth/AuthGuard";

// export async function loader(args: Route.LoaderArgs) {
//   return rootAuthLoader(args);
// }

type Props = {
  className?: string;
  sidebar?: React.ReactNode;
  bottomNavigation?: React.ReactNode;
};

export default function SidebarLayout({
  className,
  sidebar,
  bottomNavigation,
}: Props) {
  return (
    <AuthGuard>
      <SidebarProvider>
        {sidebar}
        <div className="flex flex-col w-full h-screen  bg-white dark:bg-gray-950">
          <main className={`flex-1 overflow-auto ${className}`}>
            <Outlet />
          </main>
          {bottomNavigation}
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
