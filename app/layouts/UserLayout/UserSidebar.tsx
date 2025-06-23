import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import UserNavi from "~/features/user/UserNavi";
import LogoSideItem from "../components/LogoSideMenu";
import SideMenu from "../components/Sidemenu";

export default function UserSidebar() {
  // Menu items.
  const items = [
    {
      title: "Home",
      to: "/home",
      icon: <Home />,
    },
    {
      title: "Inbox",
      to: "/",
      icon: <Inbox />,
    },
    {
      title: "Calendar",
      to: "#",
      icon: <Calendar />,
    },
    {
      title: "Search",
      to: "/search",
      icon: <Search />,
    },
    {
      title: "Settings",
      to: "#",
      icon: <Settings />,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <LogoSideItem />
          <SidebarMenuItem title="ちんこ">
            <SidebarMenuButton size="lg">
              <UserNavi
                user={{
                  name: "test",
                  display_name: "test",
                  avatar_src: "https://github.com/shadcn.png",
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SideMenu {...it} key={it.title} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
