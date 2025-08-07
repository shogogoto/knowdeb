import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "../ui/button";
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

const PagingNaviProps = z.object({
  n_page: z.number().int().nonnegative(),
  current: z.number().int().nonnegative().optional(),
});

type Props = z.infer<typeof PagingNaviProps>;

export default function PagingNavi(props: Props) {
  const { n_page, current } = PagingNaviProps.parse(props);
  if (current && (current < 1 || current > n_page)) {
    throw new Error("現在ページが有効範囲外");
  }

  function iprops(page: number) {
    return {
      page,
      isActive: page === current,
    };
  }

  const isFirst = current === 1;
  const isLast = current === n_page;

  return (
    <Pagination>
      <PaginationContent className="item-center">
        <PaginationItem>
          {isFirst ? (
            <DisabledPrevNext isPrev />
          ) : (
            <PaginationPrevious to="#" />
          )}
        </PaginationItem>
        {n_page > 5 ? (
          <>
            <PageIndex to="#" {...iprops(1)} />
            <ScrollArea className="rounded-md whitespace-nowrap">
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
          {isLast ? <DisabledPrevNext /> : <PaginationNext to="#" />}
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
      {props.isActive ? (
        <Button variant="outline" size="icon" disabled>
          {page}
        </Button>
      ) : (
        <PaginationLink {...props} size="icon">
          {page}
        </PaginationLink>
      )}
    </PaginationItem>
  );
}

function DisabledPrevNext({ isPrev }: { isPrev?: boolean }) {
  const icon = isPrev ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  const txt = (
    <span className="hidden sm:block">{isPrev ? "Previous" : "Next"}</span>
  );

  return (
    <Button
      disabled
      variant="ghost"
      size="default"
      className="gap-1 px-2.5 sm:pl-2.5"
    >
      {isPrev ? [icon, txt] : [txt, icon]}
    </Button>
  );
}
