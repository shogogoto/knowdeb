import { useCallback, useContext } from "react";
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
import SearchContext from "../SearchContext";

type PaginationProps = {
  totalItems: number;
};

export default function SearchPagination({ totalItems }: PaginationProps) {
  const searchContext = useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!searchContext) {
    throw new Error("SearchPagination must be used within a SearchProvider");
  }

  const { paging, setPaging } = searchContext;
  const currentPage = paging.page || 1;
  const pageSize = paging.size || 100;
  const totalPages = Math.ceil(totalItems / pageSize);

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

  const generatePagination = () => {
    const pages: (number | null)[] = [];
    pages.push(1); // Always add page 1

    // Add null if there's a gap after page 1
    if (currentPage > 3) {
      pages.push(null);
    }

    // Add page before current if not page 1
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    // Add current page if not page 1
    if (currentPage !== 1) {
      pages.push(currentPage);
    }

    // Add page after current if not last page
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }

    // Add null if there's a gap before last page
    if (currentPage < totalPages - 2) {
      pages.push(null);
    }

    // Add last page if not page 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(Math.max(1, currentPage - 1))}
            onClick={(e) => {
              if (currentPage > 1) {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {pages.map((page, i) => {
          if (page === null) {
            return <PaginationEllipsis />;
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageUrl(page)}
                isActive={page === currentPage}
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
            href={createPageUrl(Math.min(totalPages, currentPage + 1))}
            onClick={(e) => {
              if (currentPage < totalPages) {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
