import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import type { Route } from "../+types/root";

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

type Props = {
  className?: string;
  sidebar?: React.ReactNode;
};

export default function SidebarLayout({ className, sidebar }: Props) {
  return (
    <SidebarProvider>
      {sidebar}
      <div className="flex flex-col w-full h-screen  bg-white dark:bg-gray-950">
        <main className={`overflow-auto ${className}`}>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
