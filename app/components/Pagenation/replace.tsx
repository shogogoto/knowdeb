import _ from "lodash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  type PaginationLinkProps,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {
  n_page: number;
  current?: number;
};

export default function PagingNavi({ n_page, current }: Props) {
  function iprops(page: number) {
    return {
      page,
      isActive: page === current,
    };
  }

  return (
    <Pagination>
      <PaginationContent className="item-center">
        <PaginationItem>
          <PaginationPrevious to="#" />
        </PaginationItem>
        {n_page > 5 ? (
          <>
            <PageIndex to="#" {...iprops(1)} />
            <ScrollArea className="rounded-md border whitespace-nowrap">
              <div className="flex max-w-xs">
                {_.range(2, n_page).map((i) => (
                  <PageIndex key={`page-${i}`} to="#" {...iprops(i)} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <PageIndex to="#" {...iprops(n_page)} />
          </>
        ) : (
          <div className="flex max-w-xl">
            {Array.from({ length: n_page }).map((_, i) => (
              <PageIndex key={`page-${i + 1}`} to="#" {...iprops(i + 1)} />
            ))}
          </div>
        )}
        <PaginationItem>
          <PaginationNext to="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type PageIndexProps = {
  page: number;
} & PaginationLinkProps;

function PageIndex({ page, ...props }: PageIndexProps) {
  return (
    <PaginationItem>
      <PaginationLink {...props}>{page}</PaginationLink>
    </PaginationItem>
  );
}
