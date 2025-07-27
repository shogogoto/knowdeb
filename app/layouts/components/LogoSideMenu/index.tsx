import { Link } from "react-router";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import favicon from "/favicon.svg";

export function SiteLogo() {
  return <img src={favicon} alt="Logo" className="inline size-8" />;
}

export default function LogoSideItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Link to="/">
          <SiteLogo />
          <span>Knowde</span>
        </Link>
      </SidebarMenuButton>
      {/* <ThemeToggle /> */}
    </SidebarMenuItem>
  );
}
