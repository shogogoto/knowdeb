import { describe, expect, it } from "vitest";

const add = (a: number, b: number): number => a + b;

describe("add", () => {
  it("example", () => {
    const result = add(1, 2);
    expect(result).toBe(3);
  });
});
