import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { findTimeRange } from "./find-time-range.js";

describe("findTimeRange", () => {
  it("should return minStart and maxEnd for a single card", () => {
    const cards: TraceSpan[] = [
      {
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1000" } },
          { key: "completion_tokens", value: { intValue: "500" } },
          { key: "total_tokens", value: { intValue: "1500" } },
          { key: "user_id", value: { stringValue: "user123" } },
        ],
        endTime: new Date("2023-10-01T12:00:00.000Z"),
        id: "1",
        raw: [
          JSON.stringify({
            attributes: {
              completion_tokens: 500,
              model: "gpt-4",
              prompt_tokens: 1000,
              total_tokens: 1500,
              user_id: "user123",
            },
            cost: 10,
            duration: 300,
            endTimeUnixNano: "1704067500000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            status: "success",
            title: "Task 1",
            tokensCount: 1500,
            type: "llm_call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Task 1",
        tokenUsage: { total: { cost: 100, tokens: 1 } },
        type: "embedding",
      },
    ];

    const result = findTimeRange(cards);

    expect(result).toStrictEqual({
      maxEnd: +new Date("2023-10-01T12:00:00.000Z"),
      minStart: +new Date("2023-10-01T10:00:00.000Z"),
    });
  });

  it("should return minStart and maxEnd for multiple cards", () => {
    const cards: TraceSpan[] = [
      {
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1000" } },
          { key: "completion_tokens", value: { intValue: "500" } },
          { key: "total_tokens", value: { intValue: "1500" } },
          { key: "user_id", value: { stringValue: "user123" } },
        ],
        endTime: new Date("2023-10-01T12:00:00.000Z"),
        id: "1",
        raw: [
          JSON.stringify({
            attributes: {
              completion_tokens: 500,
              model: "gpt-4",
              prompt_tokens: 1000,
              total_tokens: 1500,
              user_id: "user123",
            },
            cost: 10,
            duration: 300,
            endTimeUnixNano: "1704067500000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            status: "success",
            title: "Task 1",
            tokensCount: 1500,
            type: "llm_call",
          }),
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        status: "success",
        title: "Task 1",
        tokenUsage: { total: { cost: 100, tokens: 1 } },
        type: "chain_operation",
      },
      {
        attributes: [
          { key: "model", value: { stringValue: "gpt-3.5" } },
          { key: "prompt_tokens", value: { intValue: "800" } },
          { key: "completion_tokens", value: { intValue: "400" } },
          { key: "total_tokens", value: { intValue: "1200" } },
          { key: "user_id", value: { stringValue: "user456" } },
        ],
        endTime: new Date("2023-10-01T11:00:00.000Z"),
        id: "2",
        raw: [
          JSON.stringify({
            attributes: {
              completion_tokens: 500,
              model: "gpt-4",
              prompt_tokens: 1000,
              total_tokens: 1500,
              user_id: "user123",
            },
            cost: 10,
            duration: 300,
            endTimeUnixNano: "1704067500000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            status: "success",
            title: "Task 1",
            tokensCount: 1500,
            type: "llm_call",
          }),
        ],
        startTime: new Date("2023-10-01T09:00:00.000Z"),
        status: "success",
        title: "Task 2",
        tokenUsage: { total: { cost: 200, tokens: 2 } },
        type: "llm_call",
      },
      {
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1200" } },
          { key: "completion_tokens", value: { intValue: "600" } },
          { key: "total_tokens", value: { intValue: "1800" } },
          { key: "user_id", value: { stringValue: "user789" } },
        ],
        endTime: new Date("2023-10-01T13:00:00.000Z"),
        id: "3",
        raw: [
          JSON.stringify({
            attributes: {
              completion_tokens: 500,
              model: "gpt-4",
              prompt_tokens: 1000,
              total_tokens: 1500,
              user_id: "user123",
            },
            cost: 10,
            duration: 300,
            endTimeUnixNano: "1704067500000000000",
            id: "1",
            startTimeUnixNano: "1704067200000000000",
            status: "success",
            title: "Task 1",
            tokensCount: 1500,
            type: "llm_call",
          }),
        ],
        startTime: new Date("2023-10-01T11:30:00.000Z"),
        status: "success",
        title: "Task 3",
        tokenUsage: { total: { cost: 300, tokens: 3 } },
        type: "agent_invocation",
      },
    ];

    const result = findTimeRange(cards);

    expect(result).toStrictEqual({
      maxEnd: +new Date("2023-10-01T13:00:00.000Z"),
      minStart: +new Date("2023-10-01T09:00:00.000Z"),
    });
  });

  it("should return Infinity and -Infinity for an empty array", () => {
    const cards: TraceSpan[] = [];

    const result = findTimeRange(cards);

    expect(result).toStrictEqual({
      maxEnd: -Infinity,
      minStart: Infinity,
    });
  });
});
