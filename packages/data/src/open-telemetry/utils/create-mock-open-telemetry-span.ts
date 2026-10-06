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
 * Creates a mock Open TelemetrySpan for testing. Attribute values map to OTLP
 * values: null and undefined carry no value, every number becomes an
 * `intValue` string (parsed back with parseFloat), arrays are joined into a
 * string, and anything else is stringified.
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
          return {};
        }
        if (typeof value === "string") return { stringValue: value };
        if (typeof value === "number") {
          return { intValue: String(value) };
        }
        if (typeof value === "boolean") return { boolValue: value };
        if (Array.isArray(value)) {
          return { stringValue: value.join(", ") };
        }
        return { stringValue: String(value) };
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
