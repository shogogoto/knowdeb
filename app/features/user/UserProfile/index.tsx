import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useAuth } from "~/features/auth/AuthProvider";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex justify-between items-start">
        <Dialog>
          <DialogTrigger asChild>
            <Avatar className="h-24 w-24 cursor-pointer">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                alt={user?.display_name ?? undefined}
              />
              <AvatarFallback>
                {user?.display_name?.charAt(0) || "N"}
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="p-0 border-0 max-w-md w-full">
            <img
              src={user?.avatar_url ?? undefined}
              alt={user?.display_name ?? undefined}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
        <Button asChild className="px-4 py-2 text-md">
          <Link to="/user/edit">編集</Link>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
          {user?.display_name || "名無しさん"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
          {`@${user?.username || user?.uid || "userId"}`}
        </p>
      </div>

      <div className="text-gray-700 dark:text-gray-200 text-base pt-4 overflow-hidden break-words whitespace-pre-line">
        {user?.profile || "プロフィールが設定されていません。"}
      </div>
    </div>
  );
}
