import { Link } from "react-router";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import favicon from "/favicon.ico";
import useToggleSidebar from "../hooks";
export function SiteLogo() {
  return <img src={favicon} alt="Logo" className="inline" />;
}

export default function LogoSideItem() {
  const { handleMenuClick } = useToggleSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild tooltip={"Landng Page"}>
        <Link to="/" onClick={handleMenuClick}>
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <SiteLogo />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Knowde</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
