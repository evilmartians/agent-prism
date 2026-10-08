import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { Check, Ellipsis, Info, TriangleAlert } from "lucide-react";

import type { ReadonlyProps } from "./ReadonlyProps";
import type { SpanStatusIndicatorProps } from "./SpanStatusIndicatorProps";

const STATUS_COLORS_BADGE: Record<TraceSpanStatus, string> = {
  error: "bg-agentprism-error-muted text-agentprism-error-muted-foreground",
  pending:
    "bg-agentprism-pending-muted text-agentprism-pending-muted-foreground",
  success:
    "bg-agentprism-success-muted text-agentprism-success-muted-foreground",
  warning:
    "bg-agentprism-warning-muted text-agentprism-warning-muted-foreground",
};

export const SpanStatusBadge = ({
  status,
  title,
}: ReadonlyProps<SpanStatusIndicatorProps>): ReactElement => {
  return (
    <span
      aria-label={title}
      className={cn(
        "inline-flex items-center justify-center",
        "h-3.5 w-4 rounded",
        STATUS_COLORS_BADGE[status],
      )}
      role="img"
      title={title}
    >
      {status === "success" && <Check aria-hidden className="size-2.5" />}
      {status === "error" && <TriangleAlert aria-hidden className="size-2.5" />}
      {status === "warning" && <Info aria-hidden className="size-2.5" />}
      {status === "pending" && <Ellipsis aria-hidden className="size-2.5" />}
    </span>
  );
};
