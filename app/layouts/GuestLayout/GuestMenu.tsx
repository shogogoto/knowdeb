import {
  BellRing,
  BookOpen,
  Bookmark,
  ChevronsLeftRightEllipsis,
  Crown,
  Folder,
  FolderSearch,
  LogIn,
  MailQuestion,
  Search,
  Speech,
  TextSearch,
  UserPen,
  UserSearch,
  Users,
} from "lucide-react";
import { SidebarGroup, SidebarMenu } from "~/components/ui/sidebar";
import { documents } from "~/routes/docs/toc";
import Sidemenu from "../components/Sidemenu";
import SideMenu from "../components/Sidemenu";

export default function DocMenu() {
  return (
    <SidebarGroup>
      <SideMenu icon={<MailQuestion />} to={"/register"} title="新規登録" />
      <SideMenu icon={<LogIn />} to={"/login"} title="ログイン" />
      <SidebarMenu>
        <Sidemenu
          title={"ドキュメント"}
          to={"/docs"}
          icon={<BookOpen />}
          subs={documents}
        />
        <Sidemenu
          title={"検索"}
          to={"#"}
          icon={<Search />}
          subs={[
            {
              title: "単文検索",
              to: "/search",
              icon: <TextSearch />,
            },
            {
              title: "リソース検索",
              to: "/search",
              icon: <FolderSearch />,
            },
            {
              title: "ユーザー検索",
              to: "/search",
              icon: <UserSearch />,
            },
          ]}
        />

        <Sidemenu
          title={"ランキング"}
          to={"#"}
          icon={<Crown />}
          subs={[
            {
              title: "単文ランキング",
              to: "/search",
              icon: <TextSearch />,
            },
            {
              title: "リソースランキング",
              to: "/search",
              icon: <FolderSearch />,
            },
            {
              title: "ユーザーランキング",
              to: "/search",
              icon: <UserSearch />,
            },
          ]}
        />
        <Sidemenu
          title={"ログイン後機能(予定)"}
          to={"#"}
          icon={<LogIn />}
          subs={[
            {
              title: "通知",
              to: "#",
              icon: <BellRing />,
            },
            {
              title: "エントリー管理",
              to: "#",
              icon: <Folder />,
            },
            {
              title: "ブックマーク",
              to: "#",
              icon: <Bookmark />,
            },
            {
              title: "検索パラメータ",
              to: "#",
              icon: <ChevronsLeftRightEllipsis />,
            },
            {
              title: "参加中ディスカッション",
              to: "#",
              icon: <Speech />,
            },
            {
              title: "加入グループ",
              to: "#",
              icon: <Users />,
            },
            {
              title: "プロフィール",
              to: "#",
              icon: <UserPen />,
            },
          ]}
        />
      </SidebarMenu>
      <SideMenu icon={<MailQuestion />} to={"/contact"} title="問い合わせ" />
    </SidebarGroup>
  );
}
