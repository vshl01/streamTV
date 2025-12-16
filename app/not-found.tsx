import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";

/** Branded 404 page. */
export default function NotFound() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-4 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-soft">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Lost your signal
        </h1>
        <p className="mt-4 text-ink-muted">
          We couldn&apos;t find that page. It may have been moved, or the title is no longer
          streaming.
        </p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-bold text-canvas transition hover:bg-white/90"
        >
          <Icon name="back" size={18} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
