import type { Decorator, Preview } from "@storybook/react-vite";

import "@evilmartians/agent-prism-ui/styles.css";
import "@evilmartians/agent-prism-ui/theme.css";

import "./styles.css";

const withTheme: Decorator = (StoryFn, context) => {
  const theme = context.globals["theme"] || "system";
  let mode = theme;

  if (theme === "system") {
    mode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  document.documentElement.setAttribute("data-mode", mode);
  return StoryFn();
};

export const decorators = [withTheme];

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        dynamicTitle: true,
        icon: "circlehollow",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "System", value: "system" },
        ],
        title: "Theme",
      },
    },
  },
  parameters: {
    a11y: { test: "todo" },
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { codePanel: true },
    options: { storySort: { order: ["Demo", "Main Components", "Atoms"] } },
  },
};

export default preview;
