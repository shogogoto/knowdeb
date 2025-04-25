import type { Preview } from "@storybook/react";
import "../app/app.css";
import {
  reactRouterParameters,
  withRouter,
} from "storybook-addon-remix-react-router";

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
  decorators: [withRouter],
};

export default preview;
