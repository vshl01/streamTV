"use client";

/**
 * The single integration point with `@noriginmedia/norigin-spatial-navigation`.
 *
 * Wraps `useFocusable` and exposes a focusable container that:
 *  - registers itself in the spatial-navigation focus tree,
 *  - reflects focus via `data-focused` (drives the `.focus-ring` style),
 *  - fires `onSelect` on D-pad/keyboard Enter *and* pointer click,
 *  - optionally provides a `FocusContext` so descendants nest correctly.
 *
 * Every focusable molecule (PosterCard, NavItem, hero/player buttons) composes
 * this rather than calling `useFocusable` directly.
 */
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useCallback, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface FocusableDivProps {
  /** Stable focus key; auto-generated when omitted. */
  focusKey?: string;
  /** Invoked on Enter (D-pad/keyboard) and on pointer click. */
  onSelect?: () => void;
  /** Called when this element gains spatial focus (e.g. to scroll into view). */
  onFocused?: () => void;
  /** Provide a FocusContext to children (use for rows/grids). */
  provideContext?: boolean;
  /** Save/restore the last focused child when re-entering this region. */
  saveLastFocusedChild?: boolean;
  /** Scroll this element into view (centered) when it gains focus. */
  scrollIntoViewOnFocus?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  role?: string;
  /** Either static children or a render-prop receiving the focused flag. */
  children: ReactNode | ((focused: boolean) => ReactNode);
}

export function FocusableDiv({
  focusKey,
  onSelect,
  onFocused,
  provideContext = false,
  saveLastFocusedChild = true,
  scrollIntoViewOnFocus = false,
  className,
  style,
  ariaLabel,
  role,
  children,
}: FocusableDivProps) {
  const handleEnter = useCallback(() => onSelect?.(), [onSelect]);

  const {
    ref,
    focused,
    focusKey: resolvedKey,
    focusSelf,
    hasFocusedChild,
  } = useFocusable<object, HTMLDivElement>({
    focusKey,
    saveLastFocusedChild,
    trackChildren: provideContext,
    onEnterPress: handleEnter,
    onFocus: () => {
      if (scrollIntoViewOnFocus) {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
      onFocused?.();
    },
  });

  const content = (
    <div
      ref={ref}
      role={role ?? (onSelect ? "button" : undefined)}
      tabIndex={onSelect ? 0 : -1}
      aria-label={ariaLabel}
      data-focused={focused || hasFocusedChild}
      onClick={() => {
        focusSelf();
        onSelect?.();
      }}
      onKeyDown={(event) => {
        if (onSelect && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(onSelect && "focus-ring cursor-pointer", className)}
      style={style}
    >
      {typeof children === "function" ? children(focused) : children}
    </div>
  );

  return provideContext ? (
    <FocusContext.Provider value={resolvedKey}>{content}</FocusContext.Provider>
  ) : (
    content
  );
}
