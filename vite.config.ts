import mdx from "@mdx-js/rollup";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import reactVitest from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [
    tailwindcss(),
    process.env.VITEST ? reactVitest() : reactRouter(), // storybookのテスト解消
    tsconfigPaths(),
    netlifyPlugin(),
    { enforce: "pre", ...mdx() },
  ],
  test: {
    globals: true, // テスト関数のインポート省略
    // environment: "jsdom",
    // setupFiles: ["vitest.setup.ts"],
  },
});
