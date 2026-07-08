import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import {
  parseTodos,
  type TodoItem,
  type TodoStatus,
} from "@evilmartians/agent-prism-data";
import cn from "classnames";
import { CheckCircle2, Circle, CircleDot, ListTodo } from "lucide-react";

interface DetailsViewTodosSectionProps {
  data: TraceSpan;
  className?: string;
}

function StatusIcon({ status }: { status: TodoStatus }): ReactElement {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2 className="text-agentprism-success-muted-foreground size-4 shrink-0" />
      );
    case "in_progress":
      return (
        <CircleDot className="text-agentprism-pending-muted-foreground size-4 shrink-0" />
      );
    case "pending":
    default:
      return (
        <Circle className="text-agentprism-muted-foreground size-4 shrink-0" />
      );
  }
}

function TodoItemRow({ todo }: { todo: TodoItem }): ReactElement {
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
          "text-sm",
          isCompleted && "text-agentprism-muted-foreground line-through",
          isInProgress &&
            "text-agentprism-pending-muted-foreground font-medium",
          !isCompleted && !isInProgress && "text-agentprism-foreground",
        )}
      >
        {todo.content}
      </span>
    </div>
  );
}

export const DetailsViewTodosSection = ({
  data,
  className,
}: DetailsViewTodosSectionProps): ReactElement | null => {
  const todos = parseTodos(data);

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
          <ListTodo className="text-agentprism-muted-foreground size-4" />
          <span className="text-agentprism-foreground text-sm font-medium">
            Tasks
          </span>
        </div>
        <div className="text-agentprism-muted-foreground flex items-center gap-3 text-xs">
          {completed > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="text-agentprism-success-muted-foreground size-3" />
              {completed}
            </span>
          )}
          {inProgress > 0 && (
            <span className="flex items-center gap-1">
              <CircleDot className="text-agentprism-pending-muted-foreground size-3" />
              {inProgress}
            </span>
          )}
          {pending > 0 && (
            <span className="flex items-center gap-1">
              <Circle className="size-3" />
              {pending}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-0.5 p-2">
        {todos.map((todo, index) => (
          <TodoItemRow key={`${todo.content}-${index}`} todo={todo} />
        ))}
      </div>
    </div>
  );
};
