import { describe, expect, it } from "vitest";

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

    expect(tree.map((span) => span.id)).toStrictEqual(["root"]);
    expect(tree[0]?.children?.map((span) => span.id)).toStrictEqual(["child"]);
  });
});
