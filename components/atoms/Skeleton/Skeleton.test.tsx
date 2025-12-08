import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is decorative and hidden from assistive tech", () => {
    const { container } = render(<Skeleton width={100} height={20} />);
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveAttribute("aria-hidden", "true");
    expect(node).toHaveClass("animate-pulse");
  });
});
