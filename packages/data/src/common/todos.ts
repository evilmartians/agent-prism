import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

/**
 * TodoWrite parsing, extracted so it is unit-testable. Reads `claude_code.todos`
 * (a JSON array hoisted onto the span); a non-Claude span has no such attribute, so
 * todos stay hidden (cross-vendor safe). Parsed at the boundary with a guard.
 */
export type TodoStatus = "pending" | "in_progress" | "completed";

export interface TodoItem {
  content: string;
  status: TodoStatus;
  activeForm: string;
}

function getAttributeString(
  attributes: TraceSpanAttribute[] | undefined,
  key: string,
): string | undefined {
  return attributes?.find((a) => a.key === key)?.value.stringValue;
}

function isTodoStatus(value: unknown): value is TodoStatus {
  return (
    value === "pending" || value === "in_progress" || value === "completed"
  );
}

function isTodoItem(value: unknown): value is TodoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "content" in value &&
    typeof value.content === "string" &&
    "activeForm" in value &&
    typeof value.activeForm === "string" &&
    "status" in value &&
    isTodoStatus(value.status)
  );
}

export function parseTodos(
  data: Pick<TraceSpan, "attributes">,
): TodoItem[] | null {
  const todosStr = getAttributeString(data.attributes, "claude_code.todos");

  if (!todosStr) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(todosStr);
  } catch {
    return null;
  }

  return Array.isArray(parsed) ? parsed.filter(isTodoItem) : null;
}

export function hasTodos(data: Pick<TraceSpan, "attributes">): boolean {
  const todos = parseTodos(data);

  return todos !== null && todos.length > 0;
}
