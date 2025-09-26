import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { flattenSpans } from "./flatten-spans";

describe("flattenSpans", () => {
  it("should return an empty array when input is an empty array", () => {
    const input: TraceSpan[] = [];
    const result = flattenSpans(input);
    expect(result).toEqual([]);
  });

  it("should return the same array if there are no children", () => {
    const input: TraceSpan[] = [
      {
        id: "1",
        title: "Span 1",
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        type: "guardrail",
        raw: "raw-data",
        status: "success",
      },
    ];
    const result = flattenSpans(input);
    expect(result).toEqual(input);
  });

  it("should flatten spans with one level of children", () => {
    const childSpan: TraceSpan = {
      id: "2",
      title: "Child Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 50,
      type: "chain_operation",
      raw: "raw-data",
      status: "success",
    };
    const input: TraceSpan[] = [
      {
        id: "1",
        title: "Parent Span",
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        type: "create_agent",
        raw: "raw-data",
        status: "success",
        children: [childSpan],
      },
    ];
    const result = flattenSpans(input);
    expect(result).toEqual([input[0], childSpan]);
  });

  it("should flatten spans with multiple levels of children", () => {
    const grandChildSpan: TraceSpan = {
      id: "3",
      title: "Grandchild Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 25,
      type: "chain_operation",
      raw: "raw-data",
      status: "success",
    };
    const childSpan: TraceSpan = {
      id: "2",
      title: "Child Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 50,
      type: "llm_call",
      raw: "raw-data",
      status: "success",
      children: [grandChildSpan],
    };
    const input: TraceSpan[] = [
      {
        id: "1",
        title: "Parent Span",
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        type: "chain_operation",
        raw: "raw-data",
        status: "success",
        children: [childSpan],
      },
    ];
    const result = flattenSpans(input);
    expect(result).toEqual([input[0], childSpan, grandChildSpan]);
  });

  it("should handle spans where some children arrays are empty or undefined", () => {
    const input: TraceSpan[] = [
      {
        id: "1",
        title: "Span 1",
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        type: "create_agent",
        raw: "raw-data",
        status: "success",
        children: [],
      },
      {
        id: "2",
        title: "Span 2",
        startTime: new Date(),
        endTime: new Date(),
        duration: 50,
        type: "create_agent",
        raw: "raw-data",
        status: "success",
        children: undefined,
      },
    ];
    const result = flattenSpans(input);
    expect(result).toEqual(input);
  });

  it("should handle nested spans with mixed empty and non-empty children", () => {
    const grandChildSpan: TraceSpan = {
      id: "3",
      title: "Grandchild Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 25,
      type: "guardrail",
      raw: "raw-data",
      status: "success",
    };
    const childSpan: TraceSpan = {
      id: "2",
      title: "Child Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 50,
      type: "create_agent",
      raw: "raw-data",
      status: "success",
      children: [],
    };
    const parentSpan: TraceSpan = {
      id: "1",
      title: "Parent Span",
      startTime: new Date(),
      endTime: new Date(),
      duration: 100,
      type: "retrieval",
      raw: "raw-data",
      status: "success",
      children: [childSpan, grandChildSpan],
    };
    const result = flattenSpans([parentSpan]);
    expect(result).toEqual([parentSpan, childSpan, grandChildSpan]);
  });
});
