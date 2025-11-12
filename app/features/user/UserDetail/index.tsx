import { useState } from "react";
import Loading from "~/shared/components/Loading";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/components/ui/collapsible";
import type {
  getArchievementHistoryUserArchievementHistoryPostResponse,
  getUserActivityUserActivityPostResponse,
} from "~/shared/generated/public-user/public-user";
import AchieveHistoryChart from "../AchieveHistory";
import AchieveHistoryTable from "../AchieveHistory/HistoryTable";
import ActivityBoard from "../Activity";
import UserProfile from "../UserProfile";
import type { UserProps } from "../types";

type Props = UserProps &
  React.PropsWithChildren & {
    achievementsData:
      | getArchievementHistoryUserArchievementHistoryPostResponse
      | undefined;
    activityData: getUserActivityUserActivityPostResponse | undefined;
    isLoading: boolean;
  };

export default function UserDetail({
  user,
  children,
  achievementsData,
  activityData,
  isLoading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md">
      {children}
      <UserProfile user={user} />
      {isLoading && <Loading type="center-x" />}
      {!isLoading && activityData?.data && activityData.status === 200 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <ActivityBoard activity={activityData.data[0]} isOpen={isOpen} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {achievementsData?.data && achievementsData.status === 200 && (
              <div className="flex flex-col space-y-10">
                <AchieveHistoryChart aHistories={achievementsData.data} />
                <AchieveHistoryTable aHistories={achievementsData.data} />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
