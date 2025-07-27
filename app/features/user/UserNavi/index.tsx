import { Dialog } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import LogoutDialogContent from "~/features/auth/SignOutDialog";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { useIsMobile } from "~/hooks/use-mobile";
import UserAvatar from "../UserAvatar";
import UserDropdown from "./UserDropdown";

type Props = {
  user: UserRead | null;
  side?: "left" | "right" | "top" | "bottom";
};

export default function UserNavi({ user }: Props) {
  const isMobile = useIsMobile();
  const side = isMobile ? "bottom" : "right";

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <UserAvatar user={user} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DropdownMenuTrigger>
        <UserDropdown side={side} />
      </DropdownMenu>
      <LogoutDialogContent />
    </Dialog>
  );
}
