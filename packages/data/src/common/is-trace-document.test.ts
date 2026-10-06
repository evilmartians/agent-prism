import type { OpenTelemetrySpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { createMockLangfuseObservation } from "../langfuse/utils/create-mock-langfuse-observation.js";
import {
  createMockLangfuseTrace,
  mockLangfuseScore,
} from "../langfuse/utils/create-mock-langfuse-trace.js";
import { createMockOpenTelemetrySpan } from "../open-telemetry/utils/create-mock-open-telemetry-span.js";
import {
  isLangfuseDocument,
  isOpenTelemetryDocument,
} from "./is-trace-document.js";

type Override = Readonly<Record<string, unknown>>;

type OverrideRow = readonly [string, Override];

type ValueRow = readonly [string, unknown];

const span = createMockOpenTelemetrySpan({
  attributes: { "llm.model": "gpt-4o", "llm.stream": true, "llm.tokens": 12 },
});

const otelDocument = (spanOverride: Override = {}) => ({
  resourceSpans: [
    {
      resource: { attributes: [{ key: "service", value: {} }] },
      scopeSpans: [
        {
          scope: { name: "agent", version: "1.0.0" },
          spans: [{ ...span, ...spanOverride }],
        },
      ],
    },
  ],
});

const link: OpenTelemetrySpan["links"] = [
  { attributes: [], spanId: "other-span", traceId: "other-trace" },
];

describe("isOpenTelemetryDocument", () => {
  it("accepts an OTLP/JSON export", () => {
    expect(isOpenTelemetryDocument(otelDocument())).toBe(true);
    expect(
      isOpenTelemetryDocument(
        otelDocument({
          events: [{ name: "start", timeUnixNano: "1" }],
          links: link,
          parentSpanId: "root",
        }),
      ),
    ).toBe(true);
  });

  it("accepts every OTLP/JSON attribute value form", () => {
    const attributes = [
      { key: "double", value: { doubleValue: 0.7 } },
      { key: "int-number", value: { intValue: 42 } },
      { key: "int-string", value: { intValue: "42" } },
      { key: "bytes", value: { bytesValue: "AAE=" } },
      {
        key: "array",
        value: { arrayValue: { values: [{ stringValue: "a" }] } },
      },
      {
        key: "kvlist",
        value: {
          kvlistValue: { values: [{ key: "k", value: { boolValue: true } }] },
        },
      },
    ];

    expect(isOpenTelemetryDocument(otelDocument({ attributes }))).toBe(true);
  });

  it("accepts a document with no resource spans", () => {
    expect(isOpenTelemetryDocument({ resourceSpans: [] })).toBe(true);
  });

  it.each<ValueRow>([
    ["null", null],
    ["a list of documents", [otelDocument()]],
    ["a document without resourceSpans", { spans: [] }],
    ["resourceSpans that are not a list", { resourceSpans: {} }],
    [
      "a resource without attributes",
      { resourceSpans: [{ resource: {}, scopeSpans: [] }] },
    ],
    [
      "a scope without a name",
      {
        resourceSpans: [
          {
            resource: { attributes: [] },
            scopeSpans: [{ scope: {}, spans: [] }],
          },
        ],
      },
    ],
  ])("rejects %s", (_label, value) => {
    expect(isOpenTelemetryDocument(value)).toBe(false);
  });

  it.each<OverrideRow>([
    ["an unknown kind", { kind: "SPAN_KIND_BATCH" }],
    ["a missing flags", { flags: undefined }],
    ["a numeric spanId", { spanId: 1 }],
    ["an unknown status code", { status: { code: "STATUS_CODE_FAILED" } }],
    [
      "an attribute with a numeric key",
      { attributes: [{ key: 1, value: {} }] },
    ],
    [
      "an attribute with a fractional intValue",
      { attributes: [{ key: "n", value: { intValue: 1.5 } }] },
    ],
    [
      "an attribute with a non-numeric doubleValue",
      { attributes: [{ key: "n", value: { doubleValue: "0.7" } }] },
    ],
    [
      "an attribute with a malformed nested arrayValue",
      {
        attributes: [
          { key: "n", value: { arrayValue: { values: [{ boolValue: 1 }] } } },
        ],
      },
    ],
    ["an event without a name", { events: [{ timeUnixNano: "1" }] }],
    ["a link without a spanId", { links: [{ traceId: "other-trace" }] }],
  ])("rejects a span with %s", (_label, spanOverride) => {
    expect(isOpenTelemetryDocument(otelDocument(spanOverride))).toBe(false);
  });
});

const trace = createMockLangfuseTrace();

const observation = createMockLangfuseObservation();

const langfuseDocument = (
  traceOverride: Override = {},
  observationOverride: Override = {},
) => ({
  observations: [{ ...observation, ...observationOverride }],
  trace: { ...trace, ...traceOverride },
});

describe("isLangfuseDocument", () => {
  it("accepts a Langfuse trace export", () => {
    expect(isLangfuseDocument(langfuseDocument())).toBe(true);
  });

  it.each<ValueRow>([
    ["a string", "trace=1"],
    ["a record", { team: "search" }],
    ["null", null],
  ])("accepts trace metadata given as %s", (_label, metadata) => {
    expect(isLangfuseDocument(langfuseDocument({ metadata }))).toBe(true);
  });

  it("accepts observations with optional details", () => {
    expect(
      isLangfuseDocument(
        langfuseDocument(
          { observations: [observation] },
          {
            costDetails: { input: 0.001, total: 0.002 },
            level: "ERROR",
            metadata: ["anything"],
            type: "GENERATION",
            usageDetails: null,
          },
        ),
      ),
    ).toBe(true);
  });

  it.each<ValueRow>([
    ["a document without a trace", { observations: [] }],
    ["a document without observations", { trace }],
    ["a list of documents", [langfuseDocument()]],
  ])("rejects %s", (_label, value) => {
    expect(isLangfuseDocument(value)).toBe(false);
  });

  it.each<OverrideRow>([
    ["a numeric id", { id: 1 }],
    ["a non-boolean bookmarked", { bookmarked: "no" }],
    ["tags that are not strings", { tags: [1] }],
    ["metadata given as a number", { metadata: 1 }],
    [
      "a score with an unknown source",
      { scores: [{ ...mockLangfuseScore, source: "X" }] },
    ],
    ["malformed nested observations", { observations: [{ id: "x" }] }],
  ])("rejects a trace with %s", (_label, traceOverride) => {
    expect(isLangfuseDocument(langfuseDocument(traceOverride))).toBe(false);
  });

  it.each<OverrideRow>([
    ["an unknown type", { type: "STEP" }],
    ["an unknown level", { level: "FATAL" }],
    ["a numeric endTime", { endTime: 1 }],
    ["a missing parentObservationId", { parentObservationId: undefined }],
    ["cost details with a string cost", { costDetails: { input: "free" } }],
    ["provided cost details given as a list", { providedCostDetails: [] }],
  ])("rejects an observation with %s", (_label, observationOverride) => {
    expect(isLangfuseDocument(langfuseDocument({}, observationOverride))).toBe(
      false,
    );
  });
});
