import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const getDurationMs = (spanCard: TraceSpan): number => {
  const startMs = +spanCard.startTime;
  const endMs = +spanCard.endTime;
  return endMs - startMs;
};
