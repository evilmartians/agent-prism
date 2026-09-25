import type { TraceSpan } from "@evilmartians/agent-prism-types";

/**
 * Builds a TraceSpan for tests with sensible defaults, so a fixture only spells
 * out the fields the test is actually about.
 */
export const createTestSpan = (
  overrides: Partial<TraceSpan> = {},
): TraceSpan => ({
  id: "test-span",
  title: "Test Span",
  startTime: new Date("2024-01-01T00:00:00.000Z"),
  endTime: new Date("2024-01-01T00:00:01.000Z"),
  type: "span",
  status: "success",
  raw: [],
  ...overrides,
});
