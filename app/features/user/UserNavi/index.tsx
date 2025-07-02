import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { useIsMobile } from "~/hooks/use-mobile";
import UserAvatar from "../UserAvatar";
import UserDropdown from "./UserDropdown";

type Props = {
  user: UserRead | null;
  side?: "left" | "right" | "top" | "bottom";
};

export default function UserNavi({ user }: Props) {
  const avatar = <UserAvatar user={user} />;
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen(e: Event) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <UserAvatar user={user} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <UserDropdown avatar={avatar} side={side} toggleOpen={toggleOpen} />
    </DropdownMenu>
  );
}
