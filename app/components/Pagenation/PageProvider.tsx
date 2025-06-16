import { createContext, useState } from "react";
import { useSearchParams } from "react-router";
import type { PagenationState, Paging } from ".";

const initial: Paging = { page: 1, size: 50 };
export const PageContext = createContext<PagenationState>({
  paging: initial,
  setPaging: () => null,
});

export default function PageProvider({
  children,
}: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const sizeParam = searchParams.get("size");
  const [paging, setPaging] = useState<Paging>({
    page: pageParam ? Number.parseInt(pageParam, 10) : initial.page,
    size: sizeParam ? Number.parseInt(sizeParam, 10) : initial.size,
  });
  const value = { paging, setPaging };
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
