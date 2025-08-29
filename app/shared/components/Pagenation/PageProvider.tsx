import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { PaginationProps } from ".";
import PageContext from "./PageContext";

type Props = PaginationProps & React.PropsWithChildren;

export function PageProvider(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [current, setCurrent] = useState(
    Number(searchParams.get("page")) || props.initial,
  );
  const [_pageSize, setPageSize] = useState(props.pageSize);
  const [_total, setTotal] = useState(0);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (current) {
      newParams.set("page", String(current));
    } else {
      newParams.set("page", String(current));
    }
    newParams.set("size", String(_pageSize));

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [current, searchParams, setSearchParams, _pageSize]);

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
