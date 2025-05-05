import type { Meta, StoryObj } from "@storybook/react";
import { AuthProvider } from "~/components/auth";
import Login from "./index";

const meta = {
  title: "Routes/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="container mx-auto">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
