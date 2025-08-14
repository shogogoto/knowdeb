import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { UserProps } from "../types";
import ProfileImage from "./ProfileImage";

export default function UserProfile({ user }: UserProps) {
  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex item-center space-x-4">
        <ProfileImage user={user} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
            {user?.display_name || "名無しさん"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
            {`@${user?.username || user?.uid || "userId"}`}
          </p>
        </div>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-base pt-4 overflow-hidden break-words whitespace-pre-line">
        {user?.profile || "プロフィールが設定されていません。"}
      </div>
      <Button asChild className="px-4 py-2 text-md">
        <Link to="/user/edit">プロフィールを編集</Link>
      </Button>
    </div>
  );
}
