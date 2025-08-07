import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {
  n_page: number;
  current?: number;
};

// 元の奴が手に追えないから新しく作り直す
export default function PagingNavi({ n_page }: Props) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious to="#" />
        </PaginationItem>
        <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
          <div className="flex w-max space-y-2">
            {Array.from({ length: n_page }, (_, i) => (
              <PaginationItem key={`page-${i + 1}`}>
                <PaginationLink to="#">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <PaginationItem>
          <PaginationNext to="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
