type PaginationItem = number | "...";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  items: PaginationItem[];
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  items,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
      <button
        className="rounded-lg border border-black/10 bg-white px-4 py-2"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <span className="mr-2">‹</span>
        Previous
      </button>
      <div className="flex items-center gap-2">
        {items.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2">
                ...
              </span>
            );
          }
          const page = item as number;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              className={`rounded-lg px-3 py-2 ${
                isActive ? "bg-black text-white" : "border border-transparent"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        className="rounded-lg border border-black/10 bg-white px-4 py-2"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
        <span className="ml-2">›</span>
      </button>
    </div>
  );
}
