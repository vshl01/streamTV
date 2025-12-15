import type { Metadata } from "next";
import { SearchView } from "@/components/organisms/SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search StreamTV by title, genre, director, or cast.",
};

/** Search page (Server Component shell; the search UI is client-interactive). */
export default function SearchPage() {
  return <SearchView />;
}
