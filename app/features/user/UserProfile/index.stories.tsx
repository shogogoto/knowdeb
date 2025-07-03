import type { Meta, StoryObj } from "@storybook/react-vite";

import { faker } from "@faker-js/faker";
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      display_name: "ナナシ",
      email: "LjTq4@example.com",
      profile: faker.helpers.arrayElement([faker.string.alpha(160), null]),
      id: "0123456789",
      created: "2023-01-01",
      avatar_url: "https://github.com/shadcn.png",
    },
  },
};
