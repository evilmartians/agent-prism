import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

const STATUS_COLORS_DOT: Record<TraceSpanStatus, string> = {
  error: "bg-agentprism-error",
  pending: "bg-agentprism-pending",
  success: "bg-agentprism-success",
  warning: "bg-agentprism-warning",
};

export const SpanStatusDot = ({
  status,
  title,
}: {
  status: TraceSpanStatus;
  title: string;
}): ReactElement => {
  return (
    <span
      aria-label={title}
      className={cn("block size-1.5 rounded-full", STATUS_COLORS_DOT[status])}
      role="img"
      title={title}
    />
  );
};
