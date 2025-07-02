import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { UserRead } from "~/generated/fastAPI.schemas";

type Props = {
  user: UserRead | null;
};

export default function UserAvatar({ user }: Props) {
  return (
    <>
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
        <span className="truncate text-xs">{`@${user ? (user?.id as string) : "userId"}`}</span>
      </div>
    </>
  );
}
