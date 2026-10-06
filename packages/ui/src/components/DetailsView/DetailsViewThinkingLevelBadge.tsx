import type { TraceReasoningLevel } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

const LEVEL_CONFIG: Record<
  TraceReasoningLevel,
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className:
      "bg-agentprism-success-muted text-agentprism-success-muted-foreground",
  },
  medium: {
    label: "Medium",
    className:
      "bg-agentprism-warning-muted text-agentprism-warning-muted-foreground",
  },
  low: {
    label: "Low",
    className: "bg-agentprism-muted text-agentprism-muted-foreground",
  },
};

export function DetailsViewThinkingLevelBadge({
  level,
}: {
  level: TraceReasoningLevel;
}): ReactElement {
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
