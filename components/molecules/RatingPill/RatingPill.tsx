import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/Icon";
import { formatRating } from "@/lib/utils/format";

export interface RatingPillProps {
  /** Score out of 10. */
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

const ICON_PX = { sm: 12, md: 14 } as const;

/** Star + numeric score pill (e.g. ★ 8.6). */
export function RatingPill({ rating, size = "md", className }: RatingPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold text-ink",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
    >
      <Icon name="star" size={ICON_PX[size]} className="text-rating" title="Rating" />
      {formatRating(rating)}
    </span>
  );
}
