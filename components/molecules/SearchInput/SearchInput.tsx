"use client";

/**
 * Controlled search field with a leading icon and a clear button.
 * Presentational only — debouncing and query state live in the search page.
 */
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/atoms/Icon";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onChange, onClear, className, placeholder = "Search titles, genres, people…", ...rest },
    ref,
  ) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-4 py-2 backdrop-blur transition focus-within:border-brand/60 focus-within:bg-surface",
          className,
        )}
      >
        <Icon name="search" size={18} className="text-ink-subtle" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          {...rest}
        />
        {value.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="focus-ring rounded-full p-0.5 text-ink-subtle hover:text-ink"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    );
  },
);
