import { useEffect } from "react";
import {
  useGetArchievementHistoryUserArchievementHistoryPost,
  useGetUserActivityUserActivityPost,
} from "~/shared/generated/public-user/public-user";
import AchieveHistoryChart from "../AchieveHistory";
import AchieveHistoryTable from "../AchieveHistory/HistoryTable";
import ActivityBoard from "../Activity";
import UserProfile from "../UserProfile";
import type { UserProps } from "../types";

export default function UserDetail({
  user,
  children,
}: UserProps & React.PropsWithChildren) {
  const { data, isMutating, trigger } =
    useGetArchievementHistoryUserArchievementHistoryPost();

  const {
    data: activityData,
    trigger: activityTrigger,
    isMutating: activityIsMutating,
  } = useGetUserActivityUserActivityPost();
  useEffect(() => {
    if (user) {
      trigger({ user_ids: [user.uid] });
      activityTrigger({ user_ids: [user.uid] });
    }
  }, [user, trigger, activityTrigger]);

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md">
      {children}
      <UserProfile user={user} />
      {/* {activityIsMutating && <Loading type="center-x" />} */}
      {activityData?.data && activityData.status === 200 && (
        <ActivityBoard activity={activityData.data[0]} />
      )}
      {/* {isMutating && <Loading type="center-x" />} */}
      {data?.data && data.status === 200 && (
        <div className="flex flex-col space-y-10">
          <AchieveHistoryChart aHistories={data.data} />
          <AchieveHistoryTable aHistories={data.data} />
        </div>
      )}
    </div>
  );
}
