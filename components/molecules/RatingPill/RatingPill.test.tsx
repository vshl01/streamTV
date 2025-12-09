import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RatingPill } from "./RatingPill";

describe("RatingPill", () => {
  it("renders the rating to one decimal", () => {
    render(<RatingPill rating={8.567} />);
    expect(screen.getByText("8.6")).toBeInTheDocument();
  });

  it("includes a labelled star icon", () => {
    render(<RatingPill rating={7.2} />);
    expect(screen.getByTitle("Rating")).toBeInTheDocument();
  });
});
