import { describe, expect, it } from "vitest";
import reducer, { addRecent, clearRecent, setQuery } from "./searchSlice";

const initial = reducer(undefined, { type: "@@INIT" });

describe("searchSlice", () => {
  it("sets the live query", () => {
    expect(reducer(initial, setQuery("neon")).query).toBe("neon");
  });

  it("adds recent searches, deduped and newest-first", () => {
    let state = reducer(initial, addRecent("action"));
    state = reducer(state, addRecent("drama"));
    state = reducer(state, addRecent("action"));
    expect(state.recent).toEqual(["action", "drama"]);
  });

  it("ignores empty/whitespace queries and trims", () => {
    let state = reducer(initial, addRecent("   "));
    expect(state.recent).toHaveLength(0);
    state = reducer(state, addRecent("  neon  "));
    expect(state.recent).toEqual(["neon"]);
  });

  it("caps recent searches at six", () => {
    let state = initial;
    for (const term of ["a", "b", "c", "d", "e", "f", "g"]) {
      state = reducer(state, addRecent(term));
    }
    expect(state.recent).toHaveLength(6);
    expect(state.recent[0]).toBe("g");
  });

  it("clears recent searches", () => {
    let state = reducer(initial, addRecent("x"));
    state = reducer(state, clearRecent());
    expect(state.recent).toHaveLength(0);
  });
});
