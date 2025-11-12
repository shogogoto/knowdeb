import { useCallback, useEffect } from "react";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import {
  useGetArchievementHistoryUserArchievementHistoryPost,
  useGetUserActivityUserActivityPost,
} from "~/shared/generated/public-user/public-user";

export default function useUserDetail({
  user,
}: { user: UserReadPublic | undefined }) {
  const { data, isMutating, trigger } =
    useGetArchievementHistoryUserArchievementHistoryPost();

  const {
    data: activityData,
    trigger: activityTrigger,
    isMutating: activityIsMutating,
  } = useGetUserActivityUserActivityPost();

  const triggerUserDetail = useCallback(() => {
    if (user) {
      trigger({ user_ids: [user.uid] });
      activityTrigger({ user_ids: [user.uid] });
    }
  }, [trigger, activityTrigger, user]);

  useEffect(() => {
    triggerUserDetail();
  }, [triggerUserDetail]);

  const isLoading = isMutating || activityIsMutating;
  return {
    achievementsData: data,
    activityData,
    isLoading,
    triggerUserDetail,
  };
}
