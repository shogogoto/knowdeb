import type { Meta, StoryObj } from "@storybook/react-vite";

import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: <div>Header</div>,
    main: (
      <div>
        {Array.from({ length: 10 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <div key={`item-${i}`}>Item {i}</div>
        ))}
      </div>
    ),
  },
};

export const LongMain: Story = {
  args: {
    header: <div>Header</div>,
    main: (
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <div key={i}>Item {i}</div>
        ))}
      </div>
    ),
  },
};

export const Chinko: Story = {
  args: {
    header: <div>Header</div>,
    main: (
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <div key={i}>Item {i}</div>
        ))}
      </div>
    ),
  },
  globals: { viewport: { value: "mobile1" } },
};
