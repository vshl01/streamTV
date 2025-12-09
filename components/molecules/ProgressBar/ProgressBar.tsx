import { cn } from "@/lib/utils/cn";

export interface ProgressBarProps {
  /** Completion percentage, 0–100. */
  value: number;
  className?: string;
  /** Accessible label describing what is progressing. */
  label?: string;
}

/** Slim playback-progress indicator used on Continue Watching cards. */
export function ProgressBar({ value, className, label = "Watch progress" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-white/25", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
