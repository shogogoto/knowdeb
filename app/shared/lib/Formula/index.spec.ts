import { extractFormulas, replacePlaceHolder } from ".";

const ps = "^@;"; // place holder

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
});

// Splitsentence -> formulaとrefと文字列に分解
// マッチしたもので区切った文字列配列に分解
//   マッチ部分はplaceholderに変換
//   formulaのsplit
//   用語のsplit
//   混在してる場合
//   splitしたものを変換
// formulaを TeX, refをリンク, 文字列はspanに変換して結合
//
//
