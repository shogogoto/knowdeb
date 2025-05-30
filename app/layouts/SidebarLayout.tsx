import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Header } from "~/components/Header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import type { Route } from "../+types/root";

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}
export default function SidebarLayout() {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <AppSidebar />
          <div className="w-full bg-white dark:bg-gray-900">
            <Header>
              <SidebarTrigger />
            </Header>
            <main className="flex-1 p-4">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export function AppSidebar() {
  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
