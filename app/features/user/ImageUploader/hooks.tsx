import { toast } from "sonner";
import { useAuth } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/generated/fastAPI.schemas";
import { editUserProfile } from "../UserProfileForm/action";

export default function useOnUploadSuccess() {
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

  return { onUploadSuccess };
}
