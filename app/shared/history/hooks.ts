import { useCallback, useEffect } from "react";
import { useLocation } from "react-router";
import useSWR, { useSWRConfig } from "swr";
import { historyCache } from "~/shared/lib/indexed";
import type { HistoryItemType } from "./types";

const SWR_KEY = "history";

export function useHistory() {
  const { data: histories } = useSWR(SWR_KEY, () => historyCache.getAll());
  const { mutate } = useSWRConfig();
  const location = useLocation();

  const addHistory = useCallback(
    async (item: Omit<HistoryItemType, "id" | "timestamp" | "url">) => {
      const url = location.pathname + location.search;
      await historyCache.add({ ...item, url });
      const newHistories = await historyCache.getAll();
      await mutate(SWR_KEY, newHistories, { revalidate: false });
    },
    [location, mutate],
  );

  return {
    histories: histories ?? [],
    addHistory,
  };
}

// useHighlightByHash は変更なし
export function useHighlightByHash(prefix = "history-") {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith(`#${prefix}`)) return;
    const elementId = hash.substring(1);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.transition = "background-color 0.5s ease-in-out";
      element.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
      setTimeout(() => {
        element.style.backgroundColor = "";
      }, 2000);
    }
  }, [prefix]);
}
