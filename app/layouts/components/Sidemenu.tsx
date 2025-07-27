import { ChevronRight } from "lucide-react";

import type { ReactNode } from "react";
import { NavLink } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar";

type MenuProps = {
  title: string;
  to: string;
  icon?: ReactNode;
};

type SideMenuProps = MenuProps & {
  subs?: MenuProps[];
};

// 開閉できるサイドバーの単位
export default function SideMenu({ title, to, icon, subs }: SideMenuProps) {
  const { isMobile, toggleSidebar } = useSidebar();
  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  if (!subs || subs.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <NavLink to={to} onClick={handleMenuClick}>
            {icon}
            <span>{title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger asChild className="group">
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={title}>
            <div>
              {icon}
              <span>{title}</span>
            </div>
          </SidebarMenuButton>
          <CollapseToggle />
        </SidebarMenuItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SubMenu items={subs} />
      </CollapsibleContent>
    </Collapsible>
  );
}

function CollapseToggle() {
  return (
    <SidebarMenuAction className="transition-transform duration-200 group-data-[state=open]:rotate-90">
      <ChevronRight />
    </SidebarMenuAction>
  );
}

function SubMenu({ items }: { items?: MenuProps[] }) {
  if (items?.length === 0) return null;
  return (
    <SidebarMenuSub>
      {items?.map((subItem) => (
        <SubMenuItem
          key={subItem.title}
          to={subItem.to}
          title={subItem.title}
          icon={subItem.icon}
        />
      ))}
    </SidebarMenuSub>
  );
}

function SubMenuItem({ to, title, icon }: MenuProps) {
  const { isMobile, toggleSidebar } = useSidebar();
  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <NavLink to={to} onClick={handleMenuClick}>
          {icon}
          <span>{title}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
