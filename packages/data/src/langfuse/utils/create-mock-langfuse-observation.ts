import type { LangfuseObservation } from "@evilmartians/agent-prism-types";

type MockObservationOptions = {
  metadata?: unknown;
  name?: string;
};

/**
 * Creates a mock LangfuseObservation for testing.
 */
export function createMockLangfuseObservation(
  options: Readonly<MockObservationOptions> = {},
): LangfuseObservation {
  const { metadata, name = "test-observation" } = options;
  const nowIso = new Date().toISOString();

  return {
    createdAt: nowIso,
    endTime: nowIso,
    environment: "prod",
    id: "obs_1",
    metadata,
    name,
    parentObservationId: null,
    projectId: "proj_1",
    startTime: nowIso,
    traceId: "trace_1",
    updatedAt: nowIso,
  };
}
