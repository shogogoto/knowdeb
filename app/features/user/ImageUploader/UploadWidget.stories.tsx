import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthProvider } from "~/features/auth/AuthProvider";
import { Button } from "~/shared/components/ui/button";
import Index from "./UploadWidget";

const meta = {
  component: Index,
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
        <div>{import.meta.env.VITE_CLOUD_NAME}</div>
        <div>{import.meta.env.VITE_UPLOAD_PRESET}</div>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Button>Upload</Button>,
    publicId: "test",
    onUploadSuccess: (imageUrl: string) => {},
  },
};
