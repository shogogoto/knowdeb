import type { Preview, ReactRenderer } from "@storybook/react";
import "../app/app.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import { initialize, mswLoader } from "msw-storybook-addon";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";
import { handlers } from "../app/mocks/handlers";

initialize({
  onUnhandledRequest: "bypass", // 画像読み込みエラーを消す [MSW] Warning: intercepted a request without a matching request handler: • GET /app/stories/assets/accessibility.png?import If you still wish to intercept this unhandled request, please create a request handler for it.
});
// export const decorators = [mswDecorator];

const preview: Preview = {
  parameters: {
    msw: { handlers },
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactRouter: reactRouterParameters({}),
  },
  loaders: [mswLoader],
  decorators: [
    withRouter, // useNavigationとか解決
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
