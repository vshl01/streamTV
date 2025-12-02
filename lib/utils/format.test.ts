import { describe, expect, it } from "vitest";
import { formatClock, formatRating, formatRuntime, toPercent } from "./format";

describe("formatRuntime", () => {
  it("formats hours and minutes", () => {
    expect(formatRuntime(134)).toBe("2h 14m");
  });
  it("formats minutes-only and hours-only", () => {
    expect(formatRuntime(48)).toBe("48m");
    expect(formatRuntime(120)).toBe("2h");
  });
  it("guards invalid input", () => {
    expect(formatRuntime(0)).toBe("—");
    expect(formatRuntime(-5)).toBe("—");
  });
});

describe("formatClock", () => {
  it("formats m:ss and h:mm:ss", () => {
    expect(formatClock(75)).toBe("1:15");
    expect(formatClock(3661)).toBe("1:01:01");
  });
  it("clamps negatives to zero", () => {
    expect(formatClock(-10)).toBe("0:00");
  });
});

describe("toPercent", () => {
  it("computes and clamps percentages", () => {
    expect(toPercent(50, 100)).toBe(50);
    expect(toPercent(200, 100)).toBe(100);
    expect(toPercent(10, 0)).toBe(0);
  });
});

describe("formatRating", () => {
  it("renders one decimal place", () => {
    expect(formatRating(8.567)).toBe("8.6");
    expect(formatRating(7)).toBe("7.0");
  });
});
