import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import type { User } from "~/generated/fastAPI.schemas";
import { useIsMobile } from "~/hooks/use-mobile";
import UserAvatar from "../UserAvatar";
import UserDropdown from "./UserDropdown";

type Props = {
  user: User | null;
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
        <SidebarMenuItem>
          <SidebarMenuButton>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Avatar>
                <AvatarImage
                  src={user?.avatar_url || ""}
                  alt={user?.display_name || "no name"}
                />
                <AvatarFallback className="rounded-lg">img</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight ">
              <span className="truncate font-medium">{user?.display_name}</span>
              <span className="truncate text-xs">{`@${user ? user?.id : "userId"}`}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <UserDropdown avatar={avatar} side={side} toggleOpen={toggleOpen} />
    </DropdownMenu>
  );
}
