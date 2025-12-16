import { Spinner } from "@/components/atoms/Spinner";

/** Route-level loading fallback shown during navigation to dynamic segments. */
export default function Loading() {
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <Spinner size={44} className="text-brand-soft" label="Loading page" />
    </div>
  );
}
