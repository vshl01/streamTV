import { describe, expect, it } from "vitest";
import reducer, {
  MAX_ITEMS,
  removeItem,
  selectContinueWatching,
  upsertProgress,
} from "./continueWatchingSlice";
import type { RootState } from "@/store";

const initial = reducer(undefined, { type: "@@INIT" });

describe("continueWatchingSlice", () => {
  it("adds an in-progress item", () => {
    const state = reducer(initial, upsertProgress({ slug: "a", positionSeconds: 50, durationSeconds: 100 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].positionSeconds).toBe(50);
  });

  it("drops titles that are effectively finished (>=95%)", () => {
    const state = reducer(initial, upsertProgress({ slug: "a", positionSeconds: 96, durationSeconds: 100 }));
    expect(state.items).toHaveLength(0);
  });

  it("dedupes by slug and moves the latest to the front", () => {
    let state = reducer(initial, upsertProgress({ slug: "a", positionSeconds: 10, durationSeconds: 100 }));
    state = reducer(state, upsertProgress({ slug: "b", positionSeconds: 20, durationSeconds: 100 }));
    state = reducer(state, upsertProgress({ slug: "a", positionSeconds: 40, durationSeconds: 100 }));
    expect(state.items).toHaveLength(2);
    expect(state.items[0].slug).toBe("a");
    expect(state.items[0].positionSeconds).toBe(40);
  });

  it("caps the list at MAX_ITEMS", () => {
    let state = initial;
    for (let i = 0; i < MAX_ITEMS + 5; i += 1) {
      state = reducer(state, upsertProgress({ slug: `t${i}`, positionSeconds: 30, durationSeconds: 100 }));
    }
    expect(state.items).toHaveLength(MAX_ITEMS);
  });

  it("removes a single item", () => {
    let state = reducer(initial, upsertProgress({ slug: "a", positionSeconds: 30, durationSeconds: 100 }));
    state = reducer(state, removeItem("a"));
    expect(state.items).toHaveLength(0);
  });

  it("selectContinueWatching sorts by recency and hides barely-started items", () => {
    const state = {
      continueWatching: {
        items: [
          { slug: "old", positionSeconds: 50, durationSeconds: 100, updatedAt: 1 },
          { slug: "new", positionSeconds: 50, durationSeconds: 100, updatedAt: 2 },
          { slug: "barely", positionSeconds: 1, durationSeconds: 100, updatedAt: 3 },
        ],
      },
    } as unknown as RootState;
    const result = selectContinueWatching(state);
    expect(result.map((i) => i.slug)).toEqual(["new", "old"]);
  });
});
