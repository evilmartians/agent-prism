import type {
  DeepReadonly,
  LangfuseObservation,
  LangfuseObservationLevel,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import {
  ROOT_WITH_CHILD,
  toIdTree,
} from "../../common/test-utils/to-id-tree.js";
import { langfuseSpanAdapter } from "../adapter.js";
import { createMockLangfuseObservation } from "../utils/create-mock-langfuse-observation.js";
import { createMockLangfuseTrace } from "../utils/create-mock-langfuse-trace.js";

const makeObservation = (
  observation: DeepReadonly<
    Partial<LangfuseObservation> & Pick<LangfuseObservation, "id">
  >,
): DeepReadonly<LangfuseObservation> => ({
  ...createMockLangfuseObservation({ name: observation.id }),
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

const observations = [
  makeObservation({ id: "child", parentObservationId: "root" }),
  makeObservation({ id: "root" }),
  makeObservation({ id: "orphan", parentObservationId: "missing" }),
];

const document = { observations, trace: createMockLangfuseTrace() };

describe("langfuseSpanAdapter.convertRawSpansToSpanTree", () => {
  it("nests children under their parent and drops orphans", () => {
    expect(
      toIdTree(langfuseSpanAdapter.convertRawSpansToSpanTree(observations)),
    ).toStrictEqual(ROOT_WITH_CHILD);
  });
});

describe("langfuseSpanAdapter.convertRawDocumentsToSpans", () => {
  it("builds the span tree from one document or a list of them", () => {
    const fromOne = langfuseSpanAdapter.convertRawDocumentsToSpans(document);
    const fromList = langfuseSpanAdapter.convertRawDocumentsToSpans([document]);

    expect(toIdTree(fromOne)).toStrictEqual(ROOT_WITH_CHILD);
    expect(fromList).toStrictEqual(fromOne);
  });
});
