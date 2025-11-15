import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse, delay } from "msw";
import { useGetNamaspaceNamespaceGet } from "~/shared/generated/entry/entry";
import type { NameSpace } from "~/shared/generated/fastAPI.schemas";
import NamespaceExplorer from "./NamespaceExplorer";
import { fixtureNs } from "./fixture";

const mock = (
  overrideResponse?:
    | NameSpace
    | ((
        info: Parameters<Parameters<typeof http.get>[1]>[0],
      ) => Promise<NameSpace> | NameSpace),
) => {
  return http.get("*/namespace", async (info) => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(fixtureNs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
};

function NamespaceExplorerWithHooks() {
  const nsprops = useGetNamaspaceNamespaceGet();
  return <NamespaceExplorer nsprops={nsprops} />;
}

const meta = {
  component: NamespaceExplorerWithHooks,
  parameters: {
    msw: { handlers: [mock()] },
  },
} satisfies Meta<typeof NamespaceExplorerWithHooks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <NamespaceExplorerWithHooks />,
};
