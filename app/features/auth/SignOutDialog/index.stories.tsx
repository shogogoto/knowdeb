import { DialogTrigger } from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "~/shared/components/ui/button";
import { Dialog } from "~/shared/components/ui/dialog";
import LogoutDialogContent from ".";
import { AuthProvider } from "../AuthProvider";

const meta = {
  component: LogoutDialogContent,
} satisfies Meta<typeof LogoutDialogContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <AuthProvider>
        <Dialog>
          <DialogTrigger>
            <Button>show</Button>
          </DialogTrigger>
          <Story />
        </Dialog>
      </AuthProvider>
    ),
  ],
};
