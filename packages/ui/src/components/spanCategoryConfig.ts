import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";
import type { LucideIcon } from "lucide-react";

import {
  BarChart2,
  Bot,
  CircleDot,
  HelpCircle,
  Link,
  MoveHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

export type ColorVariant =
  | "cyan"
  | "emerald"
  | "gray"
  | "indigo"
  | "orange"
  | "purple"
  | "red"
  | "sky"
  | "teal"
  | "yellow";

/**
 * Shared configuration for span categories containing label, theme, and icon
 */
export const SPAN_CATEGORY_CONFIG: Record<
  TraceSpanCategory,
  {
    icon: LucideIcon;
    label: string;
    theme: ColorVariant;
  }
> = {
  agent_invocation: {
    icon: Bot,
    label: "AGENT INVOCATION",
    theme: "indigo",
  },
  chain_operation: {
    icon: Link,
    label: "CHAIN",
    theme: "teal",
  },
  create_agent: {
    icon: Plus,
    label: "CREATE AGENT",
    theme: "sky",
  },
  embedding: {
    icon: BarChart2,
    label: "EMBEDDING",
    theme: "emerald",
  },
  event: {
    icon: CircleDot,
    label: "EVENT",
    theme: "emerald",
  },
  guardrail: {
    icon: ShieldCheck,
    label: "GUARDRAIL",
    theme: "red",
  },
  llm_call: {
    icon: Zap,
    label: "LLM",
    theme: "purple",
  },
  retrieval: {
    icon: Search,
    label: "RETRIEVAL",
    theme: "cyan",
  },
  span: {
    icon: MoveHorizontal,
    label: "SPAN",
    theme: "cyan",
  },
  tool_execution: {
    icon: Wrench,
    label: "TOOL",
    theme: "orange",
  },
  unknown: {
    icon: HelpCircle,
    label: "UNKNOWN",
    theme: "gray",
  },
};

export function getSpanCategoryIcon(category: TraceSpanCategory): LucideIcon {
  return SPAN_CATEGORY_CONFIG[category].icon;
}

export function getSpanCategoryLabel(category: TraceSpanCategory): string {
  return SPAN_CATEGORY_CONFIG[category].label;
}

export function getSpanCategoryTheme(
  category: TraceSpanCategory,
): ColorVariant {
  return SPAN_CATEGORY_CONFIG[category].theme;
}
