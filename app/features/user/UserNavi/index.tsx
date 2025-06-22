import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import UserAvatar from "../UserAvatar";
import type { User } from "../types";
import UserDropdown from "./UserDropdown";

type Props = {
  user: User;
  side?: "left" | "right" | "top" | "bottom";
};

export default function UserNavi({ user }: { user: User }) {
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
        <SidebarMenuButton>{avatar}</SidebarMenuButton>
      </DropdownMenuTrigger>
      <UserDropdown avatar={avatar} side={side} toggleOpen={toggleOpen} />
    </DropdownMenu>
  );
}
