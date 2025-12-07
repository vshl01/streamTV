"use client";

/**
 * Returns `false` during SSR and the first client render, then `true` once
 * hydrated. Built on `useSyncExternalStore` so it never calls setState in an
 * effect — the idiomatic way to gate localStorage-backed UI without a
 * hydration mismatch.
 */
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
