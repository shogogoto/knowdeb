import { toast } from "sonner";
import { useAuth } from "~/features/auth/AuthProvider";
import type { UserRead } from "~/shared/generated/fastAPI.schemas";
import { editUserProfile } from "../UserProfileForm/action";

async function updateAvatarUrl(imageUrl: string) {
  const formData = new FormData();
  formData.append("avatar_url", imageUrl);
  const request = new Request("/user/edit", {
    method: "PATCH",
    body: formData,
  });
  return await editUserProfile({ request, params: {}, context: {} });
}

export function useOnUploadSuccess() {
  const { user, mutate } = useAuth();
  async function onUploadSuccess(imageUrl: string) {
    const res = await updateAvatarUrl(imageUrl);
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

export function useDeleteUploadedImage() {
  const { user, mutate } = useAuth();

  async function deleteImageAndUpdateUser() {
    if (user?.avatar_url) {
      const formData = new FormData();
      formData.append("public_id", user.uid);
      const res0 = await fetch("/user/deleteImage", {
        method: "POST",
        body: formData,
      });
      if (!res0.ok) {
        toast.error("画像の削除に失敗しました");
        throw new Error("Failed to delete user image", { cause: res0 });
      }
      const res = await updateAvatarUrl("");
      if (!res.ok) {
        toast.error("avatar_urlの更新に失敗しました");
        throw new Error("Failed to upload user image url");
      }

      const u = { ...user, avatar_url: "" } as UserRead;
      mutate(
        { data: u, status: 200, headers: new Headers() },
        { revalidate: false },
      );
      toast.success("画像を更新しました");
    }
  }

  return { deleteImageAndUpdateUser };
}
