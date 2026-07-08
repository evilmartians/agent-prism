import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import { hasContextContent, hasThinkingContent } from "./details-tabs";

type SpanTabData = Pick<TraceSpan, "attributes" | "input" | "output">;

const span = (over: Partial<SpanTabData>): SpanTabData => ({
  attributes: [],
  input: undefined,
  output: undefined,
  ...over,
});

describe("agent-prism / details-tabs — tab decisions", () => {
  it("hasThinkingContent is true only when claude_code.thinking is present", () => {
    expect(
      hasThinkingContent(
        span({
          attributes: [
            {
              key: "claude_code.thinking",
              value: { stringValue: "pondering" },
            },
          ],
        }),
      ),
    ).toBe(true);
    expect(hasThinkingContent(span({}))).toBe(false);
  });

  it("hasContextContent is true only for claude_code context attributes", () => {
    expect(
      hasContextContent(
        span({
          attributes: [
            {
              key: "claude_code.context_fill_percent",
              value: { stringValue: "50.00" },
            },
          ],
        }),
      ),
    ).toBe(true);
    expect(
      hasContextContent(
        span({
          attributes: [
            {
              key: "claude_code.cumulative_tokens",
              value: { intValue: "100" },
            },
          ],
        }),
      ),
    ).toBe(true);
    expect(hasContextContent(span({}))).toBe(false);
  });

  it("cross-vendor: a non-Claude span (gen_ai only) gets no Claude tabs", () => {
    const langfuseSpan = span({
      attributes: [
        { key: "gen_ai.usage.input_tokens", value: { intValue: "120" } },
      ],
      input: "hello",
      output: "hi there",
    });

    expect(hasThinkingContent(langfuseSpan)).toBe(false);
    // The upstream guard keyed on gen_ai.usage.input_tokens — we keep the Context
    // tab claude_code-only so a plain OTLP/Langfuse LLM span never grows one.
    expect(hasContextContent(langfuseSpan)).toBe(false);
  });
});
