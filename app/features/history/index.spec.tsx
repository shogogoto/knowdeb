import { createMemoryRouter } from "react-router";

function mkrouter() {
  return createMemoryRouter(
    [
      {
        path: "/somewhere",
        Component: () => <div>somewhere</div>,
      },
      {
        path: "/home",
        Component: () => <div>home</div>,
      },
    ],
    {
      initialEntries: ["/home"],
    },
  );
}

describe("history", () => {
  it("AAAAAAA", async () => {});
  it("AAAAAAA", async () => {});
  it("AAAAAAA", async () => {});
  it("AAAAAAA", async () => {});
});
