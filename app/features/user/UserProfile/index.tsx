import { useEffect, useRef } from "react";
import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";
import { useHistory } from "~/shared/history/hooks";
import type { UserProps } from "../types";
import ProfileImage from "./ProfileImage";

export default function UserProfile({ user }: UserProps) {
  const addedRootIdRef = useRef<UserReadPublic | null>(null);

  const { addHistory, getUserTitle } = useHistory();
  useEffect(() => {
    if (!user) return;
    if (addedRootIdRef.current === user) return;
    addHistory({ title: getUserTitle(user) });
    addedRootIdRef.current = user;
  }, [addHistory, getUserTitle, user]);

  return (
    <>
      <div className="flex item-center space-x-4">
        <ProfileImage user={user} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 break-words">
            {user?.display_name || "名無しさん"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
            {`@${user?.username}`}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
            {`${user?.uid}`}
          </p>
        </div>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-base pt-4 overflow-hidden break-words whitespace-pre-line">
        {user?.profile || "プロフィールが設定されていません。"}
      </div>
    </>
  );
}
