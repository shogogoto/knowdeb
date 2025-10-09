import LinkTabPage, {
  type LinkTabItem,
} from "~/shared/components/tabs/LinkTabPage";

export default function Search() {
  const items: LinkTabItem[] = [
    {
      href: "/search",
      tab: <div>知識</div>,
      className: tabColor("bg-blue-500"),
    },
    {
      href: "/search/resource",
      tab: <div>リソース</div>,
      className: tabColor("bg-orange-500"),
    },
    {
      href: "/search/user",
      tab: <div>ユーザー</div>,
      className: tabColor("bg-purple-500"),
    },
  ];

  return <LinkTabPage items={items} />;
}

function tabColor(value: string) {
  return `text-muted-foreground data-[state=active]:${value} data-[state=active]:text-white`;
}
