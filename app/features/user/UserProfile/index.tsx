import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/generated/fastAPI.schemas";
import UploadWidget from "../ImageUploader/UploadWidget";
import UserProfileImage from "../UserAvatar/UserProfileImage";
import { editUserProfile } from "../UserProfileForm/action";

export default function UserProfile() {
  const { user, mutate } = useAuth();
  async function onUploadSuccess(imageUrl: string) {
    const formData = new FormData();
    formData.append("avatar_url", imageUrl);
    const request = new Request("/user/edit", {
      method: "PATCH",
      body: formData,
    });

    const res = await editUserProfile({ request, params: {}, context: {} });
    if (!res.ok) {
      toast.error("画像の更新に失敗しました");
      throw new Error("Failed to upload user image url");
    }

    const u = { ...user, avatar_url: imageUrl } as UserRead;
    mutate(
      { data: u, status: 200, headers: new Headers() },
      { revalidate: false },
    );
    toast.success("画像を更新しました");
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex justify-between items-start">
        <UserProfileImage user={user} />
        <Button asChild className="px-4 py-2 text-md">
          <Link to="/user/edit">編集</Link>
        </Button>
        <UploadWidget
          publicId={user?.uid as string}
          onUploadSuccess={onUploadSuccess}
        />
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
