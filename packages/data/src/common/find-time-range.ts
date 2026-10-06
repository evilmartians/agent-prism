import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

type TimeRange = { maxEnd: number; minStart: number };

export function findTimeRange(
  cards: readonly DeepReadonly<TraceSpan>[],
): TimeRange {
  return cards.reduce(
    (acc: Readonly<TimeRange>, c) => {
      const start = +new Date(c.startTime);
      const end = +new Date(c.endTime);
      return {
        maxEnd: Math.max(acc.maxEnd, end),
        minStart: Math.min(acc.minStart, start),
      };
    },
    { maxEnd: -Infinity, minStart: Infinity },
  );
}
