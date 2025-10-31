import type { AgentPrismTheme, AgentPrismThemePrefixed } from "../types";

export function createTheme<T extends string = string>(
  themeObject: AgentPrismTheme,
  prefix: T,
): AgentPrismThemePrefixed<T> {
  const prefixedTheme: AgentPrismThemePrefixed<T> = Object.fromEntries(
    Object.entries(themeObject).map(([key, value]) => [
      `${prefix}-${key}`,
      value,
    ]),
  ) as AgentPrismThemePrefixed<T>;

  return prefixedTheme;
}
