import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies tone styling", () => {
    render(<Badge tone="brand">HD</Badge>);
    expect(screen.getByText("HD")).toHaveClass("bg-brand");
  });
});
