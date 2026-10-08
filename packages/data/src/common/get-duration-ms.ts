import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const getDurationMs = (
  spanCard: Readonly<Pick<TraceSpan, "endTime" | "startTime">>,
): number => {
  const startMs = +spanCard.startTime;
  const endMs = +spanCard.endTime;
  return endMs - startMs;
};
