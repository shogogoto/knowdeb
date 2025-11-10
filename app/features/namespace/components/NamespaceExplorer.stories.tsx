import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse, delay } from "msw";
import type { NameSpace } from "~/shared/generated/fastAPI.schemas";
import NamespaceExplorer from "./NamespaceExplorer";
import { mockData } from "./fixture";

const mock = (
  overrideResponse?:
    | NameSpace
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0],
      ) => Promise<NameSpace> | NameSpace),
) => {
  return http.get("*/namespace", async (info) => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
};

const meta = {
  component: NamespaceExplorer,
  parameters: {
    msw: { handlers: [mock()] },
  },
} satisfies Meta<typeof NamespaceExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
