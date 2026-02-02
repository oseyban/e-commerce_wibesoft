import { themeColors } from "../../data/theme-colors";

function Star({ small = false }: { small?: boolean }) {
  const size = small ? 9 : 18;
  const height = small ? 17 : 18;
  return (
    <svg width={size} height={height} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l2.6 5.3 5.8.8-4.2 4 1 5.7L12 17.8 6.8 18.5l1-5.7L3.6 8.8l5.8-.8L12 2.5z"
        fill={themeColors.accent.warning}
      />
    </svg>
  );
}

export default function RatingRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star small />
      </div>
      <span className="text-[14px] leading-[19px] text-black">4.5/5</span>
    </div>
  );
}
