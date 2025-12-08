import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-[var(--ease-out-cine)] disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-canvas hover:bg-white/90 shadow-lg shadow-black/30",
  secondary:
    "bg-white/12 text-ink backdrop-blur hover:bg-white/20 border border-white/10",
  ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-white/10",
  icon: "bg-white/10 text-ink hover:bg-white/20 rounded-full",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-13 w-13",
};

/** Icon dimensions per button size. */
const GLYPH_PX: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading glyph. */
  leftIcon?: IconName;
  /** Trailing glyph. */
  rightIcon?: IconName;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  children?: ReactNode;
}

/**
 * Primary interactive control. `icon` variant renders a square icon-only
 * button; provide `aria-label` for accessibility in that case.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    fullWidth = false,
    loading = false,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isIconOnly = variant === "icon";
  const glyph = GLYPH_PX[size];
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        BASE,
        VARIANT_CLASSES[variant],
        isIconOnly ? ICON_SIZE_CLASSES[size] : SIZE_CLASSES[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Spinner size={glyph} />
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size={glyph} />}
          {children}
          {rightIcon && <Icon name={rightIcon} size={glyph} />}
        </>
      )}
    </button>
  );
});
