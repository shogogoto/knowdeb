import { ThemeToggle } from "~/components/theme/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "~/components/ui/sidebar";
import LogoSideItem from "../components/LogoSideMenu";
import GuestMenu from "./GuestMenu";

export default function GuestSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border">
        <SidebarMenu>
          <LogoSideItem />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <GuestMenu />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton size="lg" asChild tooltip={"Toggle Theme"}>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
