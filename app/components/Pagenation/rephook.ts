import React from "react";

export type PagingState = {
  current?: number;
  pageSize: number;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  nPage: number;
};

const initial: PagingState = {
  pageSize: 10,
  setCurrent: () => {},
  current: 1,
  nPage: 1,
};

export const PContext = React.createContext<PagingState>(initial);

export default function usePagingNeo() {
  const { current, setCurrent, nPage } = React.useContext(PContext);
  if (current && (current < 1 || current > nPage)) {
    throw new Error("現在ページが有効範囲外");
  }

  // ------------------------------------- methods
  function currentNext() {
    if (!current || current === nPage) return;
    setCurrent(current + 1);
  }
  function currentPrev() {
    if (!current || current === 1) return;
    setCurrent(current - 1);
  }
  function updateCurrent(val: number) {
    if (val < 1) {
      setCurrent(1);
    } else if (val > nPage) {
      setCurrent(nPage);
    } else {
      setCurrent(val);
    }
  }
  return {
    n_page: nPage,
    current,
    location,
    currentNext,
    currentPrev,
    updateCurrent,
  };
}
