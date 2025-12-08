import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "neutral" | "brand" | "accent" | "success" | "outline";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-white/12 text-ink backdrop-blur",
  brand: "bg-brand text-white",
  accent: "bg-accent text-white",
  success: "bg-success/15 text-success",
  outline: "border border-white/25 text-ink",
};

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

/** Small status / metadata pill (maturity rating, "NEW", quality, etc.). */
export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
