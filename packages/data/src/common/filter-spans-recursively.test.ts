import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { filterSpansRecursively } from "./filter-spans-recursively";

describe("filterSpansRecursively", () => {
  const sampleSpans: TraceSpan[] = [
    {
      id: "1",
      title: "Parent Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 100,
      type: "guardrail",
      raw: "",
      status: "success",
      children: [
        {
          id: "1.1",
          title: "Child Span A",
          startTime: new Date(),
          endTime: new Date(),
          duration: 50,
          type: "embedding",
          raw: "",
          status: "success",
          children: [],
        },
        {
          id: "1.2",
          title: "Child Span B",
          startTime: new Date(),
          endTime: new Date(),
          duration: 30,
          type: "embedding",
          raw: "",
          status: "success",
          children: [
            {
              id: "1.2.1",
              title: "Nested Span",
              startTime: new Date(),
              endTime: new Date(),
              duration: 10,
              type: "guardrail",
              raw: "",
              status: "success",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Another Parent Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 200,
      type: "embedding",
      raw: "",
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
        ...sampleSpans[0],
        children: [
          {
            ...sampleSpans[0].children![0],
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
        ...sampleSpans[0],
        children: [
          {
            ...sampleSpans[0].children![1],
            children: [
              {
                ...sampleSpans[0].children![1].children![0],
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
        ...sampleSpans[0],
        children: [
          {
            ...sampleSpans[0].children![1],
            children: [],
          },
        ],
      },
    ]);
  });
});
