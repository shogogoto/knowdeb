import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { Link } from "react-router";

type MenuItem = {
  title: string;
  to: string;
};

type SideMenuProps = MenuItem & {
  icon: ReactNode;
  subs?: MenuItem[];
};

export default function SideMenu({ title, to, icon, subs }: SideMenuProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={title}>
            <div>
              {icon}
              <span>{title}</span>
            </div>
          </SidebarMenuButton>
          <CollapseToggle />
          <CollapsibleContent>
            <SubMenu items={subs} />
          </CollapsibleContent>
        </SidebarMenuItem>
      </CollapsibleTrigger>
    </Collapsible>
  );
}

function CollapseToggle() {
  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuAction className="data-[state=open]:rotate-90">
        <ChevronRight />
        {/* ↓ これが必要な理由が謎 */}
        <span className="sr-only">Toggle</span>
      </SidebarMenuAction>
    </CollapsibleTrigger>
  );
}

function SubMenu({ items }: { items?: MenuItem[] }) {
  if (items?.length === 0) return null;
  return (
    <SidebarMenuSub>
      {items?.map((subItem) => (
        <SubMenuItem
          key={subItem.title}
          to={subItem.to}
          title={subItem.title}
        />
      ))}
    </SidebarMenuSub>
  );
}

function SubMenuItem({ to, title }: { to: string; title: string }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link to={to}>
          <span>{title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
