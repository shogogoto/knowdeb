import { useEffect } from "react";
import Loading from "~/shared/components/Loading";
import { useGetArchievementHistoryUserArchievementHistoryPost } from "~/shared/generated/public-user/public-user";
import AchieveHistory from "../AchieveHistory";
import UserProfile from "../UserProfile";
import type { UserProps } from "../types";

export default function UserDetail({ user }: UserProps) {
  const { data, isMutating, trigger } =
    useGetArchievementHistoryUserArchievementHistoryPost();

  useEffect(() => {
    if (user) {
      trigger({ user_ids: [user.uid] });
    }
  }, [user, trigger]);

  return (
    <div>
      <UserProfile user={user} />
      {isMutating && <Loading type="center-x" />}
      {data?.data && data.status === 200 && (
        <AchieveHistory aHistories={data.data} />
      )}
    </div>
  );
}
