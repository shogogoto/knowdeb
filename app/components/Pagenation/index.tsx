import React from "react";
import { useContext } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { PageContext } from "./PageProvider";
import { usePaging } from "./hooks";

export type Paging = {
  page: number;
  size: number;
};

type Props = { total: number };
function _PageNavi({ total }: Props) {
  const { paging, setPaging, createPageUrl, handlePageChange, prev, next } =
    useContext(PageContext);
  const { totalPages, pages } = usePaging(paging, total);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={createPageUrl(prev)}
            onClick={() => {
              setPaging({ ...paging, page: prev });
            }}
          />
        </PaginationItem>

        {pages.map((page) => {
          if (page === null) return <PaginationEllipsis />;
          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                to={createPageUrl(page)}
                isActive={page === paging.page}
                onClick={() => {
                  setPaging({ ...paging, page });
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            to={createPageUrl(next(total))}
            onClick={() => {
              setPaging({ ...paging, page: next(total) });
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const PageNavi = React.memo((props: Props) => <_PageNavi {...props} />);
export default PageNavi;
