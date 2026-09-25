import type {
  TraceSpan,
  TraceReasoningLevel,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { Brain } from "lucide-react";

interface DetailsViewThinkingTabProps {
  data: TraceSpan;
}

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

function ThinkingLevelBadge({
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

export const DetailsViewThinkingTab = ({
  data,
}: DetailsViewThinkingTabProps): ReactElement => {
  const { reasoning } = data;

  if (!reasoning) {
    return (
      <div className="border-agentprism-border rounded-md border p-4">
        <p className="text-agentprism-muted-foreground text-sm">
          No thinking content available for this span.
        </p>
        <p className="text-agentprism-muted-foreground mt-2 text-xs">
          Extended thinking is available for assistant message spans when the
          model uses extended reasoning.
        </p>
      </div>
    );
  }

  const triggers = reasoning.triggers ?? [];
  const hasSummary =
    reasoning.level !== undefined ||
    triggers.length > 0 ||
    reasoning.tokens !== undefined;

  return (
    <div className="space-y-4">
      {hasSummary && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {reasoning.level && <ThinkingLevelBadge level={reasoning.level} />}
          {reasoning.tokens !== undefined && (
            <span className="text-agentprism-muted-foreground text-xs">
              {reasoning.tokens.toLocaleString()} thinking tokens
            </span>
          )}
          {triggers.length > 0 && (
            <span className="text-agentprism-muted-foreground text-xs">
              Triggers: {triggers.join(", ")}
            </span>
          )}
        </div>
      )}

      <div className="border-agentprism-border bg-agentprism-muted/30 rounded-md border p-4">
        <div className="text-agentprism-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
          <Brain className="size-4" />
          Extended Thinking
        </div>
        {reasoning.content ? (
          <div className="text-agentprism-foreground max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed">
            {reasoning.content}
          </div>
        ) : (
          <p className="text-agentprism-muted-foreground text-sm">
            The provider reported thinking tokens but did not return the
            thinking text.
          </p>
        )}
      </div>
    </div>
  );
};
