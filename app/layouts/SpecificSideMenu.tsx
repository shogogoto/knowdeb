import {
  BellRing,
  BookOpen,
  Bookmark,
  Crown,
  Folder,
  FolderSearch,
  LogIn,
  Search,
  SearchCode,
  Speech,
  TextSearch,
  UserPen,
  UserSearch,
  Users,
} from "lucide-react";
import { documents } from "~/routes/docs/toc";
import SideMenu from "./components/Sidemenu";

export function DocsSideMenu() {
  return (
    <SideMenu
      title={"ドキュメント"}
      to={"/docs"}
      icon={<BookOpen />}
      subs={documents}
    />
  );
}

const _list = [
  { title: "単文", to: "/search", icon: <TextSearch /> },
  { title: "リソース", to: "/search", icon: <FolderSearch /> },
  { title: "ユーザー", to: "/search", icon: <UserSearch /> },
];

export function SearchSideMenu() {
  return (
    <SideMenu
      title={"検索"}
      to={"/search"}
      icon={<Search />}
      // subs={_list.map((v) => ({ ...v, title: `${v.title}検索` }))}
    />
  );
}

export function RankingSideMenu() {
  return (
    <SideMenu
      title={"ランキング"}
      to={"/search"}
      icon={<Crown />}
      // subs={_list.map((v) => ({ ...v, title: `${v.title}ランキング` }))}
    />
  );
}

export function FeaturesMenu() {
  return (
    <SideMenu
      title={"ログイン後機能(予定)"}
      to={"#"}
      icon={<LogIn />}
      subs={[
        { to: "#", title: "通知", icon: <BellRing /> },
        { to: "#", title: "エントリー管理", icon: <Folder /> },
        { to: "#", title: "ブックマーク", icon: <Bookmark /> },
        { to: "#", title: "検索パラメータ", icon: <SearchCode /> },
        { to: "#", title: "参加中ディスカッション", icon: <Speech /> },
        { to: "#", title: "加入グループ", icon: <Users /> },
        { to: "#", title: "プロフィール", icon: <UserPen /> },
      ]}
    />
  );
}
