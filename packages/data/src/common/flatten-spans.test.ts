import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { flattenSpans } from "./flatten-spans.js";

describe("flattenSpans", () => {
  it("should return an empty array when input is an empty array", () => {
    const input: TraceSpan[] = [];
    const result = flattenSpans(input);
    expect(result).toStrictEqual([]);
  });

  it("should return the same array if there are no children", () => {
    const input: TraceSpan[] = [
      {
        endTime: new Date(),
        id: "1",
        raw: ["raw-data"],
        startTime: new Date(),
        status: "success",
        title: "Span 1",
        type: "guardrail",
      },
    ];
    const result = flattenSpans(input);
    expect(result).toStrictEqual(input);
  });

  it("should flatten spans with one level of children", () => {
    const childSpan: TraceSpan = {
      endTime: new Date(),
      id: "2",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Child Span",
      type: "chain_operation",
    };
    const input: TraceSpan[] = [
      {
        children: [childSpan],
        endTime: new Date(),
        id: "1",
        raw: ["raw-data"],
        startTime: new Date(),
        status: "success",
        title: "Parent Span",
        type: "create_agent",
      },
    ];
    const result = flattenSpans(input);
    expect(result).toStrictEqual([input[0], childSpan]);
  });

  it("should flatten spans with multiple levels of children", () => {
    const grandChildSpan: TraceSpan = {
      endTime: new Date(),
      id: "3",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Grandchild Span",
      type: "chain_operation",
    };
    const childSpan: TraceSpan = {
      children: [grandChildSpan],
      endTime: new Date(),
      id: "2",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Child Span",
      type: "llm_call",
    };
    const input: TraceSpan[] = [
      {
        children: [childSpan],
        endTime: new Date(),
        id: "1",
        raw: ["raw-data"],
        startTime: new Date(),
        status: "success",
        title: "Parent Span",
        type: "chain_operation",
      },
    ];
    const result = flattenSpans(input);
    expect(result).toStrictEqual([input[0], childSpan, grandChildSpan]);
  });

  it("should handle spans where some children arrays are empty or undefined", () => {
    const input: TraceSpan[] = [
      {
        children: [],
        endTime: new Date(),
        id: "1",
        raw: ["raw-data"],
        startTime: new Date(),
        status: "success",
        title: "Span 1",
        type: "create_agent",
      },
      {
        children: undefined,
        endTime: new Date(),
        id: "2",
        raw: ["raw-data"],
        startTime: new Date(),
        status: "success",
        title: "Span 2",
        type: "create_agent",
      },
    ];
    const result = flattenSpans(input);
    expect(result).toStrictEqual(input);
  });

  it("should handle nested spans with mixed empty and non-empty children", () => {
    const grandChildSpan: TraceSpan = {
      endTime: new Date(),
      id: "3",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Grandchild Span",
      type: "guardrail",
    };
    const childSpan: TraceSpan = {
      children: [],
      endTime: new Date(),
      id: "2",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Child Span",
      type: "create_agent",
    };
    const parentSpan: TraceSpan = {
      children: [childSpan, grandChildSpan],
      endTime: new Date(),
      id: "1",
      raw: ["raw-data"],
      startTime: new Date(),
      status: "success",
      title: "Parent Span",
      type: "retrieval",
    };
    const result = flattenSpans([parentSpan]);
    expect(result).toStrictEqual([parentSpan, childSpan, grandChildSpan]);
  });
});
