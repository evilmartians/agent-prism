import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import cn from "classnames";
import { CheckCircle2, Circle, CircleDot, ListTodo } from "lucide-react";

import { DetailsViewTodoItemRow } from "./DetailsViewTodoItemRow";

type DetailsViewTodosSectionProps = {
  className?: string | undefined;
  data: TraceSpan;
};

export const DetailsViewTodosSection = ({
  className,
  data,
}: DetailsViewTodosSectionProps): null | ReactElement => {
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
          <DetailsViewTodoItemRow key={`${todo.title}-${index}`} todo={todo} />
        ))}
      </div>
    </div>
  );
};
