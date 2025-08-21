export const historyTypes = ["user", "knowde", "resource", "search"] as const;
export type HistoryType = (typeof historyTypes)[number];

export type HistoryItem = {
  id?: number; // auto-increment
  type: HistoryType;
  title: string;
  url: string;
  timestamp: number;
};
