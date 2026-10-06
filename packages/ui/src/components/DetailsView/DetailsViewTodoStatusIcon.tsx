import type { TraceTodoStatus } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";

export function DetailsViewTodoStatusIcon({
  status,
}: {
  status: TraceTodoStatus;
}): ReactElement {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2
          aria-hidden
          className="text-agentprism-success-muted-foreground size-4 shrink-0"
        />
      );
    case "in_progress":
      return (
        <CircleDot
          aria-hidden
          className="text-agentprism-pending-muted-foreground size-4 shrink-0"
        />
      );
    case "pending":
    default:
      return (
        <Circle
          aria-hidden
          className="text-agentprism-muted-foreground size-4 shrink-0"
        />
      );
  }
}
