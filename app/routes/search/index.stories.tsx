import type { Meta, StoryObj } from "@storybook/react";
import { useLoaderData } from "react-router";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import {
  getKnowdeMock,
  getSearchByTextKnowdeGetMockHandler,
} from "~/generated/knowde/knowde.msw";
import type { Route } from "./+types";
import Search, { loader } from "./index";

const meta = {
  component: Search,
  parameters: {
    msw: { handlers: getKnowdeMock() },
  },
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof Search>;

function DataLoader() {
  const loaderData: Route.ComponentProps = useLoaderData();

  // @ts-ignore
  return <Search loaderData={loaderData} />;
}

export const WithResults: Story = {
  // args: {
  //   loaderData: { data: getSearchByTextKnowdeGetResponseMock() },
  // },
  render: () => <DataLoader />,
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: "/search",
        loader: loader,
        handle: getSearchByTextKnowdeGetMockHandler,
      },
    }),
  },
};
