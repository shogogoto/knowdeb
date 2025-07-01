import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { User } from "~/generated/fastAPI.schemas";

type Props = {
  user: User | null;
};

export default function UserAvatar({ user }: Props) {
  return (
    <>
      <Avatar className="size-8 rounded-lg">
        <AvatarImage
          src={user.avatar_url || ""}
          alt={user.display_name || "username"}
        />
        <AvatarFallback className="rounded-lg">img</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight ">
        <span className="truncate font-medium">{user.display_name}</span>
        <span className="truncate text-xs">{user.display_name}</span>
      </div>
    </>
  );
}
