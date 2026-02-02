import Image from "next/image";
import { colors, spacing, radii, shadows } from "../../../../../packages/design-tokens/src";
import { themeColors } from "../../data/theme-colors";

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
  const borderColor = colors.gray[200];

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
                className={`relative flex h-[106px] w-[112px] shrink-0 items-center justify-center lg:w-[152px] ${isSelected ? "lg:h-[167px]" : "lg:h-[168px]"}`}
                style={{
                  borderRadius: "20px",
                  border: isSelected ? "1px solid #000000" : "0px solid transparent",
                  background: "transparent",
                }}
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
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center lg:h-24 lg:w-full"
            style={{
              borderRadius: radii.xl,
              border: `1px solid ${borderColor}`,
              background: colors.gray[50],
              color: colors.gray[400],
            }}
          >
            No image
          </div>
        )}
      </div>

      <div
        className="order-1 flex min-h-[260px] items-center justify-center sm:min-h-[280px] lg:order-none lg:w-[444px] lg:h-[530px] lg:ml-4"
        style={{
          borderRadius: "20px",
          background: themeColors.neutral.gray200,
          padding: spacing[6],
          boxShadow: shadows.sm,
        }}
      >
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
