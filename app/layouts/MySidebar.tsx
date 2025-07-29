import { LogIn, MailQuestion } from "lucide-react";
import {
  DocsSideMenu,
  FeaturesMenu,
  RankingSideMenu,
  SearchSideMenu,
} from "./SpecificSideMenu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useAuth } from "~/features/auth/AuthProvider";
import { useIsMobile } from "~/hooks/use-mobile";
import UserNavi from "./UserNavi";
import LogoSideMenu from "./components/LogoSideMenu";
import SideMenu from "./components/Sidemenu";

export default function MySidebar() {
  const { user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";

  const forGuest = (
    <>
      <SideMenu icon={<MailQuestion />} to={"/register"} title="新規登録" />
      <SideMenu icon={<LogIn />} to={"/login"} title="ログイン" />
    </>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border">
        <LogoSideMenu />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isAuthenticated && forGuest}
          <SidebarMenu>
            <DocsSideMenu />
            <SearchSideMenu />
            <RankingSideMenu />
            <FeaturesMenu />
          </SidebarMenu>
          <SideMenu
            icon={<MailQuestion />}
            to={"/contact"}
            title="問い合わせ"
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border">
        <SidebarMenu>
          <SidebarMenuItem title="ユーザー">
            <SidebarMenuButton size="lg">
              <UserNavi user={user} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
