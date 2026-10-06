import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";
import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

import cn from "classnames";
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

import { Badge, type BadgeProps } from "./Badge";

export type SpanBadgeProps = Omit<
  BadgeProps,
  "iconEnd" | "iconStart" | "label"
> & {
  category: TraceSpanCategory;
};

const categoryContent: Record<
  TraceSpanCategory,
  {
    icon: LucideIcon;
    label: string;
  }
> = {
  agent_invocation: {
    icon: Bot,
    label: "AGENT INVOCATION",
  },
  chain_operation: {
    icon: Link,
    label: "CHAIN",
  },
  create_agent: {
    icon: Plus,
    label: "CREATE AGENT",
  },
  embedding: {
    icon: BarChart2,
    label: "EMBEDDING",
  },
  event: {
    icon: CircleDot,
    label: "EVENT",
  },
  guardrail: {
    icon: ShieldCheck,
    label: "GUARDRAIL",
  },
  llm_call: {
    icon: Zap,
    label: "LLM",
  },
  retrieval: {
    icon: Search,
    label: "RETRIEVAL",
  },
  span: {
    icon: MoveHorizontal,
    label: "SPAN",
  },
  tool_execution: {
    icon: Wrench,
    label: "TOOL",
  },
  unknown: {
    icon: HelpCircle,
    label: "UNKNOWN",
  },
};

const badgeClasses: Record<TraceSpanCategory, string> = {
  agent_invocation:
    "bg-agentprism-badge-agent text-agentprism-badge-agent-foreground",
  chain_operation:
    "bg-agentprism-badge-chain text-agentprism-badge-chain-foreground",
  create_agent:
    "bg-agentprism-badge-create-agent text-agentprism-badge-create-agent-foreground",
  embedding:
    "bg-agentprism-badge-embedding text-agentprism-badge-embedding-foreground",
  event: "bg-agentprism-badge-event text-agentprism-badge-event-foreground",
  guardrail:
    "bg-agentprism-badge-guardrail text-agentprism-badge-guardrail-foreground",
  llm_call: "bg-agentprism-badge-llm text-agentprism-badge-llm-foreground",
  retrieval:
    "bg-agentprism-badge-retrieval text-agentprism-badge-retrieval-foreground",
  span: "bg-agentprism-badge-span text-agentprism-badge-span-foreground",
  tool_execution:
    "bg-agentprism-badge-tool text-agentprism-badge-tool-foreground",
  unknown:
    "bg-agentprism-badge-unknown text-agentprism-badge-unknown-foreground",
};

export const SpanBadge = ({
  category,
  className,
  ...props
}: SpanBadgeProps): ReactElement => {
  const { icon: Icon, label } = categoryContent[category];

  return (
    <Badge
      className={cn(badgeClasses[category], className)}
      iconStart={<Icon className="size-2.5" />}
      {...props}
      label={label}
      unstyled
    />
  );
};
