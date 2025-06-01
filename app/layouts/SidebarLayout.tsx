import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Link, Outlet } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "~/components/ui/sidebar";
import type { Route } from "../+types/root";
import ButtonNavigation from "./ButtonNavigation";
import { NavUser } from "./NavUser";

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}
export default function SidebarLayout() {
  return (
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser user={{ name: "test", email: "test", avatar: "test" }} />
      </SidebarHeader>

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
      <SidebarRail />
    </Sidebar>
  );
}
