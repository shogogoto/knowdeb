import React from "react";

export type PagingState = {
  current?: number;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

const initial: PagingState = {
  current: 1,
  setCurrent: () => {},
  pageSize: 10,
  setPageSize: () => {},
};

export const PContext = React.createContext<PagingState>(initial);
