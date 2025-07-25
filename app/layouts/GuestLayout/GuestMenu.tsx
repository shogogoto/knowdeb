import { LogIn, MailQuestion } from "lucide-react";
import { SidebarGroup, SidebarMenu } from "~/components/ui/sidebar";
import {
  DocsSideMenu,
  FeaturesMenu,
  RankingSideMenu,
  SearchSideMenu,
} from "../SpecificSideMenu";
import SideMenu from "../components/Sidemenu";

export default function DocMenu() {
  return (
    <SidebarGroup>
      <SideMenu icon={<MailQuestion />} to={"/register"} title="新規登録" />
      <SideMenu icon={<LogIn />} to={"/login"} title="ログイン" />
      <SidebarMenu>
        <DocsSideMenu />
        <SearchSideMenu />
        <RankingSideMenu />
        <FeaturesMenu />
      </SidebarMenu>
      <SideMenu icon={<MailQuestion />} to={"/contact"} title="問い合わせ" />
    </SidebarGroup>
  );
}
