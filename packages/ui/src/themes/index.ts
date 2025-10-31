import type { AgentPrismTheme } from "./types";

import { defaultTheme } from "./default";
import { getPrefixedTheme } from "./utils/getPrefixedTheme";

function getColorsForTailwindConfig(theme: AgentPrismTheme) {
  const prefixedTheme = getPrefixedTheme(theme);

  const tailwindTheme: Record<string, string> = {};

  Object.keys(prefixedTheme.light).forEach((key) => {
    tailwindTheme[key] =
      `light-dark(rgb(var(--${key}-light) / <alpha-value>), rgb(var(--${key}-dark) / <alpha-value>))`;
  });

  return tailwindTheme;
}

export const agentPrismTailwindColors =
  getColorsForTailwindConfig(defaultTheme);
