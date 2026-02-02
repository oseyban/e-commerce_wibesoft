type ColorOption = { name: string; value: string };

type FiltersPanelProps = {
  categories: string[];
  sizes: string[];
  colors: ColorOption[];
  dressStyles: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedColors: string[];
  selectedDressStyles: string[];
  priceBounds: { min: number; max: number };
  priceRange: [number, number];
  onChangePriceRange: (next: [number, number]) => void;
  activePriceThumb: "min" | "max";
  onActiveThumbChange: (next: "min" | "max") => void;
  onToggleCategory: (value: string) => void;
  onToggleSize: (value: string) => void;
  onToggleColor: (value: string) => void;
  onToggleDressStyle: (value: string) => void;
  onReset?: () => void;
  onApply: () => void;
  onClose?: () => void;
  variant: "desktop" | "mobile";
};

const FilterContent = ({
  categories,
  sizes,
  colors,
  dressStyles,
  selectedCategories,
  selectedSizes,
  selectedColors,
  selectedDressStyles,
  priceBounds,
  priceRange,
  onChangePriceRange,
  activePriceThumb,
  onActiveThumbChange,
  onToggleCategory,
  onToggleSize,
  onToggleColor,
  onToggleDressStyle,
}: Omit<FiltersPanelProps, "onReset" | "onApply" | "onClose" | "variant">) => {
  return (
    <>
      <div className="space-y-3 border-b border-black/10 pb-4 text-sm text-zinc-600">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onToggleCategory(item)}
            className={`flex w-full items-center justify-between text-left ${
              selectedCategories.includes(item) ? "font-semibold text-zinc-900" : ""
            }`}
          >
            <span>{item}</span>
            <span>›</span>
          </button>
        ))}
      </div>

      <div className="py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Price</h3>
          <span>▾</span>
        </div>
        <div className="mt-4">
          <div className="relative h-6">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#F0F0F0]" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black"
              style={{
                left: `${((priceRange[0] - priceBounds.min) /
                  (priceBounds.max - priceBounds.min || 1)) * 100}%`,
                right: `${
                  100 -
                  ((priceRange[1] - priceBounds.min) /
                    (priceBounds.max - priceBounds.min || 1)) *
                    100
                }%`,
              }}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange[0]}
              onChange={(event) =>
                onChangePriceRange([
                  Math.min(Number(event.target.value), priceRange[1]),
                  priceRange[1],
                ])
              }
              className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent accent-black"
              onPointerDown={() => onActiveThumbChange("min")}
              style={{
                zIndex: activePriceThumb === "min" ? 4 : 3,
              }}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange[1]}
              onChange={(event) =>
                onChangePriceRange([
                  priceRange[0],
                  Math.max(Number(event.target.value), priceRange[0]),
                ])
              }
              className="price-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent accent-black"
              onPointerDown={() => onActiveThumbChange("max")}
              style={{
                zIndex: activePriceThumb === "max" ? 4 : 3,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Colors</h3>
          <span>▾</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 sm:grid sm:grid-cols-5 sm:gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => onToggleColor(color.name)}
              className={`h-9 w-9 rounded-full border border-black/10 ${
                selectedColors.includes(color.name)
                  ? "ring-2 ring-black ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-pressed={selectedColors.includes(color.name)}
            >
              {selectedColors.includes(color.name) && (
                <span
                  className={`flex h-full w-full items-center justify-center text-[10px] font-semibold ${
                    color.value === "#FFFFFF" ? "text-black" : "text-white"
                  }`}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-black/10 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Size</h3>
          <span>▾</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onToggleSize(size)}
              className={`w-full rounded-full border border-black/10 px-3 py-2 ${
                selectedSizes.includes(size) ? "bg-black text-white" : "text-zinc-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-black/10 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Dress Style</h3>
          <span>▾</span>
        </div>
        <div className="mt-3 space-y-2 text-sm text-zinc-600">
          {dressStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => onToggleDressStyle(style)}
              className={`flex w-full items-center justify-between ${
                selectedDressStyles.includes(style) ? "font-semibold text-zinc-900" : ""
              }`}
            >
              <span>{style}</span>
              <span>›</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export function FilterSidebar({
  onReset,
  onApply,
  onClose,
  variant,
  ...props
}: FiltersPanelProps) {
  if (variant !== "desktop") return null;
  return (
    <aside className="hidden h-fit rounded-2xl border border-black/10 bg-white p-4 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button
          className="text-xs text-zinc-400"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </div>
      <FilterContent {...props} />
      <button
        className="mt-4 w-full rounded-full bg-black py-3 text-sm font-semibold text-white"
        type="button"
        onClick={onApply}
      >
        Apply Filter
      </button>
    </aside>
  );
}

export function FilterDrawer({
  onApply,
  onClose,
  variant,
  ...props
}: FiltersPanelProps) {
  if (variant !== "mobile") return null;
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-t-[20px] rounded-b-none border border-black/10 bg-white p-4 lg:hidden">
      <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button className="text-zinc-400" onClick={onClose}>
          ✕
        </button>
      </div>
      <FilterContent {...props} />
      <button
        className="mt-4 w-full rounded-full bg-black py-3 text-sm font-semibold text-white"
        type="button"
        onClick={onApply}
      >
        Apply Filter
      </button>
    </div>
  );
}
