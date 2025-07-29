import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/AuthProvider";
import ProfileImage from "./ProfileImage";

export default function UserProfile() {
  const { user } = useAuth();

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
      {/* デバッグ情報（必要に応じて削除してください） */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold">デバッグ情報:</h3>
        <p>UID: {user?.uid}</p>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <p>Display Name: {user?.display_name}</p>
        <p>Profile: {user?.profile}</p>
        <p>Avatar URL: {user?.avatar_url}</p>
      </div>
    </div>
  );
}
