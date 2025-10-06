import LinkTabPage, {
  type LinkTabItem,
} from "~/shared/components/tabs/LinkTabPage";

export default function Search() {
  const items: LinkTabItem[] = [
    {
      href: "/search",
      tab: <div>知識</div>,
      className:
        "text-muted-foreground data-[state=active]:bg-blue-500 data-[state=active]:text-white",
    },
    {
      href: "/search/resource",
      tab: <div>リソース</div>,
      className:
        "text-muted-foreground data-[state=active]:bg-orange-500 data-[state=active]:text-white",
    },
    {
      href: "/search/user",
      tab: <div>ユーザー</div>,
      className:
        "text-muted-foreground data-[state=active]:bg-purple-500 data-[state=active]:text-white",
    },
  ];

  return <LinkTabPage items={items} />;
}
