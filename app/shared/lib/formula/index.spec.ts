import { extractFormulas, inject2list, replacePlaceHolder } from ".";

const ps = "^@;"; // place holder

const injection = "X";

const casesExtract = [
  ["$(n+1)^2$", ["(n+1)^2"], ps],
  ["aaa$(n+1)^2$aaa", ["(n+1)^2"], `aaa${ps}aaa`],
  ["$(n+1)^2$aaa$(n+1)^3$", ["(n+1)^2", "(n+1)^3"], `${ps}aaa${ps}`],
  ["$aaa", [], "$aaa"],
  ["aaa$", [], "aaa$"],
  ["aaa", [], "aaa"],
];

describe("extractFormula", () => {
  it.each(casesExtract)("extract: %s -> %s", (input, output, placed) => {
    expect(extractFormulas(input as string)).toEqual(output);
    expect(replacePlaceHolder(input as string, ps)).toEqual(placed);
  });

  it("inject2list", () => {
    expect(inject2list(ps, ps, [injection])).toEqual([injection]);
    expect(inject2list(`aaa${ps}`, ps, [injection])).toEqual([
      "aaa",
      injection,
    ]);
    expect(inject2list(`${ps}aaa`, ps, [injection])).toEqual([
      injection,
      "aaa",
    ]);
    expect(inject2list(`aaa${ps}aaa`, ps, [injection])).toEqual([
      "aaa",
      injection,
      "aaa",
    ]);
  });
});
