import { useState } from "react";
import { PContext } from "./rephook";
import type { PaginationProps } from "./replace";

type Props = PaginationProps & React.PropsWithChildren;

export function PProvider(props: Props) {
  const [current, setCurrent] = useState(props.initial);
  const [_pageSize, setPageSize] = useState(props.pageSize);

  const value = {
    current,
    setCurrent,
    pageSize: _pageSize,
    setPageSize,
  };

  return <PContext.Provider value={value}>{props.children}</PContext.Provider>;
}
