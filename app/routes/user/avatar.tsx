import { type ActionFunction, redirect } from "react-router";
import { getAuth } from "~/features/auth";
import { user } from "~/generated/user/user";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const avatar = formData.get("avatar") as File;
  const auth = getAuth();
  const currentUser = await auth.currentUser;
  if (!currentUser) {
    return redirect("/user/login");
  }

  try {
    await user.uploadAvatarUserAvatarPost(avatar, {
      headers: {
        Authorization: `Bearer ${await currentUser.getIdToken()}`,
      },
    });
    return redirect("/user/me");
  } catch (error) {
    console.error(error);
    return new Response("Avatar upload failed", { status: 500 });
  }
};
