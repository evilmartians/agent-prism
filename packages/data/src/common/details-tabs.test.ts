import { describe, expect, it } from "vitest";

import {
  hasContextContent,
  hasThinkingContent,
  hasTodos,
} from "./details-tabs.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

describe("agent-prism / details-tabs — tab decisions", () => {
  it("hasThinkingContent is true only when the span carries reasoning", () => {
    expect(
      hasThinkingContent(
        createTestSpan({ reasoning: { content: "pondering" } }),
      ),
    ).toBe(true);
    expect(
      hasThinkingContent(
        createTestSpan({ reasoning: { content: "", tokens: 512 } }),
      ),
    ).toBe(true);
    expect(hasThinkingContent(createTestSpan())).toBe(false);
  });

  it("hasContextContent is true only for claude_code context attributes", () => {
    expect(
      hasContextContent(
        createTestSpan({
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
        createTestSpan({
          attributes: [
            {
              key: "claude_code.cumulative_tokens",
              value: { intValue: "100" },
            },
          ],
        }),
      ),
    ).toBe(true);
    expect(hasContextContent(createTestSpan())).toBe(false);
  });

  it("hasTodos is true only for a non-empty task list", () => {
    expect(
      hasTodos(
        createTestSpan({ todos: [{ status: "pending", title: "ship it" }] }),
      ),
    ).toBe(true);
    expect(hasTodos(createTestSpan({ todos: [] }))).toBe(false);
    expect(hasTodos(createTestSpan())).toBe(false);
  });

  it("cross-vendor: a non-Claude span (gen_ai only) gets no Claude tabs", () => {
    const langfuseSpan = createTestSpan({
      attributes: [
        { key: "gen_ai.usage.input_tokens", value: { intValue: "120" } },
      ],
      input: "hello",
      output: "hi there",
    });

    expect(hasThinkingContent(langfuseSpan)).toBe(false);
    expect(hasContextContent(langfuseSpan)).toBe(false);
    expect(hasTodos(langfuseSpan)).toBe(false);
  });
});
