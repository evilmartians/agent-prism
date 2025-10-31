import type { AgentPrismTheme } from "../types";

const DEFAULT_PREFIX = "ap";

export function getPrefixedTheme(
  theme: AgentPrismTheme,
  prefix: string = DEFAULT_PREFIX,
) {
  return {
    light: addPrefixToObjectKeys(theme.light, prefix),
    dark: addPrefixToObjectKeys(theme.dark, prefix),
  };
}

function addPrefixToObjectKeys(object: Record<string, string>, prefix: string) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [`${prefix}-${key}`, value]),
  );
}
