import { describe, expect, it } from "vitest";

import {
  ROOT_WITH_CHILD,
  toIdTree,
} from "../../common/test-utils/to-id-tree.js";
import { openTelemetrySpanAdapter } from "../adapter.js";
import { createMockOpenTelemetrySpan } from "../utils/create-mock-open-telemetry-span.js";

describe("openTelemetrySpanAdapter.convertRawSpansToSpanTree", () => {
  it("nests children under their parent and drops orphans", () => {
    const tree = openTelemetrySpanAdapter.convertRawSpansToSpanTree([
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
    ]);

    expect(toIdTree(tree)).toStrictEqual(ROOT_WITH_CHILD);
  });
});
