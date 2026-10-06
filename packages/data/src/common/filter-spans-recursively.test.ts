import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { filterSpansRecursively } from "./filter-spans-recursively";

describe("filterSpansRecursively", () => {
  const childSpanA: TraceSpan = {
    id: "1.1",
    title: "Child Span A",
    startTime: new Date(),
    endTime: new Date(),
    type: "embedding",
    raw: [],
    status: "success",
    children: [],
  };

  const nestedSpan: TraceSpan = {
    id: "1.2.1",
    title: "Nested Span",
    startTime: new Date(),
    endTime: new Date(),
    type: "guardrail",
    raw: [],
    status: "success",
    children: [],
  };

  const childSpanB: TraceSpan = {
    id: "1.2",
    title: "Child Span B",
    startTime: new Date(),
    endTime: new Date(),
    type: "embedding",
    raw: [],
    status: "success",
    children: [nestedSpan],
  };

  const parentSpan: TraceSpan = {
    id: "1",
    title: "Parent Span",
    startTime: new Date(),
    endTime: new Date(),
    type: "guardrail",
    raw: [],
    status: "success",
    children: [childSpanA, childSpanB],
  };

  const sampleSpans: TraceSpan[] = [
    parentSpan,
    {
      id: "2",
      title: "Another Parent Span",
      startTime: new Date(),
      endTime: new Date(),
      type: "embedding",
      raw: [],
      status: "success",
      children: [],
    },
  ];

  it("should return all spans when searchValue is an empty string or whitespace", () => {
    expect(filterSpansRecursively(sampleSpans, "")).toEqual(sampleSpans);
    expect(filterSpansRecursively(sampleSpans, "   ")).toEqual(sampleSpans);
  });

  it("should return spans that match the searchValue in their title", () => {
    const result = filterSpansRecursively(sampleSpans, "Child Span A");
    expect(result).toEqual([
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
    expect(result).toEqual([
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
    expect(result).toEqual([]);
  });

  it("should be case insensitive when filtering spans", () => {
    const result = filterSpansRecursively(sampleSpans, "child span b");
    expect(result).toEqual([
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
