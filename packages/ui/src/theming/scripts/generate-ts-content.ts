import { AGENT_PRISM_PREFIX, agentPrismTheme } from "../theme";

const tokenNames = agentPrismTheme.tokenGroups.flatMap((group) =>
  group.tokens.map((token) => `"${token.name}"`),
);

export function generateTsContent(): string {
  const lines: string[] = [];

  lines.push("");
  for (const tokenName of tokenNames) {
    lines.push(`  "${tokenName}",`);
  }
  lines.push("] as const;");

  return `
    export const agentPrismPrefix = "${AGENT_PRISM_PREFIX}";

    export const AGENT_PRISM_TOKENS = [
        ${tokenNames.join(",\n")}
    ] as const ;

    export type AgentPrismToken = typeof AGENT_PRISM_TOKENS[number];

    export type AgentPrismColors = Record<AgentPrismToken, string>;
    
    export const agentPrismTailwindColors = Object.fromEntries(
      AGENT_PRISM_TOKENS.map((tokenName) => [
        \`${AGENT_PRISM_PREFIX}-\${tokenName}\`,
        token(tokenName),
      ]),
    ) as AgentPrismColors;

    function token(name: string) {
      return \`oklch(var(--\${agentPrismPrefix}-\${name}) / <alpha-value>)\`;
    }
  `;
}
