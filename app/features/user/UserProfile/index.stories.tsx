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
      profile: faker.helpers.arrayElement([faker.string.alpha(160), null]),
      username: "0123456789",
      uid: "382d74c3-5782-4930-aaa1-ef3ea08f506a",
      created: "2023-01-01",
      avatar_url: "https://github.com/shadcn.png",
    },
  },
};
