import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { filterSpansRecursively } from "./filter-spans-recursively.js";

describe("filterSpansRecursively", () => {
  const childSpanA: TraceSpan = {
    children: [],
    endTime: new Date(),
    id: "1.1",
    raw: [],
    startTime: new Date(),
    status: "success",
    title: "Child Span A",
    type: "embedding",
  };

  const nestedSpan: TraceSpan = {
    children: [],
    endTime: new Date(),
    id: "1.2.1",
    raw: [],
    startTime: new Date(),
    status: "success",
    title: "Nested Span",
    type: "guardrail",
  };

  const childSpanB: TraceSpan = {
    children: [nestedSpan],
    endTime: new Date(),
    id: "1.2",
    raw: [],
    startTime: new Date(),
    status: "success",
    title: "Child Span B",
    type: "embedding",
  };

  const parentSpan: TraceSpan = {
    children: [childSpanA, childSpanB],
    endTime: new Date(),
    id: "1",
    raw: [],
    startTime: new Date(),
    status: "success",
    title: "Parent Span",
    type: "guardrail",
  };

  const sampleSpans: TraceSpan[] = [
    parentSpan,
    {
      children: [],
      endTime: new Date(),
      id: "2",
      raw: [],
      startTime: new Date(),
      status: "success",
      title: "Another Parent Span",
      type: "embedding",
    },
  ];

  it("should return all spans when searchValue is an empty string or whitespace", () => {
    expect(filterSpansRecursively(sampleSpans, "")).toStrictEqual(sampleSpans);
    expect(filterSpansRecursively(sampleSpans, "   ")).toStrictEqual(
      sampleSpans,
    );
  });

  it("should return spans that match the searchValue in their title", () => {
    const result = filterSpansRecursively(sampleSpans, "Child Span A");
    expect(result).toStrictEqual([
      {
        ...parentSpan,
        children: [
          {
            ...childSpanA,
            children: [],
          },
        ],
      },
    ]);
  });

  it("should return spans that have matching children recursively", () => {
    const result = filterSpansRecursively(sampleSpans, "Nested Span");
    expect(result).toStrictEqual([
      {
        ...parentSpan,
        children: [
          {
            ...childSpanB,
            children: [
              {
                ...nestedSpan,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("should return an empty array if no spans match the searchValue", () => {
    const result = filterSpansRecursively(sampleSpans, "Nonexistent Span");
    expect(result).toStrictEqual([]);
  });

  it("should be case insensitive when filtering spans", () => {
    const result = filterSpansRecursively(sampleSpans, "child span b");
    expect(result).toStrictEqual([
      {
        ...parentSpan,
        children: [
          {
            ...childSpanB,
            children: [],
          },
        ],
      },
    ]);
  });
});
