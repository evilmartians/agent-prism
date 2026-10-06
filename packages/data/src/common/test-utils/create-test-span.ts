import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * Builds a TraceSpan for tests with sensible defaults, so a fixture only spells
 * out the fields the test is actually about.
 */
export const createTestSpan = (
  overrides: DeepReadonly<Partial<TraceSpan>> = {},
): DeepReadonly<TraceSpan> => ({
  endTime: new Date("2024-01-01T00:00:01.000Z"),
  id: "test-span",
  raw: [],
  startTime: new Date("2024-01-01T00:00:00.000Z"),
  status: "success",
  title: "Test Span",
  type: "span",
  ...overrides,
});
