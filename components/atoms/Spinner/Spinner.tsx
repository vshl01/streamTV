import { cn } from "@/lib/utils/cn";

export interface SpinnerProps {
  /** Diameter in pixels. */
  size?: number;
  className?: string;
  /** Accessible status label. */
  label?: string;
}

/** Indeterminate loading spinner. */
export function Spinner({ size = 24, className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-block animate-spin", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
