import type {
  OpenTelemetrySpan,
  OpenTelemetrySpanKind,
  OpenTelemetryStatusCode,
} from "@evilmartians/agent-prism-types";

interface MockSpanOptions {
  name?: string;
  duration?: [number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>;
  status?: { code: OpenTelemetryStatusCode; message?: string };
  kind?: OpenTelemetrySpanKind;
}

/**
 * Creates a mock Open TelemetrySpan for testing.
 */
export const createMockOpenTelemetrySpan = (
  options: MockSpanOptions = {},
): OpenTelemetrySpan => {
  const {
    name = "test-span",
    duration = [2, 0],
    attributes = {},
    status = { code: "STATUS_CODE_OK" },
    kind = "SPAN_KIND_INTERNAL",
  } = options;

  const startTime = [1640995200, 0];
  const endTime = [startTime[0] + duration[0], duration[1]];

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
    name,
    kind,
    traceId: "test-trace-id",
    spanId: "test-span-id",
    startTimeUnixNano: startTimeNano,
    endTimeUnixNano: endTimeNano,
    status,
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
    flags: 1,
    events: [],
    links: [],
    droppedAttributesCount: 0,
    droppedEventsCount: 0,
    droppedLinksCount: 0,
  };
};
