import { tailwindColors, type TailwindColorToken } from "../tailwindColors";
import { agentPrismTheme } from "../theme";

/**
 * Resolves a Tailwind color token to its OKLCH color value
 */
function resolveColorToken(token: TailwindColorToken): string {
  if (token === "black" || token === "white") {
    return tailwindColors[token];
  }

  const [colorName, shade] = token.split(".");
  const colorGroup = tailwindColors[colorName as keyof typeof tailwindColors];

  if (!colorGroup || typeof colorGroup !== "object") {
    throw new Error(`Invalid color token: ${token}`);
  }

  const colorValue = colorGroup[shade as keyof typeof colorGroup];
  if (typeof colorValue !== "string") {
    throw new Error(`Invalid color shade: ${token}`);
  }

  return colorValue;
}

/**
 * Extracts OKLCH values from a color string like "oklch(21% 0.034 264.665)"
 * Returns the values as a space-separated string like "21% 0.034 264.665"
 * We need this extraction to be later used as `${values} / <alpha-value>`
 * This will allow for tailwind's opacity syntax bg-tokenName/50
 */
function extractOklchValues(colorString: string): string {
  const match = colorString.match(/oklch\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Invalid OKLCH color format: ${colorString}`);
  }

  const values = match[1].trim();
  const parts = values.split(/\s+/);

  // Convert 100% to 1 and 0% to 0 for lightness, keep percentages otherwise
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
