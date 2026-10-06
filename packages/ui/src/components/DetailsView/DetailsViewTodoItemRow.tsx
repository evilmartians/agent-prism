import type {
  TraceTodo,
  TraceTodoStatus,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";

import { DetailsViewTodoStatusIcon } from "./DetailsViewTodoStatusIcon";

// Status is otherwise shown only by icon, color and strike-through, so each row
// and count also carries it as text for screen readers.
const STATUS_LABELS: Record<TraceTodoStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  pending: "Pending",
};

export function DetailsViewTodoItemRow({
  todo,
}: {
  todo: TraceTodo;
}): ReactElement {
  const isCompleted = todo.status === "completed";
  const isInProgress = todo.status === "in_progress";

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md px-2 py-1.5",
        isInProgress && "bg-agentprism-pending-muted/30",
      )}
    >
      <DetailsViewTodoStatusIcon status={todo.status} />
      <span
        className={cn(
          "min-w-0 break-words text-sm",
          isCompleted && "text-agentprism-muted-foreground line-through",
          isInProgress &&
            "text-agentprism-pending-muted-foreground font-medium",
          !isCompleted && !isInProgress && "text-agentprism-foreground",
        )}
      >
        <span className="sr-only">{STATUS_LABELS[todo.status]}: </span>
        {todo.title}
      </span>
    </div>
  );
}
