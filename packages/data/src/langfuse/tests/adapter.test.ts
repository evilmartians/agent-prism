import type {
  LangfuseObservation,
  LangfuseObservationLevel,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { langfuseSpanAdapter } from "../adapter.js";

const makeObservation = (
  observation: Partial<LangfuseObservation> & Pick<LangfuseObservation, "id">,
): LangfuseObservation => ({
  createdAt: "2026-06-05T10:00:00.000Z",
  endTime: "2026-06-05T10:00:01.000Z",
  environment: "default",
  name: observation.id,
  parentObservationId: null,
  projectId: "project-1",
  startTime: "2026-06-05T10:00:00.000Z",
  traceId: "trace-1",
  updatedAt: "2026-06-05T10:00:01.000Z",
  ...observation,
});

describe("langfuseSpanAdapter.getSpanStatus", () => {
  it("maps level ERROR to error status", () => {
    expect(
      langfuseSpanAdapter.getSpanStatus(
        makeObservation({ id: "a", level: "ERROR" }),
      ),
    ).toBe("error");
  });

  it("maps level WARNING to warning status", () => {
    expect(
      langfuseSpanAdapter.getSpanStatus(
        makeObservation({ id: "b", level: "WARNING" }),
      ),
    ).toBe("warning");
  });

  it.each<LangfuseObservationLevel | undefined>([
    "DEFAULT",
    "DEBUG",
    undefined,
  ])("treats level %s as success", (level) => {
    expect(
      langfuseSpanAdapter.getSpanStatus(
        makeObservation(level ? { id: "c", level } : { id: "c" }),
      ),
    ).toBe("success");
  });
});
