import type { Meta, StoryObj } from "@storybook/react";

import { ClerkProvider } from "@clerk/react-router";
import { ThemeProvider } from "../theme";
import { Header } from "./index";
const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

const meta = {
  component: Header,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <Story />
        </ClerkProvider>
      </ThemeProvider>
    ),
  ],
  // parameters: {
  //   reactRouter: reactRouterParameters({
  //     routing: {
  //       path: "/search",
  //       loader: loader,
  //     },
  //   }),
  // },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
