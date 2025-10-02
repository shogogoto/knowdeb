import { useLoaderData } from "react-router";
import UserProfile from "~/features/user/UserProfile";
import { userProfileUserProfileUsernameGet } from "~/shared/generated/public-user/public-user";
import type { Route } from "./+types/search";

export async function loader({ params }: Route.LoaderArgs) {
  const { userId } = params;

  const response = await userProfileUserProfileUsernameGet(userId);

  if (response.status !== 200 || !response.data) {
    throw new Response("Error fetching user data", { status: response.status });
  }

  return response.data;
}

export default function UserSearch() {
  const data = useLoaderData<typeof loader>();
  return <UserProfile user={data} />;
}
