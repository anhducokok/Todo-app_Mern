import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { FilterTypes } from "@/lib/data";
const TaskListPagination = ({
  handleNextPage,
  handlePrevPage,
  currentPage,
  totalPages,
  onPageChange,
  activeTaskCount = 0,
  completedTaskCount = 0,
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };
  return (
    <>
      <div className=" items-start justify-between gap-4 sm:flex-row sm:items-center w-3/4 mb-4">
        {/* Phần thống kê */}
        <div className="flex gap-3">
          <Badge
            variant="secondary"
            className="bg-white/50 text-accent-foreground border-info/20"
          >
            {activeTaskCount} {FilterTypes.active}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-white/50 text-success border-success/20"
          >
            {completedTaskCount} {FilterTypes.completed}
          </Badge>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={currentPage === 1 ? undefined : handlePrevPage}
                  className={cn("cursor-pointer", {
                    "opacity-50 pointer-events-none": currentPage === 1,
                  })}
                />
              </PaginationItem>
              {generatePageNumbers().map((page, index) =>
                page === "..." ? (
                  <PaginationEllipsis key={`ellipsis-${index}`} />
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      className={cn("cursor-pointer hover:underline", {
                        " pointer-events-none bg-red-300": currentPage === page,
                      })}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={
                    currentPage === totalPages ? undefined : handleNextPage
                  }
                  className={cn("cursor-pointer", {
                    "opacity-50 pointer-events-none":
                      currentPage === totalPages,
                  })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default TaskListPagination;
