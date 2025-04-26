import type { Preview } from "@storybook/react";
import "../app/app.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";
import type { Renderer } from "storybook/internal/types";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactRouter: reactRouterParameters({}),
  },
  decorators: [
    withRouter,
    withThemeByClassName<Renderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
