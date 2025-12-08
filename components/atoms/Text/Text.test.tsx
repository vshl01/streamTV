import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders a semantic element by variant", () => {
    render(<Text variant="display">Headline</Text>);
    expect(screen.getByText("Headline").tagName).toBe("H1");
  });

  it("defaults body copy to a paragraph", () => {
    render(<Text variant="body">Copy</Text>);
    expect(screen.getByText("Copy").tagName).toBe("P");
  });

  it("honors the `as` override", () => {
    render(
      <Text variant="heading" as="span">
        Inline
      </Text>,
    );
    expect(screen.getByText("Inline").tagName).toBe("SPAN");
  });

  it("applies a line clamp when requested", () => {
    render(
      <Text variant="body" clamp={2}>
        Clamped
      </Text>,
    );
    expect(screen.getByText("Clamped")).toHaveClass("line-clamp-2");
  });
});
