import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import EnemyAvatar from "./EnemyAvatar";
import { characterAsset, characterAssets } from "./characterAssets";

it("ships a real WebP for every registered character", () => {
  for (const asset of Object.values(characterAssets)) {
    const bytes = readFileSync(resolve("public", asset.src.slice(1)));
    expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
  }
  expect(characterAsset("https://example.com/other.png")).toBeUndefined();
  expect(characterAsset("constructor")).toBeUndefined();
});

it("renders boss artwork at a larger size instead of a vector icon", () => {
  const { container } = render(
    <EnemyAvatar identity="boss:5" icon="art_archive_golem" large />,
  );
  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    "/game-assets/archive_golem.webp",
  );
  expect(container.firstElementChild).toHaveClass("size-40");
  expect(container.querySelector("svg")).not.toBeInTheDocument();
});
