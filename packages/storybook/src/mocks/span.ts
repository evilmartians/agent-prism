import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

export const mockSpan = (
  overrides: DeepReadonly<Partial<TraceSpan> & Pick<TraceSpan, "id">>,
): DeepReadonly<TraceSpan> => ({
  endTime: new Date("2024-01-15T10:30:03Z"),
  raw: ["{}"],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: overrides.id,
  type: "span",
  ...overrides,
});
