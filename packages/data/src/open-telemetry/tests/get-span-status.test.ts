import type {
  DeepReadonly,
  OpenTelemetrySpan,
  OpenTelemetryStatus,
  TraceSpanStatus,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { openTelemetrySpanAdapter } from "../adapter.js";

const span: OpenTelemetrySpan = {
  endTimeUnixNano: "2",
  name: "span",
  spanId: "span",
  startTimeUnixNano: "1",
  traceId: "trace",
};

describe("openTelemetrySpanAdapter.getSpanStatus", () => {
  it.each<readonly [DeepReadonly<OpenTelemetryStatus> | null, TraceSpanStatus]>(
    [
      [{ code: "STATUS_CODE_ERROR" }, "error"],
      [{ code: 2 }, "error"],
      [{ code: "STATUS_CODE_OK" }, "success"],
      [{ code: 1 }, "success"],
      [{ code: "STATUS_CODE_UNSET" }, "warning"],
      [{ code: 0 }, "warning"],
      [{}, "warning"],
      [null, "warning"],
    ],
  )("maps status %j to %s", (status, expected) => {
    expect(openTelemetrySpanAdapter.getSpanStatus({ ...span, status })).toBe(
      expected,
    );
  });

  it("maps a span without status to warning", () => {
    expect(openTelemetrySpanAdapter.getSpanStatus(span)).toBe("warning");
  });
});
