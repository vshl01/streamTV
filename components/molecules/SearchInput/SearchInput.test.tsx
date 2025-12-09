import { describe, expect, it } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

/** Stateful harness so the controlled input reflects typed text. */
function Harness() {
  const [value, setValue] = useState("");
  return <SearchInput value={value} onChange={setValue} />;
}

describe("SearchInput", () => {
  it("updates as the user types", async () => {
    render(<Harness />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "neon");
    expect(input).toHaveValue("neon");
  });

  it("reveals a clear button that empties the field", async () => {
    render(<Harness />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "drama");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
  });
});
