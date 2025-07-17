import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "react-router";
import type { UserUpdate } from "~/generated/fastAPI.schemas";
import { usersPatchCurrentUserUserMePatch } from "~/generated/user/user"; // orvalが生成したAPIクライアント
import { UserProfileSchema } from ".";

export async function editUserProfile({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: UserProfileSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const userUpdate: UserUpdate = {
    display_name: submission.value.display_name,
    profile: submission.value.profile,
    avatar_url: submission.value.avatar_url,
    username: submission.value.username,
  };

  try {
    const res = await usersPatchCurrentUserUserMePatch(userUpdate, {
      credentials: "include",
    });

    if (res.status !== 200) {
      // APIからのエラーメッセージを適切に取得しようと試みる
      const errorData = res.data as { detail?: string | { msg: string } };
      let errorMessage = "不明なエラー";
      if (typeof errorData?.detail === "string") {
        errorMessage = errorData.detail;
      } else if (typeof errorData?.detail?.msg === "string") {
        errorMessage = errorData.detail.msg;
      }
      return submission.reply({
        formErrors: [`プロフィールの更新に失敗しました: ${errorMessage}`],
      });
    }

    return Response.json({ message: "プロフィールを更新しました。" });
  } catch (e) {
    // ネットワークエラーなど、fetch自体が失敗した場合
    return submission.reply({
      formErrors: ["サーバーとの通信中にエラーが発生しました。"],
    });
  }
}
