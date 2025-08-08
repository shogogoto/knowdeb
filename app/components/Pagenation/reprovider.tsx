import { useState } from "react";
import { PContext } from "./rephook";
import type { PaginationProps } from "./replace";

type Props = PaginationProps & React.PropsWithChildren;

export function PProvider(props: Props) {
  // const parsed = _PagingNaviProps.parse(props);
  const { total, pageSize, initial } = props;
  const [current, setCurrent] = useState(initial);
  if (total < 0 || pageSize <= 0) {
    throw new Error(
      "total must be non-negative and pageSize must be positive.",
    );
  }
  const [_pageSize, setPageSize] = useState(props.pageSize);

  const nPage = Math.ceil(total / _pageSize);
  if (current && (current < 1 || current > nPage)) {
    throw new Error("現在ページが有効範囲外");
  }

  const value = {
    current,
    setCurrent,
    pageSize: _pageSize,
    setPageSize,
    nPage,
  };

  return <PContext.Provider value={value}>{props.children}</PContext.Provider>;
}
