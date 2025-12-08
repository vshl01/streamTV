import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Typographic scale. */
export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "caption"
  | "label";

/** Color tone, mapped to design tokens. */
export type TextTone = "default" | "muted" | "subtle" | "brand" | "inverse";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  display: "text-4xl font-extrabold tracking-tight sm:text-6xl",
  title: "text-2xl font-bold tracking-tight sm:text-4xl",
  heading: "text-xl font-semibold tracking-tight",
  subheading: "text-lg font-semibold",
  body: "text-base leading-relaxed",
  caption: "text-sm",
  label: "text-xs font-semibold uppercase tracking-widest",
};

const TONE_CLASSES: Record<TextTone, string> = {
  default: "text-ink",
  muted: "text-ink-muted",
  subtle: "text-ink-subtle",
  brand: "text-brand-soft",
  inverse: "text-canvas",
};

const DEFAULT_ELEMENT: Record<TextVariant, ElementType> = {
  display: "h1",
  title: "h2",
  heading: "h3",
  subheading: "h4",
  body: "p",
  caption: "p",
  label: "span",
};

export interface TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  /** Override the rendered element (defaults are semantic per variant). */
  as?: ElementType;
  /** Clamp to a single line with an ellipsis. */
  truncate?: boolean;
  /** Clamp to N lines (uses Tailwind line-clamp). */
  clamp?: 1 | 2 | 3 | 4;
  className?: string;
  id?: string;
  children: ReactNode;
}

const CLAMP_CLASSES: Record<NonNullable<TextProps["clamp"]>, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

/** Typography primitive. Maps a variant/tone to consistent styles. */
export function Text({
  variant = "body",
  tone = "default",
  as,
  truncate = false,
  clamp,
  className,
  id,
  children,
}: TextProps) {
  const Component = as ?? DEFAULT_ELEMENT[variant];
  return (
    <Component
      id={id}
      className={cn(
        VARIANT_CLASSES[variant],
        TONE_CLASSES[tone],
        truncate && "truncate",
        clamp && CLAMP_CLASSES[clamp],
        className,
      )}
    >
      {children}
    </Component>
  );
}
