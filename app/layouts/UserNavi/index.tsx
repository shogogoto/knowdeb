import { Dialog } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import LogoutDialogContent from "~/features/auth/SignOutDialog";
import UserAvatar from "~/features/user/UserAvatar";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { useIsMobile } from "~/hooks/use-mobile";
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
          <SidebarMenu>
            <SidebarMenuItem title="ユーザー">
              <SidebarMenuButton size="lg">
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <UserAvatar user={user} />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight ">
                      <span className="truncate font-medium">
                        {user?.display_name}
                      </span>
                      <span className="truncate text-xs">{`@${user?.username || user?.uid || "none"}`}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DropdownMenuTrigger>
        <UserDropdown side={side} />
      </DropdownMenu>
      <LogoutDialogContent />
    </Dialog>
  );
}
