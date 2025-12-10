"use client";

/**
 * Interactive search experience.
 *
 * A debounced query hits the GraphQL CMS endpoint via RTK Query
 * (`useSearchTitlesQuery`). Shows recent searches, skeleton loaders while
 * fetching, results in a spatially-navigable grid, and a friendly empty state.
 */
import { useEffect, useRef, useState } from "react";
import { SearchInput } from "@/components/molecules/SearchInput";
import { PosterCard } from "@/components/molecules/PosterCard";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Icon } from "@/components/atoms/Icon";
import { useSearchTitlesQuery } from "@/store/api/contentfulGqlApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addRecent, selectRecent, setQuery } from "@/store/slices/searchSlice";

const DEBOUNCE_MS = 350;
const MIN_QUERY = 2;
const SKELETON_COUNT = 12;

export function SearchView() {
  const dispatch = useAppDispatch();
  const recent = useAppSelector(selectRecent);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [term, setTerm] = useState("");

  // Debounce the input into the active search term.
  useEffect(() => {
    const id = window.setTimeout(() => setTerm(value.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [value]);

  useEffect(() => {
    dispatch(setQuery(term));
  }, [term, dispatch]);

  const active = term.length >= MIN_QUERY;
  const { data, isFetching, isError } = useSearchTitlesQuery(
    { query: term },
    { skip: !active },
  );

  const commit = (next: string) => {
    setValue(next);
    setTerm(next.trim());
    if (next.trim().length >= MIN_QUERY) dispatch(addRecent(next.trim()));
    inputRef.current?.focus();
  };

  const results = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-height)+1.5rem)] sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Search</h1>

      <form
        role="search"
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          commit(value);
        }}
      >
        <SearchInput
          ref={inputRef}
          value={value}
          onChange={setValue}
          autoFocus
          aria-label="Search titles"
        />
      </form>

      {/* Recent searches */}
      {!active && recent.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
            Recent searches
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {recent.map((entry) => (
              <li key={entry}>
                <button
                  type="button"
                  onClick={() => commit(entry)}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  <Icon name="search" size={14} />
                  {entry}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Idle prompt */}
      {!active && recent.length === 0 && (
        <div className="mt-16 grid place-items-center text-center text-ink-subtle">
          <Icon name="search" size={48} className="opacity-40" />
          <p className="mt-4 max-w-sm text-sm">
            Find something to watch — search by title, genre, director, or cast.
          </p>
        </div>
      )}

      {/* Results */}
      {active && (
        <section aria-live="polite" className="mt-8">
          {isFetching ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="mt-2 h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-danger">Something went wrong. Please try again.</p>
          ) : results.length === 0 ? (
            <div className="mt-12 grid place-items-center text-center">
              <p className="text-lg font-semibold text-ink">No results for “{term}”</p>
              <p className="mt-1 text-sm text-ink-subtle">
                Try a different title, genre, or person.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-subtle">
                {results.length} {results.length === 1 ? "result" : "results"} for “{term}”
              </p>
              <FocusableDiv
                focusKey="search-results"
                provideContext
                className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                {results.map((title) => (
                  <PosterCard key={title.id} title={title} rowSlug="search" fullWidth />
                ))}
              </FocusableDiv>
            </>
          )}
        </section>
      )}
    </div>
  );
}
