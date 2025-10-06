import { BookText, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/shared/components/ui/card";
import type { UserSearchRow } from "~/shared/generated/fastAPI.schemas";
import UserAvatar from "../UserAvatar";

type Props = {
  row: UserSearchRow;
};

export function UserCard({ row }: Props) {
  const { user, archivement } = row;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} />
          <div className="flex items-baseline space-x-2">
            <Link
              to={`/user/${user.username || user.uid}`}
              className="font-semibold text-lg hover:underline"
            >
              {user.display_name || user.username}
            </Link>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {user.profile}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <FileText className="mr-1 h-4 w-4" />
          <span>{archivement.n_resource}</span>
        </div>
        <div className="flex items-center">
          <BookText className="mr-1 h-4 w-4" />
          <span>{archivement.n_sentence}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1 h-4 w-4" />
          <span>{archivement.n_char}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
