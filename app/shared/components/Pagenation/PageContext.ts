import type React from "react";

type PageContextType = {
  current?: number;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  handleSuccess: (newTotal: number, pageSize: number) => void;
};

const initial: PageContextType = {
  current: undefined,
  setCurrent: () => {},
  pageSize: 10,
  setPageSize: () => {},
  total: 0,
  setTotal: () => {},
  handleSuccess: () => {},
};

import { createContext } from "react";

const PageContext = createContext<PageContextType>(initial);

export default PageContext;
