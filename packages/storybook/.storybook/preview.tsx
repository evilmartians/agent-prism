import type { Preview } from "@storybook/react-vite";

import "@evilmartians/agent-prism-ui/styles.css";

import "./styles.css";

const withTheme = (StoryFn, context) => {
  const theme = context.globals.theme || "system";
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
  parameters: {
    backgrounds: { disable: true },
    options: { storySort: { order: ["Demo", "Main Components", "Atoms"] } },
    docs: { codePanel: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "todo" },
  },
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
