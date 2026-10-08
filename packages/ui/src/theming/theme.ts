import type { TailwindColorToken } from "./tailwindColors";

type Theme = {
  readonly tokenGroups: readonly TokenGroup[];
};

type TokenGroup = {
  readonly title: string;
  readonly tokens: readonly TokenValue[];
};

type TokenValue = {
  readonly dark: TailwindColorToken;
  readonly light: TailwindColorToken;
  readonly name: string;
};

export const AGENT_PRISM_PREFIX = "agentprism";

export const agentPrismTheme: Theme = {
  tokenGroups: [
    {
      title: "General purpose colors",
      tokens: [
        { dark: "gray.950", light: "white", name: "background" },
        { dark: "gray.100", light: "gray.900", name: "foreground" },
        { dark: "gray.100", light: "gray.900", name: "primary" },
        { dark: "gray.950", light: "gray.50", name: "primary-foreground" },
        { dark: "gray.800", light: "gray.100", name: "secondary" },
        { dark: "gray.500", light: "gray.500", name: "secondary-foreground" },
        { dark: "gray.900", light: "gray.50", name: "muted" },
        { dark: "gray.400", light: "gray.600", name: "muted-foreground" },
        { dark: "gray.100", light: "gray.100", name: "accent" },
        { dark: "gray.900", light: "gray.100", name: "accent-foreground" },
      ],
    },
    {
      title: "Brand colors",
      tokens: [
        { dark: "violet.500", light: "violet.500", name: "brand" },
        { dark: "white", light: "white", name: "brand-foreground" },
        { dark: "orange.500", light: "orange.500", name: "brand-secondary" },
        { dark: "white", light: "white", name: "brand-secondary-foreground" },
      ],
    },
    {
      title: "Borders",
      tokens: [
        { dark: "gray.600", light: "gray.200", name: "border" },
        {
          dark: "gray.700",
          light: "gray.100",
          name: "border-subtle",
        },
        {
          dark: "gray.500",
          light: "gray.300",
          name: "border-strong",
        },
        {
          dark: "gray.200",
          light: "gray.900",
          name: "border-inverse",
        },
      ],
    },
    {
      title: "Success status color",
      tokens: [
        { dark: "green.500", light: "emerald.500", name: "success" },
        { dark: "green.950", light: "emerald.50", name: "success-muted" },
        {
          dark: "green.300",
          light: "emerald.700",
          name: "success-muted-foreground",
        },
      ],
    },
    {
      title: "Error status color",
      tokens: [
        { dark: "red.500", light: "red.500", name: "error" },
        { dark: "red.950", light: "red.50", name: "error-muted" },
        { dark: "red.300", light: "red.600", name: "error-muted-foreground" },
      ],
    },
    {
      title: "Warning status color",
      tokens: [
        { dark: "yellow.500", light: "yellow.500", name: "warning" },
        { dark: "yellow.950", light: "yellow.50", name: "warning-muted" },
        {
          dark: "yellow.300",
          light: "yellow.700",
          name: "warning-muted-foreground",
        },
      ],
    },
    {
      title: "Pending status color",
      tokens: [
        { dark: "violet.500", light: "violet.500", name: "pending" },
        { dark: "violet.950", light: "violet.100", name: "pending-muted" },
        {
          dark: "violet.400",
          light: "violet.600",
          name: "pending-muted-foreground",
        },
      ],
    },
    {
      title: "Code syntax highlighting",
      tokens: [
        { dark: "red.400", light: "red.600", name: "code-string" },
        { dark: "red.400", light: "red.600", name: "code-number" },
        { dark: "blue.300", light: "blue.600", name: "code-key" },
        { dark: "gray.400", light: "gray.500", name: "code-base" },
      ],
    },
    {
      title: "Generic badge colors",
      tokens: [
        { dark: "gray.900", light: "gray.100", name: "badge-default" },
        {
          dark: "gray.400",
          light: "gray.600",
          name: "badge-default-foreground",
        },
      ],
    },
    {
      title: "Agent content colors (claude)",
      tokens: [
        {
          dark: "purple.950",
          light: "purple.50",
          name: "badge-claude-thinking",
        },
        {
          dark: "purple.300",
          light: "purple.500",
          name: "badge-claude-thinking-foreground",
        },
        {
          dark: "violet.400",
          light: "violet.500",
          name: "context-source-conversation",
        },
      ],
    },
    {
      title: "Trace colors (llm)",
      tokens: [
        { dark: "purple.300", light: "purple.500", name: "avatar-llm" },
        { dark: "purple.950", light: "purple.50", name: "badge-llm" },
        {
          dark: "purple.300",
          light: "purple.500",
          name: "badge-llm-foreground",
        },
        { dark: "purple.400", light: "purple.400", name: "timeline-llm" },
      ],
    },
    {
      title: "Trace colors (agent)",
      tokens: [
        { dark: "indigo.300", light: "indigo.500", name: "avatar-agent" },
        { dark: "indigo.950", light: "indigo.50", name: "badge-agent" },
        {
          dark: "indigo.300",
          light: "indigo.500",
          name: "badge-agent-foreground",
        },
        { dark: "indigo.400", light: "indigo.400", name: "timeline-agent" },
      ],
    },
    {
      title: "Trace colors (tool)",
      tokens: [
        { dark: "orange.300", light: "orange.500", name: "avatar-tool" },
        { dark: "orange.950", light: "orange.50", name: "badge-tool" },
        {
          dark: "orange.300",
          light: "orange.500",
          name: "badge-tool-foreground",
        },
        { dark: "orange.400", light: "orange.400", name: "timeline-tool" },
      ],
    },
    {
      title: "Trace colors (chain)",
      tokens: [
        { dark: "teal.300", light: "teal.500", name: "avatar-chain" },
        { dark: "teal.950", light: "teal.50", name: "badge-chain" },
        { dark: "teal.300", light: "teal.500", name: "badge-chain-foreground" },
        { dark: "teal.400", light: "teal.400", name: "timeline-chain" },
      ],
    },
    {
      title: "Trace colors (retrieval)",
      tokens: [
        { dark: "cyan.300", light: "cyan.500", name: "avatar-retrieval" },
        { dark: "cyan.950", light: "cyan.50", name: "badge-retrieval" },
        {
          dark: "cyan.300",
          light: "cyan.500",
          name: "badge-retrieval-foreground",
        },
        { dark: "cyan.400", light: "cyan.400", name: "timeline-retrieval" },
      ],
    },
    {
      title: "Trace colors (embedding)",
      tokens: [
        { dark: "emerald.300", light: "emerald.500", name: "avatar-embedding" },
        { dark: "emerald.950", light: "emerald.50", name: "badge-embedding" },
        {
          dark: "emerald.300",
          light: "emerald.500",
          name: "badge-embedding-foreground",
        },
        {
          dark: "emerald.400",
          light: "emerald.400",
          name: "timeline-embedding",
        },
      ],
    },
    {
      title: "Trace colors (guardrail)",
      tokens: [
        { dark: "red.300", light: "red.500", name: "avatar-guardrail" },
        { dark: "red.950", light: "red.50", name: "badge-guardrail" },
        {
          dark: "red.300",
          light: "red.500",
          name: "badge-guardrail-foreground",
        },
        { dark: "red.400", light: "red.400", name: "timeline-guardrail" },
      ],
    },
    {
      title: "Trace colors (create agent)",
      tokens: [
        { dark: "sky.300", light: "sky.500", name: "avatar-create-agent" },
        { dark: "sky.950", light: "sky.50", name: "badge-create-agent" },
        {
          dark: "sky.300",
          light: "sky.500",
          name: "badge-create-agent-foreground",
        },
        { dark: "sky.400", light: "sky.400", name: "timeline-create-agent" },
      ],
    },
    {
      title: "Trace colors (span)",
      tokens: [
        { dark: "cyan.300", light: "cyan.500", name: "avatar-span" },
        { dark: "cyan.950", light: "cyan.50", name: "badge-span" },
        { dark: "cyan.300", light: "cyan.500", name: "badge-span-foreground" },
        { dark: "cyan.400", light: "cyan.400", name: "timeline-span" },
      ],
    },
    {
      title: "Trace colors (event)",
      tokens: [
        { dark: "emerald.300", light: "emerald.500", name: "avatar-event" },
        { dark: "emerald.950", light: "emerald.50", name: "badge-event" },
        {
          dark: "emerald.300",
          light: "emerald.500",
          name: "badge-event-foreground",
        },
        { dark: "emerald.400", light: "emerald.400", name: "timeline-event" },
      ],
    },
    {
      title: "Trace colors (unknown)",
      tokens: [
        { dark: "gray.300", light: "gray.500", name: "avatar-unknown" },
        { dark: "gray.950", light: "gray.50", name: "badge-unknown" },
        {
          dark: "gray.300",
          light: "gray.500",
          name: "badge-unknown-foreground",
        },
        { dark: "gray.400", light: "gray.400", name: "timeline-unknown" },
      ],
    },
  ],
};
