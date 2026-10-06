import type { Decorator, Preview } from "@storybook/react-vite";

import "@evilmartians/agent-prism-ui/styles.css";
import "@evilmartians/agent-prism-ui/theme.css";

import "./styles.css";

const withTheme: Decorator = (StoryFn, context) => {
  const theme: unknown = context.globals["theme"];
  const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const mode =
    typeof theme === "string" && theme !== "" && theme !== "system"
      ? theme
      : systemMode;

  document.documentElement.setAttribute("data-mode", mode);
  return StoryFn();
};

export const decorators = [withTheme];

const colorContrastDecidedInIssue107 = {
  enabled: false,
  id: "color-contrast",
};

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
    a11y: {
      config: { rules: [colorContrastDecidedInIssue107] },
      test: "error",
    },
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { codePanel: true },
    options: { storySort: { order: ["Demo", "Main Components", "Atoms"] } },
  },
};

export default preview;
