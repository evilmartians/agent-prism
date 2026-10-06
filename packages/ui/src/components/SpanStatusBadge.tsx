import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { Check, Ellipsis, Info, TriangleAlert } from "lucide-react";

const STATUS_COLORS_BADGE: Record<TraceSpanStatus, string> = {
  success:
    "bg-agentprism-success-muted text-agentprism-success-muted-foreground",
  error: "bg-agentprism-error-muted text-agentprism-error-muted-foreground",
  pending:
    "bg-agentprism-pending-muted text-agentprism-pending-muted-foreground",
  warning:
    "bg-agentprism-warning-muted text-agentprism-warning-muted-foreground",
};

export const SpanStatusBadge = ({
  status,
  title,
}: {
  status: TraceSpanStatus;
  title: string;
}): ReactElement => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "h-3.5 w-4 rounded",
        STATUS_COLORS_BADGE[status],
      )}
      aria-label={title}
      title={title}
    >
      {status === "success" && <Check className="size-2.5" aria-hidden />}
      {status === "error" && <TriangleAlert className="size-2.5" aria-hidden />}
      {status === "warning" && <Info className="size-2.5" aria-hidden />}
      {status === "pending" && <Ellipsis className="size-2.5" aria-hidden />}
    </span>
  );
};
