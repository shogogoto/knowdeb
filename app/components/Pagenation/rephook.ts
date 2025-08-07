import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export type PageHookProps = {
  total: number;
  pageSize: number;
  currentPage?: number;
};

export default function usePagingNeo(props: PageHookProps) {
  const { total, pageSize, currentPage } = props;
  if (total < 0 || pageSize <= 0) {
    throw new Error(
      "total must be non-negative and pageSize must be positive.",
    );
  }
  const nPage = Math.ceil(total / pageSize);
  if (currentPage !== undefined && (currentPage < 1 || currentPage > nPage)) {
    throw new Error("currentPage must be between 1 and nPage.");
  }
  const [current, setCurrent] = useState(currentPage ?? 1);
  const location = useLocation();
  const navigate = useNavigate();

  function setPageUrlParam(currentPage: number) {
    const params = new URLSearchParams(location.search);
    params.set("page", String(currentPage));
    navigate(`${location.pathname}?${params.toString()}`);
  }
  // ------------------------------------- methods
  function currentNext() {
    if (current === nPage) return;
    setCurrent(current + 1);
  }
  function currentPrev() {
    if (current === 1) return;
    setCurrent(current - 1);
  }
  function updateCurrent(val: number) {
    if (val < 1) {
      setCurrent(1);
    }
    if (val > nPage) {
      setCurrent(nPage);
    }
    setCurrent(val);
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
