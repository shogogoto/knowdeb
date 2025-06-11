import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  reactRouterOutlet,
  reactRouterParameters,
} from "storybook-addon-remix-react-router";
import Concept from "~/routes/docs/concept.mdx";
import DocumentLayout from "./index";

const meta = {
  component: DocumentLayout,
  parameters: {
    reactRouter: reactRouterParameters({
      // routing: reactRouterOutlet(<LandingPage />),
      routing: reactRouterOutlet(<Concept />),
    }),
  },
} satisfies Meta<typeof DocumentLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: "tablet" },
  },
};
