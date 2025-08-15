import LogoutDialogContent from "~/features/auth/SignOutDialog";
import UserAvatar from "~/features/user/UserAvatar";
import { Dialog } from "~/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/shared/components/ui/sidebar";
import type { UserRead } from "~/shared/generated/fastAPI.schemas";
import { useIsMobile } from "~/shared/hooks/use-mobile";
import UserDropdown from "./UserDropdown";

type Props = {
  user: UserRead | undefined;
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
