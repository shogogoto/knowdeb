import type { Meta, StoryObj } from "@storybook/react";

import { AuthProvider } from "../auth";
import { ThemeProvider } from "../theme";
import { Header } from "./index";

const meta = {
  component: Header,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
