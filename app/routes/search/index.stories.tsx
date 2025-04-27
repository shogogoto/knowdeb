import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import {
  getKnowdeMock,
  getSearchByTextKnowdeGetMockHandler,
  getSearchByTextKnowdeGetResponseMock,
} from "~/generated/knowde/knowde.msw";
import Search, { loader } from "./index";

const meta = {
  component: Search,
  parameters: {
    msw: { handlers: getKnowdeMock() },
  },
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof Search>;

export const WithResults: Story = {
  args: {
    loaderData: { data: getSearchByTextKnowdeGetResponseMock() },
  },
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
