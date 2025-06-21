import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { User } from "../types";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <>
      <Avatar className="size-8 rounded-lg">
        <AvatarImage src={user.avatar_src} alt={user.name} />
        <AvatarFallback className="rounded-lg">img</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight ">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs">{user.display_name}</span>
      </div>
    </>
  );
}
