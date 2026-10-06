import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { getDurationMs } from "./get-duration-ms.js";

export const getTimelineData = ({
  maxEnd,
  minStart,
  spanCard,
}: {
  maxEnd: number;
  minStart: number;
  spanCard: TraceSpan;
}): { durationMs: number; startPercent: number; widthPercent: number } => {
  const startMs = +spanCard.startTime;
  const totalRange = maxEnd - minStart;
  const durationMs = getDurationMs(spanCard);
  const startPercent = ((startMs - minStart) / totalRange) * 100;
  const widthPercent = (durationMs / totalRange) * 100;

  return {
    durationMs,
    startPercent,
    widthPercent,
  };
};
