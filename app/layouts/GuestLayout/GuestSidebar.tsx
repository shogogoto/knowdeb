import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  Calendar,
  Home,
  Inbox,
  MailQuestion,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Header } from "~/components/Header";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import DocMenu from "./DecMenu";

export default function GuestSidebar() {
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
  const [activeItem, setActiveItem] = useState(true);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* <NavUser user={{ name: "test", email: "test", avatar: "test" }} /> */}
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <DocMenu />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function DocumentMenuGroup() {
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
    {
      title: "問い合わせ",
      url: "/contact",
      icon: MailQuestion,
    },
  ];
  return (
    <SidebarMenu>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem />
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}

//<SidebarMenu>
//  {items.map((item) => (
//    <SidebarMenuItem key={item.title}>
//      <SidebarMenuButton asChild>
//        <Link to={item.url}>
//          <item.icon />
//          <span>{item.title}</span>
//        </Link>
//      </SidebarMenuButton>
//    </SidebarMenuItem>
//  ))}
//</SidebarMenu>
