import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/AuthProvider";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex items-center space-x-4 pt-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
            {user?.display_name || "名無しさん"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
            {`@${user?.username || user?.uid || "userId"}`}
          </p>
        </div>
        <Button asChild className="px-4 py-2 text-md">
          <Link to="/user/edit">編集</Link>
        </Button>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-base mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden break-words">
        {user?.profile
          ? user.profile.length > 160
            ? `${user.profile.substring(0, 160)}...`
            : user.profile
          : "プロフィールが設定されていません。"}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold">デバッグ情報:</h3>
        <p>ID: {user?.uid as string}</p>
        <p>Email: {user?.email as string}</p>
        <p>Username: {user?.username as string}</p>
        <p>Display Name: {user?.display_name}</p>
        <p>Profile: {user?.profile}</p>
        <p>Avatar URL: {user?.avatar_url}</p>
      </div>
    </div>
  );
}
