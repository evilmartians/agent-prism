import type { TailwindColorToken } from "./tailwindColors";

type TokenValue = {
  name: string;
  light: TailwindColorToken;
  dark: TailwindColorToken;
};

type TokenGroup = {
  title: string;
  tokens: TokenValue[];
};

type Theme = {
  tokenGroups: TokenGroup[];
};

export const AGENT_PRISM_PREFIX = "agentprism";

export const agentPrismTheme: Theme = {
  tokenGroups: [
    {
      title: "General purpose colors",
      tokens: [
        { name: "background", light: "white", dark: "gray.950" },
        { name: "foreground", light: "gray.900", dark: "gray.100" },
        { name: "primary", light: "gray.900", dark: "gray.100" },
        { name: "primary-foreground", light: "gray.50", dark: "gray.950" },
        { name: "primary", light: "gray.900", dark: "gray.100" },
        { name: "primary-foreground", light: "gray.50", dark: "gray.950" },
        { name: "secondary", light: "gray.100", dark: "gray.800" },
        { name: "secondary-foreground", light: "gray.500", dark: "gray.500" },
        { name: "muted", light: "gray.50", dark: "gray.900" },
        { name: "muted-foreground", light: "gray.600", dark: "gray.400" },
        { name: "accent", light: "gray.100", dark: "gray.100" },
        { name: "accent-foreground", light: "gray.100", dark: "gray.900" },
      ],
    },
    {
      title: "Brand colors",
      tokens: [
        { name: "brand", light: "violet.500", dark: "violet.500" },
        { name: "brand-foreground", light: "white", dark: "white" },
        { name: "brand-secondary", light: "orange.500", dark: "orange.500" },
        { name: "brand-secondary-foreground", light: "white", dark: "white" },
      ],
    },
    {
      title: "Borders",
      tokens: [
        { name: "border", light: "gray.200", dark: "gray.600" },
        {
          name: "border-subtle",
          light: "gray.100",
          dark: "gray.700",
        },
        {
          name: "border-strong",
          light: "gray.300",
          dark: "gray.500",
        },
        {
          name: "border-inverse",
          light: "gray.900",
          dark: "gray.200",
        },
      ],
    },
    {
      title: "Success status color",
      tokens: [
        { name: "success", light: "emerald.500", dark: "green.500" },
        { name: "success-muted", light: "emerald.50", dark: "green.950" },
        {
          name: "success-muted-foreground",
          light: "emerald.700",
          dark: "green.300",
        },
      ],
    },
    {
      title: "Error status color",
      tokens: [
        { name: "error", light: "red.500", dark: "red.500" },
        { name: "error-muted", light: "red.50", dark: "red.950" },
        { name: "error-muted-foreground", light: "red.600", dark: "red.300" },
      ],
    },
    {
      title: "Warning status color",
      tokens: [
        { name: "warning", light: "yellow.500", dark: "yellow.500" },
        { name: "warning-muted", light: "yellow.50", dark: "yellow.950" },
        {
          name: "warning-muted-foreground",
          light: "yellow.700",
          dark: "yellow.300",
        },
      ],
    },
    {
      title: "Pending status color",
      tokens: [
        { name: "pending", light: "violet.500", dark: "violet.500" },
        { name: "pending-muted", light: "violet.100", dark: "violet.950" },
        {
          name: "pending-muted-foreground",
          light: "violet.600",
          dark: "violet.400",
        },
      ],
    },
    {
      title: "Code syntax highlighting",
      tokens: [
        { name: "code-string", light: "red.600", dark: "red.400" },
        { name: "code-number", light: "red.600", dark: "red.400" },
        { name: "code-key", light: "blue.600", dark: "blue.300" },
        { name: "code-base", light: "gray.500", dark: "gray.400" },
      ],
    },
    {
      title: "Generic badge colors",
      tokens: [
        { name: "badge-default", light: "gray.100", dark: "gray.900" },
        {
          name: "badge-default-foreground",
          light: "gray.600",
          dark: "gray.400",
        },
      ],
    },
    {
      title: "Trace colors (llm)",
      tokens: [
        { name: "avatar-llm", light: "purple.500", dark: "purple.300" },
        { name: "badge-llm", light: "purple.50", dark: "purple.950" },
        {
          name: "badge-llm-foreground",
          light: "purple.500",
          dark: "purple.300",
        },
        { name: "timeline-llm", light: "purple.400", dark: "purple.400" },
      ],
    },
    {
      title: "Trace colors (agent)",
      tokens: [
        { name: "avatar-agent", light: "indigo.500", dark: "indigo.300" },
        { name: "badge-agent", light: "indigo.50", dark: "indigo.950" },
        {
          name: "badge-agent-foreground",
          light: "indigo.500",
          dark: "indigo.300",
        },
        { name: "timeline-agent", light: "indigo.400", dark: "indigo.400" },
      ],
    },
    {
      title: "Trace colors (tool)",
      tokens: [
        { name: "avatar-tool", light: "orange.500", dark: "orange.300" },
        { name: "badge-tool", light: "orange.50", dark: "orange.950" },
        {
          name: "badge-tool-foreground",
          light: "orange.500",
          dark: "orange.300",
        },
        { name: "timeline-tool", light: "orange.400", dark: "orange.400" },
      ],
    },
    {
      title: "Trace colors (chain)",
      tokens: [
        { name: "avatar-chain", light: "teal.500", dark: "teal.300" },
        { name: "badge-chain", light: "teal.50", dark: "teal.950" },
        { name: "badge-chain-foreground", light: "teal.500", dark: "teal.300" },
        { name: "timeline-chain", light: "teal.400", dark: "teal.400" },
      ],
    },
    {
      title: "Trace colors (retrieval)",
      tokens: [
        { name: "avatar-retrieval", light: "cyan.500", dark: "cyan.300" },
        { name: "badge-retrieval", light: "cyan.50", dark: "cyan.950" },
        {
          name: "badge-retrieval-foreground",
          light: "cyan.500",
          dark: "cyan.300",
        },
        { name: "timeline-retrieval", light: "cyan.400", dark: "cyan.400" },
      ],
    },
    {
      title: "Trace colors (embedding)",
      tokens: [
        { name: "avatar-embedding", light: "emerald.500", dark: "emerald.300" },
        { name: "badge-embedding", light: "emerald.50", dark: "emerald.950" },
        {
          name: "badge-embedding-foreground",
          light: "emerald.500",
          dark: "emerald.300",
        },
        {
          name: "timeline-embedding",
          light: "emerald.400",
          dark: "emerald.400",
        },
      ],
    },
    {
      title: "Trace colors (guardrail)",
      tokens: [
        { name: "avatar-guardrail", light: "red.500", dark: "red.300" },
        { name: "badge-guardrail", light: "red.50", dark: "red.950" },
        {
          name: "badge-guardrail-foreground",
          light: "red.500",
          dark: "red.300",
        },
        { name: "timeline-guardrail", light: "red.400", dark: "red.400" },
      ],
    },
    {
      title: "Trace colors (create agent)",
      tokens: [
        { name: "avatar-create-agent", light: "sky.500", dark: "sky.300" },
        { name: "badge-create-agent", light: "sky.50", dark: "sky.950" },
        {
          name: "badge-create-agent-foreground",
          light: "sky.500",
          dark: "sky.300",
        },
        { name: "timeline-create-agent", light: "sky.400", dark: "sky.400" },
      ],
    },
    {
      title: "Trace colors (span)",
      tokens: [
        { name: "avatar-span", light: "cyan.500", dark: "cyan.300" },
        { name: "badge-span", light: "cyan.50", dark: "cyan.950" },
        { name: "badge-span-foreground", light: "cyan.500", dark: "cyan.300" },
        { name: "timeline-span", light: "cyan.400", dark: "cyan.400" },
      ],
    },
    {
      title: "Trace colors (event)",
      tokens: [
        { name: "avatar-event", light: "emerald.500", dark: "emerald.300" },
        { name: "badge-event", light: "emerald.50", dark: "emerald.950" },
        {
          name: "badge-event-foreground",
          light: "emerald.500",
          dark: "emerald.300",
        },
        { name: "timeline-event", light: "emerald.400", dark: "emerald.400" },
      ],
    },
    {
      title: "Trace colors (unknown)",
      tokens: [
        { name: "avatar-unknown", light: "gray.500", dark: "gray.300" },
        { name: "badge-unknown", light: "gray.50", dark: "gray.950" },
        {
          name: "badge-unknown-foreground",
          light: "gray.500",
          dark: "gray.300",
        },
        { name: "timeline-unknown", light: "gray.400", dark: "gray.400" },
      ],
    },
  ],
};
