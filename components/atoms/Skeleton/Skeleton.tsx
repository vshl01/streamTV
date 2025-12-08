import { cn } from "@/lib/utils/cn";

export interface SkeletonProps {
  className?: string;
  /** Render as a circle (avatars). */
  rounded?: boolean;
  /** Inline width/height when not using utility classes. */
  width?: number | string;
  height?: number | string;
}

/**
 * Shimmering placeholder for async surfaces. Decorative — hidden from
 * assistive tech; surrounding regions announce loading state instead.
 */
export function Skeleton({ className, rounded = false, width, height }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse bg-surface-2",
        rounded ? "rounded-full" : "rounded-lg",
        className,
      )}
      style={{ width, height }}
    />
  );
}
