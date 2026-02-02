import Image from "next/image";
import { useMemo, useState } from "react";
import reviews from "../../data/reviews.json";

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

type ProductTabsProps = {
  description: string;
};

const reviewList = reviews as Review[];

const ASSETS = {
  filter: "/images/filtrele.png",
  latestArrow: "/images/latest_ok.png",
};

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faqs">("reviews");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest");
  const [visibleReviews, setVisibleReviews] = useState(6);

  const sortedReviews = useMemo(() => {
    const list = [...reviewList];
    const toDate = (value: string) => {
      const text = value.replace("Posted on ", "");
      const parsed = Date.parse(text);
      return Number.isNaN(parsed) ? 0 : parsed;
    };
    if (sortBy === "latest") {
      return list.sort((a, b) => toDate(b.date) - toDate(a.date));
    }
    if (sortBy === "highest") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list.sort((a, b) => a.rating - b.rating);
  }, [sortBy]);

  return (
    <>
      <section className="mt-10 border-b border-black/10 sm:mt-12">
        <div
          className="grid w-full grid-cols-3 text-center text-sm font-semibold text-zinc-500"
        >
          <button
            className={`w-full pb-3 border-b-2 ${
              activeTab === "details" ? "border-black text-black" : "border-transparent text-zinc-500"
            }`}
            onClick={() => setActiveTab("details")}
            type="button"
          >
            Product Details
          </button>
          <button
            className={`w-full pb-3 border-b-2 ${
              activeTab === "reviews" ? "border-black text-black" : "border-transparent text-zinc-500"
            }`}
            onClick={() => setActiveTab("reviews")}
            type="button"
          >
            Rating & Reviews
          </button>
          <button
            className={`w-full pb-3 border-b-2 ${
              activeTab === "faqs" ? "border-black text-black" : "border-transparent text-zinc-500"
            }`}
            onClick={() => setActiveTab("faqs")}
            type="button"
          >
            FAQs
          </button>
        </div>
      </section>

      {activeTab === "details" && (
        <section className="mt-6 sm:mt-8">
          <h2 className="text-xl font-bold">Product Details</h2>
          <p className="mt-3 text-sm leading-[1.7] text-black/60">
            {description}
          </p>
        </section>
      )}

      {activeTab === "reviews" && (
        <section className="mt-6 sm:mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                All Reviews{" "}
                <span className="text-zinc-500 font-normal">(451)</span>
              </h2>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100"
                aria-label="Filter reviews"
              >
                <Image src={ASSETS.filter} alt="Filter" width={20} height={20} unoptimized />
              </button>
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="flex h-10 min-w-[96px] items-center justify-between gap-2 rounded-full bg-zinc-100 px-3 text-[12px] font-medium text-black sm:px-4"
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  <span>{sortBy === "latest" ? "Latest" : sortBy === "highest" ? "Highest" : "Lowest"}</span>
                  <Image src={ASSETS.latestArrow} alt="Open" width={14} height={14} unoptimized />
                </button>
                {sortOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-full min-w-[160px] rounded-2xl border border-black/10 bg-white p-2 shadow-lg"
                    role="listbox"
                  >
                    {["latest", "highest", "lowest"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100"
                        onClick={() => {
                          setSortBy(value as "latest" | "highest" | "lowest");
                          setSortOpen(false);
                        }}
                      >
                        {value === "latest" ? "Latest" : value === "highest" ? "Highest" : "Lowest"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="rounded-full bg-black px-3 py-2 text-[12px] font-medium leading-[22px] text-white sm:px-5 sm:py-3 sm:text-sm"
                type="button"
              >
                Write a Review
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedReviews.slice(0, visibleReviews).map((review, index) => (
              <div
                key={review.id}
                className={`rounded-[20px] border border-black/10 p-5 ${index >= 3 ? "hidden sm:block" : ""}`}
              >
                <div className="flex items-center gap-1 text-sm text-[#FFC633]">
                  {"★★★★★"}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span>{review.name}</span>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                </div>
                <p className="mt-2 text-xs text-black/60">{review.text}</p>
                <p className="mt-3 text-[11px] text-zinc-400">{review.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              className="rounded-full border border-black/10 px-6 py-2 text-sm"
              type="button"
              onClick={() => setVisibleReviews((prev) => Math.min(prev + 2, reviewList.length))}
            >
              Load More Reviews
            </button>
          </div>
        </section>
      )}

      {activeTab === "faqs" && (
        <section className="mt-6 sm:mt-8">
          <h2 className="text-xl font-bold">FAQs</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600">
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="font-semibold text-zinc-900">How do I choose my size?</div>
              <p className="mt-2">Check the size chart and compare with a similar item you own.</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <div className="font-semibold text-zinc-900">Can I return this item?</div>
              <p className="mt-2">Returns are accepted within 30 days in original condition.</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
