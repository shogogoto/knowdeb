import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  useContext,
  useEffect,
  useRef,
} from "react";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  type PaginationLinkProps,
  PaginationNext,
  PaginationPrevious,
} from "~/shared/components/ui/pagination";
import { ScrollArea, ScrollBar } from "~/shared/components/ui/scroll-area";
import PageContext from "./PageContext";

export const _PagingNaviProps = z.object({
  pageSize: z.number().int().positive(),
  initial: z.number().int().positive().optional(),
});

export type PaginationProps = z.infer<typeof _PagingNaviProps>;

export function numberPage(total: number, pageSize: number) {
  if (total < 0 || pageSize <= 0) {
    throw new Error(
      "total must be non-negative and pageSize must be positive.",
    );
  }
  return Math.ceil(total / pageSize);
}

type Props = {
  total: number;
};

export default function PagingNavi({ total }: Props) {
  const { current, setCurrent, pageSize, setTotal } = useContext(PageContext);
  useEffect(() => {
    setTotal(total);
  }, [total, setTotal]);

  if (total < 0 || pageSize <= 0) {
    throw new Error(
      "total must be non-negative and pageSize must be positive.",
    );
  }

  const nPage = numberPage(total, pageSize);
  if (total > 0 && !!current && (current < 1 || current > nPage)) {
    throw new Error(
      `現在ページが有効範囲外${JSON.stringify({ current, nPage, total })}`,
    );
  }
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

  const iprops = (page: number) => ({ page, isActive: page === current });
  const isFirst = current === 1;
  const isLast = current === nPage;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem key="prev">
          {isFirst ? (
            <DisabledPrevNext isPrev key="prev-disabled" />
          ) : (
            <PaginationPrevious to="#" onClick={currentPrev} />
          )}
        </PaginationItem>
        {nPage > 5 ? (
          <>
            <PageIndex to="#" {...iprops(1)} onClick={() => updateCurrent(1)} />
            <ScrollArea
              className="rounded-md whitespace-nowrap
              max-w-[calc(100vw-12rem)] md:max-w-xs lg:max-w-md"
            >
              <div className="flex w-full">
                {_.range(2, nPage).map((i) => (
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
              {...iprops(nPage)}
              onClick={() => updateCurrent(nPage)}
            />
          </>
        ) : (
          <div className="flex">
            {Array.from({ length: nPage }).map((_, i) => (
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
        inline: "nearest", // 横方向の中央に表示
        block: "nearest", // 縦方向の中央に表示
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
