import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { getTransformedImageUrl } from "./libs";

type Props = {
  user: UserRead;
};

export default function UserProfile({ user }: Props) {
  const avatarDisplayUrl = getTransformedImageUrl(
    user?.avatar_url,
    100,
    100,
    "fill",
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4 pt-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow-md flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          {avatarDisplayUrl ? (
            <img
              src={avatarDisplayUrl}
              alt="プロフィール画像"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-lg dark:text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
            {user?.display_name || "名無しさん"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
            {`@${user.id || "userId"}`}
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

      {/* デバッグ情報（必要に応じて削除してください） */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold">デバッグ情報:</h3>
        <p>ID: {user?.id as string}</p>
        <p>Email: {user?.email}</p>
        <p>Display Name: {user?.display_name}</p>
        <p>Profile: {user?.profile}</p>
        <p>Avatar URL: {user?.avatar_url}</p>
      </div>
    </div>
  );
}
