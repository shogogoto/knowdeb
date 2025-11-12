import { useLoaderData } from "react-router";
import UserDetail from "~/features/user/UserDetail";
import useUserDetail from "~/features/user/UserDetail/hooks";
import { userProfileUserProfileUsernameGet } from "~/shared/generated/public-user/public-user";
import type { Route } from "./+types/detail";

export async function loader({ params }: Route.LoaderArgs) {
  const { userId } = params;

  const response = await userProfileUserProfileUsernameGet(userId);

  if (response.status !== 200 || !response.data) {
    throw new Response("Error fetching user data", { status: response.status });
  }

  return response.data;
}

export default function _() {
  const data = useLoaderData<typeof loader>();
  const props = useUserDetail({ user: data });
  return <UserDetail user={data} {...props} />;
}
