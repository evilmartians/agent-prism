import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { getTimelineData } from "./get-timeline-data.js";

describe("getTimelineData", () => {
  describe("basic functionality", () => {
    it("should calculate timeline data for a span card within a time range", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "provider", value: { stringValue: "openai" } },
        ],
        endTime: new Date("2023-10-01T10:00:30.000Z"),
        id: "1",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "LLM Call",
        tokenUsage: { total: { cost: 0.002, tokens: 150 } },
        type: "llm_call",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(30000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(50);
    });

    it("should handle span cards that start after the minimum time", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "tool_name", value: { stringValue: "search" } },
          { key: "parameters", value: { stringValue: "{'query': 'test'}" } },
        ],
        endTime: new Date("2023-10-01T10:00:45.000Z"),
        id: "2",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:30.000Z"),
        status: "success",
        title: "Tool Execution",
        tokenUsage: { total: { cost: 0.001, tokens: 50 } },
        type: "tool_execution",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(15000);
      expect(result.startPercent).toBe(50);
      expect(result.widthPercent).toBe(25);
    });

    it("should handle span cards that end before the maximum time", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "agent_id", value: { stringValue: "agent-123" } },
          { key: "task", value: { stringValue: "analysis" } },
        ],
        endTime: new Date("2023-10-01T10:00:20.000Z"),
        id: "3",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Agent Invocation",
        tokenUsage: { total: { cost: 0.003, tokens: 200 } },
        type: "agent_invocation",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(20000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(33.33333333333333);
    });
  });

  describe("edge cases", () => {
    it("should handle very short duration spans", () => {
      const spanCard: TraceSpan = {
        attributes: [
          {
            key: "operation_type",
            value: {
              stringValue: "quick",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:00.001Z"),
        id: "4",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Quick Operation",
        tokenUsage: { total: { cost: 0.0001, tokens: 10 } },
        type: "chain_operation",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:00:01.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(1);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(0.1);
    });

    it("should handle very long duration spans", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "source", value: { stringValue: "database" } },
          { key: "query_type", value: { stringValue: "semantic_search" } },
        ],
        endTime: new Date("2023-10-01T10:00:59.000Z"),
        id: "5",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Long Running Task",
        tokenUsage: { total: { cost: 0.005, tokens: 500 } },
        type: "retrieval",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(59000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBeCloseTo(98.33);
    });

    it("should handle spans that span the entire time range", () => {
      const spanCard: TraceSpan = {
        attributes: [
          {
            key: "embedding_model",
            value: { stringValue: "text-embedding-3-small" },
          },
          { key: "dimensions", value: { stringValue: "1536" } },
        ],
        endTime: new Date("2023-10-01T10:01:00.000Z"),
        id: "6",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Full Range Span",
        tokenUsage: { total: { cost: 0.01, tokens: 1000 } },
        type: "embedding",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(60000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(100);
    });

    it("should handle spans that are exactly at the boundaries", () => {
      const spanCard: TraceSpan = {
        attributes: [],
        endTime: new Date("2023-10-01T10:00:00.000Z"),
        id: "7",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Boundary Span",
        tokenUsage: { total: { cost: 0, tokens: 0 } },
        type: "unknown",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:00:01.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(0);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(0);
    });
  });

  describe("percentage calculations", () => {
    it("should calculate start percentage correctly for various positions", () => {
      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const spanCard1: TraceSpan = {
        attributes: [
          {
            key: "position",
            value: {
              stringValue: "25%",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:20.000Z"),
        id: "8",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:15.000Z"),
        status: "success",
        title: "25% Position",
        tokenUsage: { total: { cost: 0.001, tokens: 100 } },
        type: "llm_call",
      };

      const result1 = getTimelineData({
        maxEnd,
        minStart,
        spanCard: spanCard1,
      });
      expect(result1.startPercent).toBe(25);

      const spanCard2: TraceSpan = {
        attributes: [
          {
            key: "position",
            value: {
              stringValue: "75%",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:50.000Z"),
        id: "9",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:45.000Z"),
        status: "success",
        title: "75% Position",
        tokenUsage: { total: { cost: 0.001, tokens: 100 } },
        type: "tool_execution",
      };

      const result2 = getTimelineData({
        maxEnd,
        minStart,
        spanCard: spanCard2,
      });
      expect(result2.startPercent).toBe(75);
    });

    it("should calculate width percentage correctly for various durations", () => {
      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:01:00.000Z");

      const spanCard1: TraceSpan = {
        attributes: [
          {
            key: "width_percent",
            value: {
              stringValue: "10%",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:06.000Z"),
        id: "10",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "10% Width",
        tokenUsage: { total: { cost: 0.001, tokens: 100 } },
        type: "chain_operation",
      };

      const result1 = getTimelineData({
        maxEnd,
        minStart,
        spanCard: spanCard1,
      });
      expect(result1.widthPercent).toBe(10);

      const spanCard2: TraceSpan = {
        attributes: [
          {
            key: "width_percent",
            value: {
              stringValue: "20%",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:12.000Z"),
        id: "11",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "20% Width",
        tokenUsage: { total: { cost: 0.002, tokens: 200 } },
        type: "retrieval",
      };

      const result2 = getTimelineData({
        maxEnd,
        minStart,
        spanCard: spanCard2,
      });
      expect(result2.widthPercent).toBe(20);
    });
  });

  describe("time range variations", () => {
    it("should handle different time range scales", () => {
      const spanCard: TraceSpan = {
        attributes: [
          {
            key: "scale",
            value: {
              stringValue: "micro",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:00.100Z"),
        id: "15",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Micro Operation",
        tokenUsage: { total: { cost: 0.00001, tokens: 5 } },
        type: "chain_operation",
      };

      const minStart1 = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd1 = +new Date("2023-10-01T10:00:01.000Z");
      const result1 = getTimelineData({
        maxEnd: maxEnd1,
        minStart: minStart1,
        spanCard,
      });
      expect(result1.widthPercent).toBe(10);

      const minStart2 = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd2 = +new Date("2023-10-01T10:00:00.200Z");
      const result2 = getTimelineData({
        maxEnd: maxEnd2,
        minStart: minStart2,
        spanCard,
      });
      expect(result2.widthPercent).toBe(50);
    });

    it("should handle very large time ranges", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "process_type", value: { stringValue: "long_running" } },
          { key: "batch_size", value: { stringValue: "1000" } },
        ],
        endTime: new Date("2023-10-01T10:05:00.000Z"),
        id: "16",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Long Running Process",
        tokenUsage: { total: { cost: 0.05, tokens: 5000 } },
        type: "embedding",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T11:00:00.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(300000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBeCloseTo(8.33);
    });
  });

  describe("precision and floating point handling", () => {
    it("should handle precise timing calculations", () => {
      const spanCard: TraceSpan = {
        attributes: [
          {
            key: "precision",
            value: {
              stringValue: "high",
            },
          },
        ],
        endTime: new Date("2023-10-01T10:00:00.001Z"),
        id: "17",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Precise Operation",
        tokenUsage: { total: { cost: 0.000001, tokens: 1 } },
        type: "unknown",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:00:00.010Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(1);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(10);
    });

    it("should handle edge case where span duration equals total range", () => {
      const spanCard: TraceSpan = {
        attributes: [
          { key: "range", value: { stringValue: "full" } },
          { key: "test_case", value: { stringValue: "edge_case" } },
        ],
        endTime: new Date("2023-10-01T10:00:01.000Z"),
        id: "18",
        raw: [
          JSON.stringify({
            endTimeUnixNano: "1704067230000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            title: "LLM Call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Full Range Span",
        tokenUsage: { total: { cost: 0.001, tokens: 100 } },
        type: "llm_call",
      };

      const minStart = +new Date("2023-10-01T10:00:00.000Z");
      const maxEnd = +new Date("2023-10-01T10:00:01.000Z");

      const result = getTimelineData({ maxEnd, minStart, spanCard });

      expect(result.durationMs).toBe(1000);
      expect(result.startPercent).toBe(0);
      expect(result.widthPercent).toBe(100);
    });
  });
});
