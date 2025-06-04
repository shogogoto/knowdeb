import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import {
  BellRing,
  BookOpen,
  Bookmark,
  ChevronsLeftRightEllipsis,
  Crown,
  Folder,
  FolderSearch,
  Search,
  Speech,
  TextSearch,
  UserPen,
  UserSearch,
  Users,
} from "lucide-react";
import Sidemenu from "~/components/Sidemenu";

export default function DocMenu({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Sidemenu
          title={"ドキュメント"}
          to={"/docs"}
          icon={<BookOpen />}
          subs={[
            {
              title: "Knowdeについて",
              to: "/",
            },
            {
              title: "Get Started",
              to: "/docs/get-started",
            },
            {
              title: "xxxx",
              to: "/",
            },
            {
              title: "Get Started",
              to: "/",
            },
            {
              title: "xxxx",
              to: "/",
            },
            {
              title: "Get Started",
              to: "/",
            },
            {
              title: "xxxx",
              to: "/",
            },
          ]}
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
          icon={<BookOpen />}
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
      {children}
    </SidebarGroup>
  );
}
