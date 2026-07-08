import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { Brain } from "lucide-react";

interface DetailsViewThinkingTabProps {
  data: TraceSpan;
}

type ThinkingLevel = "high" | "medium" | "low";

interface ThinkingMetadata {
  level: ThinkingLevel;
  disabled: boolean;
  triggers: string[];
}

function getAttributeString(
  attributes: TraceSpanAttribute[] | undefined,
  key: string,
): string | undefined {
  return attributes?.find((a) => a.key === key)?.value.stringValue;
}

function isThinkingLevel(value: unknown): value is ThinkingLevel {
  return value === "high" || value === "medium" || value === "low";
}

/**
 * Parses `claude_code.thinking_metadata` at the boundary with a guard (no casts):
 * an unknown `level` or a non-array `triggers` would otherwise crash the render.
 */
function parseThinkingMetadata(data: TraceSpan): ThinkingMetadata | null {
  const metadataStr = getAttributeString(
    data.attributes,
    "claude_code.thinking_metadata",
  );
  if (!metadataStr) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(metadataStr);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  if (!("level" in parsed) || !isThinkingLevel(parsed.level)) return null;

  const triggers =
    "triggers" in parsed && Array.isArray(parsed.triggers)
      ? parsed.triggers.filter((t): t is string => typeof t === "string")
      : [];
  const disabled = "disabled" in parsed && parsed.disabled === true;

  return { level: parsed.level, disabled, triggers };
}

const LEVEL_CONFIG: Record<
  ThinkingLevel,
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

function ThinkingLevelBadge({ level }: { level: ThinkingLevel }): ReactElement {
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
  const thinkingContent = getAttributeString(
    data.attributes,
    "claude_code.thinking",
  );
  const metadata = parseThinkingMetadata(data);

  if (!thinkingContent) {
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

  return (
    <div className="space-y-4">
      {metadata && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <ThinkingLevelBadge level={metadata.level} />
          {metadata.triggers.length > 0 && (
            <span className="text-agentprism-muted-foreground text-xs">
              Triggers: {metadata.triggers.join(", ")}
            </span>
          )}
        </div>
      )}

      <div className="border-agentprism-border bg-agentprism-muted/30 rounded-md border p-4">
        <div className="text-agentprism-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
          <Brain className="size-4" />
          Extended Thinking
        </div>
        <div className="text-agentprism-foreground max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed">
          {thinkingContent}
        </div>
      </div>
    </div>
  );
};
