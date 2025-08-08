import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ButtonHTMLAttributes, useEffect, useRef } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  type PaginationLinkProps,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import usePagingNeo from "./rephook";

export const _PagingNaviProps = z.object({
  total: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  initial: z.number().int().positive().optional(),
});

export type PaginationProps = z.infer<typeof _PagingNaviProps>;

export default function PagingNavi() {
  const { n_page, current, currentNext, currentPrev, updateCurrent } =
    usePagingNeo();

  const iprops = (page: number) => ({ page, isActive: page === current });

  const isFirst = current === 1;
  const isLast = current === n_page;

  return (
    <Pagination>
      <PaginationContent className="">
        <PaginationItem key="prev">
          {isFirst ? (
            <DisabledPrevNext isPrev key="prev-disabled" />
          ) : (
            <PaginationPrevious to="#" onClick={currentPrev} />
          )}
        </PaginationItem>
        {n_page > 5 ? (
          <>
            <PageIndex to="#" {...iprops(1)} onClick={() => updateCurrent(1)} />
            <ScrollArea
              className="rounded-md whitespace-nowrap
              max-w-[calc(100vw-12rem)] md:max-w-xs lg:max-w-md"
            >
              <div className="flex w-full">
                {_.range(2, n_page).map((i) => (
                  <PageIndex
                    key={`page-${i}`}
                    to="#"
                    {...iprops(i)}
                    onClick={() => updateCurrent(i)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <PageIndex
              to="#"
              key={"page-last"}
              {...iprops(n_page)}
              onClick={() => updateCurrent(n_page)}
            />
          </>
        ) : (
          <div className="flex">
            {Array.from({ length: n_page }).map((_, i) => (
              <PageIndex
                key={`page-${i + 1}`}
                to="#"
                {...iprops(i + 1)}
                onClick={() => updateCurrent(i + 1)}
              />
            ))}
          </div>
        )}
        <PaginationItem key="next">
          {isLast ? (
            <DisabledPrevNext key="next-disabled" />
          ) : (
            <PaginationNext to="#" onClick={currentNext} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type PageIndexProps = {
  page: number;
} & PaginationLinkProps;

function PageIndex({ page, ...props }: PageIndexProps) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (props.isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth", // スムーズなスクロール効果
        inline: "center", // 横方向の中央に表示
      });
    }
  }, [props.isActive]);

  return (
    <PaginationItem ref={ref}>
      <PaginationLink {...props} size="icon">
        {page}
      </PaginationLink>
    </PaginationItem>
  );
}

function DisabledPrevNext({
  isPrev,
  ...props
}: { isPrev?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
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
      {...props}
    >
      {/* Each child in a list should have a unique "key" prop. と怒られる */}
      {isPrev ? (
        <>
          {icon}
          {txt}
        </>
      ) : (
        <>
          {txt}
          {icon}
        </>
      )}
    </Button>
  );
}
