import { AGENT_PRISM_PREFIX, agentPrismTheme } from "../theme";

const names = agentPrismTheme.tokenGroups.flatMap((group) =>
  group.tokens.map((token) => token.name),
);

export function generateTsContent(): string {
  return `
    export const agentPrismPrefix = "${AGENT_PRISM_PREFIX}";

    export const AGENT_PRISM_TOKENS = [
        ${names.map((name) => `"${name}"`).join(",\n")}
    ] as const ;

    export type AgentPrismToken = typeof AGENT_PRISM_TOKENS[number];

    export type AgentPrismColors = Record<\`\${typeof agentPrismPrefix}-\${AgentPrismToken}\`, string>;

    export const agentPrismTailwindColors: AgentPrismColors = {
        ${names.map((name) => `"${AGENT_PRISM_PREFIX}-${name}": token("${name}")`).join(",\n")}
    };

    function token(name: AgentPrismToken) {
      return \`oklch(var(--\${agentPrismPrefix}-\${name}) / <alpha-value>)\`;
    }
  `;
}
