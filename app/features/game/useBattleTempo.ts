import { useContext, useState } from "react";
import useSWR from "swr";
import { AuthContext } from "~/features/auth/AuthProvider";
import { gameRequest } from "./battle";

export type BattleTempo = "slow" | "medium" | "fast";
export default function useBattleTempo() {
  const auth = useContext(AuthContext);
  const uid = auth?.user?.uid;
  const [local, setLocal] = useState<BattleTempo>("medium");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const { data, mutate } = useSWR(
    uid ? ["battle-preferences", uid] : null,
    () => gameRequest<{ tempo: BattleTempo }>("battle/preferences"),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  return {
    tempo: data?.tempo ?? local,
    error,
    saving,
    async change(tempo: BattleTempo) {
      setError(undefined);
      if (!uid) {
        setLocal(tempo);
        return;
      }
      setSaving(true);
      try {
        const value = await gameRequest<{ tempo: BattleTempo }>(
          "battle/preferences",
          { tempo },
          "PUT",
        );
        await mutate(value, false);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "速度を保存できませんでした。",
        );
      } finally {
        setSaving(false);
      }
    },
  };
}
