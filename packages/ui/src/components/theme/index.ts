import {
  AGENT_PRISM_TOKENS,
  AGENT_PRISM_PREFIX,
  type AgentPrismToken,
} from "./tokens";

export type AgentPrismColors = Record<AgentPrismToken, string>;

export const agentPrismTailwindColors = Object.fromEntries(
  AGENT_PRISM_TOKENS.map((tokenName) => [
    `${AGENT_PRISM_PREFIX}-${tokenName}`,
    token(tokenName),
  ]),
) as AgentPrismColors;

function token(name: string) {
  return `oklch(var(--${AGENT_PRISM_PREFIX}-${name}) / <alpha-value>)`;
}
