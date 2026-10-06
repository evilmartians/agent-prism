import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";
import type { LucideIcon } from "lucide-react";

import {
  Zap,
  Wrench,
  Bot,
  Link,
  Search,
  BarChart2,
  Plus,
  HelpCircle,
  MoveHorizontal,
  CircleDot,
  ShieldCheck,
} from "lucide-react";

export type ColorVariant =
  | "purple"
  | "indigo"
  | "orange"
  | "teal"
  | "cyan"
  | "sky"
  | "yellow"
  | "emerald"
  | "red"
  | "gray";

/**
 * Shared configuration for span categories containing label, theme, and icon
 */
export const SPAN_CATEGORY_CONFIG: Record<
  TraceSpanCategory,
  {
    label: string;
    theme: ColorVariant;
    icon: LucideIcon;
  }
> = {
  llm_call: {
    label: "LLM",
    theme: "purple",
    icon: Zap,
  },
  tool_execution: {
    label: "TOOL",
    theme: "orange",
    icon: Wrench,
  },
  agent_invocation: {
    label: "AGENT INVOCATION",
    theme: "indigo",
    icon: Bot,
  },
  chain_operation: {
    label: "CHAIN",
    theme: "teal",
    icon: Link,
  },
  retrieval: {
    label: "RETRIEVAL",
    theme: "cyan",
    icon: Search,
  },
  embedding: {
    label: "EMBEDDING",
    theme: "emerald",
    icon: BarChart2,
  },
  create_agent: {
    label: "CREATE AGENT",
    theme: "sky",
    icon: Plus,
  },
  span: {
    label: "SPAN",
    theme: "cyan",
    icon: MoveHorizontal,
  },
  event: {
    label: "EVENT",
    theme: "emerald",
    icon: CircleDot,
  },
  guardrail: {
    label: "GUARDRAIL",
    theme: "red",
    icon: ShieldCheck,
  },
  unknown: {
    label: "UNKNOWN",
    theme: "gray",
    icon: HelpCircle,
  },
};

export function getSpanCategoryTheme(
  category: TraceSpanCategory,
): ColorVariant {
  return SPAN_CATEGORY_CONFIG[category].theme;
}

export function getSpanCategoryLabel(category: TraceSpanCategory): string {
  return SPAN_CATEGORY_CONFIG[category].label;
}

export function getSpanCategoryIcon(category: TraceSpanCategory): LucideIcon {
  return SPAN_CATEGORY_CONFIG[category].icon;
}
