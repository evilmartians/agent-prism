import type {
  TraceSpan,
  TraceTodo,
  TraceTodoStatus,
} from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { CheckCircle2, Circle, CircleDot, ListTodo } from "lucide-react";

interface DetailsViewTodosSectionProps {
  data: TraceSpan;
  className?: string;
}

// Status is otherwise shown only by icon, color and strike-through, so each row
// and count also carries it as text for screen readers.
const STATUS_LABELS: Record<TraceTodoStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  pending: "Pending",
};

function StatusIcon({ status }: { status: TraceTodoStatus }): ReactElement {
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

function TodoItemRow({ todo }: { todo: TraceTodo }): ReactElement {
  const isCompleted = todo.status === "completed";
  const isInProgress = todo.status === "in_progress";

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md px-2 py-1.5",
        isInProgress && "bg-agentprism-pending-muted/30",
      )}
    >
      <StatusIcon status={todo.status} />
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

export const DetailsViewTodosSection = ({
  data,
  className,
}: DetailsViewTodosSectionProps): ReactElement | null => {
  const { todos } = data;

  if (!todos || todos.length === 0) {
    return null;
  }

  const completed = todos.filter((t) => t.status === "completed").length;
  const inProgress = todos.filter((t) => t.status === "in_progress").length;
  const pending = todos.filter((t) => t.status === "pending").length;

  return (
    <div
      className={cn("border-agentprism-border rounded-md border", className)}
    >
      <div className="border-agentprism-border flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <ListTodo
            aria-hidden
            className="text-agentprism-muted-foreground size-4"
          />
          <span className="text-agentprism-foreground text-sm font-medium">
            Tasks
          </span>
        </div>
        <div className="text-agentprism-muted-foreground flex items-center gap-3 text-xs">
          {completed > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle2
                aria-hidden
                className="text-agentprism-success-muted-foreground size-3"
              />
              {completed}
              <span className="sr-only"> completed</span>
            </span>
          )}
          {inProgress > 0 && (
            <span className="flex items-center gap-1">
              <CircleDot
                aria-hidden
                className="text-agentprism-pending-muted-foreground size-3"
              />
              {inProgress}
              <span className="sr-only"> in progress</span>
            </span>
          )}
          {pending > 0 && (
            <span className="flex items-center gap-1">
              <Circle aria-hidden className="size-3" />
              {pending}
              <span className="sr-only"> pending</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-0.5 p-2">
        {todos.map((todo, index) => (
          <TodoItemRow key={`${todo.title}-${index}`} todo={todo} />
        ))}
      </div>
    </div>
  );
};
