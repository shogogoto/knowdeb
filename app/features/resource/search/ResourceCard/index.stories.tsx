import type { Meta, StoryObj } from "@storybook/react-vite";

import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    info: {
      user: {
        display_name: null,
        profile: "NHhLoZluFYTFMZIiNnPo",
        avatar_url: "hegYoMEUBxQiOqfglhpX",
        username: "^G$",
        uid: "4712d37a-4d17-423c-b278-c7f49dce860e",
        created: "2025-06-12T03:17:51Z",
      },
      resource: {
        name: "kZcXjTKSVJhcRgyEXvuA",
        uid: "c25ca739-9f5a-4ce6-a8e7-87e4a7e95ad5",
        published: null,
        urls: ["https://worst-petticoat.biz", "https://whole-language.biz"],
        updated: "2025-01-12T01:55:54Z",
        txt_hash: null,
      },
      resource_stats: {
        diameter: 57,
        radius: null,
        average_degree: 56,
        n_char: 970205,
        n_sentence: 646,
        n_term: 579,
        n_edge: 519,
        n_isolation: 84,
        n_axiom: 50,
        n_unrefered: 44,
        r_isolation: 8,
        r_axiom: 0.823468885127271,
        r_unrefered: 0.22611240287228,
      },
    },
  },
};

// resource_stats: {
//   diameter: 5733591772860134,
//   radius: null,
//   average_degree: 5608733722793788,
//   n_char: 970205177476216,
//   n_sentence: 6466099238452026,
//   n_term: 5794593602711025,
//   n_edge: 5195507580780401,
//   n_isolation: 8450379571209101,
//   n_axiom: 5072081624377616,
//   n_unrefered: 4474012335534326,
//   r_isolation: 8057378647082307,
//   r_axiom: 8234688851272716,
//   r_unrefered: 2261124028722803,
// },
