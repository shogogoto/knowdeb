import { useLoaderData } from "react-router";
import UserProfile from "~/features/user/UserProfile";
import { searchUserUserSearchGet } from "~/shared/generated/public-user/public-user";
import type { Route } from "./+types/search";

export async function loader({ params }: Route.LoaderArgs) {
  const { userId } = params;

  const isUUID = (id: string | undefined): id is string => {
    if (!id) return false;
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  };

  const convertedUserId = isUUID(userId) ? userId.replace(/-/g, "") : userId;

  const response = await searchUserUserSearchGet({
    id: convertedUserId,
  });

  if (response.status !== 200 || !response.data) {
    throw new Response("Error fetching user data", { status: response.status });
  }

  if (response.data.length === 0) {
    throw new Response("User not found", { status: 404 });
  }

  if (response.data.length > 1) {
    throw new Response("Multiple users found", { status: 400 });
  }

  return response.data[0];
}

export default function UserSearch() {
  const user = useLoaderData<typeof loader>();
  return <UserProfile user={user} />;
}
