"use client";

/**
 * `next/image` wrapper with a built-in loading skeleton and a graceful
 * gradient fallback when the remote image fails. Defaults to `fill` layout
 * for posters/backdrops.
 */
import NextImage from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/atoms/Skeleton";

export interface ImageProps {
  src: string;
  alt: string;
  /** Fill the (positioned) parent. Default true. */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Responsive sizes hint for the optimizer. */
  sizes?: string;
  /** Prioritize for LCP (above-the-fold imagery). */
  priority?: boolean;
  /** Classes for the positioning wrapper. */
  className?: string;
  /** Classes for the underlying <img>. */
  imgClassName?: string;
}

export function Image({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 45vw, 220px",
  priority = false,
  className,
  imgClassName,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <span className={cn("relative block overflow-hidden bg-surface-2", className)}>
      {!loaded && !errored && <Skeleton className="absolute inset-0 h-full w-full" />}

      {errored ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface-2 to-surface text-ink-subtle"
        >
          <span className="px-2 text-center text-xs font-semibold">{alt}</span>
        </span>
      ) : (
        <NextImage
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </span>
  );
}
