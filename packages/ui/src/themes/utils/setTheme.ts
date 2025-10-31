import type { AgentPrismTheme } from "../types";

import { hexToRgb } from "./hexToRgb";

export function setTheme(
  theme: AgentPrismTheme,
  container: HTMLElement = document.body,
) {
  console.log("setting theme", theme);
  Object.keys(theme.light).forEach((key) => {
    const lightValue = hexToRgb(theme.light[key as keyof typeof theme.light]);
    const darkValue = hexToRgb(theme.dark[key as keyof typeof theme.dark]);

    container.style.setProperty(`--ap-${key}-light`, lightValue);
    container.style.setProperty(`--ap-${key}-dark`, darkValue);
  });
}
