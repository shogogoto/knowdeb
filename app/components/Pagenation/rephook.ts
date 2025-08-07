import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { PaginationProps } from "./replace";

export default function usePagingNeo(props: PaginationProps) {
  const { total, pageSize, initial } = props;
  if (total < 0 || pageSize <= 0) {
    throw new Error(
      "total must be non-negative and pageSize must be positive.",
    );
  }
  const nPage = Math.ceil(total / pageSize);
  if (initial !== undefined && (initial < 1 || initial > nPage)) {
    throw new Error("initial must be between 1 and nPage.");
  }
  const [current, setCurrent] = useState(initial);
  const location = useLocation();
  const navigate = useNavigate();

  function setPageUrlParam(currentPage: number) {
    const params = new URLSearchParams(location.search);
    params.set("page", String(currentPage));
    navigate(`${location.pathname}?${params.toString()}`);
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
    setPageUrlParam,
    currentNext,
    currentPrev,
    updateCurrent,
  };
}
