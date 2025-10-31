// @ts-expect-error Node built-ins available at runtime
import { promises as fs } from "fs";
// @ts-expect-error Node built-ins available at runtime
import path from "path";
// @ts-expect-error Node built-ins available at runtime
import { fileURLToPath } from "url";

import type { AgentPrismTheme } from "../types";

import { defaultTheme } from "../default";
import { highContrastTheme } from "../high-contrast";
import { hexToRgb } from "../utils/hexToRgb";

type ThemeData = {
  name: string;
  theme: AgentPrismTheme;
};

const themes: ThemeData[] = [
  { name: "default", theme: defaultTheme },
  {
    name: "high-contrast",
    theme: highContrastTheme,
  },
];

function getThemeFileContent({ theme }: ThemeData) {
  let content = "";

  Object.keys(theme.light).forEach((key) => {
    const lightValue = theme.light[key as keyof typeof theme.light];
    const darkValue = theme.dark[key as keyof typeof theme.dark];

    content += `
      --ap-${key}-light: ${hexToRgb(lightValue)};
      --ap-${key}-dark: ${hexToRgb(darkValue)};
    `;
  });

  return `
  @layer base {
    :root {
      ${content}
    }
  }
  `;
}

async function createThemeFiles() {
  const currentFilename = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilename);
  const stylesDir = path.resolve(currentDir, "..", "styles");

  await fs.mkdir(stylesDir, { recursive: true });

  await Promise.all(
    themes.map(async (themeData) => {
      const cssContent = getThemeFileContent(themeData).trim() + "\n";
      const filePath = path.join(stylesDir, `${themeData.name}.css`);
      await fs.writeFile(filePath, cssContent, "utf8");
    }),
  );
}

createThemeFiles();
