import type { Meta, StoryObj } from "@storybook/react-vite";

import { reactRouterParameters } from "storybook-addon-remix-react-router";
import Docs from "~/routes/docs";
import CliDoc from "~/routes/docs/cli.mdx";
import ConceptDoc from "~/routes/docs/concept.mdx";
import FeaturesDoc from "~/routes/docs/features.mdx";
import GetStartedDoc from "~/routes/docs/get-started.mdx"; // MDXファイルもコンポーネントとしてインポート
import Index from "./index";

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    reactRouter: reactRouterParameters({
      routing: [
        {
          // 親レイアウトのルートパス（通常は '/' または特定のセグメント）
          // 提示された「layout("layouts/DocumentLayout.tsx", [...])」に対応
          path: "/",
          // element: <GuestLayout />, // DocumentLayoutを親要素として設定
          children: [
            // DocumentLayout内のOutletにレンダリングされる子ルート
            // 「route("docs", "routes/docs/index.tsx")」に対応
            { path: "docs", element: <Docs /> },

            // MDXファイルの子ルートに対応
            // path は URLセグメント、element はインポートしたMDXコンポーネント
            { path: "docs/get-started", element: <GetStartedDoc /> },
            { path: "docs/concept", element: <ConceptDoc /> },
            { path: "docs/cli", element: <CliDoc /> },
            { path: "docs/features", element: <FeaturesDoc /> },

            // オプション: ルートパス ('/') でアクセスされたときに、
            // どのドキュメントをデフォルトで表示するかを設定できます。
            // 例として、/docs にリダイレクトするか、特定のMDXを表示する設定
            // { index: true, element: <DocsIndex /> }, // '/' にアクセスしたら DocsIndex を表示
            // または、'/docs' へリダイレクトする場合
            // { path: '/', element: <Navigate to="/docs" replace /> },
          ],
        },
      ],
    }),
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
};

export const Desktop: Story = {
  // globals: {
  //   viewport: { value: "tablet" },
  // },
};
