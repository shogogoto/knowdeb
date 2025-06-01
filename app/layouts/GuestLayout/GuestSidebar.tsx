import { Header, SiteLogo } from "~/components/Header";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import DocMenu from "./DecMenu";

export default function GuestSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Landng Page"}>
              <SiteLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Header />
        </SidebarMenu>

        {/* <NavUser user={{ name: "test", email: "test", avatar: "test" }} /> */}
      </SidebarHeader>
      <SidebarContent>
        <DocMenu />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
