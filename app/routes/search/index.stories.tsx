import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLoaderData } from "react-router";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { getKnowdeMock } from "~/generated/knowde/knowde.msw";
import Search from "./index";

const meta = {
  component: Search,
  parameters: {
    msw: { handlers: getKnowdeMock() },
  },
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof Search>;

let isFirst = true;
function DataLoader() {
  const loaderData = useLoaderData();
  if (isFirst) {
    isFirst = false;
    // @ts-ignore
    return <Search loaderData={{ data: [] }} />;
  }
  // @ts-ignore
  return <Search loaderData={loaderData} />;
}

export const Default: Story = {
  render: () => <DataLoader />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: "/search",
        // loader: loader,
      },
    }),
  },
};
