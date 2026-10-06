import type { TraceSpanStatus } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

const STATUS_COLORS_DOT: Record<TraceSpanStatus, string> = {
  success: "bg-agentprism-success",
  error: "bg-agentprism-error",
  pending: "bg-agentprism-pending",
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
      className={cn("block size-1.5 rounded-full", STATUS_COLORS_DOT[status])}
      aria-label={title}
      title={title}
    />
  );
};
