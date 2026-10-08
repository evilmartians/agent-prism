import { tailwindColors, type TailwindColorToken } from "../tailwindColors";
import { agentPrismTheme } from "../theme";

export function generateCssContent(): string {
  const lines: string[] = [];

  lines.push(":root {");
  lines.push("  @media (prefers-color-scheme: light) {");

  for (const group of agentPrismTheme.tokenGroups) {
    lines.push("");
    lines.push(`    /* ${group.title} */`);

    for (const token of group.tokens) {
      const lightColor = resolveColorToken(token.light);
      const lightValues = extractOklchValues(lightColor);

      lines.push(
        `    ${getCssVariableName(token.name)}: ${lightValues}; /* ${token.light} */`,
      );
    }
  }

  lines.push("  }");
  lines.push("");
  lines.push("  @media (prefers-color-scheme: dark) {");

  for (const group of agentPrismTheme.tokenGroups) {
    lines.push("");
    lines.push(`    /* ${group.title} */`);

    for (const token of group.tokens) {
      const darkColor = resolveColorToken(token.dark);
      const darkValues = extractOklchValues(darkColor);

      lines.push(
        `    ${getCssVariableName(token.name)}: ${darkValues}; /* ${token.dark} */`,
      );
    }
  }

  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Extracts OKLCH values from a color string like "oklch(21% 0.034 264.665)"
 * Returns the values as a space-separated string like "21% 0.034 264.665"
 * We need this extraction to be later used as `${values} / <alpha-value>`
 * This will allow for tailwind's opacity syntax bg-tokenName/50
 */
function extractOklchValues(colorString: string): string {
  const values = /oklch\(([^)]+)\)/.exec(colorString)?.[1];
  if (values === undefined) {
    throw new Error(`Invalid OKLCH color format: ${colorString}`);
  }

  const parts = values.trim().split(/\s+/);

  if (parts[0] === "100%") {
    parts[0] = "1";
  } else if (parts[0] === "0%") {
    parts[0] = "0";
  }

  return parts.join(" ");
}

function getCssVariableName(tokenName: string): string {
  return `--agentprism-${tokenName}`;
}

/**
 * Resolves a Tailwind color token to its OKLCH color value
 */
function resolveColorToken(token: TailwindColorToken): string {
  if (token === "black" || token === "white") {
    return tailwindColors[token];
  }

  const [colorName, shade] = token.split(".");
  const colorGroup = Object.entries(tailwindColors).find(
    ([name]: readonly [string, unknown]) => name === colorName,
  )?.[1];

  if (typeof colorGroup !== "object") {
    throw new Error(`Invalid color token: ${token}`);
  }

  const colorValue = Object.entries(colorGroup).find(
    ([key]: readonly [string, unknown]) => key === shade,
  )?.[1];
  if (colorValue === undefined) {
    throw new Error(`Invalid color shade: ${token}`);
  }

  return colorValue;
}
