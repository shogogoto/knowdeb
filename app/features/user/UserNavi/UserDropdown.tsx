import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

import type { ReactNode } from "react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { LogoutDialog } from "~/features/auth/SignOutDialog";

type Props = {
  avatar: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  toggleOpen?: (e: Event) => void;
};

export default function UserDropdown({ avatar, side, toggleOpen }: Props) {
  return (
    <DropdownMenuContent
      side={side}
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
    >
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuGroup>
          <UserDropdownItem icon={<Sparkles />} title="Upgrade to Pro" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <UserDropdownItem icon={<BadgeCheck />} title="Account" />
          <UserDropdownItem icon={<CreditCard />} title="Billing" />
          <UserDropdownItem icon={<Bell />} title="Notifications" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutDialog>
          <DropdownMenuItem onSelect={toggleOpen}>
            <LogOut />
            LogOut
          </DropdownMenuItem>
        </LogoutDialog>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function UserDropdownItem({
  icon,
  title,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <DropdownMenuItem onClick={onClick}>
      {icon}
      {title}
    </DropdownMenuItem>
  );
}
