import Image from "next/image";

type ProductGalleryProps = {
  title: string;
  thumbnails: string[];
  activeImage: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

export default function ProductGallery({
  title,
  thumbnails,
  activeImage,
  selectedIndex,
  onSelectIndex,
}: ProductGalleryProps) {
  return (
    <>
      <div className="order-2 flex flex-row justify-center gap-4 lg:order-none lg:flex-col lg:gap-3 lg:justify-between lg:h-[530px]">
        {thumbnails.length ? (
          thumbnails.map((src, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => onSelectIndex(index)}
                className={`relative flex h-[106px] w-[112px] shrink-0 items-center justify-center rounded-[20px] border bg-transparent lg:w-[152px] ${
                  isSelected ? "border-black lg:h-[167px]" : "border-transparent lg:h-[168px]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  className="object-contain p-2 lg:p-3"
                />
              </button>
            );
          })
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-[#F0F0F0] text-zinc-400 lg:h-24 lg:w-full">
            No image
          </div>
        )}
      </div>

      <div className="order-1 flex min-h-[260px] items-center justify-center rounded-[20px] bg-[#F0EEED] p-6 shadow-sm sm:min-h-[280px] lg:order-none lg:h-[530px] lg:w-[444px] lg:ml-4">
        <div className="relative h-56 w-full sm:h-64 lg:h-full">
          <Image
            src={activeImage}
            alt={title}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </>
  );
}
