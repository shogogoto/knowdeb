import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import StatEditor from "./StatEditor";
import { defaultBalance } from "./battle";

it("previews allocation, enforces the total budget, and resets freely", async () => {
  const user = userEvent.setup();
  render(
    <StatEditor
      level={2}
      balance={defaultBalance}
      inBattle={false}
      onSaved={vi.fn()}
    />,
  );
  const hp = screen.getByRole("button", { name: "最大HPにポイントを割り振る" });
  await user.click(hp);
  await user.click(hp);
  await user.click(hp);
  expect(screen.getByLabelText("未使用の育成ポイント")).toHaveTextContent(
    /0\s*\/\s*3/,
  );
  expect(screen.getByText("50")).toBeVisible();
  expect(hp).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "振り直す" }));
  expect(screen.getByLabelText("未使用の育成ポイント")).toHaveTextContent(
    /3\s*\/\s*3/,
  );
  expect(screen.getByText("35")).toBeVisible();
});

it("blocks allocation and reset during battle", () => {
  render(
    <StatEditor
      level={4}
      balance={defaultBalance}
      inBattle
      onSaved={vi.fn()}
    />,
  );
  expect(
    screen.getByRole("button", { name: "最大HPにポイントを割り振る" }),
  ).toBeDisabled();
  expect(screen.getByRole("button", { name: "振り直す" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "割り振りを保存" })).toBeDisabled();
});
