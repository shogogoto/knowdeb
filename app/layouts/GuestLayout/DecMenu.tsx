import {
  BookOpen,
  Bot,
  ChevronRight,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { Link } from "react-router";

export default function DocMenu() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SideMenu
          title={"Playground"}
          to={"#"}
          icon={<SquareTerminal />}
          subs={[
            {
              title: "History",
              to: "/home",
            },
            {
              title: "Starred",
              to: "#",
            },
            {
              title: "Settings",
              to: "#",
            },
          ]}
        />
        <SideMenu
          title={"Models"}
          to={"#"}
          icon={<Bot />}
          subs={[
            {
              title: "Genesis",
              to: "#",
            },
            {
              title: "Explorer",
              to: "#",
            },
            {
              title: "Quantum",
              to: "#",
            },
          ]}
        />
        <SideMenu
          title={"Documentation"}
          to={"#"}
          icon={<BookOpen />}
          subs={[
            {
              title: "Introduction",
              to: "#",
            },
            {
              title: "Get Started",
              to: "#",
            },
            {
              title: "Tutorials",
              to: "#",
            },
            {
              title: "Changelog",
              to: "#",
            },
          ]}
        />
        <SideMenu
          title={"Settings"}
          to={"#"}
          icon={<Settings2 />}
          subs={[
            {
              title: "General",
              to: "#",
            },
            {
              title: "Team",
              to: "#",
            },
            {
              title: "Billing",
              to: "#",
            },
            {
              title: "Limits",
              to: "#",
            },
          ]}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}

type MenuItem = {
  title: string;
  to: string;
};

type SideMenuProps = MenuItem & {
  icon: ReactNode;
  subs?: MenuItem[];
};

function SideMenu({ title, to, icon, subs }: SideMenuProps) {
  return (
    <Collapsible asChild>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <Link to={to}>
            {icon}
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <SubMenu items={subs} />
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SubMenu({ items }: { items?: MenuItem[] }) {
  if (items?.length === 0) return null;
  return (
    <>
      <MenuToggle />
      <CollapsibleContent>
        <SidebarMenuSub>
          {items?.map((subItem) => (
            <SubMenuItem
              key={subItem.title}
              to={subItem.to}
              title={subItem.title}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </>
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

function MenuToggle() {
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
