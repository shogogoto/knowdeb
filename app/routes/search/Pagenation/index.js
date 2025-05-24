"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchPagination;
var react_1 = require("react");
var react_router_1 = require("react-router");
var pagination_1 = require("~/components/ui/pagination");
var SearchContext_1 = require("../SearchContext");
function SearchPagination(_a) {
    var totalItems = _a.totalItems;
    var searchContext = (0, react_1.useContext)(SearchContext_1.default);
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    if (!searchContext) {
        throw new Error("SearchPagination must be used within a SearchProvider");
    }
    var paging = searchContext.paging, setPaging = searchContext.setPaging;
    var currentPage = paging.page || 1;
    var pageSize = paging.size || 100;
    var totalPages = Math.ceil(totalItems / pageSize);
    var createPageUrl = (0, react_1.useCallback)(function (page) {
        var newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        return "?".concat(newParams.toString());
    }, [searchParams]);
    var handlePageChange = (0, react_1.useCallback)(function (page) {
        setPaging(__assign(__assign({}, paging), { page: page }));
        // Update URL with new page parameter
        var newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        navigate("?".concat(newParams.toString()));
    }, [paging, setPaging, searchParams, navigate]);
    var generatePagination = function () {
        var pages = [];
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
    var pages = generatePagination();
    if (totalPages <= 1) {
        return null;
    }
    return (<pagination_1.Pagination>
      <pagination_1.PaginationContent>
        <pagination_1.PaginationItem>
          <pagination_1.PaginationPrevious href={createPageUrl(Math.max(1, currentPage - 1))} onClick={function (e) {
            if (currentPage > 1) {
                e.preventDefault();
                handlePageChange(currentPage - 1);
            }
        }}/>
        </pagination_1.PaginationItem>

        {pages.map(function (page, i) {
            if (page === null) {
                return <pagination_1.PaginationEllipsis />;
            }
            return (<pagination_1.PaginationItem key={"page-".concat(page)}>
              <pagination_1.PaginationLink href={createPageUrl(page)} isActive={page === currentPage} onClick={function (e) {
                    e.preventDefault();
                    handlePageChange(page);
                }}>
                {page}
              </pagination_1.PaginationLink>
            </pagination_1.PaginationItem>);
        })}

        <pagination_1.PaginationItem>
          <pagination_1.PaginationNext href={createPageUrl(Math.min(totalPages, currentPage + 1))} onClick={function (e) {
            if (currentPage < totalPages) {
                e.preventDefault();
                handlePageChange(currentPage + 1);
            }
        }}/>
        </pagination_1.PaginationItem>
      </pagination_1.PaginationContent>
    </pagination_1.Pagination>);
}
