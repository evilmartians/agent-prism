import type { LangfuseObservation } from "@evilmartians/agent-prism-types";

interface MockObservationOptions {
  name?: string;
  metadata?: unknown;
}

/**
 * Creates a mock LangfuseObservation for testing.
 */
export function createMockLangfuseObservation(
  options: MockObservationOptions = {},
): LangfuseObservation {
  const { name = "test-observation", metadata } = options;
  const nowIso = new Date().toISOString();

  return {
    id: "obs_1",
    traceId: "trace_1",
    projectId: "proj_1",
    environment: "prod",
    parentObservationId: null,
    startTime: nowIso,
    endTime: nowIso,
    name,
    metadata,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}
