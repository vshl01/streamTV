import { describe, expect, it } from "vitest";
import reducer, {
  loadTitle,
  resetPlayer,
  setProgress,
  setVolume,
  toggleMute,
} from "./playerSlice";

const initial = reducer(undefined, { type: "@@INIT" });

describe("playerSlice", () => {
  it("loads a title and enters the loading state", () => {
    const state = reducer(initial, loadTitle("neon"));
    expect(state.activeSlug).toBe("neon");
    expect(state.status).toBe("loading");
  });

  it("records progress", () => {
    const state = reducer(initial, setProgress({ currentTime: 12, duration: 100 }));
    expect(state.currentTime).toBe(12);
    expect(state.duration).toBe(100);
  });

  it("clamps volume and unmutes when audible", () => {
    expect(reducer(initial, setVolume(2)).volume).toBe(1);
    expect(reducer(initial, setVolume(-1)).volume).toBe(0);
    const muted = { ...initial, muted: true };
    expect(reducer(muted, setVolume(0.5)).muted).toBe(false);
  });

  it("toggles mute", () => {
    expect(reducer(initial, toggleMute()).muted).toBe(true);
  });

  it("resets to the initial state", () => {
    const dirty = reducer(initial, loadTitle("x"));
    expect(reducer(dirty, resetPlayer()).activeSlug).toBeNull();
  });
});
