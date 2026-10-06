import type {
  OpenTelemetrySpan,
  OpenTelemetrySpanKind,
  OpenTelemetryStatusCode,
} from "@evilmartians/agent-prism-types";

type MockSpanOptions = {
  attributes?: Record<string, unknown>;
  duration?: [number, number];
  kind?: OpenTelemetrySpanKind;
  name?: string;
  status?: { code: OpenTelemetryStatusCode; message?: string };
};

/**
 * Creates a mock Open TelemetrySpan for testing.
 */
export const createMockOpenTelemetrySpan = (
  options: MockSpanOptions = {},
): OpenTelemetrySpan => {
  const {
    attributes = {},
    duration = [2, 0],
    kind = "SPAN_KIND_INTERNAL",
    name = "test-span",
    status = { code: "STATUS_CODE_OK" },
  } = options;

  const startTime: [number, number] = [1640995200, 0];
  const endTime: [number, number] = [startTime[0] + duration[0], duration[1]];

  // Convert to nanosecond strings
  const startTimeNano = (
    BigInt(startTime[0]) * 1000000000n +
    BigInt(startTime[1])
  ).toString();
  const endTimeNano = (
    BigInt(endTime[0]) * 1000000000n +
    BigInt(endTime[1])
  ).toString();

  return {
    attributes: Object.entries(attributes).map(([key, value]) => ({
      key,
      value: (() => {
        if (value === null || value === undefined) {
          // Don't include any value properties for null/undefined
          return {};
        }
        if (typeof value === "string") return { stringValue: value };
        if (typeof value === "number") {
          // Store all numbers as intValue, including special values
          // They'll be parsed back with parseFloat
          return { intValue: String(value) };
        }
        if (typeof value === "boolean") return { boolValue: value };
        if (Array.isArray(value)) {
          // Convert arrays to string for testing compatibility
          return { stringValue: value.join(", ") };
        }
        return { stringValue: String(value) }; // Fallback for objects, etc.
      })(),
    })),
    droppedAttributesCount: 0,
    droppedEventsCount: 0,
    droppedLinksCount: 0,
    endTimeUnixNano: endTimeNano,
    events: [],
    flags: 1,
    kind,
    links: [],
    name,
    spanId: "test-span-id",
    startTimeUnixNano: startTimeNano,
    status,
    traceId: "test-trace-id",
  };
};
