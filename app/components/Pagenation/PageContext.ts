import React from "react";

type PagingState = {
  current?: number;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

const initial: PagingState = {
  current: undefined,
  setCurrent: () => {},
  pageSize: 10,
  setPageSize: () => {},
};

const PageContext = React.createContext<PagingState>(initial);
export default PageContext;
