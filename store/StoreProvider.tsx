"use client";

/**
 * Client-side Redux provider. Creates one store instance per browser session
 * (via a ref so it survives re-renders) and hydrates persisted slices from
 * localStorage before the first render.
 */
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";
import { loadPersistedState } from "./middleware/localStorageMiddleware";

export function StoreProvider({ children }: { children: ReactNode }) {
  // Lazy initializer → the store is created exactly once per session and is
  // safe to read during render (no ref access).
  const [store] = useState<AppStore>(() => makeStore(loadPersistedState()));
  return <Provider store={store}>{children}</Provider>;
}
