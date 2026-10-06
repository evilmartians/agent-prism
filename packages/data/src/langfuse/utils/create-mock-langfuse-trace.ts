import type {
  LangfuseScore,
  LangfuseTrace,
} from "@evilmartians/agent-prism-types";

/**
 * A Langfuse score for testing, attached to the trace `createMockLangfuseTrace`
 * returns.
 */
export const mockLangfuseScore: LangfuseScore = {
  authorUserId: null,
  comment: null,
  configId: null,
  createdAt: "2026-06-05T10:00:00.000Z",
  dataType: "NUMERIC",
  id: "score-1",
  name: "accuracy",
  observationId: null,
  projectId: "project-1",
  queueId: null,
  source: "API",
  stringValue: null,
  timestamp: "2026-06-05T10:00:00.000Z",
  traceId: "trace-1",
  updatedAt: "2026-06-05T10:00:00.000Z",
  value: 0.9,
};

/**
 * Creates a mock LangfuseTrace with one score for testing.
 */
export const createMockLangfuseTrace = (): LangfuseTrace => ({
  bookmarked: false,
  createdAt: "2026-06-05T10:00:00.000Z",
  environment: "default",
  id: "trace-1",
  name: "agent run",
  projectId: "project-1",
  public: false,
  release: null,
  scores: [mockLangfuseScore],
  tags: ["prod"],
  timestamp: "2026-06-05T10:00:00.000Z",
  updatedAt: "2026-06-05T10:00:01.000Z",
  version: null,
});
