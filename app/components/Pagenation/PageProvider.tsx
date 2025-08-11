import { useState } from "react";
import type { PaginationProps } from ".";
import PageContext from "./PageContext";

type Props = PaginationProps & React.PropsWithChildren;

export function PageProvider(props: Props) {
  const [current, setCurrent] = useState(props.initial);
  const [_pageSize, setPageSize] = useState(props.pageSize);
  const [_total, setTotal] = useState(0);

  const value = {
    current,
    setCurrent,
    pageSize: _pageSize,
    setPageSize,
    total: _total,
    setTotal,
  };

  return (
    <PageContext.Provider value={value}>{props.children}</PageContext.Provider>
  );
}
