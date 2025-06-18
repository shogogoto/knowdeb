import type { Paging } from ".";

export function usePaging(paging: Paging, total: number) {
  const totalPages = Math.ceil(total / paging.size);
  const generatePagination = () => {
    const pages: (number | null)[] = [];
    pages.push(1); // Always add page 1

    // Add null if there's a gap after page 1
    if (paging.page > 3) {
      pages.push(null);
    }

    // Add page before current if not page 1
    if (paging.page > 2) {
      pages.push(paging.page - 1);
    }

    // Add current page if not page 1
    if (paging.page !== 1) {
      pages.push(paging.page);
    }

    // Add page after current if not last page
    if (paging.page < totalPages - 1) {
      pages.push(paging.page + 1);
    }

    // Add null if there's a gap before last page
    if (paging.page < totalPages - 2) {
      pages.push(null);
    }

    // Add last page if not page 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  return { totalPages, pages };
}
