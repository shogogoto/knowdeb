import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserSearch from ".";

describe("UserSearch", () => {
  it("renders search bar", () => {
    render(<UserSearch />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
