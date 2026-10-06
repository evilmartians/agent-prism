import type { OpenTelemetrySpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { createMockLangfuseObservation } from "../langfuse/utils/create-mock-langfuse-observation.js";
import { createMockLangfuseTrace } from "../langfuse/utils/create-mock-langfuse-trace.js";
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
    [
      "no resource and no scope",
      { resourceSpans: [{ scopeSpans: [{ spans: [span] }] }] },
    ],
    [
      "an empty resource and an empty scope",
      {
        resourceSpans: [
          { resource: {}, scopeSpans: [{ scope: {}, spans: [span] }] },
        ],
      },
    ],
    [
      "a resource without scope spans and a scope without spans",
      { resourceSpans: [{}, { scopeSpans: [{}] }] },
    ],
    [
      "a null resource and a null scope",
      {
        resourceSpans: [
          { resource: null, scopeSpans: [{ scope: null, spans: [span] }] },
        ],
      },
    ],
  ])("accepts a document with %s", (_label, value) => {
    expect(isOpenTelemetryDocument(value)).toBe(true);
  });

  it.each<OverrideRow>([
    ["no flags", { flags: undefined }],
    ["no kind", { kind: undefined }],
    ["a numeric kind", { kind: 1 }],
    ["no status", { status: undefined }],
    ["a null status", { status: null }],
    ["a numeric status code", { status: { code: 2 } }],
    ["no attributes", { attributes: undefined }],
    [
      "an attribute with a null value",
      { attributes: [{ key: "k", value: null }] },
    ],
    [
      "empty lists, which OTLP/JSON writes without values",
      {
        attributes: [
          { key: "tags", value: { arrayValue: {} } },
          { key: "extra", value: { kvlistValue: {} } },
        ],
      },
    ],
    [
      "no name and no times, which OTLP/JSON omits when empty or 0",
      {
        endTimeUnixNano: undefined,
        name: undefined,
        startTimeUnixNano: undefined,
      },
    ],
    [
      "an attribute, an event and a link with every field omitted",
      { attributes: [{}], events: [{}], links: [{}] },
    ],
    [
      "doubles written as strings",
      {
        attributes: [
          { key: "double", value: { doubleValue: "0.7" } },
          { key: "nan", value: { doubleValue: "NaN" } },
          { key: "inf", value: { doubleValue: "Infinity" } },
          { key: "-inf", value: { doubleValue: "-Infinity" } },
        ],
      },
    ],
    [
      "null attribute value fields",
      {
        attributes: [
          { key: "string", value: { stringValue: null } },
          { key: "list", value: { arrayValue: null, kvlistValue: null } },
        ],
      },
    ],
    [
      "counts and flags written as strings",
      {
        droppedAttributesCount: "0",
        events: [{ droppedAttributesCount: "1" }],
        flags: "1",
      },
    ],
    ["a null parentSpanId", { parentSpanId: null }],
    ["null events", { events: null }],
    [
      "times given as numbers",
      {
        endTimeUnixNano: 1_700_000_001_000_000_000,
        startTimeUnixNano: 1_700_000_000_000_000_000,
      },
    ],
  ])("accepts a span with %s", (_label, spanOverride) => {
    expect(isOpenTelemetryDocument(otelDocument(spanOverride))).toBe(true);
  });

  it.each<ValueRow>([
    ["null", null],
    ["a list of documents", [otelDocument()]],
    ["a document without resourceSpans", { spans: [] }],
    ["resourceSpans that are not a list", { resourceSpans: {} }],
    [
      "a scope with a numeric name",
      { resourceSpans: [{ scopeSpans: [{ scope: { name: 1 }, spans: [] }] }] },
    ],
  ])("rejects %s", (_label, value) => {
    expect(isOpenTelemetryDocument(value)).toBe(false);
  });

  it.each<OverrideRow>([
    ["an unknown kind", { kind: "SPAN_KIND_BATCH" }],
    ["a fractional kind", { kind: 1.5 }],
    ["a fractional time", { startTimeUnixNano: 1.5 }],
    ["a time that is not a number", { startTimeUnixNano: "soon" }],
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
      { attributes: [{ key: "n", value: { doubleValue: "abc" } }] },
    ],
    ["a non-numeric flags", { flags: "abc" }],
    [
      "an attribute with a malformed nested arrayValue",
      {
        attributes: [
          { key: "n", value: { arrayValue: { values: [{ boolValue: 1 }] } } },
        ],
      },
    ],
    ["an event with a numeric name", { events: [{ name: 1 }] }],
    ["a link with a numeric spanId", { links: [{ spanId: 1 }] }],
  ])("rejects a span with %s", (_label, spanOverride) => {
    expect(isOpenTelemetryDocument(otelDocument(spanOverride))).toBe(false);
  });
});

const trace = createMockLangfuseTrace();

const observation = createMockLangfuseObservation();

describe("isLangfuseDocument", () => {
  it.each<ValueRow>([
    ["a Langfuse trace export", { observations: [observation], trace }],
    ["a document without a trace", { observations: [] }],
    [
      "a trace without the fields the adapter does not read",
      { observations: [observation], trace: { id: trace.id } },
    ],
  ])("accepts %s", (_label, value) => {
    expect(isLangfuseDocument(value)).toBe(true);
  });

  it.each<ValueRow>([
    ["null", null],
    ["a document without observations", { trace }],
    ["observations that are not a list", { observations: {}, trace }],
    ["a list of documents", [{ observations: [observation], trace }]],
  ])("rejects %s", (_label, value) => {
    expect(isLangfuseDocument(value)).toBe(false);
  });
});
