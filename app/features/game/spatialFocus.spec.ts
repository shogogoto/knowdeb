import { movePanelFocus, nearestControl } from "./spatialFocus";

const box = (x: number, y: number, width = 100, height = 50) => ({
  left: x,
  right: x + width,
  top: y,
  bottom: y + height,
});
it("moves through a two-dimensional enemy grid without wrapping", () => {
  const grid = [box(0, 0), box(120, 0), box(0, 70), box(120, 70)];
  expect(nearestControl(grid[0], grid, "ArrowRight")).toBe(1);
  expect(nearestControl(grid[0], grid, "ArrowDown")).toBe(2);
  expect(nearestControl(grid[3], grid, "ArrowUp")).toBe(1);
  expect(nearestControl(grid[3], grid, "ArrowLeft")).toBe(2);
  expect(nearestControl(grid[0], grid, "ArrowLeft")).toBe(-1);
});
it("uses visual positions, not DOM order or control role", () => {
  const choices = [box(120, 200), box(0, 200), box(0, 280), box(0, 0)];
  expect(nearestControl(choices[1], choices, "ArrowRight")).toBe(0);
  expect(nearestControl(choices[1], choices, "ArrowDown")).toBe(2);
  expect(nearestControl(choices[1], choices, "ArrowUp")).toBe(3);
  expect(nearestControl(choices[1], choices, "ArrowLeft")).toBe(-1);
});
it("skips hidden and disabled controls", () => {
  const root = document.createElement("div");
  root.innerHTML =
    "<button>current</button><button disabled>disabled</button><div hidden><button>hidden</button></div><button>next</button>";
  const controls = root.querySelectorAll("button");
  for (const [i, control] of controls.entries())
    control.getBoundingClientRect = () => ({
      ...box(120 * i, 0),
      x: 120 * i,
      y: 0,
      width: 100,
      height: 50,
      toJSON: () => ({}),
    });
  document.body.append(root);
  controls[0].focus();
  expect(movePanelFocus(root, controls[0], "ArrowRight")).toBe(true);
  expect(controls[3]).toHaveFocus();
  root.remove();
});

it("moves from a wide answer to the small confirm button directly below it", () => {
  const origin = box(0, 0, 500, 60);
  const controls = [box(0, 80, 80, 32), box(0, 250, 80, 32)];
  expect(nearestControl(origin, controls, "ArrowDown")).toBe(0);
});

it("does not skip wide real quiz choices for a narrow report button", () => {
  const enemy = box(0, 0, 200, 90);
  const controls = [
    box(0, 200, 960, 90),
    box(0, 320, 960, 140),
    box(0, 600, 80, 32),
  ];
  expect(nearestControl(enemy, controls, "ArrowDown")).toBe(0);
  expect(nearestControl(controls[0], controls, "ArrowDown")).toBe(1);
});
