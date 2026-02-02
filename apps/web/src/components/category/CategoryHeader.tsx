import Image from "next/image";

type CategoryHeaderProps = {
  title: string;
  showingText: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  onOpenFilters: () => void;
};

export default function CategoryHeader({
  title,
  showingText,
  sortBy,
  onSortChange,
  onOpenFilters,
}: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-[32px] font-bold leading-[43px] text-black">
          {title}
        </h1>
        <span className="text-[14px] font-normal leading-[19px] text-black/60 sm:hidden">
          {showingText}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-[14px] font-normal leading-[19px] text-black/60 sm:inline">
          {showingText}
        </span>
        <label
          className="hidden items-center gap-2 text-[16px] font-normal leading-[22px] text-black/60 sm:flex"
        >
          Sort by:
          <span className="inline-flex items-center gap-0">
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              className="appearance-none bg-transparent font-medium text-black outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="new">Newest</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
            </select>
            <span
              className="inline-flex h-4 w-4 -ml-0 items-center justify-center text-black outline-none"
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        </label>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 sm:hidden"
          onClick={onOpenFilters}
          aria-label="Open filters"
        >
          <Image src="/images/filtrele.png" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
