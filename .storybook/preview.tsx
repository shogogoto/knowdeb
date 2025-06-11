import type { Preview, ReactRenderer } from "@storybook/react-vite";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react"; // これを追加
import "../app/app.css";

import { withThemeByClassName } from "@storybook/addon-themes";
import { initialize, mswLoader } from "msw-storybook-addon";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

initialize({
  onUnhandledRequest: "bypass", // 画像読み込みエラーを消す [MSW] Warning: intercepted a request without a matching request handler: • GET /app/stories/assets/accessibility.png?import If you still wish to intercept this unhandled request, please create a request handler for it.
});
import { ClerkProvider } from "@clerk/clerk-react";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { ThemeProvider } from "~/components/theme";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <Story />
        </ClerkProvider>
      </ThemeProvider>
    ),
    withRouter, // useNavigationとか解決
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactRouter: reactRouterParameters({}),
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  loaders: [mswLoader],
};

export default preview;
