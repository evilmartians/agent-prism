import type { TraceSpan } from "@evilmartians/agent-prism-types";

export function findTimeRange(cards: TraceSpan[]): {
  minStart: number;
  maxEnd: number;
} {
  return cards.reduce(
    (acc, c) => {
      const start = +new Date(c.startTime);
      const end = +new Date(c.endTime);
      return {
        minStart: Math.min(acc.minStart, start),
        maxEnd: Math.max(acc.maxEnd, end),
      };
    },
    {
      minStart: cards.length > 0 ? +new Date(cards[0].startTime) : Infinity,
      maxEnd: cards.length > 0 ? +new Date(cards[0].endTime) : -Infinity,
    },
  );
}
