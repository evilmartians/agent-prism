import { describe, expect, it } from "vitest";

import {
  ROOT_WITH_CHILD,
  toIdTree,
} from "../../common/test-utils/to-id-tree.js";
import { openTelemetrySpanAdapter } from "../adapter.js";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";

const spans = [
  {
    ...createMockOpenTelemetrySpan(),
    parentSpanId: "root",
    spanId: "child",
  },
  { ...createMockOpenTelemetrySpan(), spanId: "root" },
  {
    ...createMockOpenTelemetrySpan(),
    parentSpanId: "missing",
    spanId: "orphan",
  },
];

const document = {
  resourceSpans: [
    {
      resource: { attributes: [] },
      scopeSpans: [{ scope: { name: "agent" }, spans }],
    },
  ],
};

describe("openTelemetrySpanAdapter.convertRawSpansToSpanTree", () => {
  it("nests children under their parent and drops orphans", () => {
    expect(
      toIdTree(openTelemetrySpanAdapter.convertRawSpansToSpanTree(spans)),
    ).toStrictEqual(ROOT_WITH_CHILD);
  });
});

describe("openTelemetrySpanAdapter.convertRawDocumentsToSpans", () => {
  it("builds the span tree from one document or a list of them", () => {
    const fromOne =
      openTelemetrySpanAdapter.convertRawDocumentsToSpans(document);
    const fromList = openTelemetrySpanAdapter.convertRawDocumentsToSpans([
      document,
    ]);

    expect(toIdTree(fromOne)).toStrictEqual(ROOT_WITH_CHILD);
    expect(fromList).toStrictEqual(fromOne);
  });
});
