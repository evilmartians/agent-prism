import type { TraceSpan } from "@evilmartians/agent-prism-types";

export function isValidTraceSpan(item: unknown): item is TraceSpan {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "title" in item &&
    "startTime" in item &&
    "endTime" in item &&
    "duration" in item &&
    "type" in item &&
    "status" in item &&
    "raw" in item
  );
}
