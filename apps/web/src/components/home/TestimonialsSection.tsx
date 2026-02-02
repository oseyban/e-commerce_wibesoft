import { useState } from "react";
import testimonials from "../../data/testimonials.json";
import RatingRow from "./Rating";

export default function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(1);

  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-5">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2
          className="text-[28px] font-bold leading-[34px] text-black underline decoration-2 sm:no-underline sm:text-[48px] sm:leading-[58px]"
          style={{ fontFamily: "var(--font-integral), sans-serif" }}
        >
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="flex gap-2">
          <button
            className="h-8 w-8 rounded-full border border-zinc-300"
            onClick={() =>
              setTestimonialIndex((prev) =>
                prev <= 0 ? testimonials.length - 1 : prev - 1
              )
            }
            type="button"
            aria-label="Previous testimonials"
          >
            ←
          </button>
          <button
            className="h-8 w-8 rounded-full border border-zinc-300"
            onClick={() =>
              setTestimonialIndex((prev) =>
                prev >= testimonials.length - 1 ? 0 : prev + 1
              )
            }
            type="button"
            aria-label="Next testimonials"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:hidden">
        {testimonials.slice(0, 1).map((item) => (
          <div key={item.id} className="rounded-2xl border border-zinc-200 p-5">
            <RatingRow />
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <span>{item.name}</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px]">
                ✓
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="relative hidden overflow-hidden sm:block">
        <div
          className="flex items-stretch gap-4 transition-transform duration-300"
          style={{
            transform: `translateX(calc(50% - ${testimonialIndex * 336 + 160}px))`,
          }}
        >
          {testimonials.map((item, idx) => {
            const distance = Math.abs(idx - testimonialIndex);
            const faded = distance > 1;
            return (
              <div
                key={item.id}
                className={`min-w-[320px] rounded-2xl border border-zinc-200 p-5 transition ${
                  faded ? "opacity-25" : "opacity-100"
                }`}
              >
                <RatingRow />
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                  <span>{item.name}</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px]">
                    ✓
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
