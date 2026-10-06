import type { TraceSpanCategory } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

import { Badge, type BadgeProps } from "./Badge";
import {
  getSpanCategoryIcon,
  getSpanCategoryLabel,
} from "./spanCategoryConfig";

export type SpanBadgeProps = Omit<
  BadgeProps,
  "iconEnd" | "iconStart" | "label"
> & {
  category: TraceSpanCategory;
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
  const Icon = getSpanCategoryIcon(category);
  const label = getSpanCategoryLabel(category);

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
