import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { findTimeRange } from "./find-time-range.ts";

describe("findTimeRange", () => {
  it("should return minStart and maxEnd for a single card", () => {
    const cards: TraceSpan[] = [
      {
        id: "1",
        title: "Task 1",
        raw: JSON.stringify({
          id: "1",
          title: "Task 1",
          attributes: {
            model: "gpt-4",
            prompt_tokens: 1000,
            completion_tokens: 500,
            total_tokens: 1500,
            user_id: "user123",
          },
          startTimeUnixNano: "1704067200000000000",
          endTimeUnixNano: "1704067500000000000",
          tokensCount: 1500,
          type: "llm_call",
          duration: 300,
          status: "success",
          cost: 10,
        }),
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        endTime: new Date("2023-10-01T12:00:00.000Z"),
        duration: 7200,
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1000" } },
          { key: "completion_tokens", value: { intValue: "500" } },
          { key: "total_tokens", value: { intValue: "1500" } },
          { key: "user_id", value: { stringValue: "user123" } },
        ],
        cost: 100,
        type: "embedding",
        tokensCount: 1,
        status: "success",
      },
    ];

    const result = findTimeRange(cards);

    expect(result).toEqual({
      minStart: +new Date("2023-10-01T10:00:00.000Z"),
      maxEnd: +new Date("2023-10-01T12:00:00.000Z"),
    });
  });

  it("should return minStart and maxEnd for multiple cards", () => {
    const cards: TraceSpan[] = [
      {
        id: "1",
        raw: JSON.stringify({
          id: "1",
          title: "Task 1",
          attributes: {
            model: "gpt-4",
            prompt_tokens: 1000,
            completion_tokens: 500,
            total_tokens: 1500,
            user_id: "user123",
          },
          startTimeUnixNano: "1704067200000000000",
          endTimeUnixNano: "1704067500000000000",
          tokensCount: 1500,
          type: "llm_call",
          duration: 300,
          status: "success",
          cost: 10,
        }),
        title: "Task 1",
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1000" } },
          { key: "completion_tokens", value: { intValue: "500" } },
          { key: "total_tokens", value: { intValue: "1500" } },
          { key: "user_id", value: { stringValue: "user123" } },
        ],
        startTime: new Date("2023-10-01T10:00:00.000Z"),
        endTime: new Date("2023-10-01T12:00:00.000Z"),
        duration: 7200,
        cost: 100,
        type: "chain_operation",
        tokensCount: 1,
        status: "success",
      },
      {
        id: "2",
        raw: JSON.stringify({
          id: "1",
          title: "Task 1",
          attributes: {
            model: "gpt-4",
            prompt_tokens: 1000,
            completion_tokens: 500,
            total_tokens: 1500,
            user_id: "user123",
          },
          startTimeUnixNano: "1704067200000000000",
          endTimeUnixNano: "1704067500000000000",
          tokensCount: 1500,
          type: "llm_call",
          duration: 300,
          status: "success",
          cost: 10,
        }),
        title: "Task 2",
        startTime: new Date("2023-10-01T09:00:00.000Z"),
        endTime: new Date("2023-10-01T11:00:00.000Z"),
        duration: 7200,
        cost: 200,
        type: "llm_call",
        attributes: [
          { key: "model", value: { stringValue: "gpt-3.5" } },
          { key: "prompt_tokens", value: { intValue: "800" } },
          { key: "completion_tokens", value: { intValue: "400" } },
          { key: "total_tokens", value: { intValue: "1200" } },
          { key: "user_id", value: { stringValue: "user456" } },
        ],
        tokensCount: 2,
        status: "success",
      },
      {
        id: "3",
        title: "Task 3",
        raw: JSON.stringify({
          id: "1",
          title: "Task 1",
          attributes: {
            model: "gpt-4",
            prompt_tokens: 1000,
            completion_tokens: 500,
            total_tokens: 1500,
            user_id: "user123",
          },
          startTimeUnixNano: "1704067200000000000",
          endTimeUnixNano: "1704067500000000000",
          tokensCount: 1500,
          type: "llm_call",
          duration: 300,
          status: "success",
          cost: 10,
        }),
        startTime: new Date("2023-10-01T11:30:00.000Z"),
        endTime: new Date("2023-10-01T13:00:00.000Z"),
        duration: 5400,
        attributes: [
          { key: "model", value: { stringValue: "gpt-4" } },
          { key: "prompt_tokens", value: { intValue: "1200" } },
          { key: "completion_tokens", value: { intValue: "600" } },
          { key: "total_tokens", value: { intValue: "1800" } },
          { key: "user_id", value: { stringValue: "user789" } },
        ],
        cost: 300,
        type: "agent_invocation",
        tokensCount: 3,
        status: "success",
      },
    ];

    const result = findTimeRange(cards);

    expect(result).toEqual({
      minStart: +new Date("2023-10-01T09:00:00.000Z"),
      maxEnd: +new Date("2023-10-01T13:00:00.000Z"),
    });
  });

  it("should return Infinity and -Infinity for an empty array", () => {
    const cards: TraceSpan[] = [];

    const result = findTimeRange(cards);

    expect(result).toEqual({
      minStart: Infinity,
      maxEnd: -Infinity,
    });
  });
});
