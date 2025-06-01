import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import Sidemenu from "~/components/Sidemenu";

export default function DocMenu() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Sidemenu
          title={"Playground"}
          to={"/docs"}
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
        <Sidemenu
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
        <Sidemenu
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
        <Sidemenu
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
