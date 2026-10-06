import type { TraceReasoningLevel } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

const LEVEL_CONFIG: Record<
  TraceReasoningLevel,
  { className: string; label: string }
> = {
  high: {
    className:
      "bg-agentprism-success-muted text-agentprism-success-muted-foreground",
    label: "High",
  },
  low: {
    className: "bg-agentprism-muted text-agentprism-muted-foreground",
    label: "Low",
  },
  medium: {
    className:
      "bg-agentprism-warning-muted text-agentprism-warning-muted-foreground",
    label: "Medium",
  },
};

export function DetailsViewThinkingLevelBadge({
  level,
}: Readonly<{
  level: TraceReasoningLevel;
}>): ReactElement {
  const config = LEVEL_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label} Thinking
    </span>
  );
}
