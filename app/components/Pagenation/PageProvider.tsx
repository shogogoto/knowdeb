import { createContext, useCallback, useState } from "react";
import { useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import type { Paging } from ".";

export type PagenationState = {
  paging: Paging;
  setPaging: React.Dispatch<React.SetStateAction<Paging>>;
  startIndex: number;
  createPageUrl: (page: number) => string;
  handlePageChange: (page: number) => void;
  prev: number;
  next: (total: number) => number;
};
const initial: Paging = { page: 1, size: 50 };
export const PageContext = createContext<PagenationState>({
  paging: initial,
  setPaging: () => null,
  startIndex: 0,
  createPageUrl: () => "",
  handlePageChange: () => null,
  prev: 1,
  next: (total: number) => 1,
});

export default function PageProvider({ children }: React.PropsWithChildren) {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const [paging, setPaging] = useState<Paging>({
    page: pageParam ? Number.parseInt(pageParam, 10) : initial.page,
    size: sizeParam ? Number.parseInt(sizeParam, 10) : initial.size,
  });
  const startIndex = (paging.size ?? 0) * ((paging.page ?? 1) - 1) + 1;
  const prev = Math.max(1, paging.page - 1);
  function next(total: number) {
    return Math.min(total, paging.page + 1);
  }
  const createPageUrl = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      return `?${newParams.toString()}`;
    },
    [searchParams],
  );

  const navigate = useNavigate();
  const handlePageChange = useCallback(
    (page: number) => {
      if (page === paging.page) return;

      setPaging({ ...paging, page });
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      navigate(`?${newParams.toString()}`);
    },
    [paging, searchParams, navigate],
  );

  const value = {
    paging,
    setPaging,
    startIndex,
    createPageUrl,
    handlePageChange,
    prev,
    next,
  };
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
