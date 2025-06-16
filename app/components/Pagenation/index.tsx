import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { usePaging } from "./hooks";

export type Paging = {
  page: number;
  size: number;
};

export type PagenationState = {
  paging: Paging;
  setPaging: React.Dispatch<React.SetStateAction<Paging>>;
};

type PaginationProps = {
  total: number;
  state: PagenationState;
};

export function getStartIndex(paging: Paging) {
  return (paging.size ?? 0) * ((paging.page ?? 1) - 1) + 1;
}

export default function PageNavi({ total, state }: PaginationProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { paging, setPaging } = state;
  const { totalPages, pages, start } = usePaging(paging, total);

  const createPageUrl = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      return `?${newParams.toString()}`;
    },
    [searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPaging({ ...paging, page });
      // Update URL with new page parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      navigate(`?${newParams.toString()}`);
    },
    [paging, setPaging, searchParams, navigate],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(Math.max(1, paging.page - 1))}
            onClick={(e) => {
              if (paging.page > 1) {
                e.preventDefault();
                handlePageChange(paging.page - 1);
              }
            }}
          />
        </PaginationItem>

        {pages.map((page) => {
          if (page === null) {
            return <PaginationEllipsis />;
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageUrl(page)}
                isActive={page === paging.page}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageUrl(Math.min(totalPages, paging.page + 1))}
            onClick={(e) => {
              if (paging.page < totalPages) {
                e.preventDefault();
                handlePageChange(paging.page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
