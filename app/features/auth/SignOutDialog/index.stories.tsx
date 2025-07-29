import { DialogTrigger } from "@radix-ui/react-dialog";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
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
